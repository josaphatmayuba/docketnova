/* eslint-disable */
// Recherche unifiée — search across the whole Canadian corpus with the
// 3D score triplet on every result. Bilingual.

const SEARCH_RESULTS = [
  CASES.Bombardier, CASES.Dupont, CASES.McLeod, CASES.Gagnon,
].map((c) => ({
  ...c,
  tags: c === CASES.Bombardier ? ["Travail", "Indemnité", "QCCA"]
       : c === CASES.Dupont ? ["Travail", "Réintégration"]
       : c === CASES.McLeod ? ["Labour", "SCC", "Common law"]
       : ["Travail", "Distingué"],
  note: c === CASES.Bombardier ? "Cité 47 fois"
      : c === CASES.Dupont ? "Lié au dossier Dupont"
      : c === CASES.McLeod ? "Cité 112 fois"
      : "⚠ Solidité affaiblie",
}));

const Search = ({ lang }) => {
  const [query, setQuery] = React.useState("");
  const [tab, setTab] = React.useState(lang === "en" ? "Cases" : "Arrêts");
  const [scope, setScope] = React.useState(lang === "en" ? "All" : "Tous");
  const [bilingual, setBilingual] = React.useState(true);

  const tabs = lang === "en" ? ["Cases", "Doctrine", "Legislation", "Matters"] : ["Arrêts", "Doctrine", "Législation", "Dossiers"];
  const scopes = lang === "en" ? ["All", "Quebec", "Ontario", "Federal", "SCC"] : ["Tous", "Québec", "Ontario", "Fédéral", "CSC"];

  return (
    <div style={{ flex: 1, overflow: "auto", padding: "24px 36px 40px" }}>
      <div style={{ maxWidth: 980, margin: "0 auto" }}>

        {/* Hero search */}
        <div style={{ position: "relative", marginBottom: 18 }}>
          <span style={{ position: "absolute", left: 18, top: "50%", transform: "translateY(-50%)", color: "var(--ink-400)" }}>
            <Icon name="search" size={20}/>
          </span>
          <input value={query} onChange={(e) => setQuery(e.target.value)}
            placeholder={lang === "en" ? "Search Canadian case law…" : "Rechercher dans la jurisprudence canadienne…"}
            style={{
            width: "100%", boxSizing: "border-box",
            fontFamily: "var(--font-sans)", fontSize: 17, padding: "16px 18px 16px 48px",
            border: "1px solid var(--border-2)", borderRadius: 12, background: "var(--paper)",
            color: "var(--ink-900)", boxShadow: "var(--shadow-1)",
          }}/>
          <span style={{
            position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)",
            fontSize: 10, fontFamily: "var(--font-mono)", color: "var(--ink-400)",
            background: "var(--ink-50)", padding: "2px 6px", borderRadius: 4, letterSpacing: "0.05em",
          }}>⌘ K</span>
        </div>

        {/* Filter row */}
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 16, flexWrap: "wrap" }}>
          <div style={{ display: "inline-flex", background: "var(--ink-50)", border: "1px solid var(--border-1)", borderRadius: 8, padding: 3 }}>
            {tabs.map((t) => (
              <button key={t} onClick={() => setTab(t)} style={{
                fontFamily: "var(--font-sans)", fontSize: 13, fontWeight: tab === t ? 600 : 500,
                border: 0, background: tab === t ? "var(--paper)" : "transparent",
                color: tab === t ? "var(--ink-900)" : "var(--ink-500)",
                padding: "6px 14px", borderRadius: 6, cursor: "pointer",
                boxShadow: tab === t ? "var(--shadow-1)" : "none",
              }}>{t}</button>
            ))}
          </div>
          <PillGroup options={scopes} value={scope} onChange={setScope}/>
          <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 8 }}>
            <button onClick={() => setBilingual(!bilingual)} className="lb-chip" style={{
              display: "inline-flex", alignItems: "center", gap: 6,
              background: bilingual ? "#E4ECF5" : "var(--paper)",
              border: "1px solid " + (bilingual ? "#7DA0CC" : "var(--border-2)"),
              color: bilingual ? "#102B57" : "var(--ink-700)",
              padding: "5px 11px", borderRadius: 999, fontSize: 12, fontWeight: 500, cursor: "pointer",
            }}>
              <Icon name="globe" size={13}/>
              {lang === "en" ? "Bilingual semantic" : "Sémantique bilingue"} {bilingual ? "·" : ""}
              {bilingual && <span style={{ fontFamily: "var(--font-mono)", fontWeight: 600 }}>FR+EN</span>}
            </button>
            <button className="lb-chip" style={{
              border: "1px solid var(--border-2)", background: "var(--paper)",
              fontSize: 12.5, fontWeight: 500, padding: "5px 10px", borderRadius: 6,
              color: "var(--ink-800)", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 6,
            }}>{lang === "en" ? "Solidity ↓" : "Solidité ↓"} <Icon name="chevDown" size={12} color="var(--ink-500)"/></button>
          </div>
        </div>

        {/* Result count */}
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 14, gap: 14 }}>
          <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 500, fontSize: 22, lineHeight: 1.25, color: "var(--ink-950)", margin: 0 }}>
            <span style={{ fontFamily: "var(--font-mono)", fontWeight: 500, fontSize: 17, color: "var(--ink-500)", marginRight: 10 }}>247</span>
            {lang === "en" ? "rulings in Canadian jurisprudence" : "arrêts dans la jurisprudence canadienne"}
          </h2>
          <div style={{ fontSize: 12, color: "var(--ink-500)" }}>
            {lang === "en" ? "Semantic search · FR + EN · 47 ms" : "Recherche sémantique · FR + EN · 47 ms"}
          </div>
        </div>

        {/* Results */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {SEARCH_RESULTS.map((c, i) => <CaseCard key={i} data={c} lang={lang} caseData={{ issue: "wrongful dismissal" }}/>)}
        </div>
      </div>
    </div>
  );
};

const PillGroup = ({ options, value, onChange }) => (
  <div style={{ display: "flex", gap: 6 }}>
    {options.map((o) => {
      const isActive = value === o;
      return (
        <button key={o} onClick={() => onChange(o)} style={{
          fontFamily: "var(--font-sans)", fontSize: 12, fontWeight: 500,
          padding: "5px 11px", borderRadius: 999,
          border: "1px solid " + (isActive ? "var(--ink-900)" : "var(--border-2)"),
          background: isActive ? "var(--ink-900)" : "var(--paper)",
          color: isActive ? "var(--parchment-50)" : "var(--ink-700)",
          cursor: "pointer",
        }}>{o}</button>
      );
    })}
  </div>
);

Object.assign(window, { Search });
