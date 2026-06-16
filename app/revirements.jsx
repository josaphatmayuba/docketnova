/* eslint-disable */
// Détection de revirements — historical strength of a precedent over time,
// flagging the moment it gets distinguished. Feature #4.

const TIMELINE = [
  { y: "2018", sol: 78, event: { fr: "Arrêt rendu", en: "Ruling delivered" } },
  { y: "2019", sol: 76 },
  { y: "2020", sol: 74, event: { fr: "Premier doute en doctrine", en: "First scholarly doubt" } },
  { y: "2021", sol: 71 },
  { y: "2022", sol: 68, event: { fr: "Appliqué avec réserves", en: "Applied with reservations" } },
  { y: "2023", sol: 62 },
  { y: "2024", sol: 54, event: { fr: "Critique en obiter", en: "Criticized in obiter" } },
  { y: "Mar 25", sol: 41, event: { fr: "Distingué par la Cour d'appel", en: "Distinguished by Court of Appeal" }, breaking: true },
  { y: "2026", sol: 41 },
];

const Revirements = ({ lang, onNav }) => (
  <div style={{ flex: 1, overflow: "auto", padding: "28px 36px 48px" }}>
    <div style={{ maxWidth: 1080, margin: "0 auto" }}>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 22, gap: 24 }}>
        <div>
          <Overline style={{ marginBottom: 4 }}>{lang === "en" ? "Reversal detection · feature 04" : "Détection de revirements · fonctionnalité 04"}</Overline>
          <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 500, fontSize: 34, color: "var(--ink-950)", letterSpacing: "-0.02em", margin: 0 }}>
            {lang === "en"
              ? <>Watching <i style={{ color: "#7A1F2B" }}>Gagnon c. Cie ABC</i></>
              : <>Surveillance de <i style={{ color: "#7A1F2B" }}>Gagnon c. Cie ABC</i></>}
          </h1>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 12.5, color: "var(--ink-500)", marginTop: 6 }}>
            2018 QCCS 9912 · {lang === "en" ? "tracked across 247 subsequent rulings" : "suivi dans 247 décisions ultérieures"}
          </div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontFamily: "var(--font-display)", fontSize: 56, fontWeight: 500, color: "#7A1F2B", lineHeight: 1, letterSpacing: "-0.03em" }}>−37</div>
          <Overline color="#7A1F2B">{lang === "en" ? "Solidity points lost since 2018" : "Pts Solidité perdus depuis 2018"}</Overline>
        </div>
      </div>

      {/* Banner */}
      <div style={{
        background: "#FBEEF0", border: "1px solid #F5DCE0", borderRadius: 14,
        padding: "16px 20px", display: "flex", alignItems: "center", gap: 16, marginBottom: 22,
      }}>
        <div style={{ width: 40, height: 40, borderRadius: 999, background: "#7A1F2B", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Icon name="alert" size={20} color="#FBF8F2"/>
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: "var(--font-sans)", fontWeight: 600, fontSize: 14.5, color: "#4A0F18" }}>
            {lang === "en"
              ? "Distinguished by the Court of Appeal — March 2025"
              : "Distingué par la Cour d'appel — mars 2025"}
          </div>
          <div style={{ fontSize: 13, color: "#5E1620", marginTop: 3 }}>
            {lang === "en"
              ? "If opposing counsel invokes this precedent against you, you have a clean reply ready in the assistant."
              : "Si la partie adverse invoque ce précédent, vous avez une réplique nette préparée dans l'assistant."}
          </div>
        </div>
        <OxbloodButton icon="chat" onClick={() => onNav && onNav("assistant")}>
          {lang === "en" ? "Prepare reply" : "Préparer la réplique"}
        </OxbloodButton>
      </div>

      {/* Timeline */}
      <div style={{ background: "var(--paper)", border: "1px solid var(--border-1)", borderRadius: 14, padding: "24px 28px", marginBottom: 22 }}>
        <h2 style={{ fontFamily: "var(--font-sans)", fontWeight: 600, fontSize: 15, color: "var(--ink-900)", margin: "0 0 18px" }}>
          {lang === "en" ? "Solidity over time" : "Solidité au fil du temps"}
        </h2>
        <SolidityTimeline lang={lang}/>
      </div>

      {/* Watch list + reply */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 22 }}>
        <div style={{ background: "var(--paper)", border: "1px solid var(--border-1)", borderRadius: 12, padding: "18px 20px" }}>
          <SectionHeader title={lang === "en" ? "Other precedents on watch" : "Autres précédents sous surveillance"} count="4"/>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {[
              { case: "Roy", trend: -23, note: { fr: "4 distinctions ultérieures", en: "4 subsequent distinctions" } },
              { case: "DroitFamille2019", trend: -6, note: { fr: "Limité au cas d'éloignement extrême", en: "Limited to extreme distance" } },
              { case: "Therrien", trend: +4, note: { fr: "Renforcé par 3 arrêts récents", en: "Reinforced by 3 recent rulings" } },
              { case: "Mikisew",  trend: -2, note: { fr: "Stable", en: "Stable" } },
            ].map((w, i) => {
              const c = CASES[w.case];
              return (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 12px", borderRadius: 8, border: "1px solid var(--border-1)" }}>
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <div style={{ fontFamily: "var(--font-display)", fontStyle: "italic", fontWeight: 500, fontSize: 14.5, color: "var(--ink-900)" }}>{c.title}</div>
                    <div style={{ fontSize: 11.5, color: "var(--ink-500)", marginTop: 2 }}>{tr(w.note, lang)}</div>
                  </div>
                  <span style={{
                    fontFamily: "var(--font-mono)", fontSize: 12, fontWeight: 600,
                    color: w.trend < 0 ? "#7A1F2B" : "#1B3D26",
                  }}>{w.trend > 0 ? "+" : ""}{w.trend}</span>
                  <SolPill value={c.sol}/>
                </div>
              );
            })}
          </div>
        </div>

        <div style={{ background: "#FBF8F2", border: "1px solid var(--parchment-200)", borderRadius: 12, padding: "18px 20px", borderLeft: "3px solid var(--oxblood-700)" }}>
          <Overline color="var(--oxblood-700)" style={{ marginBottom: 8 }}>
            {lang === "en" ? "Reply pre-built by LexiBridge" : "Réplique pré-construite par LexiBridge"}
          </Overline>
          <p style={{ fontFamily: "var(--font-display)", fontSize: 15, lineHeight: 1.7, color: "var(--ink-800)", margin: 0 }}>
            {lang === "en"
              ? <>"My learned friend invokes <i>Gagnon c. Cie ABC</i> — but that ruling was <b>expressly distinguished</b> by the Court of Appeal in <i>Lavoie c. Manufactures Nord</i> (March 2025), which the Court itself acknowledged as a 'clarification overdue.' Its Solidity, as tracked by independent jurisprudence indexing, stands at <b>41 percent</b>. It cannot bear the weight of my friend's argument."</>
              : <>« Mon collègue invoque <i>Gagnon c. Cie ABC</i> — mais cet arrêt a été <b>expressément distingué</b> par la Cour d'appel dans <i>Lavoie c. Manufactures Nord</i> (mars 2025), une clarification que la Cour elle-même qualifie de "dûe depuis longtemps". Sa Solidité, telle qu'indexée, se chiffre à <b>41 pour cent</b>. Il ne peut soutenir l'argument de mon collègue. »</>}
          </p>
          <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
            <GhostButton icon="copy">{lang === "en" ? "Copy" : "Copier"}</GhostButton>
            <GhostButton icon="quote" onClick={() => onNav && onNav("argumentaires")}>
              {lang === "en" ? "Open in drafting" : "Ouvrir en rédaction"}
            </GhostButton>
          </div>
        </div>
      </div>
    </div>
  </div>
);

// Mini SVG timeline of Solidity over years.
const SolidityTimeline = ({ lang }) => {
  const W = 880, H = 220, padX = 30, padY = 30;
  const xs = TIMELINE.map((_, i) => padX + (i * (W - padX * 2)) / (TIMELINE.length - 1));
  const ys = TIMELINE.map((d) => padY + ((100 - d.sol) * (H - padY * 2)) / 100);
  const path = TIMELINE.map((_, i) => `${i === 0 ? "M" : "L"} ${xs[i]} ${ys[i]}`).join(" ");
  return (
    <div style={{ position: "relative", width: "100%", overflowX: "auto" }}>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ display: "block" }}>
        {/* Grid lines (0, 50, 70, 100) */}
        {[0, 50, 70, 100].map((g) => {
          const y = padY + ((100 - g) * (H - padY * 2)) / 100;
          const c = g === 0 ? "transparent" : g === 50 ? "#F5DCE0" : g === 70 ? "#F6E7B5" : "var(--border-1)";
          return (
            <g key={g}>
              <line x1={padX} y1={y} x2={W - padX} y2={y} stroke={c} strokeWidth="1" strokeDasharray={g === 0 ? "0" : "2 3"}/>
              <text x={W - padX + 4} y={y + 3} fontSize="9.5" fill="var(--ink-500)" fontFamily="var(--font-mono)">{g}</text>
            </g>
          );
        })}

        {/* Area under curve, tinted by current solidity color (oxblood at end) */}
        <defs>
          <linearGradient id="solGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#3D7A4E" stopOpacity="0.18"/>
            <stop offset="60%" stopColor="#C8941F" stopOpacity="0.22"/>
            <stop offset="100%" stopColor="#B0394A" stopOpacity="0.28"/>
          </linearGradient>
        </defs>
        <path d={`${path} L ${xs[xs.length-1]} ${H - padY} L ${xs[0]} ${H - padY} Z`} fill="url(#solGrad)"/>

        {/* Line */}
        <path d={path} fill="none" stroke="var(--ink-900)" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round"/>

        {/* Points */}
        {TIMELINE.map((d, i) => (
          <g key={i}>
            <circle cx={xs[i]} cy={ys[i]} r={d.breaking ? 6 : 4}
                    fill={d.breaking ? "#7A1F2B" : d.sol < 50 ? "#B0394A" : d.sol < 70 ? "#C8941F" : "#3D7A4E"}
                    stroke="var(--paper)" strokeWidth="2"/>
            <text x={xs[i]} y={H - 6} fontSize="10" fill="var(--ink-600)" fontFamily="var(--font-mono)" textAnchor="middle">{d.y}</text>
            {d.event && (
              <g>
                <line x1={xs[i]} y1={ys[i] - 8} x2={xs[i]} y2={ys[i] - 26} stroke={d.breaking ? "#7A1F2B" : "var(--ink-300)"} strokeWidth="1"/>
                <foreignObject x={xs[i] - 70} y={ys[i] - 50} width="140" height="24" style={{ overflow: "visible", pointerEvents: "none" }}>
                  <div style={{ fontSize: 10, color: d.breaking ? "#7A1F2B" : "var(--ink-700)", fontWeight: d.breaking ? 700 : 500, textAlign: "center", lineHeight: 1.2 }}>
                    {tr(d.event, lang)}
                  </div>
                </foreignObject>
              </g>
            )}
          </g>
        ))}
      </svg>
    </div>
  );
};

Object.assign(window, { Revirements });
