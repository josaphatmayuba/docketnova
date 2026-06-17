/* eslint-disable */
// Assistant — the hero feature. Drives the conversation, streams responses,
// supports 6 pre-scripted scenarios, replays, free-form questions via
// window.claude.complete, FR/EN switching, and action chips that either
// navigate to another screen or trigger the next scripted turn.

const Assistant = ({ tweaks, onNav, scenarioId, onScenario, playAll }) => {
  const lang = tweaks.lang;
  const density = tweaks.density;
  const speed = tweaks.streamSpeed;
  const showRail = tweaks.showRail;
  const layout = tweaks.layout;
  const isMobile = useIsMobile(768);

  const scenario = SCENARIOS.find((s) => s.id === scenarioId) || SCENARIOS[0];

  // Compute the initial cursor — show every message up to (but not including)
  // the first one gated behind a `triggeredBy` action chip. Clicking an action
  // with `next: "..."` then reveals the matching scripted pair, with a fresh
  // streaming effect on the new AI response.
  // In `playAll` mode (print / PDF) every message is revealed at once.
  const computeInitialPlayed = React.useCallback((scn) => {
    if (playAll) return scn.messages.length;
    for (let i = 0; i < scn.messages.length; i++) {
      const m = scn.messages[i];
      if (m.role === "user" && m.triggeredBy && i > 0) return i;
    }
    return scn.messages.length;
  }, [playAll]);

  // Replay key — incrementing forces remount of all messages so they stream again.
  const [replayKey, setReplayKey] = React.useState(0);
  // Index of how many messages from the script have been "played" — when the
  // user clicks a follow-up action this advances, otherwise it auto-advances.
  const [played, setPlayed] = React.useState(() => computeInitialPlayed(scenario));
  // Free-form turns (user + ai) appended on top of the scripted ones.
  const [extraTurns, setExtraTurns] = React.useState([]);
  const [draft, setDraft] = React.useState("");
  const [busy, setBusy] = React.useState(false);
  const scrollRef = React.useRef(null);
  const contentRef = React.useRef(null);

  // Reset when scenario or language changes
  React.useEffect(() => {
    setPlayed(computeInitialPlayed(scenario));
    setExtraTurns([]);
    setReplayKey((k) => k + 1);
  }, [scenarioId, lang, replayKey === -1]);

  // Auto-scroll vers le bas — y compris pendant que l'IA "écrit" (streaming).
  // Le ResizeObserver suit la croissance du contenu ; on ne colle au bas que si
  // l'utilisateur n'a pas remonté manuellement.
  React.useEffect(() => {
    const sc = scrollRef.current;
    const ct = contentRef.current;
    if (!sc || !ct) return;
    const stick = () => {
      const nearBottom = sc.scrollHeight - sc.scrollTop - sc.clientHeight < 120;
      if (nearBottom) sc.scrollTop = sc.scrollHeight;
    };
    sc.scrollTop = sc.scrollHeight; // saut initial en bas
    let ro;
    if (typeof ResizeObserver !== "undefined") {
      ro = new ResizeObserver(stick);
      ro.observe(ct);
    }
    return () => { if (ro) ro.disconnect(); };
  }, [replayKey, scenarioId, lang]);

  // ─── Helpers ───────────────────────────────────────────────────────
  const replay = () => {
    setExtraTurns([]);
    setPlayed(computeInitialPlayed(scenario));
    setReplayKey((k) => k + 1);
  };

  const handleAction = (action) => {
    if (action.screen) { onNav(action.screen); return; }
    if (action.next) {
      // Reveal the next scripted user msg whose `triggeredBy` matches, plus
      // the AI response that follows it.
      const idx = scenario.messages.findIndex(
        (m, i) => i >= played && m.role === "user" && m.triggeredBy === action.next
      );
      if (idx >= 0) setPlayed(Math.min(scenario.messages.length, idx + 2));
      return;
    }
    // No-op for chips like "Copier" or "Régénérer" — they're demo-only.
  };

  const handleSuggest = (prompt) => {
    if (prompt.scenario) onScenario(prompt.scenario);
  };

  // Free-form send: try window.claude.complete and stream the result.
  const send = async () => {
    const t = draft.trim();
    if (!t || busy) return;
    setDraft("");
    setBusy(true);
    const userTurn = { role: "user", text: { fr: t, en: t } };
    const thinkingTurn = { role: "ai", thinking: true };
    setExtraTurns((prev) => [...prev, userTurn, thinkingTurn]);
    try {
      const system = lang === "en"
        ? "You are LexiBridge, a Canadian legal-research assistant. Answer concisely in English. When you reference a case, surround the short citation with double square brackets, e.g. [[Bombardier]]. Always end with a one-sentence verification reminder."
        : "Tu es LexiBridge, un assistant juridique canadien. Réponds en français de façon concise et précise. Quand tu cites un arrêt, entoure son nom court de doubles crochets, ex. [[Bombardier]]. Termine toujours par un rappel de vérification d'une phrase.";
      const reply = await window.claude.complete({
        messages: [{ role: "user", content: t }],
        system,
      });
      const aiTurn = { role: "ai", prelude: { fr: reply, en: reply }, blocks: [] };
      setExtraTurns((prev) => prev.slice(0, -1).concat(aiTurn));
    } catch (e) {
      const aiTurn = {
        role: "ai",
        prelude: {
          fr: "Désolé, je n'ai pas pu joindre l'IA. Essayez l'une des suggestions ci-dessous pour rejouer un scénario.",
          en: "Sorry, I couldn't reach the model. Try a suggestion below to replay a scenario.",
        },
        blocks: [],
      };
      setExtraTurns((prev) => prev.slice(0, -1).concat(aiTurn));
    } finally {
      setBusy(false);
    }
  };

  const scriptedMessages = scenario.messages.slice(0, played);
  const allTurns = [...scriptedMessages, ...extraTurns];

  // ─── Layout ────────────────────────────────────────────────────────
  const composer = (
    <Composer
      lang={lang}
      draft={draft} setDraft={setDraft}
      onSend={send}
      busy={busy}
      prompts={SUGGESTED_PROMPTS[lang]}
      activeScenario={scenarioId}
      onSuggest={handleSuggest}
    />
  );

  return (
    <div style={{ display: "flex", flex: 1, minHeight: 0 }}>
      {/* Conversation column */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0, minHeight: 0 }}>
        <ScenarioBar lang={lang} scenario={scenario} onReplay={replay} onScenario={onScenario}/>
        <div ref={scrollRef} style={{ flex: 1, overflow: "auto", padding: density === "compact" ? "20px 28px 12px" : "28px 36px 16px" }}>
          <div ref={contentRef} style={{ maxWidth: 760, margin: "0 auto", display: "flex", flexDirection: "column",
                        gap: density === "compact" ? 16 : 22 }}>
            {allTurns.map((m, i) => {
              if (m.role === "user") return <UserMessage key={`${replayKey}-${i}`} text={m.text} lang={lang}/>;
              if (m.thinking) return <ThinkingDot key={`${replayKey}-${i}`}/>;
              const isLast = i === allTurns.length - 1;
              return (
                <AiMessage key={`${replayKey}-${i}`} m={{ ...m, done: !isLast }}
                           lang={lang} speed={speed} onAction={handleAction}/>
              );
            })}
          </div>
        </div>

        <div style={{ padding: density === "compact" ? "8px 28px 16px" : "12px 36px 24px" }}>
          <div style={{ maxWidth: 760, margin: "0 auto" }}>{composer}</div>
        </div>
      </div>

      {/* Context rail — masqué sur mobile (cacherait la conversation) */}
      {showRail && layout === "three-col" && !isMobile && (
        <ContextRail lang={lang} scenario={scenario} onNav={onNav}/>
      )}
    </div>
  );
};

// ─── Scenario bar (header above the conversation) ─────────────────────
const ScenarioBar = ({ lang, scenario, onReplay, onScenario }) => (
  <div style={{
    padding: "10px 36px 12px", borderBottom: "1px solid var(--border-1)",
    display: "flex", alignItems: "center", gap: 12, background: "var(--bg-app)",
  }}>
    <div style={{
      width: 30, height: 30, borderRadius: 8,
      background: "var(--bg-sunken)", border: "1px solid var(--border-1)",
      display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
    }}>
      <Icon name={scenario.icon} size={15} color="var(--oxblood-700)"/>
    </div>
    <div style={{ minWidth: 0, flex: 1 }}>
      <Overline style={{ marginBottom: 2, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
        {scenario.crossDossier
          ? (lang === "en" ? "Across your matters" : "À travers vos dossiers")
          : scenario.dossier ? scenario.dossier : (lang === "en" ? "Open question" : "Question ouverte")}
      </Overline>
      <div style={{ fontFamily: "var(--font-display)", fontSize: 16, fontWeight: 500,
                    color: "var(--ink-900)", letterSpacing: "-0.005em",
                    whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
        {tr(scenario.label, lang)}
      </div>
    </div>
    <MatterPicker lang={lang} scenario={scenario} onScenario={onScenario}/>
    <ScenarioPicker lang={lang} current={scenario.id} onPick={onScenario}/>
    <button onClick={onReplay} className="lb-chip" style={{
      background: "var(--paper)", border: "1px solid var(--border-2)",
      padding: "6px 10px", borderRadius: 8, cursor: "pointer",
      fontSize: 12, fontWeight: 500, color: "var(--ink-700)",
      display: "inline-flex", alignItems: "center", gap: 5,
    }}>
      <Icon name="refresh" size={13}/>{lang === "en" ? "Replay" : "Rejouer"}
    </button>
  </div>
);

// ─── Matter (dossier) picker ────────────────────────────────────────────
// Switches the conversation context to a specific dossier (or to a cross-
// dossier / general mode). Implemented as a scenario shortcut.
const MATTER_OPTIONS = [
  { id: "dupont",   scenario: "dupont",   name: "Dupont c. Industries XYZ", area: { fr: "Travail",  en: "Labour" },  hot: true },
  { id: "beaulieu", scenario: "beaulieu", name: "R. c. Beaulieu",           area: { fr: "Criminel", en: "Criminal" }, hot: true },
  { id: "tremblay", scenario: "tremblay", name: "Tremblay c. PG du Québec", area: { fr: "Famille",  en: "Family" } },
  { id: "lemieux",  scenario: "lemieux",  name: "R. c. Lemieux",            area: { fr: "Criminel", en: "Criminal" } },
  { id: "lapointe", scenario: "medical",  name: "Lapointe c. CHUM",         area: { fr: "Médical",  en: "Medical" } },
  { id: "roy",      scenario: null,       name: "Roy c. Trudel",            area: { fr: "Contrat",  en: "Contract" } },
  { id: "_cross",   scenario: "cross",    name: { fr: "À travers tous mes dossiers", en: "Across all matters" }, area: null, special: true },
  { id: "_none",    scenario: "medical",  name: { fr: "Aucun — question générale",    en: "None — general question" }, area: null, special: true },
];

const MatterPicker = ({ lang, scenario, onScenario }) => {
  const [open, setOpen] = React.useState(false);
  const wrap = React.useRef(null);
  React.useEffect(() => {
    const onDoc = (e) => { if (wrap.current && !wrap.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  // Resolve label of the active matter from the current scenario.
  const activeOpt = MATTER_OPTIONS.find((o) => o.scenario === scenario.id) || MATTER_OPTIONS[5];
  const activeLabel = scenario.crossDossier
    ? (lang === "en" ? "All matters" : "Tous mes dossiers")
    : scenario.dossier
      ? scenario.dossier.split(" ")[0]
      : (lang === "en" ? "No matter" : "Sans dossier");

  return (
    <div ref={wrap} style={{ position: "relative" }}>
      <button onClick={() => setOpen((o) => !o)} className="lb-chip" style={{
        display: "inline-flex", alignItems: "center", gap: 6,
        background: "var(--paper)", border: "1px solid var(--border-2)",
        padding: "6px 10px", borderRadius: 8, cursor: "pointer",
        fontSize: 12, fontWeight: 500, color: "var(--ink-700)",
        maxWidth: 220,
      }}>
        <Icon name="folder" size={12}/>
        <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{activeLabel}</span>
        <Icon name="chevDown" size={11} color="var(--ink-500)"/>
      </button>
      {open && (
        <div style={{
          position: "absolute", top: "calc(100% + 6px)", right: 0, zIndex: 30,
          background: "var(--paper)", border: "1px solid var(--border-2)",
          borderRadius: 10, boxShadow: "var(--shadow-3)", width: 280, padding: 6,
        }}>
          <div style={{ padding: "6px 10px 8px", fontSize: 9.5, letterSpacing: "0.14em", textTransform: "uppercase",
                        fontWeight: 700, color: "var(--ink-500)" }}>
            {lang === "en" ? "Switch context" : "Changer de contexte"}
          </div>
          {MATTER_OPTIONS.map((o, i) => {
            const isActive = (o.scenario === scenario.id);
            const isDivider = o.id === "_cross";
            return (
              <React.Fragment key={o.id}>
                {isDivider && <div style={{ height: 1, background: "var(--border-1)", margin: "6px 4px" }}/>}
                <button
                  onClick={() => { if (o.scenario) onScenario(o.scenario); setOpen(false); }}
                  disabled={!o.scenario}
                  style={{
                    display: "grid", gridTemplateColumns: "10px 1fr auto",
                    alignItems: "center", gap: 10, width: "100%",
                    padding: "8px 10px", border: 0, borderRadius: 6,
                    background: isActive ? "var(--ink-50)" : "transparent",
                    cursor: o.scenario ? "pointer" : "not-allowed",
                    opacity: o.scenario ? 1 : 0.45, textAlign: "left",
                  }}
                  onMouseEnter={(e) => { if (!isActive && o.scenario) e.currentTarget.style.background = "var(--ink-50)"; }}
                  onMouseLeave={(e) => { if (!isActive) e.currentTarget.style.background = "transparent"; }}>
                  <span>{o.hot && <span style={{ width: 6, height: 6, borderRadius: 999, background: "#B0394A", display: "inline-block" }}/>}</span>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontFamily: o.special ? "var(--font-sans)" : "var(--font-display)",
                                  fontStyle: o.special ? "normal" : "italic",
                                  fontWeight: 500, fontSize: 13, color: "var(--ink-900)",
                                  overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {typeof o.name === "string" ? o.name : tr(o.name, lang)}
                    </div>
                    {o.area && <div style={{ fontSize: 10.5, color: "var(--ink-500)", marginTop: 1 }}>{tr(o.area, lang)}</div>}
                  </div>
                  {isActive && <Icon name="check" size={13} color="var(--oxblood-700)"/>}
                </button>
              </React.Fragment>
            );
          })}
        </div>
      )}
    </div>
  );
};

const ScenarioPicker = ({ lang, current, onPick }) => {
  const [open, setOpen] = React.useState(false);
  const wrap = React.useRef(null);
  React.useEffect(() => {
    const onDoc = (e) => { if (wrap.current && !wrap.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);
  return (
    <div ref={wrap} style={{ position: "relative" }}>
      <button onClick={() => setOpen((o) => !o)} className="lb-chip" style={{
        background: "var(--paper)", border: "1px solid var(--border-2)",
        padding: "6px 10px", borderRadius: 8, cursor: "pointer",
        fontSize: 12, fontWeight: 500, color: "var(--ink-700)",
        display: "inline-flex", alignItems: "center", gap: 5,
      }}>
        <Icon name="play" size={12}/>{lang === "en" ? "Scenarios" : "Scénarios"}
        <Icon name="chevDown" size={11} color="var(--ink-500)"/>
      </button>
      {open && (
        <div style={{
          position: "absolute", top: "calc(100% + 6px)", right: 0, zIndex: 30,
          background: "var(--paper)", border: "1px solid var(--border-2)",
          borderRadius: 10, boxShadow: "var(--shadow-3)", width: 320, padding: 6,
        }}>
          {SCENARIOS.map((s) => (
            <button key={s.id} onClick={() => { onPick(s.id); setOpen(false); }} style={{
              display: "grid", gridTemplateColumns: "22px 1fr",
              alignItems: "center", gap: 10, width: "100%",
              padding: "9px 10px", border: 0, borderRadius: 6,
              background: current === s.id ? "var(--ink-50)" : "transparent",
              cursor: "pointer", textAlign: "left",
            }}
            onMouseEnter={(e) => current !== s.id && (e.currentTarget.style.background = "var(--ink-50)")}
            onMouseLeave={(e) => current !== s.id && (e.currentTarget.style.background = "transparent")}>
              <Icon name={s.icon} size={15} color="var(--oxblood-700)"/>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: "var(--ink-900)" }}>{tr(s.label, lang)}</div>
                <div style={{ fontSize: 11.5, color: "var(--ink-500)", marginTop: 1,
                              overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {tr(s.summary, lang)}
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

// ─── Composer ─────────────────────────────────────────────────────────
const SHORT_PROMPT = {
  dupont:   { fr: "Audience demain",     en: "Hearing tomorrow" },
  tremblay: { fr: "Tremblay · garde",     en: "Tremblay · custody" },
  beaulieu: { fr: "Beaulieu · fouille",   en: "Beaulieu · search" },
  lemieux:  { fr: "Lemieux · défense",    en: "Lemieux · defence" },
  cross:    { fr: "Impact transverse",    en: "Cross-matter impact" },
  medical:  { fr: "Médical récent",       en: "Recent medical" },
  opening:  { fr: "Rédiger ouverture",    en: "Draft opening" },
  compare:  { fr: "Bombardier vs McLeod", en: "Bombardier vs McLeod" },
  honneur:  { fr: "Honneur de la Couronne", en: "Honour of the Crown" },
};

const Composer = ({ lang, draft, setDraft, onSend, busy, prompts, activeScenario, onSuggest }) => (
  <>
    <div style={{
      display: "flex", gap: 8, marginBottom: 10,
      overflowX: "auto", overflowY: "hidden",
      paddingBottom: 2, scrollbarWidth: "thin",
    }}>
      {prompts.map((p, i) => {
        const active = p.scenario === activeScenario;
        const short = tr(SHORT_PROMPT[p.scenario] || { fr: p.text, en: p.text }, lang);
        return (
          <button key={i} onClick={() => onSuggest(p)} className="lb-chip" title={p.text} style={{
            fontFamily: "var(--font-sans)", fontSize: 12,
            padding: "6px 11px", borderRadius: 999,
            background: active ? "var(--ink-900)" : "var(--paper)",
            border: "1px solid " + (active ? "var(--ink-900)" : "var(--border-2)"),
            color: active ? "var(--parchment-50)" : "var(--ink-700)",
            cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 5,
            whiteSpace: "nowrap", flexShrink: 0,
          }}>
            <Icon name={p.icon} size={12} color={active ? "var(--parchment-50)" : "var(--ink-500)"}/>
            <span>{short}</span>
          </button>
        );
      })}
    </div>
    <div style={{
      background: "var(--paper)", border: "1px solid var(--border-2)",
      borderRadius: 14, padding: "14px 16px", boxShadow: "var(--shadow-2)",
      display: "flex", alignItems: "flex-end", gap: 12,
    }}>
      <textarea
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); onSend(); } }}
        placeholder={lang === "en"
          ? "Ask a question — in French or English. The assistant knows your matters."
          : "Posez votre question — en français ou en anglais. L'assistant connaît vos dossiers."}
        style={{
          flex: 1, border: 0, outline: 0, resize: "none",
          fontFamily: "var(--font-sans)", fontSize: 14, lineHeight: 1.5,
          color: "var(--ink-900)", minHeight: 36, maxHeight: 120, background: "transparent",
        }}
        rows={1}
      />
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <span style={{ fontSize: 10, color: "var(--ink-400)", fontFamily: "var(--font-mono)", letterSpacing: "0.04em" }}>
          {busy ? (lang === "en" ? "thinking…" : "réflexion…") : "↵ envoyer"}
        </span>
        <button onClick={onSend} disabled={busy} style={{
          background: busy ? "var(--ink-400)" : "#0E1626", color: "#FBF8F2", border: 0,
          padding: 8, borderRadius: 8, cursor: busy ? "wait" : "pointer", display: "flex",
        }}><Icon name={busy ? "clock" : "send"} size={16} color="#FBF8F2"/></button>
      </div>
    </div>
    <div style={{ fontSize: 11, color: "var(--ink-400)", marginTop: 8, textAlign: "center" }}>
      {lang === "en"
        ? "The assistant cites its sources. Always verify before citing in court — it does not replace your judgment."
        : "L'assistant cite ses sources. Vérifiez toujours avant de citer en cour — il ne remplace pas votre jugement."}
    </div>
  </>
);

// ─── Context rail ─────────────────────────────────────────────────────
const ContextRail = ({ lang, scenario, onNav }) => {
  // Pull the unique case references from the scenario's blocks for the rail.
  const seen = new Set();
  scenario.messages.forEach((m) => {
    if (m.role !== "ai" || !m.blocks) return;
    m.blocks.forEach((b) => {
      if (b.kind === "cite-list") b.items.forEach((it) => seen.add(it.case));
    });
  });
  const cites = [...seen].map((k) => CASES[k]).filter(Boolean);

  return (
    <aside style={{
      width: 296, flexShrink: 0, borderLeft: "1px solid var(--border-1)",
      background: "var(--paper)", padding: "22px 20px", overflow: "auto",
      display: "flex", flexDirection: "column", gap: 22,
    }}>
      {scenario.dossier ? (
        <div>
          <Overline style={{ marginBottom: 8 }}>{lang === "en" ? "Active context" : "Contexte actif"}</Overline>
          <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px",
                        background: "var(--bg-sunken)", borderRadius: 10 }}>
            <Icon name="folder" size={16} color="#7A1F2B"/>
            <div style={{ minWidth: 0, flex: 1 }}>
              <div style={{ fontFamily: "var(--font-display)", fontStyle: "italic", fontWeight: 500,
                            fontSize: 14, lineHeight: 1.25, color: "var(--ink-900)",
                            overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {scenario.dossier}
              </div>
              <div style={{ fontSize: 11.5, color: "var(--ink-500)", marginTop: 2 }}>{tr(scenario.label, lang)}</div>
            </div>
          </div>
          <button onClick={() => onNav("dossier-dupont")} className="lb-chip" style={{
            marginTop: 8, width: "100%", boxSizing: "border-box",
            background: "transparent", border: "1px solid var(--border-1)",
            padding: "6px 10px", borderRadius: 6, cursor: "pointer",
            fontSize: 12, color: "var(--ink-700)", display: "inline-flex",
            alignItems: "center", justifyContent: "center", gap: 6,
          }}>
            {lang === "en" ? "Open matter" : "Ouvrir le dossier"} <Icon name="arrowRight" size={12}/>
          </button>
        </div>
      ) : (
        <div>
          <Overline style={{ marginBottom: 8 }}>{lang === "en" ? "Active context" : "Contexte actif"}</Overline>
          <div style={{ padding: "10px 12px", background: "var(--bg-sunken)", borderRadius: 10,
                        fontSize: 12.5, color: "var(--ink-600)", lineHeight: 1.45 }}>
            {lang === "en"
              ? "No matter linked — this is a general research question. The assistant answers from the full Canadian corpus."
              : "Aucun dossier lié — question de recherche générale. L'assistant répond à partir de tout le corpus canadien."}
          </div>
        </div>
      )}

      {cites.length > 0 && (
        <div>
          <Overline style={{ marginBottom: 10 }}>
            {lang === "en" ? `Cited sources (${cites.length})` : `Sources citées (${cites.length})`}
          </Overline>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {cites.map((c, i) => (
              <div key={i} style={{ padding: "8px 10px", borderRadius: 8, border: "1px solid var(--border-1)" }}>
                <div style={{ fontFamily: "var(--font-display)", fontStyle: "italic", fontSize: 13, color: "var(--ink-900)" }}>{c.title}</div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 3 }}>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: 10.5, color: "var(--ink-500)" }}>{c.citation}</span>
                  <SolPill value={c.sol}/>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Proactive actions — turn the conversation into an official document */}
      <ProactiveActions lang={lang} scenario={scenario} onNav={onNav}/>

      <div>
        <Overline style={{ marginBottom: 8 }}>{lang === "en" ? "Connected to" : "Connecté à"}</Overline>
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          {[
            { id: "search",       icon: "search",  label: { fr: "Recherche unifiée",   en: "Unified search" } },
            { id: "cartography",  icon: "network", label: { fr: "Cartographie",        en: "Cartography" } },
            { id: "judges",       icon: "judge",   label: { fr: "Profil des juges",    en: "Judge profiles" } },
            { id: "revirements",  icon: "alert",   label: { fr: "Revirements",         en: "Reversal alerts" } },
            { id: "argumentaires",icon: "quote",   label: { fr: "Argumentaires",       en: "Argument drafting" } },
            { id: "dossiers",     icon: "folder",  label: { fr: "Mes dossiers",        en: "My matters" } },
          ].map((n) => (
            <button key={n.id} onClick={() => onNav(n.id)} className="lb-chip" style={{
              display: "flex", alignItems: "center", gap: 10,
              padding: "7px 10px", border: 0, borderRadius: 6, background: "transparent",
              fontSize: 12.5, color: "var(--ink-700)", cursor: "pointer", textAlign: "left",
              transition: "background var(--dur-fast) var(--ease-out)",
            }}>
              <Icon name={n.icon} size={13} color="var(--ink-500)"/>
              <span style={{ flex: 1 }}>{tr(n.label, lang)}</span>
              <Icon name="arrowRight" size={11} color="var(--ink-400)"/>
            </button>
          ))}
        </div>
      </div>

      <div style={{
        marginTop: "auto", padding: "10px 12px", borderRadius: 10,
        border: "1px solid var(--border-1)", background: "#FBF8F2",
        fontSize: 11.5, color: "var(--ink-600)", lineHeight: 1.5,
      }}>
        <span style={{ fontWeight: 600, color: "var(--oxblood-700)" }}>
          {lang === "en" ? "Honesty note · " : "Note d'honnêteté · "}
        </span>
        {lang === "en"
          ? "The assistant flags its limits. Verify every citation before pleading."
          : "L'assistant signale ses limites. Vérifiez chaque citation avant de plaider."}
      </div>
    </aside>
  );
};

// ─── Proactive actions ─────────────────────────────────────
// Turn the conversation into an official document. These cards live in the
// right rail and stay tailored to whichever scenario is active.
const ACTIONS_BY_SCENARIO = {
  dupont: [
    { icon: "quote",    label: { fr: "Ouverture de plaidoirie",    en: "Opening statement" },         sub: { fr: "4 paragraphes · calibré juge Côté", en: "4 paragraphs · calibrated for J. Côté" }, to: "argumentaires" },
    { icon: "fileText", label: { fr: "Mémo de recherche",          en: "Research memo" },              sub: { fr: "Sourcé · prochain mardi",          en: "Sourced · next Tuesday" } },
    { icon: "scales",   label: { fr: "Requête en réintégration",    en: "Reinstatement motion" },     sub: { fr: "Pièces jointes prêtes",            en: "Exhibits ready" }, to: "dossier-dupont" },
    { icon: "alert",    label: { fr: "Réplique à Gagnon",           en: "Reply on Gagnon" },           sub: { fr: "Précédent distingué · Sol 41 %",     en: "Distinguished · Sol 41%" }, to: "revirements" },
  ],
  tremblay: [
    { icon: "quote",    label: { fr: "Argument continuité scolaire", en: "School-continuity argument" }, sub: { fr: "3 paragraphes prêts",             en: "3 paragraphs ready" }, to: "argumentaires" },
    { icon: "fileText", label: { fr: "Mémo · distinguer 2019",      en: "Memo · distinguish 2019" },    sub: { fr: "Basé sur Droit famille 2023",       en: "Built on Droit famille 2023" } },
    { icon: "judge",    label: { fr: "Note sur la juge Bernier",     en: "Note on Justice Bernier" },    sub: { fr: "Tendances · 21 jugements",         en: "Tendencies · 21 rulings" }, to: "judges" },
  ],
  cross: [
    { icon: "alert",    label: { fr: "Corriger Dupont en priorité", en: "Fix Dupont first" },           sub: { fr: "Audience demain · 9 h 30",           en: "Hearing tomorrow · 9:30" }, to: "dossier-dupont" },
    { icon: "layout",   label: { fr: "Vue d'ensemble dossiers",     en: "Matters overview" },           sub: { fr: "4 dossiers · 41 sources",            en: "4 matters · 41 sources" }, to: "dossiers" },
    { icon: "fileText", label: { fr: "Note de veille · Gagnon",     en: "Watch memo · Gagnon" },        sub: { fr: "À envoyer à toute l'équipe",         en: "Send to the whole team" } },
  ],
  beaulieu: [
    { icon: "quote",    label: { fr: "Requête en exclusion 24(2)", en: "Motion to exclude (24(2))" },   sub: { fr: "Générée · 11 sources",                en: "Generated · 11 sources" }, to: "argumentaires" },
    { icon: "fileText", label: { fr: "Plan d'interrogatoire",       en: "Cross-exam outline" },          sub: { fr: "4 séquences · test Grant",           en: "4 sequences · Grant test" } },
    { icon: "judge",    label: { fr: "Profil du juge Lacasse",      en: "Justice Lacasse profile" },     sub: { fr: "Exclusion 62 %",                     en: "Exclusion rate 62%" }, to: "judges" },
    { icon: "book",     label: { fr: "Mémo · jurisprudence post-Grant", en: "Memo · post-Grant case law" },sub: { fr: "14 arrêts QCCA / QCCS",            en: "14 QCCA / QCCS rulings" } },
  ],
  lemieux: [
    { icon: "quote",    label: { fr: "Argument légitime défense · art. 34", en: "Self-defence argument · s. 34" }, sub: { fr: "Basé sur Lavallée + Khill",  en: "Built on Lavallée + Khill" }, to: "argumentaires" },
    { icon: "clock",    label: { fr: "Tableau Jordan · retards",    en: "Jordan delay table" },          sub: { fr: "141 j Couronne · 426 j total",      en: "141 d Crown · 426 d total" } },
    { icon: "fileText", label: { fr: "Mise en demeure · Couronne",  en: "Demand letter · Crown" },       sub: { fr: "Solidifie le futur Jordan",        en: "Solidifies future Jordan motion" }, to: "argumentaires" },
    { icon: "judge",    label: { fr: "Profil de la juge Audet",     en: "Justice Audet profile" },       sub: { fr: "Acquittement art. 34 : 51 %",     en: "Acquittal s. 34: 51%" }, to: "judges" },
  ],
  medical: [
    { icon: "fileText", label: { fr: "Note de veille · médical QC", en: "Watch memo · QC medical" },    sub: { fr: "127 arrêts résumés",                en: "127 rulings summarized" } },
    { icon: "network",  label: { fr: "Cartographie des standards",  en: "Map of standards" },          sub: { fr: "3 axes · 14 arrêts CA",             en: "3 axes · 14 appellate rulings" }, to: "cartography" },
  ],
  opening: [
    { icon: "copy",     label: { fr: "Copier le brouillon",         en: "Copy the draft" },             sub: { fr: "Format texte ou Word",            en: "Text or Word" } },
    { icon: "refresh",  label: { fr: "Régénérer — plus ferme",      en: "Regenerate — firmer" },        sub: { fr: "Mêmes sources",                    en: "Same sources" } },
    { icon: "folder",   label: { fr: "Ajouter au dossier Dupont",   en: "Save to Dupont matter" },     sub: { fr: "Section · Ouverture",              en: "Section · Opening" }, to: "dossier-dupont" },
  ],
  compare: [
    { icon: "columns",  label: { fr: "Tableau comparatif · .docx",  en: "Comparison table · .docx" },  sub: { fr: "Prêt à insérer en mémoire",         en: "Ready to drop in a brief" } },
    { icon: "fileText", label: { fr: "Mémo doctrinal",              en: "Doctrinal memo" },             sub: { fr: "Civil law ↔ common law",            en: "Civil law ↔ common law" } },
  ],
  honneur: [
    { icon: "fileText", label: { fr: "Note de synthèse · trilogie", en: "Memo · the trilogy" },         sub: { fr: "Haida · Mikisew · Tsilhqot'in",      en: "Haida · Mikisew · Tsilhqot'in" } },
    { icon: "network",  label: { fr: "Cartographie autour de Haida", en: "Cartography around Haida" },  sub: { fr: "58 arrêts au second degré",        en: "58 rulings at second degree" }, to: "cartography" },
  ],
};

const ProactiveActions = ({ lang, scenario, onNav }) => {
  const items = ACTIONS_BY_SCENARIO[scenario.id] || ACTIONS_BY_SCENARIO.dupont;
  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
        <Overline color="var(--oxblood-700)">{lang === "en" ? "Proactive actions" : "Actions proactives"}</Overline>
        <span style={{ fontSize: 10, color: "var(--ink-500)", fontFamily: "var(--font-mono)" }}>
          {lang === "en" ? "from this dialogue" : "à partir de ce dialogue"}
        </span>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {items.map((a, i) => (
          <button key={i} onClick={() => a.to && onNav(a.to)} className="lb-chip" style={{
            display: "grid", gridTemplateColumns: "32px 1fr 12px", alignItems: "center", gap: 10,
            padding: "10px 12px", border: "1px solid var(--border-1)", borderRadius: 10,
            background: "var(--paper)", cursor: "pointer", textAlign: "left",
            transition: "all var(--dur-fast) var(--ease-out)",
          }}
          onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--oxblood-300)"; e.currentTarget.style.background = "#FBF8F2"; }}
          onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--border-1)"; e.currentTarget.style.background = "var(--paper)"; }}>
            <div style={{ width: 30, height: 30, borderRadius: 8, background: "#FBEEF0", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Icon name={a.icon} size={14} color="#7A1F2B"/>
            </div>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: 12.5, fontWeight: 600, color: "var(--ink-900)", lineHeight: 1.25 }}>{tr(a.label, lang)}</div>
              <div style={{ fontSize: 11, color: "var(--ink-500)", marginTop: 2,
                            overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{tr(a.sub, lang)}</div>
            </div>
            <Icon name="arrowRight" size={12} color="var(--ink-400)"/>
          </button>
        ))}
      </div>
    </div>
  );
};

Object.assign(window, { Assistant });