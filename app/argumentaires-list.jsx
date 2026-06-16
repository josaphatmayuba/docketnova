/* eslint-disable */
// Argumentaires list — browse pre-drafted arguments. Click to view detailed draft.

const ArgumentairesList = ({ lang, onNav }) => {
  const [search, setSearch] = React.useState("");
  const [filter, setFilter] = React.useState("all");
  const [sort, setSort] = React.useState("recent");

  // Mock argumentaires database
  const ALL_ARGUMENTAIRES = [
    {
      id: "dupont-opening",
      title: { fr: "Ouverture de plaidoirie \u2014 Dupont", en: "Opening statement — Dupont" },
      topic: { fr: "Cause juste de congédiement", en: "Just cause for dismissal" },
      case: "Dupont c. Industries XYZ",
      length: 480,
      quality: 92,
      status: "draft",
      date: "aujourd'hui",
      estimate: { fr: "8 min de plaidoirie", en: "8 min oral argument" },
    },
    {
      id: "tremblay-continuity",
      title: { fr: "Argument \u2014 Continuité scolaire", en: "Argument — School continuity" },
      topic: { fr: "Intérêt supérieur de l'enfant", en: "Best interest of child" },
      case: "Tremblay c. PG du Québec",
      length: 320,
      quality: 88,
      status: "draft",
      date: "hier",
      estimate: { fr: "6 min de plaidoirie", en: "6 min oral argument" },
    },
    {
      id: "beaulieu-exclusion",
      title: { fr: "Mémoire \u2014 Exclusion de preuve", en: "Brief — Excluding evidence" },
      topic: { fr: "Violation Charte s. 8", en: "Charter s. 8 breach" },
      case: "R. c. Beaulieu",
      length: 580,
      quality: 95,
      status: "ready",
      date: "3 jours",
      estimate: { fr: "Mémoire complet", en: "Full memorandum" },
    },
    {
      id: "lemieux-selfdefence",
      title: { fr: "Plan d'argumentation \u2014 Légitime défense", en: "Argument outline — Self-defence" },
      topic: { fr: "Appréciation subjective (Lavallée)", en: "Subjective assessment (Lavallée)" },
      case: "R. c. Lemieux",
      length: 240,
      quality: 82,
      status: "outline",
      date: "2 jours",
      estimate: { fr: "Ébauche \u00e0 développer", en: "Outline to develop" },
    },
  ];

  const filtered = ALL_ARGUMENTAIRES
    .filter((a) => {
      if (search) {
        const q = search.toLowerCase();
        return tr(a.title, lang).toLowerCase().includes(q) || a.case.toLowerCase().includes(q);
      }
      if (filter === "draft") return a.status === "draft";
      if (filter === "ready") return a.status === "ready";
      if (filter === "outline") return a.status === "outline";
      return true;
    })
    .sort((a, b) => {
      if (sort === "quality") return b.quality - a.quality;
      if (sort === "length") return b.length - a.length;
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
            placeholder={lang === "en" ? "Search arguments by title or case…" : "Chercher par titre ou dossier…"}
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
            <option value="all">{lang === "en" ? "All statuses" : "Tous les statuts"}</option>
            <option value="draft">{lang === "en" ? "Drafts" : "Brouillons"}</option>
            <option value="ready">{lang === "en" ? "Ready to file" : "Prêt à déposer"}</option>
            <option value="outline">{lang === "en" ? "Outlines" : "Ébauches"}</option>
          </select>
          <select value={sort} onChange={(e) => setSort(e.target.value)} style={{
            padding: "8px 10px", borderRadius: 8, border: "1px solid var(--border-2)",
            background: "var(--paper)", fontSize: 13, fontWeight: 500, cursor: "pointer",
          }}>
            <option value="recent">{lang === "en" ? "Recent" : "Récent"}</option>
            <option value="quality">{lang === "en" ? "Best quality" : "Meilleure qualité"}</option>
            <option value="length">{lang === "en" ? "Longest" : "Plus long"}</option>
          </select>
        </div>
      </div>

      {/* Arguments list */}
      <div style={{ flex: 1, overflow: "auto", padding: "20px 36px" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 12, maxWidth: 900 }}>
          {filtered.length === 0 ? (
            <div style={{ textAlign: "center", padding: "40px 20px", color: "var(--ink-500)" }}>
              {lang === "en" ? "No arguments found." : "Aucun argument trouvé."}
            </div>
          ) : (
            filtered.map((arg) => (
              <ArgumentaireCard key={arg.id} arg={arg} lang={lang} onNav={onNav}/>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

const ArgumentaireCard = ({ arg, lang, onNav }) => {
  const statusColors = {
    draft: { bg: "#FBF3D9", text: "#C8941F", label: { fr: "Brouillon", en: "Draft" } },
    ready: { bg: "#E7F0EA", text: "#3D7A4E", label: { fr: "Prêt", en: "Ready" } },
    outline: { bg: "#E4ECF5", text: "#102B57", label: { fr: "Ébauche", en: "Outline" } },
  };
  const colors = statusColors[arg.status];

  return (
    <button
      onClick={() => onNav("argumentaire-detail")}
      style={{
        display: "grid", gridTemplateColumns: "1fr auto auto", gap: 16, alignItems: "start",
        padding: 16, borderRadius: 12, border: "1px solid var(--border-1)",
        background: "var(--paper)", cursor: "pointer", textAlign: "left",
        transition: "all var(--dur-fast) var(--ease-out)",
      }}
      onMouseEnter={(e) => { e.currentTarget.style.background = "var(--ink-50)"; e.currentTarget.style.borderColor = "var(--ink-200)"; }}
      onMouseLeave={(e) => { e.currentTarget.style.background = "var(--paper)"; e.currentTarget.style.borderColor = "var(--border-1)"; }}
    >
      <div style={{ minWidth: 0 }}>
        <div style={{ fontFamily: "var(--font-display)", fontSize: 16, fontWeight: 500, color: "var(--ink-900)", marginBottom: 4 }}>
          {tr(arg.title, lang)}
        </div>
        <div style={{ fontSize: 12.5, color: "var(--ink-600)", marginBottom: 8 }}>
          {arg.case}
        </div>
        <div style={{ fontSize: 13, color: "var(--ink-700)", marginBottom: 8 }}>
          {tr(arg.topic, lang)}
        </div>
        <div style={{ display: "flex", gap: 12, fontSize: 12, color: "var(--ink-600)" }}>
          <span>{arg.length} {lang === "en" ? "words" : "mots"}</span>
          <span>·</span>
          <span>{tr(arg.estimate, lang)}</span>
        </div>
      </div>

      <div style={{
        display: "flex", flexDirection: "column", alignItems: "center", gap: 6, minWidth: 80,
        padding: "8px 12px", borderRadius: 8, background: colors.bg,
      }}>
        <div style={{ fontSize: 10, fontWeight: 700, color: colors.text, letterSpacing: "0.05em", textTransform: "uppercase" }}>
          {tr(colors.label, lang)}
        </div>
        <div style={{ fontSize: 12, fontWeight: 600, color: colors.text }}>
          {arg.quality}%
        </div>
      </div>

      <Icon name="chevRight" size={16} color="var(--ink-400)"/>
    </button>
  );
};

Object.assign(window, { ArgumentairesList });
