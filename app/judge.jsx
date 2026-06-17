/* eslint-disable */
// Profil des juges — L'hon. Hélène Côté. Bilingual.

const Judge = ({ lang }) => {
  const isMobile = useIsMobile(768);
  return (
  <div style={{ flex: 1, overflow: "auto", padding: isMobile ? "20px 16px 40px" : "28px 36px 48px" }}>
    <div style={{ maxWidth: 980, margin: "0 auto" }}>
      <div style={{ display: "flex", flexDirection: isMobile ? "column" : "row", alignItems: isMobile ? "flex-start" : "center", gap: isMobile ? 14 : 24, marginBottom: 28 }}>
        <div style={{
          width: isMobile ? 64 : 96, height: isMobile ? 64 : 96, borderRadius: 999, background: "#F5EFE2",
          display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
          fontFamily: "var(--font-display)", fontWeight: 500, fontSize: isMobile ? 26 : 38, color: "#7A1F2B",
          border: "1px solid var(--parchment-200)",
        }}>HC</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <Overline style={{ marginBottom: 4 }}>{lang === "en" ? "Judicial profile" : "Profil judiciaire"}</Overline>
          <h1 style={{ fontFamily: "var(--font-display)", fontStyle: "italic", fontWeight: 500,
                       fontSize: isMobile ? 28 : 44, color: "var(--ink-950)", letterSpacing: "-0.02em", margin: 0 }}>
            L'hon. Hélène Côté
          </h1>
          <div style={{ display: "flex", gap: 14, marginTop: 8, fontSize: 13, color: "var(--ink-600)", flexWrap: "wrap" }}>
            <span>{lang === "en" ? "Quebec Superior Court" : "Cour supérieure du Québec"}</span>
            <span>·</span><span>{lang === "en" ? "Appointed 2012" : "Nommée 2012"}</span>
            <span>·</span><span>{lang === "en" ? "412 indexed rulings" : "412 jugements indexés"}</span>
            <span>·</span><span>{lang === "en" ? "Labour · civil" : "Droit du travail · civil"}</span>
          </div>
        </div>
        {!isMobile && <GhostButton icon="pin">{lang === "en" ? "Pin" : "Épingler"}</GhostButton>}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "repeat(2, 1fr)" : "repeat(4, 1fr)", gap: 14, marginBottom: 28 }}>
        <JStat label={lang === "en" ? "Similar cases (tomorrow)" : "Cas similaires (audience demain)"} value="68 %" hint={lang === "en" ? "favourable rate" : "taux favorable"} tone="solidite"/>
        <JStat label={lang === "en" ? "Median ruling time" : "Délai moyen de jugement"} value="74 j" hint={lang === "en" ? "median 2020–2025" : "médiane 2020–2025"} tone="ink"/>
        <JStat label={lang === "en" ? "Avg. indemnity granted" : "Indemnité moyenne accordée"} value="84 %" hint={lang === "en" ? "of cap requested" : "du plafond demandé"} tone="oxblood"/>
        <JStat label={lang === "en" ? "Affirmed on appeal" : "Confirmation en appel"} value="89 %" hint="QCCA" tone="pertinence"/>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 22 }}>
        <JCard title={lang === "en" ? "Decision tendencies" : "Tendances décisionnelles"}>
          <p style={{ fontSize: 13.5, lineHeight: 1.55, color: "var(--ink-700)", marginBottom: 16 }}>
            {lang === "en"
              ? <>Justice Côté <b>grants the maximum indemnity in 68%</b> of similar unjust-dismissal matters. She is particularly attentive to procedural failures — emphasize the absence of procedure rather than length of service.</>
              : <>La juge Côté <b>accorde l'indemnité maximale dans 68 % des cas similaires</b> de congédiement sans cause juste. Elle est particulièrement sensible aux manquements procéduraux — insistez sur l'absence de procédure plutôt que sur la durée du service.</>
            }
          </p>
          <Bar label={lang === "en" ? "Maximum award granted" : "Indemnité maximale accordée"} value={68} axis="sol"/>
          <Bar label={lang === "en" ? "Procedure deemed essential" : "Procédure jugée essentielle"} value={84} axis="per"/>
          <Bar label={lang === "en" ? "Moral damages granted" : "Dommages moraux accordés"} value={61} axis="sol"/>
          <Bar label={lang === "en" ? "Sensitivity to seniority" : "Sensibilité à l'ancienneté"} value={52} axis="aut"/>
        </JCard>

        <JCard title={lang === "en" ? "Recent rulings — labour" : "Arrêts récents — Travail"}>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {[
              { t: "Lavoie c. Manufactures Nord", c: "2024 QCCS 4109", outcome: lang === "en" ? "Favourable to plaintiff" : "Favorable au plaignant", sol: 88 },
              { t: "Bélanger c. Hôtel Bonaventure", c: "2024 QCCS 3712", outcome: lang === "en" ? "Reinstatement ordered" : "Réintégration ordonnée", sol: 91 },
              { t: "Roy c. Cabinet Pelletier",     c: "2023 QCCS 8821", outcome: lang === "en" ? "Capped indemnity" : "Indemnité plafonnée", sol: 74 },
              { t: "Tremblay c. Ville de Sherbrooke", c: "2023 QCCS 5564", outcome: lang === "en" ? "Dismissed" : "Rejeté", sol: 38 },
            ].map((r, i) => (
              <div key={i} style={{ display: "flex", flexDirection: isMobile ? "column" : "row", justifyContent: "space-between", alignItems: isMobile ? "flex-start" : "center", gap: isMobile ? 8 : 12, padding: "10px 12px", borderRadius: 8, border: "1px solid var(--border-1)" }}>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontFamily: "var(--font-display)", fontStyle: "italic", fontWeight: 500, fontSize: 14.5, color: "var(--ink-900)" }}>{r.t}</div>
                  <div style={{ display: "flex", gap: 8, alignItems: "center", marginTop: 3, flexWrap: "wrap" }}>
                    <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--ink-500)" }}>{r.c}</span>
                    <span style={{ fontSize: 11.5, color: r.sol < 50 ? "#7A1F2B" : "#1B3D26", fontWeight: 500 }}>{r.outcome}</span>
                  </div>
                </div>
                <div style={{ flexShrink: 0 }}><SolPill value={r.sol}/></div>
              </div>
            ))}
          </div>
        </JCard>
      </div>
    </div>
  </div>
  );
};

const JStat = ({ label, value, hint, tone }) => {
  const map = { solidite: "#1B3D26", pertinence: "#102B57", autorite: "#6B4A0E", oxblood: "#7A1F2B", ink: "var(--ink-900)" };
  return (
    <div style={{ background: "var(--paper)", border: "1px solid var(--border-1)", borderRadius: 12, padding: "16px 18px" }}>
      <Overline style={{ marginBottom: 8 }}>{label}</Overline>
      <div style={{ fontFamily: "var(--font-display)", fontWeight: 500, fontSize: 34, letterSpacing: "-0.02em", color: map[tone], lineHeight: 1 }}>{value}</div>
      <div style={{ fontSize: 11.5, color: "var(--ink-500)", marginTop: 6 }}>{hint}</div>
    </div>
  );
};

const JCard = ({ title, children }) => (
  <div style={{ background: "var(--paper)", border: "1px solid var(--border-1)", borderRadius: 12, padding: "18px 20px" }}>
    <h2 style={{ fontFamily: "var(--font-sans)", fontWeight: 600, fontSize: 15.5, color: "var(--ink-900)", margin: "0 0 14px" }}>{title}</h2>
    {children}
  </div>
);

Object.assign(window, { Judge });
