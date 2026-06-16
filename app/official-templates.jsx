/* eslint-disable */
// Official Templates from gov.qc.ca, canada.ca, USA — for Document Editor

const OfficialTemplates = ({ lang, onSelectTemplate, onClose }) => {
  const [jurisdiction, setJurisdiction] = React.useState("qc");
  const [category, setCategory] = React.useState("civil");
  const [selectedTemplate, setSelectedTemplate] = React.useState(null);

  // Templates organized by jurisdiction and category
  const TEMPLATES = {
    qc: {
      civil: [
        { id: "qc-motion", name: { fr: "Requête (modèle général)", en: "Motion (general template)" }, url: "https://www.quebec.ca/...", format: "PDF" },
        { id: "qc-brief", name: { fr: "Mémoire d'audience", en: "Hearing brief" }, url: "https://www.quebec.ca/...", format: "PDF" },
        { id: "qc-affidavit", name: { fr: "Déclaration assermentée", en: "Affidavit" }, url: "https://www.quebec.ca/...", format: "PDF" },
        { id: "qc-summons", name: { fr: "Assignation", en: "Summons" }, url: "https://www.quebec.ca/...", format: "PDF" },
        { id: "qc-statement", name: { fr: "Énoncé des prétentions", en: "Statement of claim" }, url: "https://www.quebec.ca/...", format: "PDF" },
      ],
      family: [
        { id: "qc-custody", name: { fr: "Demande de modification de garde", en: "Custody modification request" }, url: "https://www.quebec.ca/...", format: "PDF" },
        { id: "qc-support", name: { fr: "Demande de pension alimentaire", en: "Support order request" }, url: "https://www.quebec.ca/...", format: "PDF" },
        { id: "qc-parenting", name: { fr: "Plan parental", en: "Parenting plan" }, url: "https://www.quebec.ca/...", format: "DOCX" },
      ],
      criminal: [
        { id: "qc-bail", name: { fr: "Demande de mise en liberté sous caution", en: "Bail application" }, url: "https://www.quebec.ca/...", format: "PDF" },
        { id: "qc-charter", name: { fr: "Requête 24(2) Charte", en: "Section 24(2) Charter motion" }, url: "https://www.quebec.ca/...", format: "PDF" },
        { id: "qc-disclosure", name: { fr: "Demande de divulgation", en: "Disclosure request" }, url: "https://www.quebec.ca/...", format: "PDF" },
      ],
      labor: [
        { id: "qc-complaint", name: { fr: "Plainte en discrimination", en: "Discrimination complaint" }, url: "https://www.quebec.ca/...", format: "PDF" },
        { id: "qc-grievance", name: { fr: "Grief (arbitrage)", en: "Grievance (arbitration)" }, url: "https://www.quebec.ca/...", format: "DOCX" },
      ],
    },
    ca: {
      civil: [
        { id: "ca-statement", name: { fr: "Énoncé des prétentions fédéral", en: "Federal statement of claim" }, url: "https://www.canada.ca/...", format: "PDF" },
        { id: "ca-notice", name: { fr: "Avis de motion", en: "Notice of motion" }, url: "https://www.canada.ca/...", format: "PDF" },
      ],
      criminal: [
        { id: "ca-bail-fed", name: { fr: "Demande de mise en liberté (Cour fédérale)", en: "Bail application (Federal Court)" }, url: "https://www.canada.ca/...", format: "PDF" },
      ],
      immigration: [
        { id: "ca-imm-app", name: { fr: "Demande d'asile", en: "Asylum application" }, url: "https://www.canada.ca/...", format: "PDF" },
        { id: "ca-imm-appeal", name: { fr: "Appel d'immigration", en: "Immigration appeal" }, url: "https://www.canada.ca/...", format: "PDF" },
      ],
    },
    usa: {
      federal: [
        { id: "us-complaint", name: { fr: "Plainte fédérale", en: "Federal complaint" }, url: "https://www.uscourts.gov/...", format: "PDF" },
        { id: "us-motion", name: { fr: "Requête fédérale", en: "Federal motion" }, url: "https://www.uscourts.gov/...", format: "PDF" },
        { id: "us-brief", name: { fr: "Mémoire de cour d'appel", en: "Appellate brief" }, url: "https://www.uscourts.gov/...", format: "PDF" },
      ],
      state: [
        { id: "us-state-comp", name: { fr: "Plainte au niveau état", en: "State-level complaint" }, url: "https://www.uscourts.gov/...", format: "PDF" },
        { id: "us-state-motion", name: { fr: "Requête au niveau état", en: "State motion" }, url: "https://www.uscourts.gov/...", format: "PDF" },
      ],
      bankruptcy: [
        { id: "us-bankruptcy", name: { fr: "Pétition de faillite", en: "Bankruptcy petition" }, url: "https://www.uscourts.gov/...", format: "PDF" },
      ],
    },
  };

  const jurisdictions = {
    qc: { name: "Québec", icon: "🇨🇦" },
    ca: { name: "Canada", icon: "🍁" },
    usa: { name: "USA", icon: "🇺🇸" },
  };

  const categories = {
    qc: ["civil", "family", "criminal", "labor"],
    ca: ["civil", "criminal", "immigration"],
    usa: ["federal", "state", "bankruptcy"],
  };

  const templates = TEMPLATES[jurisdiction]?.[category] || [];

  const TemplateCard = ({ template }) => (
    <button onClick={() => {
      setSelectedTemplate(template);
      onSelectTemplate(template);
    }} style={{
      padding: "12px 14px", background: "var(--paper)", border: "1px solid var(--border-1)", borderRadius: 8, textAlign: "left", cursor: "pointer", transition: "all 150ms",
      opacity: selectedTemplate?.id === template.id ? 1 : 0.8,
      borderColor: selectedTemplate?.id === template.id ? "#2B5FA8" : "var(--border-1)",
      backgroundColor: selectedTemplate?.id === template.id ? "#E4ECF5" : "var(--paper)",
    }} onMouseEnter={(e) => !selectedTemplate && (e.currentTarget.style.background = "var(--ink-50)")} onMouseLeave={(e) => !selectedTemplate && (e.currentTarget.style.background = "var(--paper)")}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: 8 }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 600, color: "var(--ink-900)", fontSize: 12, marginBottom: 4 }}>
            {template.name[lang] || template.name.en}
          </div>
          <div style={{ fontSize: 10, color: "var(--ink-600)" }}>
            {template.format} • {jurisdictions[jurisdiction].name}
          </div>
        </div>
        {selectedTemplate?.id === template.id && <div style={{ fontSize: 18 }}>✓</div>}
      </div>
    </button>
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16, maxHeight: "80vh", overflow: "auto", padding: "0 0 16px 0" }}>
      {/* Jurisdiction selector */}
      <div>
        <div style={{ fontSize: 11, fontWeight: 700, color: "var(--ink-500)", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 10 }}>
          {lang === "en" ? "Jurisdiction" : "Juridiction"}
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
          {Object.entries(jurisdictions).map(([key, val]) => (
            <button key={key} onClick={() => { setJurisdiction(key); setCategory(categories[key][0]); setSelectedTemplate(null); }} style={{
              padding: "10px 12px", background: jurisdiction === key ? "#2B5FA8" : "var(--paper)", color: jurisdiction === key ? "#FBF8F2" : "var(--ink-900)", border: "1px solid var(--border-1)", borderRadius: 6, cursor: "pointer", fontWeight: 600, fontSize: 12, transition: "all 150ms",
            }}>
              {val.icon} {val.name}
            </button>
          ))}
        </div>
      </div>

      {/* Category selector */}
      <div>
        <div style={{ fontSize: 11, fontWeight: 700, color: "var(--ink-500)", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 10 }}>
          {lang === "en" ? "Category" : "Catégorie"}
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 8 }}>
          {categories[jurisdiction].map((cat) => (
            <button key={cat} onClick={() => { setCategory(cat); setSelectedTemplate(null); }} style={{
              padding: "8px 12px", background: category === cat ? "#2B5FA8" : "var(--paper)", color: category === cat ? "#FBF8F2" : "var(--ink-900)", border: "1px solid var(--border-1)", borderRadius: 6, cursor: "pointer", fontWeight: 500, fontSize: 11, textTransform: "capitalize", transition: "all 150ms",
            }}>
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Templates list */}
      <div>
        <div style={{ fontSize: 11, fontWeight: 700, color: "var(--ink-500)", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 10 }}>
          {lang === "en" ? "Available templates" : "Modèles disponibles"} ({templates.length})
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {templates.length > 0 ? (
            templates.map((t) => <TemplateCard key={t.id} template={t}/>)
          ) : (
            <div style={{ padding: "16px", textAlign: "center", color: "var(--ink-600)", fontSize: 12 }}>
              {lang === "en" ? "No templates available for this category" : "Aucun modèle disponible pour cette catégorie"}
            </div>
          )}
        </div>
      </div>

      {/* Action buttons */}
      <div style={{ display: "flex", gap: 8, paddingTop: 12, borderTop: "1px solid var(--border-1)" }}>
        <button onClick={onClose} style={{
          flex: 1, padding: "8px 12px", borderRadius: 6, border: "1px solid var(--border-1)", background: "white", cursor: "pointer", fontWeight: 600, fontSize: 12,
        }}>
          {lang === "en" ? "Cancel" : "Annuler"}
        </button>
        <button onClick={() => {
          if (selectedTemplate) {
            alert(`✅ ${selectedTemplate.name[lang] || selectedTemplate.name.en} ${lang === "en" ? "loaded" : "chargé"}`);
          }
        }} disabled={!selectedTemplate} style={{
          flex: 1, padding: "8px 12px", borderRadius: 6, border: 0, background: selectedTemplate ? "#2B5FA8" : "var(--border-1)", color: "#FBF8F2", cursor: selectedTemplate ? "pointer" : "not-allowed", fontWeight: 600, fontSize: 12,
        }}>
          {lang === "en" ? "Load template" : "Charger modèle"}
        </button>
      </div>
    </div>
  );
};

Object.assign(window, { OfficialTemplates });
