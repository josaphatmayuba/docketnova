/* eslint-disable */
// Cartography list — search citation networks. Click to view detailed network visualization.

const CartographyList = ({ lang, onNav }) => {
  const [search, setSearch] = React.useState("");
  const [sort, setSort] = React.useState("size");

  // Mock citation networks
  const ALL_NETWORKS = [
    {
      id: "gagnon-network",
      name: "Gagnon c. Québec",
      citation: "2020 CSC 18",
      nodes: 47,
      edges: 89,
      depth: 3,
      area: { fr: "Droit du travail", en: "Labour law" },
      description: { fr: "Réseau de cause juste — 47 arrêts liés, 89 citations", en: "Just cause network — 47 related rulings, 89 citations" },
    },
    {
      id: "haida-network",
      name: "Haida Nation c. Colombie-Britannique",
      citation: "2004 CSC 73",
      nodes: 58,
      edges: 112,
      depth: 4,
      area: { fr: "Droit autochtone", en: "Aboriginal law" },
      description: { fr: "Réseau de consultation — 58 arrêts, 112 liaisons", en: "Consultation network — 58 rulings, 112 links" },
    },
    {
      id: "bombardier-network",
      name: "Bombardier Inc. c. Bombardier Transportation",
      citation: "2012 CSC 4",
      nodes: 34,
      edges: 67,
      depth: 2,
      area: { fr: "Droit commercial", en: "Commercial law" },
      description: { fr: "Réseau contractuel — 34 arrêts, interprétation contrats", en: "Contract network — 34 rulings, contract interpretation" },
    },
    {
      id: "lavallée-network",
      name: "R. c. Lavallée",
      citation: "1990 CSC 87",
      nodes: 41,
      edges: 78,
      depth: 3,
      area: { fr: "Droit criminel", en: "Criminal law" },
      description: { fr: "Réseau de légitime défense — 41 arrêts critiques", en: "Self-defence network — 41 critical rulings" },
    },
  ];

  const filtered = ALL_NETWORKS
    .filter((n) => {
      if (search) {
        const q = search.toLowerCase();
        return n.name.toLowerCase().includes(q) || n.citation.toLowerCase().includes(q);
      }
      return true;
    })
    .sort((a, b) => {
      if (sort === "size") return b.nodes - a.nodes;
      if (sort === "citations") return b.edges - a.edges;
      return 0;
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
        <select value={sort} onChange={(e) => setSort(e.target.value)} style={{
          padding: "8px 10px", borderRadius: 8, border: "1px solid var(--border-2)",
          background: "var(--paper)", fontSize: 13, fontWeight: 500, cursor: "pointer",
        }}>
          <option value="size">{lang === "en" ? "Network size" : "Taille du réseau"}</option>
          <option value="citations">{lang === "en" ? "Most linked" : "Plus liés"}</option>
        </select>
      </div>

      {/* Networks list */}
      <div style={{ flex: 1, overflow: "auto", padding: "20px 36px" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 12, maxWidth: 900 }}>
          {filtered.length === 0 ? (
            <div style={{ textAlign: "center", padding: "40px 20px", color: "var(--ink-500)" }}>
              {lang === "en" ? "No networks found." : "Aucun réseau trouvé."}
            </div>
          ) : (
            filtered.map((network) => (
              <CartographyCard key={network.id} network={network} lang={lang} onNav={onNav}/>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

const CartographyCard = ({ network, lang, onNav }) => {
  const isMobile = useIsMobile(768);
  return (
    <button
      onClick={() => onNav("cartography-detail")}
      style={{
        display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr auto auto", gap: isMobile ? 10 : 20, alignItems: "start",
        padding: 16, borderRadius: 12, border: "1px solid var(--border-1)",
        background: "var(--paper)", cursor: "pointer", textAlign: "left",
        transition: "all var(--dur-fast) var(--ease-out)",
      }}
      onMouseEnter={(e) => { e.currentTarget.style.background = "var(--ink-50)"; e.currentTarget.style.borderColor = "var(--ink-200)"; }}
      onMouseLeave={(e) => { e.currentTarget.style.background = "var(--paper)"; e.currentTarget.style.borderColor = "var(--border-1)"; }}
    >
      <div style={{ minWidth: 0 }}>
        <div style={{ fontFamily: "var(--font-display)", fontSize: 16, fontWeight: 500, color: "var(--ink-900)", marginBottom: 4 }}>
          {network.name}
        </div>
        <div style={{ fontSize: 12.5, color: "var(--ink-600)", marginBottom: 8 }}>
          {network.citation}
        </div>
        <div style={{ fontSize: 13.5, color: "var(--ink-700)", marginBottom: 10 }}>
          {tr(network.description, lang)}
        </div>
        <div style={{ fontSize: 11.5, color: "var(--ink-500)", fontWeight: 500 }}>
          {tr(network.area, lang)}
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, minWidth: 80 }}>
        <div style={{ fontSize: 10, color: "var(--ink-600)", fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase" }}>
          {lang === "en" ? "Nodes" : "Nœuds"}
        </div>
        <div style={{ fontSize: 18, fontWeight: 600, color: "var(--ink-900)" }}>
          {network.nodes}
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, minWidth: 80 }}>
        <div style={{ fontSize: 10, color: "var(--ink-600)", fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase" }}>
          {lang === "en" ? "Links" : "Liaisons"}
        </div>
        <div style={{ fontSize: 18, fontWeight: 600, color: "var(--ink-900)" }}>
          {network.edges}
        </div>
      </div>
    </button>
  );
};

Object.assign(window, { CartographyList });
