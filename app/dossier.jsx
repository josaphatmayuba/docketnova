/* eslint-disable */
// Dossier detail — Professional lawyer workspace. Left: matter context. Right: integrated tools.

const Dossier = ({ lang, onNav, screenId }) => {
  const [mainTab, setMainTab] = React.useState("overview");
  const [toolTab, setToolTab] = React.useState("assistant");
  const [editMode, setEditMode] = React.useState(false);
  const [editData, setEditData] = React.useState({});

  // Panel component — wrapper for suggestion boxes
  const Panel = ({ title, tone, children }) => {
    const toneColors = {
      oxblood: { bg: "#FBEEF0", border: "#E5A8B1", title: "#7A1F2B" },
      blue: { bg: "#E4ECF5", border: "#9BC0E8", title: "#2B5FA8" },
    };
    const colors = toneColors[tone] || toneColors.oxblood;
    return (
      <div style={{ background: colors.bg, border: `1px solid ${colors.border}`, borderRadius: 12, padding: "16px 18px" }}>
        <div style={{ fontSize: 11.5, fontWeight: 700, color: colors.title, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 12 }}>
          {title}
        </div>
        {children}
      </div>
    );
  };

  // Map screenId to matter data
  const DOSSIER_DATA = {
    "dossier-dupont": {
      title: "Dupont c. Industries XYZ",
      file: "500-17-128744-241",
      court: lang === "en" ? "Quebec Superior Court" : "Cour supérieure du Québec",
      judge: "Hélène Côté",
      area: lang === "en" ? "Labour" : "Travail",
      hearing: lang === "en" ? "Tomorrow, 9:30 AM" : "Demain, 9 h 30",
      strength: "76 %",
      plaintiff: "Pierre Dupont",
      defendant: "Industries XYZ Inc.",
      status: { fr: "En cours", en: "Active" },
      nextDeadline: { fr: "15 janvier 2025", en: "January 15, 2025" },
      issue: { fr: "Congédiement sans cause juste — Réclamation de dommages", en: "Wrongful dismissal — Damages claim" },
    },
    "dossier-tremblay": {
      title: "Tremblay c. PG du Québec",
      file: "200-12-088210-244",
      court: lang === "en" ? "Quebec Superior Court" : "Cour supérieure du Québec",
      judge: "Marc Bernier",
      area: lang === "en" ? "Family" : "Famille",
      hearing: lang === "en" ? "Thursday, 2:00 PM" : "Jeudi, 14 h",
      strength: "79 %",
      plaintiff: "Sophie Tremblay",
      defendant: "PG du Québec",
      status: { fr: "En cours", en: "Active" },
      nextDeadline: { fr: "28 février 2025", en: "February 28, 2025" },
      issue: { fr: "Garde et soutien des enfants — Droit de visite", en: "Child custody and support — Visitation rights" },
    },
    "dossier-lapointe": {
      title: "Lapointe c. CHUM",
      file: "500-17-130044-258",
      court: lang === "en" ? "Quebec Superior Court" : "Cour supérieure du Québec",
      judge: lang === "en" ? "To be assigned" : "À désigner",
      area: lang === "en" ? "Medical" : "Médical",
      hearing: lang === "en" ? "Brief due May 18" : "Mémoire dû 18 mai",
      strength: "71 %",
      plaintiff: "Marc Lapointe",
      defendant: "CHUM",
      status: { fr: "Préparation", en: "Preparation" },
      nextDeadline: { fr: "10 mars 2025", en: "March 10, 2025" },
      issue: { fr: "Négligence médicale — Dommages-intérêts", en: "Medical malpractice — Damages" },
    },
    "dossier-roy": {
      title: "Roy c. Trudel",
      file: "500-22-298021-237",
      court: lang === "en" ? "Court of Québec" : "Cour du Québec",
      judge: "Sylvie Dubois",
      area: lang === "en" ? "Contract" : "Contrat",
      hearing: lang === "en" ? "No urgent deadline" : "Aucun délai urgent",
      strength: "58 %",
      plaintiff: "Robert Roy",
      defendant: "Trudel",
      status: { fr: "En pause", en: "On hold" },
      nextDeadline: { fr: "À déterminer", en: "TBD" },
      issue: { fr: "Rupture de contrat commercial", en: "Commercial contract breach" },
    },
    "dossier-beaulieu": {
      title: "R. c. Beaulieu",
      file: "500-01-209441-241",
      court: lang === "en" ? "Superior Court · Criminal" : "Cour supérieure · chambre criminelle",
      judge: "Pierre Lacasse",
      area: lang === "en" ? "Criminal" : "Criminel",
      hearing: lang === "en" ? "24-1 motion · Monday 9 AM" : "Requête 24-1 · lundi 9 h",
      strength: "82 %",
      plaintiff: "Crown",
      defendant: "Jean Beaulieu",
      status: { fr: "Urgent", en: "Urgent" },
      nextDeadline: { fr: "27 janvier 2025", en: "January 27, 2025" },
      issue: { fr: "Trafic de stupéfiants — Requête 24(2) Charte", en: "Drug trafficking — Section 24(2) Charter motion" },
    },
    "dossier-lemieux": {
      title: "R. c. Lemieux",
      file: "500-01-211089-258",
      court: lang === "en" ? "Court of Québec · Criminal" : "Cour du Québec · chambre criminelle",
      judge: "Marie-Claude Audet",
      area: lang === "en" ? "Criminal" : "Criminel",
      hearing: lang === "en" ? "Trial · May 27" : "Procès · 27 mai",
      strength: "64 %",
      plaintiff: "Crown",
      defendant: "Claude Lemieux",
      status: { fr: "Procès", en: "Trial" },
      nextDeadline: { fr: "27 mai 2025", en: "May 27, 2025" },
      issue: { fr: "Agression — Moyen de défense (consentement)", en: "Assault — Consent defence" },
    },
  };

  const dossier = DOSSIER_DATA[screenId] || DOSSIER_DATA["dossier-dupont"];

  // Initialize edit data on mount
  React.useEffect(() => {
    setEditData({
      title: dossier.title,
      file: dossier.file,
      court: dossier.court,
      judge: dossier.judge,
      area: dossier.area,
      plaintiff: dossier.plaintiff,
      defendant: dossier.defendant,
      status: dossier.status[lang] || dossier.status.fr,
      nextDeadline: dossier.nextDeadline[lang] || dossier.nextDeadline.fr,
      issue: dossier.issue[lang] || dossier.issue.fr,
    });
  }, [dossier, lang]);

  const EditModal = () => (
    <div style={{
      position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
      background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: 20
    }}>
      <form style={{
        background: "var(--paper)", borderRadius: 12, boxShadow: "0 20px 60px rgba(0,0,0,0.3)", width: "100%", maxWidth: 500, maxHeight: "90vh", display: "flex", flexDirection: "column"
      }} onSubmit={(e) => { e.preventDefault(); setEditMode(false); }}>
        <div style={{ padding: "24px", borderBottom: "1px solid var(--border-1)" }}>
          <h2 style={{ margin: 0, fontSize: 24, fontWeight: 700, color: "var(--ink-950)" }}>
            {lang === "en" ? "Edit case" : "Modifier le dossier"}
          </h2>
        </div>

        <div style={{ flex: 1, overflow: "auto", padding: "24px" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "var(--ink-600)", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                {lang === "en" ? "Case title" : "Titre du dossier"}
              </label>
              <input type="text" value={editData.title || ""} onChange={(e) => setEditData({...editData, title: e.target.value})}
                style={{ width: "100%", padding: "10px 12px", border: "1px solid var(--border-2)", borderRadius: 6, fontFamily: "var(--font-sans)", fontSize: 13, boxSizing: "border-box" }}
              />
            </div>
            <div>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "var(--ink-600)", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                {lang === "en" ? "File number" : "Numéro de dossier"}
              </label>
              <input type="text" value={editData.file || ""} onChange={(e) => setEditData({...editData, file: e.target.value})}
                style={{ width: "100%", padding: "10px 12px", border: "1px solid var(--border-2)", borderRadius: 6, fontFamily: "var(--font-mono)", fontSize: 13, boxSizing: "border-box" }}
              />
            </div>
            <div>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "var(--ink-600)", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                {lang === "en" ? "Court" : "Tribunal"}
              </label>
              <input type="text" value={editData.court || ""} onChange={(e) => setEditData({...editData, court: e.target.value})}
                style={{ width: "100%", padding: "10px 12px", border: "1px solid var(--border-2)", borderRadius: 6, fontFamily: "var(--font-sans)", fontSize: 13, boxSizing: "border-box" }}
              />
            </div>
            <div>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "var(--ink-600)", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                {lang === "en" ? "Judge" : "Juge"}
              </label>
              <input type="text" value={editData.judge || ""} onChange={(e) => setEditData({...editData, judge: e.target.value})}
                style={{ width: "100%", padding: "10px 12px", border: "1px solid var(--border-2)", borderRadius: 6, fontFamily: "var(--font-sans)", fontSize: 13, boxSizing: "border-box" }}
              />
            </div>
            <div>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "var(--ink-600)", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                {lang === "en" ? "Practice area" : "Domaine de pratique"}
              </label>
              <input type="text" value={editData.area || ""} onChange={(e) => setEditData({...editData, area: e.target.value})}
                style={{ width: "100%", padding: "10px 12px", border: "1px solid var(--border-2)", borderRadius: 6, fontFamily: "var(--font-sans)", fontSize: 13, boxSizing: "border-box" }}
              />
            </div>
            <div>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "var(--ink-600)", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                {lang === "en" ? "Plaintiff" : "Demandeur"}
              </label>
              <input type="text" value={editData.plaintiff || ""} onChange={(e) => setEditData({...editData, plaintiff: e.target.value})}
                style={{ width: "100%", padding: "10px 12px", border: "1px solid var(--border-2)", borderRadius: 6, fontFamily: "var(--font-sans)", fontSize: 13, boxSizing: "border-box" }}
              />
            </div>
            <div>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "var(--ink-600)", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                {lang === "en" ? "Defendant" : "Défendeur"}
              </label>
              <input type="text" value={editData.defendant || ""} onChange={(e) => setEditData({...editData, defendant: e.target.value})}
                style={{ width: "100%", padding: "10px 12px", border: "1px solid var(--border-2)", borderRadius: 6, fontFamily: "var(--font-sans)", fontSize: 13, boxSizing: "border-box" }}
              />
            </div>
            <div>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "var(--ink-600)", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                {lang === "en" ? "Status" : "Statut"}
              </label>
              <select value={editData.status || ""} onChange={(e) => setEditData({...editData, status: e.target.value})}
                style={{ width: "100%", padding: "10px 12px", border: "1px solid var(--border-2)", borderRadius: 6, fontFamily: "var(--font-sans)", fontSize: 13, boxSizing: "border-box" }}
              >
                <option value="Active">Active</option>
                <option value="En cours">En cours</option>
                <option value="Preparation">Preparation</option>
                <option value="Préparation">Préparation</option>
                <option value="On hold">On hold</option>
                <option value="En pause">En pause</option>
                <option value="Urgent">Urgent</option>
              </select>
            </div>
            <div>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "var(--ink-600)", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                {lang === "en" ? "Next deadline" : "Prochain délai"}
              </label>
              <input type="text" value={editData.nextDeadline || ""} onChange={(e) => setEditData({...editData, nextDeadline: e.target.value})}
                style={{ width: "100%", padding: "10px 12px", border: "1px solid var(--border-2)", borderRadius: 6, fontFamily: "var(--font-sans)", fontSize: 13, boxSizing: "border-box" }}
                placeholder={lang === "en" ? "e.g. January 15, 2025" : "p. ex. 15 janvier 2025"}
              />
            </div>
            <div>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "var(--ink-600)", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                {lang === "en" ? "Main issue" : "Enjeu principal"}
              </label>
              <textarea value={editData.issue || ""} onChange={(e) => setEditData({...editData, issue: e.target.value})}
                style={{ width: "100%", padding: "10px 12px", border: "1px solid var(--border-2)", borderRadius: 6, fontFamily: "var(--font-sans)", fontSize: 13, boxSizing: "border-box", minHeight: 80, resize: "vertical" }}
              />
            </div>
          </div>
        </div>

        <div style={{ display: "flex", gap: 12, justifyContent: "flex-end", padding: "16px 24px", borderTop: "1px solid var(--border-1)" }}>
          <button type="button" onClick={() => setEditMode(false)}
            style={{ padding: "10px 16px", borderRadius: 6, border: "1px solid var(--border-2)", background: "var(--paper)", cursor: "pointer", fontSize: 12, fontWeight: 600 }}>
            {lang === "en" ? "Cancel" : "Annuler"}
          </button>
          <button type="submit"
            style={{ padding: "10px 16px", borderRadius: 6, border: 0, background: "#7A1F2B", color: "#FBF8F2", cursor: "pointer", fontSize: 12, fontWeight: 600 }}>
            {lang === "en" ? "Save changes" : "Enregistrer les modifications"}
          </button>
        </div>
      </form>
    </div>
  );

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0, minHeight: 0 }}>
      {editMode && <EditModal />}
      
      {/* HEADER */}
      <div style={{ background: "var(--bg-app)", borderBottom: "1px solid var(--border-1)", padding: "20px 24px" }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 20 }}>
          <div style={{ flex: 1 }}>
            <Overline style={{ marginBottom: 4 }}>{tr(dossier.area, lang)}</Overline>
            <h1 style={{ fontFamily: "var(--font-display)", fontStyle: "italic", fontWeight: 500, fontSize: 32, color: "var(--ink-950)", letterSpacing: "-0.02em", margin: 0, marginBottom: 8 }}>
              {dossier.title}
            </h1>
            <div style={{ display: "flex", gap: 16, fontSize: 12, color: "var(--ink-600)" }}>
              <span><strong>{dossier.file}</strong></span>
              <span>·</span>
              <span>{dossier.court}</span>
              <span>·</span>
              <span>{lang === "en" ? "Justice" : "Juge"} {dossier.judge}</span>
            </div>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={() => setEditMode(true)} style={{ padding: "8px 12px", borderRadius: 6, border: "1px solid var(--border-2)", background: "var(--paper)", cursor: "pointer", fontSize: 12, fontWeight: 600 }}>
              {lang === "en" ? "✏️ Edit" : "✏️ Modifier"}
            </button>
            <button style={{ padding: "8px 12px", borderRadius: 6, border: "1px solid #4A90E2", background: "#E8F0FF", color: "#2B5FA8", cursor: "pointer", fontSize: 12, fontWeight: 600 }}>
              🔍 {lang === "en" ? "Analyze complete evidence (Private)" : "Analyser preuves complètes (Privé)"}
            </button>
            <button style={{ padding: "8px 12px", borderRadius: 6, border: "1px solid var(--border-2)", background: "var(--paper)", cursor: "pointer", fontSize: 12, fontWeight: 600 }}>
              {lang === "en" ? "Export" : "Exporter"}
            </button>
            <button style={{ padding: "8px 12px", borderRadius: 6, border: 0, background: "#7A1F2B", color: "#FBF8F2", cursor: "pointer", fontSize: 12, fontWeight: 600 }}>
              {lang === "en" ? "Sync to Clio" : "Sync à Clio"}
            </button>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT — Two columns */}
      <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
        {/* LEFT COLUMN — Matter context (60%) */}
        <div style={{ flex: "1.5", display: "flex", flexDirection: "column", borderRight: "1px solid var(--border-1)", overflow: "hidden" }}>
          {/* Tabs */}
          <div style={{ display: "flex", gap: 0, padding: "0 24px", background: "var(--bg-app)", borderBottom: "1px solid var(--border-1)" }}>
            {[
              { id: "overview", label: lang === "en" ? "Overview" : "Vue d'ensemble" },
              { id: "documents", label: lang === "en" ? "Documents" : "Documents" },
              { id: "contacts", label: lang === "en" ? "Parties & contacts" : "Parties & contacts" },
              { id: "timeline", label: lang === "en" ? "Calendar" : "Calendrier" },
              { id: "suggestions", label: lang === "en" ? "💡 AI Suggestions" : "💡 Suggestions IA" },
            ].map((t) => (
              <button key={t.id} onClick={() => setMainTab(t.id)} style={{
                padding: "12px 16px", border: 0, background: "transparent",
                borderBottom: mainTab === t.id ? "2px solid var(--oxblood-700)" : "2px solid transparent",
                cursor: "pointer", fontSize: 13, fontWeight: mainTab === t.id ? 600 : 500,
                color: mainTab === t.id ? "var(--oxblood-700)" : "var(--ink-600)",
              }}>
                {t.label}
              </button>
            ))}
          </div>

          {/* Content */}
          <div style={{ flex: 1, overflow: "auto", padding: "20px 24px" }}>
            {mainTab === "overview" && (
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {/* Status & strength */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  <div style={{ background: "var(--paper)", border: "1px solid var(--border-1)", borderRadius: 10, padding: "14px 16px" }}>
                    <div style={{ fontSize: 10, fontWeight: 600, color: "var(--ink-500)", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 6 }}>
                      {lang === "en" ? "Status" : "Statut"}
                    </div>
                    <div style={{ fontSize: 16, fontWeight: 600, color: "#7A1F2B" }}>{tr(dossier.status, lang)}</div>
                  </div>
                  <div style={{ background: "var(--paper)", border: "1px solid var(--border-1)", borderRadius: 10, padding: "14px 16px" }}>
                    <div style={{ fontSize: 10, fontWeight: 600, color: "var(--ink-500)", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 6 }}>
                      {lang === "en" ? "Case strength" : "Force du dossier"}
                    </div>
                    <div style={{ fontSize: 16, fontWeight: 600, color: "#1B3D26" }}>{dossier.strength}</div>
                  </div>
                </div>

                {/* Timeline */}
                <Panel title={lang === "en" ? "Key dates & milestones" : "Dates clés & jalons"} tone="oxblood">
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    {[
                      { date: "17 mai 2026", event: lang === "en" ? "Hearing (9:30 AM)" : "Audience (9 h 30)" },
                      { date: "14 mai 2026", event: lang === "en" ? "Final brief due" : "Dernier mémoire dû" },
                      { date: "10 mai 2026", event: lang === "en" ? "Prepare witnesses" : "Préparer témoins" },
                      { date: "24 avril 2026", event: lang === "en" ? "Discovery closed" : "Découverte fermée" },
                    ].map((item, i) => (
                      <div key={i} style={{ display: "flex", gap: 12, fontSize: 12 }}>
                        <div style={{ fontFamily: "var(--font-mono)", color: "var(--ink-600)", minWidth: 100 }}>{item.date}</div>
                        <div style={{ color: "var(--ink-800)" }}>{item.event}</div>
                      </div>
                    ))}
                  </div>
                </Panel>

                {/* Precedents */}
                <Panel title={lang === "en" ? "Key precedents" : "Précédents clés"} tone="blue">
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {[
                      { cite: "Bombardier 1988 CanLII 1008 (SCC)", title: "Pillar case — indemnity", sol: "92" },
                      { cite: "R. c. Grant 2009 CSC 32", title: "Charter evidence exclusion", sol: "88" },
                      { cite: "Dupont 2023 QCA 45", title: "Procedural — already cited", sol: "81" },
                    ].map((p, i) => (
                      <div key={i} style={{ padding: "8px 0", borderBottom: i < 2 ? "1px solid #9BC0E8" : 0 }}>
                        <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--ink-600)", marginBottom: 2 }}>{p.cite}</div>
                        <div style={{ fontSize: 12, fontWeight: 600, color: "var(--ink-900)" }}>{p.title}</div>
                        <div style={{ fontSize: 11, color: "var(--ink-600)", marginTop: 2 }}>Sol: <strong style={{ color: "#1B3D26" }}>{p.sol}</strong></div>
                      </div>
                    ))}
                  </div>
                </Panel>
              </div>
            )}

            {mainTab === "documents" && (
              <div style={{ display: "flex", flexDirection: "column", gap: 12, width: "100%" }}>
                {/* Action buttons */}
                <div style={{ display: "flex", flexDirection: "column", gap: 10, width: "100%" }}>
                  <button onClick={() => onNav("doc-editor")} style={{ padding: "12px 16px", background: "#7A1F2B", color: "#FBF8F2", border: 0, borderRadius: 8, cursor: "pointer", fontSize: 13, fontWeight: 600, textAlign: "center", width: "100%" }}>
                    + {lang === "en" ? "Draft motion" : "Rédiger requête"}
                  </button>
                  <button onClick={() => onNav("doc-editor")} style={{ padding: "12px 16px", background: "#7A1F2B", color: "#FBF8F2", border: 0, borderRadius: 8, cursor: "pointer", fontSize: 13, fontWeight: 600, textAlign: "center", width: "100%" }}>
                    + {lang === "en" ? "Draft brief" : "Rédiger mémoire"}
                  </button>
                </div>

                {/* Documents list */}
                <div style={{ paddingTop: 12, borderTop: "1px solid var(--border-2)", width: "100%" }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: "var(--ink-500)", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 12 }}>
                    {lang === "en" ? "Recent documents" : "Documents récents"}
                  </div>
                  {[
                    { name: lang === "en" ? "Motion for reinstatement" : "Requête en réintégration", date: "14 mai", state: "done" },
                    { name: lang === "en" ? "Hearing brief" : "Mémoire d'audience", date: "To draft", state: "draft" },
                    { name: lang === "en" ? "Authorities list" : "Liste de jurisprudence", date: "10 mai", state: "done" },
                    { name: lang === "en" ? "Discovery documents" : "Documents découverte", date: "24 avril", state: "done" },
                  ].map((doc, i) => (
                  <button key={i} onClick={() => {
                    sessionStorage.setItem("editingDoc", JSON.stringify({ name: doc.name, state: doc.state }));
                    onNav("doc-editor");
                  }} style={{ 
                    padding: "10px 12px", background: "var(--paper)", border: "1px solid var(--border-1)", 
                    borderRadius: 8, display: "flex", gap: 10, alignItems: "center", cursor: "pointer",
                    transition: "all 150ms", width: "100%", boxSizing: "border-box"
                  }} onMouseEnter={(e) => e.currentTarget.style.background = "var(--ink-50)"} onMouseLeave={(e) => e.currentTarget.style.background = "var(--paper)"}>
                    <Icon name="fileText" size={16} color="var(--ink-600)"/>
                    <div style={{ flex: 1, textAlign: "left" }}>
                      <div style={{ fontSize: 12, fontWeight: 600, color: "var(--ink-900)" }}>{doc.name}</div>
                      <div style={{ fontSize: 11, color: "var(--ink-600)" }}>{doc.date}</div>
                    </div>
                    <div style={{ padding: "3px 8px", borderRadius: 4, fontSize: 10, fontWeight: 600, background: doc.state === "done" ? "#E7F0EA" : "#FBF3D9", color: doc.state === "done" ? "#1B3D26" : "#6B4A0E" }}>
                      {doc.state === "done" ? "✓" : "Draft"}
                    </div>
                  </button>
                  ))}
                </div>
              </div>
            )}

            {mainTab === "contacts" && (
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: "var(--ink-500)", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 8 }}>
                    {lang === "en" ? "Plaintiff" : "Demandeur"}
                  </div>
                  <div style={{ padding: "10px 12px", background: "var(--paper)", border: "1px solid var(--border-1)", borderRadius: 8 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: "var(--ink-900)" }}>{dossier.plaintiff}</div>
                    <div style={{ fontSize: 11, color: "var(--ink-600)" }}>pierre.dupont@email.com · (514) 555-0123</div>
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: "var(--ink-500)", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 8 }}>
                    {lang === "en" ? "Defendant" : "Défendeur"}
                  </div>
                  <div style={{ padding: "10px 12px", background: "var(--paper)", border: "1px solid var(--border-1)", borderRadius: 8 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: "var(--ink-900)" }}>{dossier.defendant}</div>
                    <div style={{ fontSize: 11, color: "var(--ink-600)" }}>legal@industriesxyz.com · (514) 555-9999</div>
                  </div>
                </div>
              </div>
            )}

            {mainTab === "timeline" && (
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {/* Calendar header */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <h3 style={{ margin: 0, fontSize: 16, fontWeight: 600, color: "var(--ink-900)" }}>
                    {lang === "en" ? "May 2026" : "Mai 2026"}
                  </h3>
                  <div style={{ display: "flex", gap: 8 }}>
                    <button style={{ padding: "4px 8px", border: "1px solid var(--border-2)", background: "var(--paper)", borderRadius: 4, cursor: "pointer" }}>←</button>
                    <button style={{ padding: "4px 8px", border: "1px solid var(--border-2)", background: "var(--paper)", borderRadius: 4, cursor: "pointer" }}>→</button>
                  </div>
                </div>

                {/* Calendar grid */}
                <div style={{ background: "var(--paper)", border: "1px solid var(--border-1)", borderRadius: 10, padding: 12, display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 4 }}>
                  {["Lu", "Ma", "Me", "Je", "Ve", "Sa", "Di"].map((day) => (
                    <div key={day} style={{ textAlign: "center", fontSize: 10, fontWeight: 700, color: "var(--ink-500)", padding: "8px 0", borderBottom: "1px solid var(--border-2)" }}>
                      {day}
                    </div>
                  ))}
                  {[null, null, null, null, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31].map((day, i) => {
                    const hasEvent = day === 14 || day === 17;
                    return (
                      <div key={i} style={{ 
                        padding: "8px 4px", 
                        textAlign: "center", 
                        fontSize: 11, 
                        fontWeight: 500,
                        borderRadius: 6,
                        background: hasEvent ? "#FBEEF0" : "transparent",
                        border: hasEvent ? "1px solid #E5A8B1" : "none",
                        color: day ? "var(--ink-900)" : "var(--ink-300)",
                        cursor: hasEvent ? "pointer" : "default",
                        minHeight: 28
                      }}>
                        {day}
                        {hasEvent && <div style={{ fontSize: 6, color: "#7A1F2B", marginTop: 1 }}>●</div>}
                      </div>
                    );
                  })}
                </div>

                {/* Events list */}
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  <h4 style={{ margin: 0, fontSize: 12, fontWeight: 700, color: "var(--ink-600)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                    {lang === "en" ? "Upcoming events" : "Événements à venir"}
                  </h4>
                  {[
                    { date: "14 mai", time: "14:00", title: lang === "en" ? "Final brief due" : "Dernier mémoire dû", sync: "clio" },
                    { date: "17 mai", time: "09:30", title: lang === "en" ? "Hearing" : "Audience", sync: "practicepanther" },
                    { date: "24 mai", time: "10:00", title: lang === "en" ? "Follow-up call with plaintiff" : "Appel de suivi avec demandeur", sync: "mycase" },
                    { date: "31 mai", time: "15:00", title: lang === "en" ? "Settlement conference" : "Conférence de règlement", sync: "clio" },
                  ].map((event, i) => (
                    <div key={i} style={{ 
                      padding: "12px 14px", 
                      background: "var(--paper)", 
                      border: "1px solid var(--border-1)", 
                      borderRadius: 8,
                      display: "flex",
                      gap: 12,
                      alignItems: "flex-start"
                    }}>
                      <div style={{ minWidth: 60 }}>
                        <div style={{ fontSize: 11, fontWeight: 700, color: "var(--ink-600)" }}>{event.date}</div>
                        <div style={{ fontSize: 10, color: "var(--ink-500)" }}>{event.time}</div>
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 12, fontWeight: 600, color: "var(--ink-900)", marginBottom: 4 }}>{event.title}</div>
                        <span style={{
                          fontSize: 9, fontWeight: 600, padding: "2px 6px", borderRadius: 3,
                          background: event.sync === "clio" ? "#E8F0FF" : event.sync === "practicepanther" ? "#FFF3E0" : "#F3E5F5",
                          color: event.sync === "clio" ? "#0066CC" : event.sync === "practicepanther" ? "#D97757" : "#7A1F2B",
                          textTransform: "uppercase", letterSpacing: "0.04em",
                          display: "inline-flex", alignItems: "center", gap: 3
                        }}>
                          {event.sync === "clio" ? (
                            <>
                              <img src="data:image/svg+xml,%3Csvg width='10' height='10' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='50' cy='50' r='45' fill='%230066CC'/%3E%3Cpath d='M35 50L45 60L65 35' stroke='white' stroke-width='6' fill='none' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E" alt="Clio" style={{width: 10, height: 10}}/>
                              Clio
                            </>
                          ) : event.sync === "practicepanther" ? (
                            <>
                              <img src="data:image/svg+xml,%3Csvg width='10' height='10' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M50 10L20 30V60C20 80 50 95 50 95C50 95 80 80 80 60V30L50 10Z' fill='%23D97757' stroke='%23D97757' stroke-width='2'/%3E%3C/svg%3E" alt="PP" style={{width: 10, height: 10}}/>
                              PP
                            </>
                          ) : (
                            <>
                              <img src="data:image/svg+xml,%3Csvg width='10' height='10' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Crect x='20' y='15' width='60' height='75' rx='4' fill='%237A1F2B' stroke='%237A1F2B' stroke-width='2'/%3E%3C/svg%3E" alt="MC" style={{width: 10, height: 10}}/>
                              MC
                            </>
                          )}
                        </span>
                      </div>
                      <button style={{ padding: "4px 8px", background: "transparent", border: "1px solid var(--border-2)", borderRadius: 4, cursor: "pointer", fontSize: 9, color: "var(--ink-600)" }}>
                        {lang === "en" ? "Edit" : "Modifier"}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {mainTab === "suggestions" && <SuggestionsTab lang={lang} dossier={dossier} onNav={onNav}/>}
          </div>
        </div>

        {/* RIGHT COLUMN — Integrated tools (40%) */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
          {/* Tool tabs */}
          <div style={{ display: "flex", gap: 0, padding: "0 12px", background: "var(--bg-app)", borderBottom: "1px solid var(--border-1)" }}>
            {[
              { id: "assistant", label: "Assistant", icon: "sparkle" },
              { id: "research", label: lang === "en" ? "Research" : "Recherche", icon: "search" },
              { id: "drafts", label: lang === "en" ? "Drafts" : "Brouillons", icon: "edit" },
              { id: "sync", label: "Sync", icon: "sync" },
            ].map((t) => (
              <button key={t.id} onClick={() => setToolTab(t.id)} style={{
                padding: "10px 12px", border: 0, background: "transparent",
                borderBottom: toolTab === t.id ? "2px solid var(--oxblood-700)" : "2px solid transparent",
                cursor: "pointer", fontSize: 12, fontWeight: toolTab === t.id ? 600 : 500,
                color: toolTab === t.id ? "var(--oxblood-700)" : "var(--ink-600)",
                display: "inline-flex", gap: 5, alignItems: "center",
              }}>
                <Icon name={t.icon} size={13}/>{t.label}
              </button>
            ))}
          </div>

          {/* Tool content */}
          <div style={{ flex: 1, overflow: "auto", padding: "16px 12px" }}>
            {toolTab === "assistant" && (
              <div style={{ display: "flex", flexDirection: "column", gap: 10, fontSize: 12 }}>
                <div style={{ padding: "10px", background: "#E4ECF5", borderRadius: 8, borderLeft: "3px solid #2B5FA8", color: "#102B57" }}>
                  💡 {lang === "en" ? "Ask about this case: precedents, strategy, risk analysis." : "Posez des questions sur ce dossier : précédents, stratégie, analyse de risques."}
                </div>
                <input type="text" placeholder={lang === "en" ? "Ask about this matter…" : "Poser une question…"}
                  style={{ padding: "8px 10px", border: "1px solid var(--border-2)", borderRadius: 6, fontFamily: "var(--font-sans)", fontSize: 12, background: "var(--paper)" }}
                />
              </div>
            )}
            {toolTab === "research" && (
              <div style={{ display: "flex", flexDirection: "column", gap: 10, fontSize: 12 }}>
                <div style={{ padding: "10px", background: "#E4ECF5", borderRadius: 8, color: "#102B57" }}>
                  {lang === "en" ? "Search jurisprudence on this matter's key issues." : "Recherchez la jurisprudence sur les enjeux clés."}
                </div>
                <input type="text" placeholder={lang === "en" ? "Search…" : "Rechercher…"}
                  style={{ padding: "8px 10px", border: "1px solid var(--border-2)", borderRadius: 6, fontFamily: "var(--font-sans)", fontSize: 12, background: "var(--paper)" }}
                />
              </div>
            )}
            {toolTab === "drafts" && (
              <div style={{ display: "flex", flexDirection: "column", gap: 8, fontSize: 11 }}>
                <button onClick={() => onNav("doc-editor")} style={{ padding: "8px 10px", background: "#7A1F2B", color: "#FBF8F2", border: 0, borderRadius: 6, cursor: "pointer", fontWeight: 600 }}>
                  {lang === "en" ? "+ Draft motion" : "+ Rédiger requête"}
                </button>
                <button onClick={() => onNav("doc-editor")} style={{ padding: "8px 10px", background: "#7A1F2B", color: "#FBF8F2", border: 0, borderRadius: 6, cursor: "pointer", fontWeight: 600 }}>
                  {lang === "en" ? "+ Draft brief" : "+ Rédiger mémoire"}
                </button>
              </div>
            )}
            {toolTab === "sync" && (
              <div style={{ display: "flex", flexDirection: "column", gap: 8, fontSize: 11 }}>
                {["Clio", "PracticePanther", "MyCase"].map((app) => (
                  <button key={app} style={{ padding: "8px 10px", background: "var(--paper)", border: "1px solid var(--border-1)", borderRadius: 6, cursor: "pointer", fontWeight: 600, textAlign: "left" }}>
                    Sync to {app}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

Object.assign(window, { Dossier });
