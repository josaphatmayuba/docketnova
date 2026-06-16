/* eslint-disable */
// Rendering primitives for the Assistant — inline-markdown parser with
// hoverable case citations, block components for each AI message section,
// and the streaming text writer.

// ─── tr(): pick the right language out of an i18n object ────────────────
const tr = (v, lang) => {
  if (v == null) return "";
  if (typeof v === "string") return v;
  if (Array.isArray(v)) return v;
  return v[lang] ?? v.fr ?? v.en ?? "";
};

// ─── Tokenize a string with inline markup ───────────────────────────────
// Supports: **bold**, *italic*, `mono`, [[CaseShortName]]
function tokenize(str) {
  if (!str) return [];
  const out = [];
  // Regex captures the four markup forms; the rest is plain text.
  const re = /\*\*([^*]+)\*\*|\*([^*]+)\*|`([^`]+)`|\[\[([A-Za-z0-9_]+)\]\]/g;
  let last = 0; let m;
  while ((m = re.exec(str))) {
    if (m.index > last) out.push({ k: "t", v: str.slice(last, m.index) });
    if (m[1] != null) out.push({ k: "b", v: m[1] });
    else if (m[2] != null) out.push({ k: "i", v: m[2] });
    else if (m[3] != null) out.push({ k: "mono", v: m[3] });
    else if (m[4] != null) {
      const c = CASES[m[4]];
      if (c) out.push({ k: "case", c });
      else out.push({ k: "t", v: m[4] });
    }
    last = re.lastIndex;
  }
  if (last < str.length) out.push({ k: "t", v: str.slice(last) });
  return out;
}

// ─── Length used for char-by-char streaming ─────────────────────────────
function tokensLength(tokens) {
  return tokens.reduce((n, t) => n + (t.k === "case" ? t.c.title.length : t.v.length), 0);
}

// ─── Render tokens up to `limit` characters (limit = Infinity → all) ────
const RenderTokens = ({ tokens, limit = Infinity }) => {
  let used = 0;
  const out = [];
  for (let i = 0; i < tokens.length; i++) {
    const t = tokens[i];
    const segLen = t.k === "case" ? t.c.title.length : t.v.length;
    if (used >= limit) break;
    const showLen = Math.min(segLen, limit - used);
    if (t.k === "t")    out.push(<span key={i}>{t.v.slice(0, showLen)}</span>);
    else if (t.k === "i") out.push(<em key={i}>{t.v.slice(0, showLen)}</em>);
    else if (t.k === "b") out.push(<b key={i}>{t.v.slice(0, showLen)}</b>);
    else if (t.k === "mono") out.push(<code key={i}>{t.v.slice(0, showLen)}</code>);
    else if (t.k === "case") {
      // For case links, render the whole link once the user has "typed past"
      // the citation; while in-progress, render plain italic chars.
      if (showLen < segLen) out.push(<em key={i}>{t.c.title.slice(0, showLen)}</em>);
      else out.push(<CaseLink key={i} data={t.c}/>);
    }
    used += showLen;
  }
  return <span className="lb-stream">{out}</span>;
};

// ─── Inline case link with hover popover ────────────────────────────────
const CaseLink = ({ data }) => {
  const [open, setOpen] = React.useState(false);
  const wrap = React.useRef(null);
  return (
    <span ref={wrap} style={{ position: "relative", whiteSpace: "nowrap" }}
          onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
      <span className="lb-case-link">{data.title}</span>
      {open && <CasePopover data={data}/>}
    </span>
  );
};

const CasePopover = ({ data }) => (
  <div style={{
    position: "absolute", bottom: "calc(100% + 8px)", left: "50%",
    transform: "translateX(-50%)", zIndex: 50,
    width: 320, background: "var(--paper)",
    border: "1px solid var(--border-2)", borderRadius: 12,
    boxShadow: "var(--shadow-3)", padding: "14px 14px 12px",
    fontFamily: "var(--font-sans)", textAlign: "left",
  }}>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 10 }}>
      <div style={{ minWidth: 0 }}>
        <div style={{ fontFamily: "var(--font-display)", fontStyle: "italic", fontWeight: 500,
                      fontSize: 16, color: "var(--ink-900)", lineHeight: 1.2 }}>{data.title}</div>
        <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--ink-500)", marginTop: 3 }}>
          {data.citation} · {data.court}
        </div>
      </div>
      <ScoreTriplet aut={data.aut} per={data.per} sol={data.sol} size="sm"/>
    </div>
    <div style={{ fontSize: 12.5, color: "var(--ink-700)", lineHeight: 1.5, marginTop: 10 }}>{data.summary}</div>
    <div style={{ marginTop: 10, paddingTop: 10, borderTop: "1px dashed var(--border-1)",
                  display: "flex", gap: 10, alignItems: "center" }}>
      <LangTag lang={data.lang}/>
      <span style={{ fontSize: 11, color: "var(--ink-500)" }}>{data.date}</span>
      <span style={{ marginLeft: "auto", fontSize: 11.5, color: "var(--oxblood-700)", fontWeight: 600,
                     display: "inline-flex", alignItems: "center", gap: 4 }}>
        Voir l'arrêt <Icon name="arrowRight" size={12} color="var(--oxblood-700)"/>
      </span>
    </div>
    {/* tail */}
    <div style={{
      position: "absolute", left: "50%", bottom: -7, transform: "translateX(-50%) rotate(45deg)",
      width: 12, height: 12, background: "var(--paper)",
      borderRight: "1px solid var(--border-2)", borderBottom: "1px solid var(--border-2)",
    }}/>
  </div>
);

// ─── Streaming hook ─────────────────────────────────────────────────────
// Given a total length and a speed (chars/sec), reveals `progress` chars.
function useStreaming(total, speedCPS, enabled) {
  const [progress, setProgress] = React.useState(enabled ? 0 : total);
  React.useEffect(() => {
    if (!enabled) { setProgress(total); return; }
    setProgress(0);
    const start = performance.now();
    let raf;
    const tick = (t) => {
      const elapsed = (t - start) / 1000;
      const p = Math.min(total, Math.round(elapsed * speedCPS));
      setProgress(p);
      if (p < total) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [total, speedCPS, enabled]);
  return progress;
}

// ─── Message bubbles ────────────────────────────────────────────────────
const UserMessage = ({ text, lang }) => {
  const tokens = tokenize(tr(text, lang));
  return (
    <div style={{ display: "flex", justifyContent: "flex-end" }}>
      <div className="lb-user-bubble" style={{
        background: "#0E1626", color: "#FBF8F2",
        padding: "12px 16px", borderRadius: 14, borderBottomRightRadius: 4,
        fontSize: 14, lineHeight: 1.55, maxWidth: "78%",
      }}>
        <span className="lb-stream"><RenderTokens tokens={tokens} limit={Infinity}/></span>
      </div>
    </div>
  );
};

const Avatar = () => (
  <div style={{
    width: 30, height: 30, borderRadius: 8, background: "#0E1626",
    display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
  }}>
    <BrandMark size={18} color="#FBF8F2" accent="#E5A8B1"/>
  </div>
);

const ThinkingDot = () => (
  <div style={{ display: "flex", gap: 12 }}>
    <Avatar/>
    <div style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "8px 14px",
                  background: "var(--paper)", border: "1px solid var(--border-1)", borderRadius: 14, borderBottomLeftRadius: 4 }}>
      {[0,1,2].map((i) => (
        <span key={i} className="lb-thinking-dot" style={{
          width: 6, height: 6, borderRadius: 999, background: "var(--ink-400)",
          animationDelay: `${i * 160}ms`,
        }}/>
      ))}
      <span style={{ fontSize: 12.5, color: "var(--ink-500)", marginLeft: 6 }}>L'assistant réfléchit…</span>
    </div>
  </div>
);

// AI message — renders prelude streaming + then blocks fade in
const AiMessage = ({ m, lang, speed, onAction, onDone }) => {
  const enabled = !m.done;
  const tokens = React.useMemo(() => tokenize(tr(m.prelude, lang)), [m.prelude, lang]);
  const total = React.useMemo(() => tokensLength(tokens), [tokens]);
  const speedCPS = speed;          // chars per second
  const progress = useStreaming(total, speedCPS, enabled);
  const preludeDone = progress >= total;

  // Stagger blocks once prelude is done.
  const [visibleBlocks, setVisibleBlocks] = React.useState(enabled ? 0 : (m.blocks?.length || 0));
  React.useEffect(() => {
    if (!enabled) { setVisibleBlocks(m.blocks?.length || 0); return; }
    if (!preludeDone) { setVisibleBlocks(0); return; }
    const blocks = m.blocks || [];
    let cancelled = false;
    let i = 0;
    const next = () => {
      if (cancelled) return;
      if (i > blocks.length) { onDone && onDone(); return; }
      setVisibleBlocks(i);
      if (i === blocks.length) { onDone && onDone(); return; }
      i++;
      setTimeout(next, 280);
    };
    next();
    return () => { cancelled = true; };
  }, [preludeDone, enabled]);

  return (
    <div style={{ display: "flex", gap: 12 }}>
      <Avatar/>
      <div style={{ flex: 1, minWidth: 0 }}>
        {tokens.length > 0 && (
          <div style={{ fontSize: 14.5, lineHeight: 1.6, color: "var(--ink-900)", marginBottom: 14 }}>
            <RenderTokens tokens={tokens} limit={progress}/>
            {!preludeDone && enabled && <span className="lb-caret"/>}
          </div>
        )}
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {m.blocks?.slice(0, visibleBlocks).map((b, i) => (
            <div key={i} className="lb-block-in"><Block b={b} lang={lang} onAction={onAction}/></div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ─── BLOCK COMPONENT (dispatcher) ───────────────────────────────────────
const Block = ({ b, lang, onAction }) => {
  if (b.kind === "cite-list")  return <BlockCiteList b={b} lang={lang}/>;
  if (b.kind === "warn")       return <BlockWarn b={b} lang={lang}/>;
  if (b.kind === "list")       return <BlockList b={b} lang={lang}/>;
  if (b.kind === "judge")      return <BlockJudge b={b} lang={lang}/>;
  if (b.kind === "draft")      return <BlockDraft b={b} lang={lang}/>;
  if (b.kind === "compare")    return <BlockCompare b={b} lang={lang}/>;
  if (b.kind === "concept")    return <BlockConcept b={b} lang={lang}/>;
  if (b.kind === "chart")      return <BlockChart b={b} lang={lang}/>;
  if (b.kind === "matter-impact") return <BlockMatterImpact b={b} lang={lang}/>;
  if (b.kind === "actions")    return <BlockActions b={b} lang={lang} onAction={onAction}/>;
  return null;
};

const BlockTitle = ({ icon, label }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
    {icon && <Icon name={icon} size={13} color="var(--ink-600)"/>}
    <span style={{ fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase",
                   fontWeight: 600, color: "var(--ink-600)" }}>{label}</span>
  </div>
);

const BlockCiteList = ({ b, lang }) => (
  <div>
    <BlockTitle icon="book" label={tr(b.title, lang)}/>
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      {b.items.map((it, i) => {
        const c = CASES[it.case];
        return (
          <div key={i} style={{
            background: "var(--paper)", border: "1px solid var(--border-1)",
            borderRadius: 10, padding: "12px 14px",
            display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12,
          }}>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontFamily: "var(--font-display)", fontStyle: "italic", fontWeight: 500,
                            fontSize: 16, color: "var(--ink-900)" }}>{c.title}</div>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 11.5, color: "var(--ink-500)", marginTop: 2 }}>
                {c.citation}
              </div>
              <div style={{ fontSize: 12.5, color: "var(--ink-700)", marginTop: 4 }}>{tr(it.note, lang)}</div>
            </div>
            <ScoreTriplet aut={c.aut} per={c.per} sol={c.sol} size="sm"/>
          </div>
        );
      })}
    </div>
  </div>
);

const BlockWarn = ({ b, lang }) => {
  const tokens = tokenize(tr(b.body, lang));
  return (
    <div style={{
      background: "#FBF3D9", border: "1px solid #F6E7B5", borderRadius: 10,
      padding: "12px 14px", display: "flex", gap: 12, alignItems: "flex-start",
    }}>
      <Icon name="alert" size={18} color="#6B4A0E"/>
      <div style={{ fontSize: 13.5, color: "#6B4A0E", lineHeight: 1.55 }}>
        <div style={{ fontWeight: 700, marginBottom: 4 }}>{tr(b.title, lang)}</div>
        <RenderTokens tokens={tokens}/>
      </div>
    </div>
  );
};

const BlockList = ({ b, lang }) => (
  <div>
    <BlockTitle icon="fileText" label={tr(b.title, lang)}/>
    <div style={{ background: "var(--paper)", border: "1px solid var(--border-1)", borderRadius: 10, overflow: "hidden" }}>
      {b.items.map((it, i) => (
        <div key={i} style={{
          display: "flex", alignItems: "center", gap: 10, padding: "10px 14px",
          borderTop: i ? "1px solid var(--border-1)" : 0,
        }}>
          {it.state === "ok"
            ? <span style={{ width: 18, height: 18, borderRadius: 999, background: "#E7F0EA",
                             display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Icon name="check" size={11} color="#1B3D26"/>
              </span>
            : <span style={{ width: 18, height: 18, borderRadius: 999, border: "1.5px dashed var(--ink-300)" }}/>
          }
          <div style={{ flex: 1, fontSize: 13.5, color: "var(--ink-900)", fontWeight: 500 }}>{tr(it.label, lang)}</div>
          <div style={{ fontSize: 11.5, color: it.state === "ok" ? "var(--solidite-700)" : "var(--ink-500)" }}>{tr(it.meta, lang)}</div>
        </div>
      ))}
    </div>
  </div>
);

const BlockJudge = ({ b, lang }) => {
  const tokens = tokenize(tr(b.body, lang));
  return (
    <div style={{
      background: "#E4ECF5", border: "1px solid #C9D7EA", borderRadius: 10,
      padding: "14px 16px",
    }}>
      <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
        <Icon name="judge" size={18} color="#102B57"/>
        <div style={{ fontSize: 13.5, color: "#102B57", lineHeight: 1.55, flex: 1 }}>
          <div style={{ fontWeight: 700, marginBottom: 4 }}>{tr(b.title, lang)}</div>
          <RenderTokens tokens={tokens}/>
        </div>
      </div>
      {b.stats && (
        <div style={{ marginTop: 12, paddingTop: 12, borderTop: "1px dashed #C9D7EA" }}>
          {b.stats.map((s, i) => <Bar key={i} label={tr(s.label, lang)} value={s.value} axis={s.axis}/>)}
        </div>
      )}
    </div>
  );
};

const BlockDraft = ({ b, lang }) => {
  const paras = tr(b.body, lang);
  return (
    <div style={{
      background: "var(--paper)", border: "1px solid var(--border-1)",
      borderRadius: 10, padding: "20px 22px",
      fontFamily: "var(--font-display)", fontSize: 15, lineHeight: 1.75,
      color: "var(--ink-800)",
      backgroundImage: "linear-gradient(to bottom, transparent 0 27px, rgba(122,31,43,0.07) 27px 28px)",
      backgroundSize: "100% 28px",
      position: "relative",
    }}>
      <div style={{
        position: "absolute", top: 12, right: 14,
        fontSize: 9.5, letterSpacing: "0.14em", textTransform: "uppercase",
        fontWeight: 600, color: "var(--oxblood-700)",
      }}>Ébauche</div>
      {paras.map((p, i) => (
        <p key={i} style={{ margin: "0 0 12px" }}>
          <RenderTokens tokens={tokenize(p)}/>
        </p>
      ))}
    </div>
  );
};

const BlockCompare = ({ b, lang }) => {
  const L = CASES[b.left], R = CASES[b.right];
  return (
    <div style={{ background: "var(--paper)", border: "1px solid var(--border-1)", borderRadius: 12, overflow: "hidden" }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", borderBottom: "1px solid var(--border-1)" }}>
        <div style={{ padding: "12px 14px", borderRight: "1px solid var(--border-1)" }}>
          <div style={{ fontFamily: "var(--font-display)", fontStyle: "italic", fontWeight: 500, fontSize: 15, color: "var(--ink-900)" }}>{L.title}</div>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--ink-500)", marginTop: 2 }}>{L.citation}</div>
          <div style={{ marginTop: 8 }}><ScoreTriplet aut={L.aut} per={L.per} sol={L.sol} size="sm"/></div>
        </div>
        <div style={{ padding: "12px 14px" }}>
          <div style={{ fontFamily: "var(--font-display)", fontStyle: "italic", fontWeight: 500, fontSize: 15, color: "var(--ink-900)" }}>{R.title}</div>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--ink-500)", marginTop: 2 }}>{R.citation}</div>
          <div style={{ marginTop: 8 }}><ScoreTriplet aut={R.aut} per={R.per} sol={R.sol} size="sm"/></div>
        </div>
      </div>
      {b.rows.map((r, i) => (
        <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", borderBottom: i === b.rows.length - 1 ? 0 : "1px solid var(--border-1)" }}>
          <div style={{ padding: "10px 14px", borderRight: "1px solid var(--border-1)" }}>
            <Overline style={{ marginBottom: 4 }}>{tr(r.label, lang)}</Overline>
            <div style={{ fontSize: 13, color: "var(--ink-800)", lineHeight: 1.5 }}>
              <RenderTokens tokens={tokenize(tr(r.left, lang))}/>
            </div>
          </div>
          <div style={{ padding: "10px 14px" }}>
            <Overline style={{ marginBottom: 4 }}>{tr(r.label, lang)}</Overline>
            <div style={{ fontSize: 13, color: "var(--ink-800)", lineHeight: 1.5 }}>
              <RenderTokens tokens={tokenize(tr(r.right, lang))}/>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

const BlockConcept = ({ b, lang }) => {
  const tokens = tokenize(tr(b.body, lang));
  return (
    <div style={{
      background: "#FBF8F2", border: "1px solid var(--parchment-200)",
      borderRadius: 10, padding: "14px 16px", borderLeft: "3px solid var(--oxblood-700)",
    }}>
      <div style={{ fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase",
                    fontWeight: 600, color: "var(--oxblood-700)", marginBottom: 6 }}>{tr(b.title, lang)}</div>
      <div style={{ fontSize: 13.5, color: "var(--ink-800)", lineHeight: 1.6 }}>
        <RenderTokens tokens={tokens}/>
      </div>
    </div>
  );
};

const BlockChart = ({ b, lang }) => (
  <div style={{ background: "var(--paper)", border: "1px solid var(--border-1)", borderRadius: 10, padding: "14px 16px" }}>
    <BlockTitle icon="pulse" label={tr(b.title, lang)}/>
    <div style={{ marginTop: 4 }}>
      {b.bars.map((bar, i) => <Bar key={i} label={tr(bar.label, lang)} value={bar.value} axis={bar.axis}/>)}
    </div>
  </div>
);

const BlockActions = ({ b, lang, onAction }) => (
  <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 2 }}>
    {b.items.map((a, i) => (
      <button key={i} onClick={() => onAction && onAction(a)} className="lb-chip" style={{
        background: "var(--paper)", color: "var(--ink-900)",
        border: "1px solid var(--border-2)", borderRadius: 8,
        padding: "7px 12px", fontSize: 12.5, fontWeight: 500,
        cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 6,
        transition: "all var(--dur-fast) var(--ease-out)",
      }}>
        {a.icon && <Icon name={a.icon} size={14}/>}{tr(a.label, lang)}
      </button>
    ))}
  </div>
);

// ─── Cross-dossier impact panel ───────────────────────────────
const MATTER_LABELS = {
  dupont:   { name: "Dupont c. Industries XYZ", area: { fr: "Travail", en: "Labour" } },
  tremblay: { name: "Tremblay c. PG du Québec", area: { fr: "Famille", en: "Family" } },
  lapointe: { name: "Lapointe c. CHUM",         area: { fr: "Médical", en: "Medical" } },
  lavoie:   { name: "Lavoie c. Manuf. Nord",    area: { fr: "Travail", en: "Labour" } },
  roy:      { name: "Roy c. Trudel",            area: { fr: "Contrat", en: "Contract" } },
};

const BlockMatterImpact = ({ b, lang }) => (
  <div>
    <BlockTitle icon="layout" label={tr(b.title, lang)}/>
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      {b.items.map((it, i) => {
        const meta = MATTER_LABELS[it.matter] || { name: it.matter, area: { fr: "", en: "" } };
        const tones = {
          hot:  { bar: "#7A1F2B", bg: "#FBEEF0", fg: "#4A0F18", chip: { fr: "Action requise", en: "Action required" } },
          warn: { bar: "#C8941F", bg: "#FBF3D9", fg: "#6B4A0E", chip: { fr: "À surveiller",    en: "Watch" } },
          ok:   { bar: "#3D7A4E", bg: "#E7F0EA", fg: "#1B3D26", chip: { fr: "Non affecté",     en: "Unaffected" } },
        }[it.tone];
        return (
          <div key={i} style={{
            background: "var(--paper)", border: "1px solid var(--border-1)",
            borderRadius: 10, padding: "12px 14px",
            borderLeft: `3px solid ${tones.bar}`,
            display: "grid", gridTemplateColumns: "1fr auto", gap: 14, alignItems: "flex-start",
          }}>
            <div style={{ minWidth: 0 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                <span style={{ fontFamily: "var(--font-display)", fontStyle: "italic", fontWeight: 500,
                              fontSize: 15, color: "var(--ink-900)" }}>{meta.name}</span>
                <span style={{
                  fontSize: 9.5, letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 700,
                  color: tones.fg, padding: "1px 7px", borderRadius: 3, background: tones.bg,
                }}>{tr(tones.chip, lang)}</span>
                <span style={{ fontSize: 11, color: "var(--ink-500)" }}>· {tr(meta.area, lang)}</span>
              </div>
              <div style={{ fontSize: 12.5, color: "var(--ink-700)", lineHeight: 1.5 }}>
                <b>{lang === "en" ? "Where: " : "Où : "}</b>{tr(it.hit, lang)}
              </div>
              <div style={{ fontSize: 12.5, color: "var(--ink-800)", lineHeight: 1.5, marginTop: 4 }}>
                <b style={{ color: tones.fg }}>{lang === "en" ? "Do: " : "Faire : "}</b>
                <RenderTokens tokens={tokenize(tr(it.rec, lang))}/>
              </div>
            </div>
            <div style={{ textAlign: "right", minWidth: 110, fontSize: 11, color: tones.fg, fontWeight: 600 }}>
              <Overline style={{ marginBottom: 4, color: "var(--ink-500)" }}>{lang === "en" ? "Next" : "Prochain"}</Overline>
              {tr(it.next, lang)}
            </div>
          </div>
        );
      })}
    </div>
  </div>
);

Object.assign(window, {
  tr, tokenize, tokensLength, RenderTokens, CaseLink, CasePopover,
  useStreaming, UserMessage, AiMessage, ThinkingDot, Avatar,
  Block, BlockCiteList, BlockWarn, BlockList, BlockJudge, BlockDraft,
  BlockCompare, BlockConcept, BlockChart, BlockMatterImpact, BlockActions,
});
