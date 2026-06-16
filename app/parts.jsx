/* eslint-disable */
// Shared atoms for the LexiBridge prototype.

// ─── Icon (Lucide-style, stroke 1.75) ────────────────────────────────────
const Icon = ({ name, size = 18, strokeWidth = 1.75, color = "currentColor", style }) => {
  const paths = {
    search:    <><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></>,
    chat:      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>,
    folder:    <path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>,
    judge:     <><circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/></>,
    network:   <><circle cx="6" cy="6" r="2"/><circle cx="18" cy="6" r="2"/><circle cx="12" cy="18" r="2"/><path d="M7.5 7.5 11 16M16.5 7.5 13 16"/></>,
    bell:      <><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10 21a2 2 0 0 0 4 0"/></>,
    settings:  <><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.6 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></>,
    plus:      <path d="M12 3v18M3 12h18"/>,
    send:      <><path d="M22 2 11 13"/><path d="M22 2 15 22l-4-9-9-4z"/></>,
    alert:     <><path d="M12 3 1.5 21h21z"/><path d="M12 10v5M12 18.5v.5"/></>,
    check:     <path d="M20 7 9 18l-5-5"/>,
    star:      <path d="m12 3 2 5h5l-4 3 1.5 6L12 14l-4.5 3L9 11 5 8h5z"/>,
    clock:     <><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></>,
    arrowRight:<path d="M5 12h14M13 5l7 7-7 7"/>,
    arrowLeft: <path d="M19 12H5M11 19l-7-7 7-7"/>,
    fileText:  <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6M8 13h8M8 17h5"/></>,
    pulse:     <path d="M3 12h4l3-8 4 16 3-8h4"/>,
    sparkle:   <path d="M12 3v4M12 17v4M3 12h4M17 12h4M5.6 5.6l2.8 2.8M15.6 15.6l2.8 2.8M5.6 18.4l2.8-2.8M15.6 8.4l2.8-2.8"/>,
    moreH:     <><circle cx="5" cy="12" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="19" cy="12" r="1.5"/></>,
    chevDown:  <path d="m6 9 6 6 6-6"/>,
    chevRight: <path d="m9 18 6-6-6-6"/>,
    pin:       <path d="M12 17v5M9 2h6l-1 6a4 4 0 0 1 3 4H7a4 4 0 0 1 3-4z"/>,
    book:      <path d="M4 19V5a2 2 0 0 1 2-2h13v18H6a2 2 0 0 1 0-4h13"/>,
    scales:    <><path d="M12 3v18M5 21h14"/><path d="m6 7-3 6a3 3 0 0 0 6 0z"/><path d="m18 7-3 6a3 3 0 0 0 6 0z"/><path d="M12 3 6 7M12 3l6 4"/></>,
    columns:   <><rect x="3"  y="5" width="6" height="14" rx="1"/><rect x="15" y="5" width="6" height="14" rx="1"/></>,
    quote:     <path d="M7 6c-2 1-3 4-3 7v5h6v-7H7c0-2 1-4 3-5zM17 6c-2 1-3 4-3 7v5h6v-7h-3c0-2 1-4 3-5z"/>,
    copy:      <><rect x="8" y="8" width="13" height="13" rx="2"/><path d="M16 8V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h3"/></>,
    refresh:   <><path d="M21 12a9 9 0 0 1-15 6.7L3 16"/><path d="M3 12a9 9 0 0 1 15-6.7L21 8"/><path d="M21 4v4h-4M3 20v-4h4"/></>,
    play:      <path d="M8 5v14l11-7z"/>,
    globe:     <><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/></>,
    sliders:   <><path d="M4 6h10M4 12h6M4 18h12"/><circle cx="17" cy="6" r="2"/><circle cx="14" cy="12" r="2"/><circle cx="19" cy="18" r="2"/></>,
    layout:    <><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/></>,
    bookmark:  <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>,
    home:      <><path d="M3 11 12 3l9 8"/><path d="M5 10v10h14V10"/></>,
    eye:       <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></>,
    eyeOff:    <><path d="M9.9 4.24A10 10 0 0 1 12 4c7 0 11 8 11 8a16 16 0 0 1-3.4 4.13M14.12 14.12A3 3 0 1 1 9.88 9.88"/><path d="M1 1l22 22M6.6 6.6A16 16 0 0 0 1 12s4 8 11 8a10 10 0 0 0 5.4-1.6"/></>,
    minus:     <path d="M5 12h14"/>,
    target:    <><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/></>,
    stop:      <rect x="6" y="6" width="12" height="12" rx="2"/>,
  };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={style}
         stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
      {paths[name]}
    </svg>
  );
};

// ─── Brand mark (inline SVG) ─────────────────────────────────────────────
// Docket Nova — "L'Étoile levante": a nova rising over the lines of the
// docket. `star` overrides the star fill (e.g. gold on dark); defaults to `color`.
const BrandMark = ({ size = 24, color = "#0E1626", accent = "#7A1F2B", star }) => {
  const starFill = star || color;
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      <rect x="11.5" y="43.5" width="41"   height="2.4" rx="1.2" fill={color}/>
      <rect x="11.5" y="50"   width="32"   height="2.4" rx="1.2" fill={color} opacity="0.42"/>
      <rect x="11.5" y="56.4" width="25.6" height="2.4" rx="1.2" fill={color} opacity="0.42"/>
      <path d="M32 5 Q35.5 25 52 29 Q35.5 33 32 53 Q28.5 33 12 29 Q28.5 25 32 5 Z" fill={starFill}/>
      <circle cx="47.5" cy="14.5" r="1.9" fill={accent}/>
      <circle cx="18"   cy="19.5" r="1.3" fill={accent}/>
    </svg>
  );
};

// ─── Score helpers ───────────────────────────────────────────────────────
function solPalette(score, axis) {
  const palettes = {
    aut: { bg: "#FBF3D9", fg: "#6B4A0E", bar: "#C8941F", track: "#F6E7B5" },
    per: { bg: "#E4ECF5", fg: "#102B57", bar: "#2B5FA8", track: "#C9D7EA" },
    sol_low:  { bg: "#FBEEF0", fg: "#7A1F2B", bar: "#B0394A", track: "#F5DCE0" },
    sol_mid:  { bg: "#FBF3D9", fg: "#6B4A0E", bar: "#C8941F", track: "#F6E7B5" },
    sol_high: { bg: "#E7F0EA", fg: "#1B3D26", bar: "#3D7A4E", track: "#CFE2D4" },
  };
  if (axis !== "sol") return palettes[axis];
  if (score < 50) return palettes.sol_low;
  if (score < 70) return palettes.sol_mid;
  return palettes.sol_high;
}

// ─── Score triplet ───────────────────────────────────────────────────────
const ScoreTriplet = ({ aut, per, sol, size = "md", caseData, lang }) => {
  const [expanded, setExpanded] = React.useState(false);
  const small = size === "sm";
  
  const scoreExplanations = {
    aut: lang === "en" 
      ? "Court of Appeal of Québec. Court hierarchy: SCC=100, CoA=80-90, Superior=70-80."
      : "Cour d'appel du Québec. Hiérarchie : CSC=100, CoA=80-90, Cour supérieure=70-80.",
    per: lang === "en"
      ? `Semantic relevance to "${caseData?.issue || 'this issue'}". Bilingual matching enabled.`
      : `Correspondance sémantique à "${caseData?.issue || 'cet enjeu'}". Appariement bilingue activé.`,
    sol: lang === "en"
      ? "Precedent remains valid. Not distinguished, criticized, or overruled in recent decisions."
      : "Précédent toujours valide. Non distingué, critiqué ni renversé dans les arrêts récents.",
  };

  const cell = {
    display: "flex", flexDirection: "column", alignItems: "center",
    padding: small ? "5px 9px" : "7px 11px",
    minWidth: small ? 46 : 54,
    cursor: !small ? "pointer" : "default",
    transition: "opacity 150ms",
  };
  const lbl = { fontSize: small ? 8.5 : 9.5, letterSpacing: "0.12em", textTransform: "uppercase", fontWeight: 600, opacity: 0.85 };
  const val = { fontFamily: "var(--font-display)", fontWeight: 500,
                fontSize: small ? 16 : 22, lineHeight: 1, letterSpacing: "-0.02em", marginTop: 2 };
  const cA = solPalette(aut, "aut"), cP = solPalette(per, "per"), cS = solPalette(sol, "sol");
  
  const ScoreCell = ({ color, label, value, explanation }) => (
    <div 
      style={{ ...cell, background: color.bg, color: color.fg, opacity: expanded ? 0.7 : 1 }}
      onClick={() => !small && setExpanded(!expanded)}
      title={!small ? lang === "en" ? "Click for explanation" : "Cliquez pour explication" : ""}
    >
      <span style={lbl}>{label}</span>
      <span style={val}>{value}</span>
    </div>
  );

  return (
    <div>
      <div style={{ display: "inline-flex", border: "1px solid var(--border-1)", borderRadius: 8, overflow: "hidden", flexShrink: 0 }}>
        <ScoreCell color={cA} label="Aut" value={aut} explanation={scoreExplanations.aut}/>
        <ScoreCell color={cP} label="Pert" value={per} explanation={scoreExplanations.per}/>
        <ScoreCell color={cS} label="Sol" value={sol} explanation={scoreExplanations.sol}/>
      </div>
      
      {/* Expandable explanations */}
      {expanded && !small && (
        <div style={{ marginTop: 8, padding: "10px 12px", background: "var(--ink-50)", borderRadius: 6, border: "1px solid var(--border-1)", display: "flex", flexDirection: "column", gap: 8, fontSize: 11, lineHeight: 1.5 }}>
          <div>
            <div style={{ fontWeight: 600, color: cA.fg, marginBottom: 2 }}>AUT (Authority)</div>
            <div style={{ color: "var(--ink-700)" }}>{scoreExplanations.aut}</div>
          </div>
          <div>
            <div style={{ fontWeight: 600, color: cP.fg, marginBottom: 2 }}>PERT (Relevance)</div>
            <div style={{ color: "var(--ink-700)" }}>{scoreExplanations.per}</div>
          </div>
          <div>
            <div style={{ fontWeight: 600, color: cS.fg, marginBottom: 2 }}>SOL (Solidity)</div>
            <div style={{ color: "var(--ink-700)" }}>{scoreExplanations.sol}</div>
          </div>
        </div>
      )}
    </div>
  );
};

// ─── Solidité pill (compact, for inline use) ─────────────────────────────
const SolPill = ({ value }) => {
  const c = solPalette(value, "sol");
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 4,
      fontSize: 11, fontWeight: 600, padding: "2px 8px", borderRadius: 999,
      background: c.bg, color: c.fg, fontFamily: "var(--font-mono)",
    }}>Sol <span style={{ fontWeight: 700 }}>{value}</span></span>
  );
};

// ─── Language tag ────────────────────────────────────────────────────────
const LangTag = ({ lang = "FR" }) => (
  <span style={{
    fontSize: 10, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase",
    color: "var(--ink-500)", border: "1px solid var(--border-2)", borderRadius: 3, padding: "1px 5px",
    fontFamily: "var(--font-sans)",
  }}>{lang}</span>
);

// ─── Case card ───────────────────────────────────────────────────────────
const CaseCard = ({ data, onClick, dense, lang = "en", caseData }) => (
  <div onClick={onClick} style={{
    background: "var(--paper)", border: "1px solid var(--border-1)",
    borderRadius: 12, padding: dense ? "12px 14px" : "16px 18px",
    cursor: onClick ? "pointer" : "default",
    display: "flex", flexDirection: "column", gap: dense ? 8 : 10,
    transition: "border-color var(--dur-fast) var(--ease-out), background var(--dur-fast) var(--ease-out)",
  }}
  onMouseEnter={(e) => onClick && (e.currentTarget.style.borderColor = "var(--ink-300)")}
  onMouseLeave={(e) => onClick && (e.currentTarget.style.borderColor = "var(--border-1)")}
  >
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 14 }}>
      <div style={{ minWidth: 0, flex: 1 }}>
        <h3 style={{
          fontFamily: "var(--font-display)", fontStyle: "italic", fontWeight: 500,
          fontSize: dense ? 18 : 21, letterSpacing: "-0.01em", color: "var(--ink-900)", margin: 0,
        }}>{data.title}</h3>
        <div style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--ink-500)", marginTop: 4 }}>
          {data.citation} · {data.court} · {data.date}
        </div>
      </div>
      <ScoreTriplet aut={data.aut} per={data.per} sol={data.sol} size={dense ? "sm" : "md"} lang={lang} caseData={caseData}/>
    </div>
    {data.summary && (
      <div style={{ fontSize: dense ? 12.5 : 13.5, lineHeight: 1.55, color: "var(--ink-700)" }}>{data.summary}</div>
    )}
    <div style={{ display: "flex", gap: 10, alignItems: "center", paddingTop: 8, borderTop: "1px dashed var(--border-1)" }}>
      <LangTag lang={data.lang || "FR"}/>
      {data.tags?.map((t, i) => (
        <span key={i} style={{
          fontSize: 11, padding: "2px 8px", borderRadius: 4,
          background: "var(--ink-50)", color: "var(--ink-700)", fontWeight: 500,
        }}>{t}</span>
      ))}
      {data.note && <span style={{ marginLeft: "auto", fontSize: 11.5, color: "var(--ink-500)" }}>{data.note}</span>}
    </div>
  </div>
);

// ─── Overline header ─────────────────────────────────────────────────────
const Overline = ({ children, color = "var(--ink-500)", style }) => (
  <div style={{
    fontSize: 10, letterSpacing: "0.14em", textTransform: "uppercase",
    fontWeight: 600, color, ...style,
  }}>{children}</div>
);

// ─── Buttons ─────────────────────────────────────────────────────────────
const InkButton = ({ children, icon, onClick, style }) => (
  <button onClick={onClick} className="lb-chip-ink" style={{
    background: "#0E1626", color: "#FBF8F2", border: 0,
    padding: "8px 14px", borderRadius: 8, fontWeight: 600, fontSize: 13,
    cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 6,
    transition: "background var(--dur-fast) var(--ease-out)", ...style,
  }}>{icon && <Icon name={icon} size={14} color="#FBF8F2"/>}{children}</button>
);
const OxbloodButton = ({ children, icon, onClick, style }) => (
  <button onClick={onClick} style={{
    background: "#7A1F2B", color: "#FBF8F2", border: 0,
    padding: "8px 14px", borderRadius: 8, fontWeight: 600, fontSize: 13,
    cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 6, ...style,
  }}>{icon && <Icon name={icon} size={14} color="#FBF8F2"/>}{children}</button>
);
const GhostButton = ({ children, icon, onClick, style }) => (
  <button onClick={onClick} className="lb-chip" style={{
    background: "var(--paper)", color: "var(--ink-900)",
    border: "1px solid var(--border-2)", padding: "7px 12px", borderRadius: 8,
    fontWeight: 500, fontSize: 12.5, cursor: "pointer",
    display: "inline-flex", alignItems: "center", gap: 6,
    transition: "background var(--dur-fast) var(--ease-out), border-color var(--dur-fast) var(--ease-out)",
    ...style,
  }}>{icon && <Icon name={icon} size={14}/>}{children}</button>
);

// ─── Bar (progress with axis tone) ───────────────────────────────────────
const Bar = ({ label, value, axis = "per", suffix = "%" }) => {
  const c = solPalette(value, axis === "sol" ? "sol" : axis);
  return (
    <div style={{ marginBottom: 10 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
        <span style={{ fontSize: 12.5, color: "var(--ink-700)" }}>{label}</span>
        <span style={{ fontFamily: "var(--font-mono)", fontSize: 11.5, color: "var(--ink-900)", fontWeight: 600 }}>{value}{suffix}</span>
      </div>
      <div style={{ height: 5, background: c.track, borderRadius: 999, overflow: "hidden" }}>
        <div style={{ height: "100%", width: value + "%", background: c.bar, borderRadius: 999, transition: "width 600ms var(--ease-out)" }}/>
      </div>
    </div>
  );
};

// ─── Section heading with optional count + action ───────────────────────
const SectionHeader = ({ title, count, action, onAction }) => (
  <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 12 }}>
    <h2 style={{ fontFamily: "var(--font-sans)", fontWeight: 600, fontSize: 16, color: "var(--ink-900)", margin: 0 }}>
      {title}{count && <span style={{ fontFamily: "var(--font-mono)", fontWeight: 500, fontSize: 12, color: "var(--ink-400)", marginLeft: 6 }}>{count}</span>}
    </h2>
    {action && (
      <button onClick={onAction} style={{
        background: "transparent", border: 0, fontSize: 12.5, color: "var(--ink-500)",
        cursor: "pointer", fontWeight: 500, display: "inline-flex", alignItems: "center", gap: 4,
      }}>{action}<Icon name="arrowRight" size={12} color="var(--ink-500)"/></button>
    )}
  </div>
);

// ─── Case database (referenced by Dossier, scenarios, etc.) ────────────────
const CASES = {
  Bombardier: {
    title: "Bombardier c. ECC",
    citation: "2020 SCC 16",
    lang: "fr",
    court: "SCC",
    year: 2020,
    aut: 95,
    per: 88,
    sol: 92,
    summary: "Just cause standard. Employer must prove conduct incompatible with employment.",
  },
  McLeod: {
    title: "McLeod c. Enerplus Resources",
    citation: "2015 SCC 54",
    lang: "en",
    court: "SCC",
    year: 2015,
    aut: 93,
    per: 78,
    sol: 88,
    summary: "Good faith and fair dealing in dismissal.",
  },
  Dupont: {
    title: "Dupont c. Québec",
    citation: "2019 QCCA 1456",
    lang: "fr",
    court: "QCCA",
    year: 2019,
    aut: 78,
    per: 85,
    sol: 82,
    summary: "Procedural fairness in termination.",
  },
  Gagnon: {
    title: "Gagnon c. Québec",
    citation: "2020 SCC 18",
    lang: "fr",
    court: "SCC",
    year: 2020,
    aut: 98,
    per: 92,
    sol: 75,
    summary: "Landmark ruling on just cause — now distinguished in many contexts.",
  },
  Haida: {
    title: "Haida Nation c. Canada",
    citation: "2004 SCC 73",
    lang: "en",
    court: "SCC",
    year: 2004,
    aut: 99,
    per: 88,
    sol: 91,
    summary: "Crown's duty to consult Aboriginal peoples.",
  },
  Tsilhqotin: {
    title: "Tsilhqot'in Nation c. Canada",
    citation: "2014 SCC 44",
    lang: "en",
    court: "SCC",
    year: 2014,
    aut: 98,
    per: 89,
    sol: 93,
    summary: "Aboriginal title and fiduciary duty.",
  },
  Lavallée: {
    title: "R. v. Lavallée",
    citation: "1990 SCC 87",
    lang: "en",
    court: "SCC",
    year: 1990,
    aut: 97,
    per: 92,
    sol: 90,
    summary: "Self-defence framework — subjective assessment.",
  },
};

Object.assign(window, {
  Icon, BrandMark, ScoreTriplet, SolPill, LangTag, CaseCard, Overline, CASES,
  InkButton, OxbloodButton, GhostButton, Bar, SectionHeader, solPalette,
});
