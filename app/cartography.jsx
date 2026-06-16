/* eslint-disable */
// Cartographie — citation network around a focal case. Bilingual.

const Cartography = ({ lang }) => {
  const nodes = [
    { id: "focus", x: 50, y: 50, r: 38, case: "Bombardier", focus: true },
    { id: "a", x: 18, y: 22, r: 22, case: "Dupont",     relation: { fr: "cite",      en: "cites" } },
    { id: "b", x: 82, y: 24, r: 24, case: "McLeod",     relation: { fr: "applique",  en: "applies" } },
    { id: "c", x: 86, y: 64, r: 18, case: "Therrien",   relation: { fr: "cite",      en: "cites" } },
    { id: "d", x: 50, y: 90, r: 16, case: "Lapointe",   relation: { fr: "cite",      en: "cites" } },
    { id: "e", x: 16, y: 78, r: 20, case: "Gagnon",     relation: { fr: "distingué", en: "distinguished" } },
  ];
  const focus = nodes[0];
  const satellites = nodes.slice(1);
  const color = (sol) => sol < 50 ? "#B0394A" : sol < 70 ? "#C8941F" : "#3D7A4E";

  return (
    <div style={{ flex: 1, overflow: "auto", padding: "24px 36px 32px" }}>
      <div style={{ maxWidth: 1080, margin: "0 auto" }}>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
          <div>
            <Overline style={{ marginBottom: 4 }}>{lang === "en" ? "Citation cartography" : "Cartographie des citations"}</Overline>
            <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 500, fontSize: 30, color: "var(--ink-950)", letterSpacing: "-0.02em", margin: 0 }}>
              {lang === "en" ? "Around " : "Autour de "}<span style={{ fontStyle: "italic", color: "#7A1F2B" }}>Syndicat c. Bombardier</span>
            </h1>
          </div>
          <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
            <LegendDot color="#3D7A4E" label={lang === "en" ? "Solid ≥ 70" : "Solide ≥ 70"}/>
            <LegendDot color="#C8941F" label={lang === "en" ? "Weakened" : "Affaibli"}/>
            <LegendDot color="#B0394A" label={lang === "en" ? "Distinguished < 50" : "Distingué < 50"}/>
          </div>
        </div>

        <div style={{
          position: "relative", background: "#FBF8F2", border: "1px solid var(--border-1)",
          borderRadius: 14, height: 520, overflow: "hidden",
          backgroundImage: "radial-gradient(circle at 1px 1px, rgba(14,22,38,0.06) 1px, transparent 0)",
          backgroundSize: "20px 20px",
        }}>
          <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} viewBox="0 0 100 100" preserveAspectRatio="none">
            {satellites.map((n, i) => {
              const dashed = n.relation.fr === "distingué";
              return (
                <line key={i} x1={focus.x} y1={focus.y} x2={n.x} y2={n.y}
                      stroke={dashed ? "#B0394A" : "#B3BCCB"} strokeWidth="0.25"
                      strokeDasharray={dashed ? "1 1" : "none"} vectorEffect="non-scaling-stroke"/>
              );
            })}
          </svg>

          {nodes.map((n) => {
            const c = CASES[n.case];
            return (
              <div key={n.id} style={{
                position: "absolute", left: n.x + "%", top: n.y + "%", transform: "translate(-50%, -50%)",
                display: "flex", flexDirection: "column", alignItems: "center", gap: 6,
              }}>
                <div style={{
                  width: n.r * 2, height: n.r * 2, borderRadius: 999,
                  background: n.focus ? "#0E1626" : "var(--paper)",
                  border: "2px solid " + (n.focus ? "#7A1F2B" : color(c.sol)),
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontFamily: "var(--font-display)", fontWeight: 500,
                  fontSize: n.focus ? 18 : 14, color: n.focus ? "#FBF8F2" : color(c.sol),
                  boxShadow: "var(--shadow-2)",
                }}>{c.sol}</div>
                <div style={{
                  background: "var(--paper)", border: "1px solid var(--border-1)",
                  borderRadius: 6, padding: "3px 8px",
                  fontFamily: "var(--font-display)", fontStyle: "italic", fontWeight: 500,
                  fontSize: n.focus ? 13 : 11.5, color: "var(--ink-900)",
                  whiteSpace: "nowrap", boxShadow: "var(--shadow-1)",
                }}>{c.title}</div>
                {n.relation && (
                  <span style={{
                    fontSize: 9.5, letterSpacing: "0.12em", textTransform: "uppercase",
                    fontWeight: 600, color: n.relation.fr === "distingué" ? "#7A1F2B" : "var(--ink-500)",
                  }}>{tr(n.relation, lang)}</span>
                )}
              </div>
            );
          })}
        </div>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 14 }}>
          <div style={{ fontSize: 12, color: "var(--ink-500)" }}>
            {lang === "en"
              ? "6 directly-linked rulings · 41 at second degree · Updated May 11 2026"
              : "6 arrêts liés directement · 41 au second degré · Mise à jour 11 mai 2026"}
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <GhostButton>{lang === "en" ? "Expand to 2 degrees" : "Élargir à 2 degrés"}</GhostButton>
            <GhostButton>{lang === "en" ? "Export" : "Exporter"}</GhostButton>
          </div>
        </div>
      </div>
    </div>
  );
};

const LegendDot = ({ color, label }) => (
  <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 11.5, color: "var(--ink-600)" }}>
    <span style={{ width: 9, height: 9, borderRadius: 999, background: color }}/>{label}
  </span>
);

Object.assign(window, { Cartography });
