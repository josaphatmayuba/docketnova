/* eslint-disable */
// Judges list — search, filter, stats. Click to view detailed profile.

const JudgesList = ({ lang, onNav }) => {
  const [search, setSearch] = React.useState("");
  const [filter, setFilter] = React.useState("all");
  const [sort, setSort] = React.useState("relevance");

  // Mock judges database
  const ALL_JUDGES = [
    {
      id: "cote",
      name: "L'hon. Hélène Côté",
      court: { fr: "Cour supérieure du Québec", en: "Superior Court of Quebec" },
      practice: { fr: "Droit du travail, droit public", en: "Labour law, public law" },
      rulings: 247,
      authority: 92,
      trend: "strict",
      cases: ["Dupont"],
      bio: { fr: "Juge depuis 2015 — spécialiste reconnue du droit du travail et des droits fondamentaux.", en: "Judge since 2015 — recognized specialist in labour law and fundamental rights." },
    },
    {
      id: "lacasse",
      name: "L'hon. Pierre Lacasse",
      court: { fr: "Cour supérieure du Québec · Chambre criminelle", en: "Superior Court of Quebec · Criminal" },
      practice: { fr: "Droit criminel, procédure pénale", en: "Criminal law, criminal procedure" },
      rulings: 189,
      authority: 88,
      trend: "balanced",
      cases: ["Beaulieu"],
      bio: { fr: "Juge depuis 2012 — connu pour une interprétation stricte de la Charte canadienne des droits et libertés.", en: "Judge since 2012 — known for strict interpretation of the Canadian Charter of Rights and Freedoms." },
    },
    {
      id: "audet",
      name: "L'hon. Marie-Claude Audet",
      court: { fr: "Cour du Québec · Chambre criminelle", en: "Court of Quebec · Criminal" },
      practice: { fr: "Droit criminel, droit de la famille", en: "Criminal law, family law" },
      rulings: 156,
      authority: 80,
      trend: "progressive",
      cases: ["Lemieux"],
      bio: { fr: "Juge depuis 2018 — reconnue pour sa sensibilité aux enjeux de légitime défense.", en: "Judge since 2018 — recognized for sensitivity to self-defence issues." },
    },
    {
      id: "bernier",
      name: "L'hon. Sylvie Bernier",
      court: { fr: "Cour du Québec · Chambre de la famille", en: "Court of Quebec · Family Division" },
      practice: { fr: "Droit de la famille, droit des enfants", en: "Family law, children's law" },
      rulings: 203,
      authority: 85,
      trend: "progressive",
      cases: ["Tremblay"],
      bio: { fr: "Juge depuis 2010 — spécialiste des enjeux de garde et de continuité scolaire.", en: "Judge since 2010 — specialist in custody and school continuity issues." },
    },
    {
      id: "dubois",
      name: "L'hon. Sylvie Dubois",
      court: { fr: "Cour du Québec", en: "Court of Quebec" },
      practice: { fr: "Droit commercial, droit des contrats", en: "Commercial law, contract law" },
      rulings: 134,
      authority: 78,
      trend: "balanced",
      cases: ["Roy"],
      bio: { fr: "Juge depuis 2016 — pragmatique dans l'interprétation des contrats commerciaux.", en: "Judge since 2016 — pragmatic in interpreting commercial contracts." },
    },
  ];

  const filtered = ALL_JUDGES
    .filter((j) => {
      if (search) {
        const q = search.toLowerCase();
        return j.name.toLowerCase().includes(q) || tr(j.practice, lang).toLowerCase().includes(q);
      }
      return true;
    })
    .sort((a, b) => {
      if (sort === "authority") return b.authority - a.authority;
      if (sort === "rulings") return b.rulings - a.rulings;
      return 0; // relevance (default)
    });

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
      {/* Topbar with search */}
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
            placeholder={lang === "en" ? "Search judges by name or practice area…" : "Chercher un juge par nom ou domaine…"}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              flex: 1, border: 0, background: "transparent",
              fontSize: 14, color: "var(--ink-900)", outline: "none",
            }}
          />
          {search && <button onClick={() => setSearch("")} style={{ border: 0, background: "transparent", cursor: "pointer", color: "var(--ink-500)", fontSize: 18 }}>✕</button>}
        </div>
        <select value={sort} onChange={(e) => setSort(e.target.value)} style={{
          padding: "8px 10px", borderRadius: 8, border: "1px solid var(--border-2)",
          background: "var(--paper)", fontSize: 13, fontWeight: 500, cursor: "pointer",
        }}>
          <option value="relevance">{lang === "en" ? "Relevance" : "Pertinence"}</option>
          <option value="authority">{lang === "en" ? "Authority" : "Autorité"}</option>
          <option value="rulings">{lang === "en" ? "Rulings" : "Jugements"}</option>
        </select>
      </div>

      {/* Judges list */}
      <div style={{ flex: 1, overflow: "auto", padding: "20px 36px" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 12, maxWidth: 900 }}>
          {filtered.length === 0 ? (
            <div style={{ textAlign: "center", padding: "40px 20px", color: "var(--ink-500)" }}>
              {lang === "en" ? "No judges found." : "Aucun juge trouvé."}
            </div>
          ) : (
            filtered.map((judge) => (
              <JudgeCard key={judge.id} judge={judge} lang={lang} onNav={onNav}/>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

const JudgeCard = ({ judge, lang, onNav }) => {
  const trendIcons = { strict: "alert", balanced: "minus", progressive: "check" };
  const trendLabels = { strict: { fr: "Stricte", en: "Strict" }, balanced: { fr: "Équilibré", en: "Balanced" }, progressive: { fr: "Progressiste", en: "Progressive" } };

  return (
    <button
      onClick={() => onNav("judge-detail")}
      style={{
        display: "grid", gridTemplateColumns: "60px 1fr auto", gap: 16, alignItems: "start",
        padding: 16, borderRadius: 12, border: "1px solid var(--border-1)",
        background: "var(--paper)", cursor: "pointer", textAlign: "left",
        transition: "all var(--dur-fast) var(--ease-out)",
      }}
      onMouseEnter={(e) => { e.currentTarget.style.background = "var(--ink-50)"; e.currentTarget.style.borderColor = "var(--ink-200)"; }}
      onMouseLeave={(e) => { e.currentTarget.style.background = "var(--paper)"; e.currentTarget.style.borderColor = "var(--border-1)"; }}
    >
      {/* Avatar */}
      <div style={{
        width: 60, height: 60, borderRadius: 10, background: "var(--bg-sunken)",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 20,
        color: "var(--oxblood-700)", flexShrink: 0,
      }}>
        {judge.name
          .replace(/^L'hon\.\s*/i, "")        // retire le titre
          .split(/[\s-]+/)                       // mots (gère "Marie-Claude")
          .filter(Boolean)
          .slice(0, 2)
          .map((w) => w[0])
          .join("")
          .toUpperCase()}
      </div>

      {/* Info */}
      <div style={{ minWidth: 0 }}>
        <div style={{ fontFamily: "var(--font-display)", fontSize: 16, fontWeight: 500, color: "var(--ink-900)", marginBottom: 4 }}>
          {judge.name}
        </div>
        <div style={{ fontSize: 12.5, color: "var(--ink-600)", marginBottom: 6 }}>
          {tr(judge.court, lang)}
        </div>
        <div style={{ fontSize: 13, color: "var(--ink-700)", marginBottom: 8 }}>
          <b>{tr(judge.practice, lang)}</b>
        </div>
        <div style={{ display: "flex", gap: 12, fontSize: 12, color: "var(--ink-600)" }}>
          <span>{judge.rulings} {lang === "en" ? "rulings" : "jugements"}</span>
          <span>·</span>
          <span>{lang === "en" ? "Authority" : "Autorité"}: <b style={{ color: "var(--ink-900)" }}>{judge.authority}</b></span>
        </div>
      </div>

      {/* Trend badge */}
      <div style={{
        display: "flex", flexDirection: "column", alignItems: "center", gap: 4,
        padding: "8px 12px", borderRadius: 8, background: "var(--ink-50)",
      }}>
        <Icon name={trendIcons[judge.trend]} size={14} color="var(--ink-700)"/>
        <div style={{ fontSize: 10, fontWeight: 600, color: "var(--ink-700)", letterSpacing: "0.05em", textTransform: "uppercase" }}>
          {tr(trendLabels[judge.trend], lang)}
        </div>
      </div>
    </button>
  );
};

Object.assign(window, { JudgesList });
