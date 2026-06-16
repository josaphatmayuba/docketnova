/* eslint-disable */
// Reversals list — search, filter by severity/date. Click to view detailed reversal analysis.

const ReversalsList = ({ lang, onNav }) => {
  const [search, setSearch] = React.useState("");
  const [filter, setFilter] = React.useState("all");
  const [sort, setSort] = React.useState("recent");

  // Mock reversals database
  const ALL_REVERSALS = [
    {
      id: "gagnon",
      case: "Gagnon c. Québec",
      citation: "2020 CSC 18",
      date: "15 mai 2020",
      severity: "high",
      impact: { fr: "Redéfinit la cause juste en droit du travail", en: "Redefines just cause in labour law" },
      citedIn: 247,
      distinguished: 12,
      overruled: false,
      area: { fr: "Droit du travail", en: "Labour law" },
    },
    {
      id: "bombardier",
      case: "Bombardier Inc. c. Bombardier Transportation",
      citation: "2012 CSC 4",
      date: "18 janv. 2012",
      severity: "medium",
      impact: { fr: "Clarifie l'interprétation des contrats commerciaux", en: "Clarifies interpretation of commercial contracts" },
      citedIn: 189,
      distinguished: 5,
      overruled: false,
      area: { fr: "Droit commercial", en: "Commercial law" },
    },
    {
      id: "haida",
      case: "Haida Nation c. Colombie-Britannique",
      citation: "2004 CSC 73",
      date: "18 nov. 2004",
      severity: "high",
      impact: { fr: "Obligation de consultation sur droit revendiqué", en: "Duty to consult on asserted rights" },
      citedIn: 312,
      distinguished: 8,
      overruled: false,
      area: { fr: "Droit autochtone", en: "Aboriginal law" },
    },
    {
      id: "lavallée",
      case: "R. c. Lavallée",
      citation: "1990 CSC 87",
      date: "3 mai 1990",
      severity: "high",
      impact: { fr: "Légitime défense — appréciation subjective", en: "Self-defence — subjective assessment" },
      citedIn: 201,
      distinguished: 3,
      overruled: false,
      area: { fr: "Droit criminel", en: "Criminal law" },
    },
    {
      id: "mcleod",
      case: "McLeod c. Egan",
      citation: "1975 CSC 11",
      date: "6 fév. 1975",
      severity: "low",
      impact: { fr: "Principes historiques toujours actifs", en: "Historic principles still active" },
      citedIn: 98,
      distinguished: 14,
      overruled: false,
      area: { fr: "Droit civil", en: "Civil law" },
    },
  ];

  const filtered = ALL_REVERSALS
    .filter((r) => {
      if (search) {
        const q = search.toLowerCase();
        return r.case.toLowerCase().includes(q) || r.citation.toLowerCase().includes(q);
      }
      if (filter === "high") return r.severity === "high";
      if (filter === "medium") return r.severity === "medium";
      if (filter === "low") return r.severity === "low";
      return true;
    })
    .sort((a, b) => {
      if (sort === "citations") return b.citedIn - a.citedIn;
      if (sort === "date") return new Date(b.date) - new Date(a.date);
      return 0; // recent
    });

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
      {/* Topbar */}
      <div style={{
        padding: "16px 36px", borderBottom: "1px solid var(--border-1)",
        display: "flex", alignItems: "center", gap: 12, background: "var(--bg-app)",
      }}>
        <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 8,
                      background: "var(--paper)", border: "1px solid var(--border-2)",
                      borderRadius: 10, padding: "8px 12px" }}>
          <Icon name="search" size={16} color="var(--ink-500)"/>
          <input
            type="text"
            placeholder={lang === "en" ? "Search by case name or citation…" : "Chercher par nom ou citation…"}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              flex: 1, border: 0, background: "transparent",
              fontSize: 14, color: "var(--ink-900)", outline: "none",
            }}
          />
          {search && <button onClick={() => setSearch("")} style={{ border: 0, background: "transparent", cursor: "pointer", color: "var(--ink-500)", fontSize: 18 }}>✕</button>}
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <select value={filter} onChange={(e) => setFilter(e.target.value)} style={{
            padding: "8px 10px", borderRadius: 8, border: "1px solid var(--border-2)",
            background: "var(--paper)", fontSize: 13, fontWeight: 500, cursor: "pointer",
          }}>
            <option value="all">{lang === "en" ? "All severities" : "Tous les niveaux"}</option>
            <option value="high">{lang === "en" ? "High impact" : "Impact élevé"}</option>
            <option value="medium">{lang === "en" ? "Medium impact" : "Impact moyen"}</option>
            <option value="low">{lang === "en" ? "Low impact" : "Impact faible"}</option>
          </select>
          <select value={sort} onChange={(e) => setSort(e.target.value)} style={{
            padding: "8px 10px", borderRadius: 8, border: "1px solid var(--border-2)",
            background: "var(--paper)", fontSize: 13, fontWeight: 500, cursor: "pointer",
          }}>
            <option value="recent">{lang === "en" ? "Recent" : "Récent"}</option>
            <option value="citations">{lang === "en" ? "Most cited" : "Plus cité"}</option>
            <option value="date">{lang === "en" ? "By date" : "Par date"}</option>
          </select>
        </div>
      </div>

      {/* Reversals list */}
      <div style={{ flex: 1, overflow: "auto", padding: "20px 36px" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 12, maxWidth: 900 }}>
          {filtered.length === 0 ? (
            <div style={{ textAlign: "center", padding: "40px 20px", color: "var(--ink-500)" }}>
              {lang === "en" ? "No reversals found." : "Aucun revirement trouvé."}
            </div>
          ) : (
            filtered.map((reversal) => (
              <ReversalCard key={reversal.id} reversal={reversal} lang={lang} onNav={onNav}/>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

const ReversalCard = ({ reversal, lang, onNav }) => {
  const severityColors = {
    high: { bg: "#FBEEF0", text: "#7A1F2B", label: { fr: "Impact élevé", en: "High impact" } },
    medium: { bg: "#FBF3D9", text: "#C8941F", label: { fr: "Impact moyen", en: "Medium impact" } },
    low: { bg: "#E7F0EA", text: "#3D7A4E", label: { fr: "Impact faible", en: "Low impact" } },
  };
  const colors = severityColors[reversal.severity];

  return (
    <button
      onClick={() => onNav("reversal-detail")}
      style={{
        display: "grid", gridTemplateColumns: "1fr auto", gap: 16, alignItems: "start",
        padding: 16, borderRadius: 12, border: "1px solid var(--border-1)",
        background: "var(--paper)", cursor: "pointer", textAlign: "left",
        transition: "all var(--dur-fast) var(--ease-out)",
      }}
      onMouseEnter={(e) => { e.currentTarget.style.background = "var(--ink-50)"; e.currentTarget.style.borderColor = "var(--ink-200)"; }}
      onMouseLeave={(e) => { e.currentTarget.style.background = "var(--paper)"; e.currentTarget.style.borderColor = "var(--border-1)"; }}
    >
      <div style={{ minWidth: 0 }}>
        <div style={{ fontFamily: "var(--font-display)", fontSize: 16, fontWeight: 500, color: "var(--ink-900)", marginBottom: 4 }}>
          {reversal.case}
        </div>
        <div style={{ fontSize: 12.5, color: "var(--ink-600)", marginBottom: 8, display: "flex", gap: 12 }}>
          <span>{reversal.citation}</span>
          <span>·</span>
          <span>{reversal.date}</span>
        </div>
        <div style={{ fontSize: 13.5, color: "var(--ink-700)", marginBottom: 10 }}>
          {tr(reversal.impact, lang)}
        </div>
        <div style={{ display: "flex", gap: 16, fontSize: 12, color: "var(--ink-600)" }}>
          <span>{reversal.citedIn} {lang === "en" ? "citations" : "citations"}</span>
          <span>·</span>
          <span>{reversal.distinguished} {lang === "en" ? "distinguished" : "distingués"}</span>
        </div>
      </div>

      <div style={{
        display: "flex", flexDirection: "column", alignItems: "center", gap: 6,
        padding: "10px 14px", borderRadius: 8, background: colors.bg,
      }}>
        <div style={{ fontSize: 10, fontWeight: 700, color: colors.text, letterSpacing: "0.05em", textTransform: "uppercase" }}>
          {tr(colors.label, lang)}
        </div>
        <div style={{ fontSize: 12, fontWeight: 600, color: colors.text }}>
          {reversal.citedIn}
        </div>
      </div>
    </button>
  );
};

Object.assign(window, { ReversalsList });
