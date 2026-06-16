/* eslint-disable */
// LexiBridge Shell — sidebar (10 features visible) + topbar.

// Sidebar nav reflects the 10 features explicitly. Items 2 (Scoring 3D) and 3
// (Sémantique bilingue) are system-wide rather than dedicated screens — they
// surface as toggles / sort modes inside Recherche. We still pin them in the
// nav so the lawyer sees the whole product offer.
const NAV_GROUPS = [
  {
    label: null,
    items: [
      { id: "assistant", n: 10, label: "Assistant",       icon: "chat",   badge: "Nouveau", hero: true },
      { id: "dashboard", n: null, label: "Tableau de bord", icon: "home"  },
    ],
  },
  {
    label: "Cœur",
    sub: "3 fonctionnalités",
    items: [
      { id: "search",      n: 1, label: "Recherche unifiée",   icon: "search" },
      { id: "scoring",     n: 2, label: "Scoring 3D",          icon: "target", system: true },
      { id: "bilingual",   n: 3, label: "Sémantique bilingue", icon: "globe",  system: true },
    ],
  },
  {
    label: "Stratégie",
    sub: "7 fonctionnalités",
    items: [
      { id: "revirements",  n: 4, label: "Détection revirements", icon: "alert" },
      { id: "judges",       n: 5, label: "Profil des juges",      icon: "judge" },
      { id: "cartography",  n: 6, label: "Cartographie",          icon: "network" },
      { id: "argumentaires",n: 7, label: "Argumentaires",         icon: "quote" },
      { id: "alerts",       n: 8, label: "Alertes intelligentes", icon: "bell",   count: 3 },
      { id: "documents",     n: 12, label: "Rédacteur de documents", icon: "fileText" },
      { id: "dossiers",     n: 9, label: "Gestion de dossier",    icon: "folder", count: 16 },
      { id: "integrations", n: 11, label: "Écosystème",            icon: "layout", badge: "Nouveau" },
    ],
  },
];

const DOSSIERS = [
  { id: "dupont",   name: "Dupont c. Industries XYZ", area: "Travail",        hot: true,  date: "Audience demain" },
  { id: "beaulieu", name: "R. c. Beaulieu",           area: "Criminel · stup.",hot: true,  date: "Requête 24-1 · lundi" },
  { id: "tremblay", name: "Tremblay c. PG du Québec", area: "Garde d'enfant", hot: false, date: "Jeudi 14 h" },
  { id: "lemieux",  name: "R. c. Lemieux",            area: "Criminel · voies", hot: false, date: "Procès 27 mai" },
  { id: "lapointe", name: "Lapointe c. CHUM",         area: "Médical",        hot: false, date: "Mémoire dû 18 mai" },
  { id: "roy",      name: "Roy c. Trudel",            area: "Contrat",        hot: false, date: "—" },
];

const Sidebar = ({ active, onNav, density }) => {
  const compact = density === "compact";
  const pad = compact ? "6px 10px" : "8px 10px";
  return (
    <aside style={{
      width: 252, background: "#0E1626", color: "#FBF8F2",
      display: "flex", flexDirection: "column", flexShrink: 0,
      borderRight: "1px solid #1F2A44",
    }}>
      {/* Brand */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "18px 18px 14px" }}>
        <BrandMark size={28} color="#FBF8F2" accent="#E5A8B1" star="#E8C56C"/>
        <div style={{ fontFamily: "var(--font-display)", fontWeight: 500, fontSize: 18, letterSpacing: "-0.015em", whiteSpace: "nowrap" }}>
          Docket <span style={{ fontStyle: "italic", color: "#E8C56C" }}>Nova</span>
        </div>
        <span style={{ marginLeft: "auto", fontSize: 9, color: "#5A6479", letterSpacing: "0.12em", fontWeight: 600 }}>v 1.4</span>
      </div>

      {/* The 10-feature meta tag */}
      <div style={{ padding: "0 18px 12px" }}>
        <div style={{ fontSize: 9.5, color: "#5A6479", letterSpacing: "0.14em", fontWeight: 600, textTransform: "uppercase" }}>
          11 fonctionnalités · Canada
        </div>
      </div>

      {/* Nav */}
      <nav style={{ padding: "0 10px 4px", display: "flex", flexDirection: "column", gap: 1, overflow: "auto", flex: 1 }}>
        {NAV_GROUPS.map((g, gi) => (
          <React.Fragment key={gi}>
            {g.label && (
              <div style={{ padding: "16px 10px 6px", display: "flex", alignItems: "baseline", justifyContent: "space-between" }}>
                <div style={{ fontSize: 9.5, fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", color: "#5A6479" }}>{g.label}</div>
                {g.sub && <div style={{ fontSize: 9.5, color: "#5A6479", fontFamily: "var(--font-mono)" }}>{g.sub}</div>}
              </div>
            )}
            {g.items.map((n) => {
              const isActive = active === n.id;
              return (
                <button key={n.id} onClick={() => onNav(n.id)} style={{
                  display: "grid", gridTemplateColumns: n.n != null ? "20px 18px 1fr auto" : "18px 1fr auto",
                  alignItems: "center", gap: 10,
                  padding: pad, border: 0, borderRadius: 6,
                  background: isActive ? (n.hero ? "#1F2A44" : "#16243C") : "transparent",
                  color: isActive ? "#FBF8F2" : "#B3BCCB",
                  fontFamily: "var(--font-sans)", fontSize: 13, fontWeight: isActive ? 600 : 500,
                  cursor: "pointer", textAlign: "left",
                  borderLeft: isActive && n.hero ? "2px solid #E5A8B1" : "2px solid transparent",
                  paddingLeft: isActive && n.hero ? 8 : undefined,
                }}>
                  {n.n != null && (
                    <span style={{
                      fontFamily: "var(--font-mono)", fontSize: 10, color: isActive ? "#E5A8B1" : "#5A6479",
                      fontWeight: 600,
                    }}>{String(n.n).padStart(2, "0")}</span>
                  )}
                  <Icon name={n.icon} size={16} color={isActive ? "#E5A8B1" : "#8590A4"}/>
                  <span style={{ minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{n.label}</span>
                  {n.badge && (
                    <span style={{
                      fontSize: 9, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase",
                      background: "#7A1F2B", color: "#FBF8F2", padding: "2px 6px", borderRadius: 4,
                    }}>{n.badge}</span>
                  )}
                  {n.count !== undefined && (
                    <span style={{ fontSize: 11, color: "#5A6479", fontFamily: "var(--font-mono)" }}>{n.count}</span>
                  )}
                  {n.system && (
                    <span title="Système — appliqué partout"
                          style={{ width: 5, height: 5, borderRadius: 999, background: "#5A6479", display: "inline-block" }}/>
                  )}
                </button>
              );
            })}
          </React.Fragment>
        ))}

        {/* Dossiers actifs */}
        <div style={{ padding: "20px 10px 6px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ fontSize: 9.5, fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", color: "#5A6479" }}>Dossiers actifs</div>
          <button style={{ background: "transparent", border: 0, color: "#8590A4", cursor: "pointer", padding: 2, display: "flex" }}>
            <Icon name="plus" size={13} color="#8590A4"/>
          </button>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 1 }}>
          {DOSSIERS.map((d) => (
            <button key={d.id} onClick={() => onNav(`dossier-${d.id}`)} style={{
              display: "grid", gridTemplateColumns: "10px 1fr", columnGap: 6, rowGap: 2,
              padding: "7px 10px", border: 0, borderRadius: 6,
              background: "transparent", color: "#D6DCE5",
              textAlign: "left", cursor: "pointer", width: "100%", boxSizing: "border-box",
            }}>
              <span style={{ gridRow: "1 / 2", gridColumn: "1 / 2", marginTop: 7 }}>
                {d.hot && <span style={{ display: "block", width: 6, height: 6, borderRadius: 999, background: "#B0394A" }}/>}
              </span>
              <span style={{
                gridRow: "1 / 2", gridColumn: "2 / 3",
                fontStyle: "italic", fontFamily: "var(--font-display)", fontWeight: 500,
                fontSize: 13, lineHeight: 1.25, color: "#FBF8F2",
                overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
              }}>{d.name}</span>
              <span style={{
                gridRow: "2 / 3", gridColumn: "2 / 3",
                fontSize: 10.5, color: "#5A6479",
                overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
              }}>{d.area} · {d.date}</span>
            </button>
          ))}
        </div>
      </nav>

      {/* User chip */}
      <div style={{ padding: 12, borderTop: "1px solid #1F2A44", display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{
          width: 32, height: 32, borderRadius: 8, background: "#7A1F2B",
          color: "#FBF8F2", display: "flex", alignItems: "center", justifyContent: "center",
          fontFamily: "var(--font-display)", fontWeight: 500, fontSize: 14,
        }}>MC</div>
        <div style={{ minWidth: 0, flex: 1 }}>
          <div style={{ fontSize: 12.5, fontWeight: 600, color: "#FBF8F2" }}>Me Côté</div>
          <div style={{ fontSize: 10.5, color: "#8590A4" }}>Cabinet Lavoie · Montréal</div>
        </div>
        <Icon name="settings" size={15} color="#8590A4"/>
      </div>
    </aside>
  );
};

const Topbar = ({ title, breadcrumb, right, lang, onLang }) => (
  <header style={{
    height: 56, borderBottom: "1px solid var(--border-1)",
    background: "var(--bg-app)", padding: "0 24px",
    display: "flex", alignItems: "center", gap: 16, flexShrink: 0,
  }}>
    <div style={{ display: "flex", flexDirection: "column", gap: 0, minWidth: 0 }}>
      {breadcrumb && (
        <div style={{ fontSize: 10.5, letterSpacing: "0.12em", textTransform: "uppercase",
                      color: "var(--ink-500)", fontWeight: 600,
                      whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{breadcrumb}</div>
      )}
      <div style={{ fontFamily: "var(--font-display)", fontWeight: 500, fontSize: 19,
                    letterSpacing: "-0.01em", color: "var(--ink-900)",
                    whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{title}</div>
    </div>
    <div style={{ flex: 1 }}/>
    {right || (
      <>
        {onLang && (
          <div style={{ display: "inline-flex", background: "var(--paper)", border: "1px solid var(--border-2)",
                        borderRadius: 999, padding: 3, fontSize: 12 }}>
            {["fr", "en"].map((l) => (
              <button key={l} onClick={() => onLang(l)} style={{
                padding: "4px 12px", border: 0, borderRadius: 999, cursor: "pointer",
                background: lang === l ? "var(--ink-900)" : "transparent",
                color: lang === l ? "var(--parchment-50)" : "var(--ink-600)",
                fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", fontSize: 10.5,
              }}>{l}</button>
            ))}
          </div>
        )}
        <div style={{ display: "flex", alignItems: "center", gap: 8,
                      background: "var(--paper)", border: "1px solid var(--border-2)",
                      borderRadius: 999, padding: "5px 12px", fontSize: 12.5 }}>
          <Icon name="check" size={13} color="#3D7A4E"/>
          <span style={{ color: "var(--ink-700)" }}>{lang === "en" ? "Synced · just now" : "Synchronisé · à l'instant"}</span>
        </div>
      </>
    )}
  </header>
);

Object.assign(window, { Sidebar, Topbar, NAV_GROUPS });
