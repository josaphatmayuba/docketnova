/* eslint-disable */
// AI Suggestions for a matter — recommends actions, missing evidence, risks.

const SuggestionsTab = ({ lang, dossier, onNav }) => {
  const [analyzing, setAnalyzing] = React.useState(false);
  const [showAnalyzeModal, setShowAnalyzeModal] = React.useState(false);
  const [showFileInput, setShowFileInput] = React.useState(true);

  // Suggestions by matter
  const SUGGESTIONS_MAP = {
    "dossier-dupont": {
      quickWins: [
        { icon: "check", label: lang === "en" ? "File reinstatement motion by Jan 15" : "Déposer requête en réintégration avant le 15 janvier", days: 15 },
        { icon: "check", label: lang === "en" ? "Request medical records from defendant" : "Demander dossier médical au défendeur", days: null },
      ],
      risks: [
        { icon: "alert", label: lang === "en" ? "Stinchcombe (1991) may weaken your position" : "Stinchcombe (1991) peut affaiblir votre position", severity: "high" },
        { icon: "alert", label: lang === "en" ? "Procedural: missed initial discovery deadline" : "Procédural: délai de découverte initial dépassé", severity: "medium" },
      ],
      missingEvidence: [
        { icon: "file", label: lang === "en" ? "Witness affidavit from Dr. Martin" : "Déclaration assermentée du Dr. Martin", priority: "high" },
        { icon: "file", label: lang === "en" ? "Email correspondence (2022-2023)" : "Correspondance email (2022-2023)", priority: "high" },
        { icon: "file", label: lang === "en" ? "Financial records from defendant" : "Registres financiers du défendeur", priority: "medium" },
      ],
    },
    "dossier-tremblay": {
      quickWins: [
        { icon: "check", label: lang === "en" ? "Submit custody assessment by Feb 1" : "Soumettre évaluation de garde avant le 1er février", days: 18 },
        { icon: "check", label: lang === "en" ? "Request mediation session with opposing counsel" : "Demander séance de médiation avec partie adverse", days: null },
      ],
      risks: [
        { icon: "alert", label: lang === "en" ? "Recent change in custody law (2024) affects your strategy" : "Changement récent en droit de garde (2024) affecte stratégie", severity: "high" },
        { icon: "alert", label: lang === "en" ? "Opposing party filed new motion for variation" : "Partie adverse a déposé nouvelle requête en variation", severity: "high" },
      ],
      missingEvidence: [
        { icon: "file", label: lang === "en" ? "Recent school reports of minor children" : "Dossiers scolaires récents des enfants", priority: "high" },
        { icon: "file", label: lang === "en" ? "Parenting plan documentation" : "Documentation du plan parental", priority: "high" },
        { icon: "file", label: lang === "en" ? "Income and employment verification" : "Vérification revenus et emploi", priority: "medium" },
      ],
    },
    "dossier-beaulieu": {
      quickWins: [
        { icon: "check", label: lang === "en" ? "File s.24(2) Charter application by Jan 20" : "Déposer requête alinéa 24(2) avant le 20 janvier", days: 6 },
        { icon: "check", label: lang === "en" ? "Obtain expert report on search legality" : "Obtenir rapport d'expert sur légalité de perquisition", days: null },
      ],
      risks: [
        { icon: "alert", label: lang === "en" ? "Grant v. Torstar (2009) may limit your Charter argument" : "Grant c. Torstar (2009) peut limiter argument Charte", severity: "high" },
        { icon: "alert", label: lang === "en" ? "Crown has strong procedural compliance record" : "Couronne a bon dossier conformité procédurale", severity: "medium" },
      ],
      missingEvidence: [
        { icon: "file", label: lang === "en" ? "Warrant authorization documents" : "Documents d'autorisation du mandat", priority: "high" },
        { icon: "file", label: lang === "en" ? "Police notebook entries and timeline" : "Carnets policiers et chronologie", priority: "high" },
        { icon: "file", label: lang === "en" ? "Expert affidavit on Charter breach" : "Déclaration expert sur violation Charte", priority: "high" },
      ],
    },
  };

  const suggestions = SUGGESTIONS_MAP[dossier.id] || SUGGESTIONS_MAP["dossier-dupont"];

  const SuggestionItem = ({ icon, label, meta, tone = "ink" }) => (
    <div style={{ display: "flex", gap: 10, padding: "8px 0", borderBottom: "1px solid rgba(0,0,0,0.05)" }}>
      <div style={{ fontSize: 16, width: 24, textAlign: "center", flexShrink: 0 }}>
        {icon === "check" ? "✅" : icon === "alert" ? "⚠️" : icon === "file" ? "📄" : "•"}
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 12, color: "var(--ink-900)", lineHeight: 1.4 }}>{label}</div>
        {meta && <div style={{ fontSize: 10, color: "var(--ink-600)", marginTop: 2 }}>{meta}</div>}
      </div>
    </div>
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20, overflow: "auto", padding: "16px 0" }}>
      {/* Quick Wins */}
      <div style={{ background: "#FFFBF0", border: "1px solid #E5D4B8", borderRadius: 12, padding: "16px 18px" }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: "#6B4A0E", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 12 }}>
          ⚡ {lang === "en" ? "Quick Wins" : "Victoires rapides"}
        </div>
        {suggestions.quickWins.map((item, i) => (
          <SuggestionItem key={i} icon={item.icon} label={item.label} meta={item.days ? `${item.days} ${lang === "en" ? "days left" : "jours restants"}` : null}/>
        ))}
      </div>

      {/* Risks */}
      <div style={{ background: "#FBF3D9", border: "1px solid #E5C478", borderRadius: 12, padding: "16px 18px" }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: "#7A4A00", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 12 }}>
          🚨 {lang === "en" ? "Risks & Obstacles" : "Risques & obstacles"}
        </div>
        {suggestions.risks.map((item, i) => (
          <SuggestionItem key={i} icon={item.icon} label={item.label} meta={item.severity === "high" ? `⚠️ ${lang === "en" ? "High" : "Élevé"}` : `⚠️ ${lang === "en" ? "Medium" : "Moyen"}`}/>
        ))}
      </div>

      {/* Missing Evidence */}
      <div style={{ background: "#E4ECF5", border: "1px solid #9BC0E8", borderRadius: 12, padding: "16px 18px" }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: "#2B5FA8", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 12 }}>
          📋 {lang === "en" ? "Missing Evidence" : "Preuves manquantes"}
        </div>
        {suggestions.missingEvidence.map((item, i) => (
          <SuggestionItem key={i} icon={item.icon} label={item.label} meta={item.priority === "high" ? `🔴 ${lang === "en" ? "Priority" : "Prioritaire"}` : `🟡 ${lang === "en" ? "Secondary" : "Secondaire"}`}/>
        ))}
      </div>

      {/* Analyze Evidence Button */}
      <button onClick={() => setShowAnalyzeModal(true)} style={{
        width: "100%", padding: "12px 16px", borderRadius: 8, border: "1px solid #2B5FA8", background: "white", color: "#2B5FA8", cursor: "pointer", fontWeight: 600, fontSize: 12, transition: "all 150ms",
      }}
      onMouseEnter={(e) => { e.currentTarget.background = "#E4ECF5"; }}
      onMouseLeave={(e) => { e.currentTarget.background = "white"; }}
      >
        🔍 {lang === "en" ? "Analyze Full Evidence (Private)" : "Analyser preuves complètes (Privé)"}
      </button>

      {/* Analyze Modal */}
      {showAnalyzeModal && (
        <div style={{
          position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 2000, display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <div style={{
            background: "white", borderRadius: 12, padding: "24px", maxWidth: 500, width: "90%", boxShadow: "0 10px 40px rgba(0,0,0,0.2)",
          }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: "#0E1626", marginBottom: 16, marginTop: 0 }}>
              🔒 {lang === "en" ? "Analyze Evidence (Private)" : "Analyser preuves (Privé)"}
            </h3>

            <div style={{ padding: "12px 14px", background: "#E7F0EA", border: "1px solid #7AB89A", borderRadius: 8, marginBottom: 16, fontSize: 11, color: "#1B3D26" }}>
              ✅ {lang === "en" ? "No data leaves your device. Analysis happens locally." : "Aucune donnée ne quitte votre appareil. Analyse locale."}
            </div>

            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: "#0E1626", display: "block", marginBottom: 8 }}>
                {lang === "en" ? "Select document to analyze:" : "Sélectionnez un document à analyser:"}
              </label>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", fontSize: 12, padding: "10px 12px", borderRadius: 6, border: "1px solid var(--border-1)", transition: "all 150ms" }}>
                  <input type="radio" name="doc" defaultChecked onChange={() => setShowFileInput(true)}/>
                  <div>
                    <div style={{ fontWeight: 600, color: "#0E1626" }}>{lang === "en" ? "Upload from computer" : "Télécharger depuis l'ordinateur"}</div>
                    <div style={{ fontSize: 11, color: "var(--ink-600)" }}>PDF, Word, Image</div>
                  </div>
                </label>
                <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", fontSize: 12, padding: "10px 12px", borderRadius: 6, border: "1px solid var(--border-1)", transition: "all 150ms" }}>
                  <input type="radio" name="doc" onChange={() => setShowFileInput(false)}/>
                  <div>
                    <div style={{ fontWeight: 600, color: "#0E1626" }}>{lang === "en" ? "Analyze from Documents" : "Analyser depuis Documents"}</div>
                    <div style={{ fontSize: 11, color: "var(--ink-600)" }}>{lang === "en" ? "From this matter" : "De ce dossier"}</div>
                  </div>
                </label>
              </div>
              
              {showFileInput && (
                <div style={{ marginTop: 12, padding: "12px", background: "#F5F7FA", border: "2px dashed #9BC0E8", borderRadius: 6, textAlign: "center" }}>
                  <input 
                    type="file" 
                    accept=".pdf,.docx,.doc,.jpg,.jpeg,.png" 
                    style={{ display: "block", width: "100%", cursor: "pointer" }}
                    onChange={(e) => {
                      if (e.target.files?.[0]) {
                        const fileName = e.target.files[0].name;
                        alert(`✅ ${fileName} ${lang === "en" ? "ready to analyze" : "prêt à analyser"}`);
                      }
                    }}
                  />
                  <div style={{ fontSize: 11, color: "var(--ink-600)", marginTop: 6 }}>
                    {lang === "en" ? "Drag & drop or click to select" : "Glisser-déposer ou cliquer pour sélectionner"}
                  </div>
                </div>
              )}
            </div>

            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={() => setShowAnalyzeModal(false)} style={{
                flex: 1, padding: "8px 12px", borderRadius: 6, border: "1px solid var(--border-1)", background: "white", cursor: "pointer", fontWeight: 600, fontSize: 12,
              }}>
                {lang === "en" ? "Cancel" : "Annuler"}
              </button>
              <button onClick={() => setAnalyzing(true)} style={{
                flex: 1, padding: "8px 12px", borderRadius: 6, border: 0, background: "#2B5FA8", color: "#FBF8F2", cursor: "pointer", fontWeight: 600, fontSize: 12,
              }}>
                {analyzing ? "⏳ " : ""}{lang === "en" ? "Analyze" : "Analyser"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

Object.assign(window, { SuggestionsTab });
