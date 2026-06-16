/* eslint-disable */
// Template selector for Document Editor — choose built-in or import custom.

const TemplateSelector = ({ lang, onSelect, onCancel, onOpenOfficial }) => {
  const [tab, setTab] = React.useState("builtin"); // "builtin", "import", or "official"
  const [selectedTemplate, setSelectedTemplate] = React.useState(null);
  const [importedFile, setImportedFile] = React.useState(null);

  // Built-in templates
  const BUILTIN_TEMPLATES = {
    motion_standard: {
      name: { fr: "Requête standard", en: "Standard Motion" },
      desc: { fr: "Modèle type pour motion générale", en: "Standard template for general motion" },
      category: "motion",
      content: `REQUÊTE

À L'HONOURABLE COUR SUPÉRIEURE

ENTRE :

[DEMANDEUR/DEMANDEURE]
Demandeur(e)
-et-

[DÉFENDEUR/DÉFENDERESSE]
Défendeur(e)

─────────────────────────────────────────────────────────────

REQUÊTE

La demandeur(e) demande respectueusement à cette Cour de [OBJET DE LA REQUÊTE].

À L'APPUI DE CETTE REQUÊTE, la demandeur(e) soumet et prétend ce qui suit :

1. La demandeur(e) [AFFIRMATION FACTUELLE 1].

2. Le défendeur(e) [AFFIRMATION FACTUELLE 2].

3. PAR CONSÉQUENT, il y a lieu d'accueillir cette requête.

POUR CES MOTIFS, LA DEMANDEUR(E) DEMANDE À CETTE COUR DE [DEMANDE CONCRÈTE].

[SIGNATURE]
[NOM DE L'AVOCAT]
[NUMÉRO DE PERMIS]`,
    },
    brief_hearing: {
      name: { fr: "Mémoire d'audience", en: "Hearing Brief" },
      desc: { fr: "Mémoire pour audition", en: "Brief for hearing" },
      category: "brief",
      content: `MÉMOIRE D'AUDIENCE

COUR SUPÉRIEURE DU QUÉBEC
District judiciaire de [DISTRICT]
No [NUMÉRO DE DOSSIER]

ENTRE :

[DEMANDEUR/DEMANDEURE]
Demandeur(e)
-et-

[DÉFENDEUR/DÉFENDERESSE]
Défendeur(e)

─────────────────────────────────────────────────────────────

1. INTRODUCTION

La demandeur(e) soumet que cette affaire soulève la question suivante : [QUESTION JURIDIQUE].

2. FAITS PERTINENTS

2.1 [FAIT 1]

2.2 [FAIT 2]

2.3 [FAIT 3]

3. QUESTIONS EN LITIGE

3.1 [QUESTION 1]

3.2 [QUESTION 2]

4. DROIT APPLICABLE

[CITATIONS DE JURISPRUDENCE ET LÉGISLATION]

5. ARGUMENTS

5.1 [ARGUMENT PRINCIPAL]

En premier lieu, [DÉVELOPPEMENT DE L'ARGUMENT].

5.2 [DEUXIÈME ARGUMENT]

De plus, [DÉVELOPPEMENT].

6. CONCLUSION

Pour ces motifs, la demandeur(e) demande à cette Cour de [DEMANDE].

─────────────────────────────────────────────────────────────`,
    },
    appeal_memo: {
      name: { fr: "Mémoire d'appel", en: "Appeal Memorandum" },
      desc: { fr: "Mémoire pour appel", en: "Memorandum for appeal" },
      category: "appeal",
      content: `MÉMOIRE D'APPEL

COUR D'APPEL DU QUÉBEC

Entre :

[APPELANT/APPELANTE]
Appelant(e)
-et-

[INTIMÉ/INTIMÉE]
Intimé(e)

─────────────────────────────────────────────────────────────

1. NATURE DE L'APPEL

Cet appel porte sur le jugement rendu le [DATE] par l'Honorable [NOM DU JUGE] de la Cour supérieure du Québec.

2. FAITS PERTINENTS

[RÉSUMÉ DES FAITS]

3. QUESTIONS EN APPEL

3.1 [QUESTION 1] ?

3.2 [QUESTION 2] ?

4. ARGUMENTS

4.1 [PREMIER ARGUMENT]

À cet égard, [DÉVELOPPEMENT].

4.2 [DEUXIÈME ARGUMENT]

De surcroît, [DÉVELOPPEMENT].

5. ORDONNANCE RECHERCHÉE

L'appelant(e) demande à cette Cour de :

a) Infirmer le jugement de première instance ;
b) [AUTRE ORDONNANCE] ;
c) Condamner l'intimé(e) aux dépens.

─────────────────────────────────────────────────────────────`,
    },
    contract_template: {
      name: { fr: "Contrat", en: "Contract" },
      desc: { fr: "Modèle de contrat", en: "Contract template" },
      category: "contract",
      content: `ENTENTE

Entre :

[PARTIE 1]
(« [Désignation Partie 1] »)

-et-

[PARTIE 2]
(« [Désignation Partie 2] »)

─────────────────────────────────────────────────────────────

ATTENDU QUE :

CONSIDÉRANT que les parties désirent établir les termes et conditions de [OBJET GÉNÉRAL] ;

À CES CAUSES, les parties conviennent de ce qui suit :

1. DÉFINITIONS ET INTERPRÉTATION

1.1 Dans la présente entente :

« [Terme] » signifie [Définition].

2. OBJET

2.1 La [Partie 1] s'engage à [OBLIGATION].

2.2 La [Partie 2] s'engage à [OBLIGATION].

3. DURÉE

3.1 La présente entente entre en vigueur le [DATE] et demeurera en vigueur pour une période de [DURÉE].

4. RÉMUNÉRATION

4.1 [Détails de rémunération].

5. RÉSILIATION

5.1 La présente entente peut être résiliée par [CONDITIONS DE RÉSILIATION].

6. DISPOSITIONS GÉNÉRALES

6.1 Cette entente constitue l'entente intégrale entre les parties.

6.2 Toute modification doit être faite par écrit et signée par les deux parties.

EN TÉMOIGNAGE DE QUOI, les parties ont apposé leurs signatures ce [DATE].

[SIGNATURE PARTIE 1]
[NOM ET TITRE]

[SIGNATURE PARTIE 2]
[NOM ET TITRE]`,
    },
    letter_formal: {
      name: { fr: "Correspondance formelle", en: "Formal Letter" },
      desc: { fr: "Lettre juridique", en: "Legal letter" },
      category: "correspondence",
      content: `[CABINET D'AVOCATS]
[ADRESSE]
[TÉLÉPHONE]
[EMAIL]

[DATE]

[DESTINATAIRE]
[ADRESSE]

OBJET : [SUJET]

Madame, Monsieur,

[INTRODUCTION - CONTEXTE SUCCINCTEMENT]

[CORPS DE LA LETTRE - DÉVELOPPEMENT DU SUJET]

À cet égard, [ARGUMENT OU EXPLICATION].

De plus, [AUTRE POINT].

[DEMANDE OU INSTRUCTION]

Nous attendons votre réponse dans un délai de [DÉLAI] jours.

Cordialement,

[SIGNATURE]
[NOM DE L'AVOCAT]
[NUMÉRO DE PERMIS]`,
    },
  };

  const handleSelectTemplate = (key) => {
    setSelectedTemplate(key);
  };

  const handleOpenTemplate = () => {
    if (selectedTemplate) {
      const template = BUILTIN_TEMPLATES[selectedTemplate];
      onSelect({
        type: "builtin",
        key: selectedTemplate,
        name: tr(template.name, lang),
        content: template.content,
        category: template.category,
      });
    }
  };

  const handleImportFile = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result || "";
        onSelect({
          type: "imported",
          name: file.name,
          content: content,
        });
      };
      reader.readAsText(file);
    }
  };

  return (
    <div style={{
      position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
      background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 2000,
    }}>
      <div style={{
        background: "white", borderRadius: 12, width: "90%", maxWidth: "700px", maxHeight: "85vh", overflow: "hidden",
        display: "flex", flexDirection: "column", boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
      }}>
        {/* Header */}
        <div style={{ background: "#2B5FA8", color: "#FBF8F2", padding: "20px 24px", borderBottom: "1px solid rgba(255,248,242,0.1)" }}>
          <h2 style={{ margin: 0, fontSize: 20, fontWeight: 600 }}>
            {lang === "en" ? "Choose a template" : "Choisir un modèle"}
          </h2>
          <p style={{ margin: "6px 0 0 0", fontSize: 13, opacity: 0.85 }}>
            {lang === "en" ? "Start with a built-in template or import your own" : "Commencez avec un modèle intégré ou importez le vôtre"}
          </p>
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", borderBottom: "1px solid var(--border-1)" }}>
          <button onClick={() => setTab("builtin")} style={{
            flex: 1, padding: "12px", border: 0, background: tab === "builtin" ? "#F5F5F5" : "white",
            borderBottom: tab === "builtin" ? "3px solid #2B5FA8" : "none",
            cursor: "pointer", fontWeight: tab === "builtin" ? 600 : 500, fontSize: 13, color: "var(--ink-900)",
          }}>
            {lang === "en" ? "Built-in templates" : "Modèles intégrés"}
          </button>
          <button onClick={() => setTab("import")} style={{
            flex: 1, padding: "12px", border: 0, background: tab === "import" ? "#F5F5F5" : "white",
            borderBottom: tab === "import" ? "3px solid #2B5FA8" : "none",
            cursor: "pointer", fontWeight: tab === "import" ? 600 : 500, fontSize: 13, color: "var(--ink-900)",
          }}>
            {lang === "en" ? "Import file" : "Importer un fichier"}
          </button>
        </div>

        {/* Content */}
        <div style={{ flex: 1, overflow: "auto", padding: "20px 24px" }}>
          {tab === "builtin" && (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              {Object.entries(BUILTIN_TEMPLATES).map(([key, tmpl]) => (
                <div
                  key={key}
                  onClick={() => handleSelectTemplate(key)}
                  style={{
                    padding: "16px", border: selectedTemplate === key ? "2px solid #2B5FA8" : "1px solid var(--border-1)",
                    borderRadius: 8, cursor: "pointer", background: selectedTemplate === key ? "#E4ECF5" : "var(--paper)",
                    transition: "all 200ms",
                  }}
                  onMouseEnter={(e) => !selectedTemplate || selectedTemplate !== key ? e.currentTarget.style.borderColor = "#2B5FA8" : null}
                  onMouseLeave={(e) => !selectedTemplate || selectedTemplate !== key ? e.currentTarget.style.borderColor = "var(--border-1)" : null}
                >
                  <div style={{ fontWeight: 600, color: "#2B5FA8", fontSize: 13, marginBottom: 6 }}>
                    {tr(tmpl.name, lang)}
                  </div>
                  <div style={{ fontSize: 11, color: "var(--ink-600)", lineHeight: 1.4 }}>
                    {tr(tmpl.desc, lang)}
                  </div>
                </div>
              ))}
            </div>
          )}

          {tab === "import" && (
            <div style={{ textAlign: "center", padding: "40px 20px" }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>📄</div>
              <p style={{ fontSize: 13, fontWeight: 600, marginBottom: 8, color: "var(--ink-900)" }}>
                {lang === "en" ? "Upload your template" : "Importez votre modèle"}
              </p>
              <p style={{ fontSize: 12, color: "var(--ink-600)", marginBottom: 16 }}>
                {lang === "en" ? "Accepts .txt, .md, or plain text files" : "Accepte les fichiers .txt, .md ou texte brut"}
              </p>
              <label style={{
                display: "inline-block", padding: "12px 20px", background: "#2B5FA8", color: "#FBF8F2",
                borderRadius: 6, cursor: "pointer", fontWeight: 600, fontSize: 13,
              }}>
                {lang === "en" ? "Choose file" : "Choisir un fichier"}
                <input type="file" accept=".txt,.md,.doc,.docx" onChange={handleImportFile} style={{ display: "none" }} />
              </label>
              {importedFile && (
                <p style={{ fontSize: 12, color: "var(--ink-700)", marginTop: 12 }}>
                  ✓ {lang === "en" ? "File selected" : "Fichier sélectionné"}: {importedFile}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{ padding: "16px 24px", borderTop: "1px solid var(--border-1)", display: "flex", gap: 12, justifyContent: "space-between" }}>
          <button onClick={() => onOpenOfficial()} style={{
            padding: "8px 16px", borderRadius: 6, border: "1px solid #2B5FA8", background: "white", color: "#2B5FA8",
            cursor: "pointer", fontSize: 12, fontWeight: 600,
          }}>
            🌐 {lang === "en" ? "Official templates" : "Modèles officiels"}
          </button>
          <div style={{ display: "flex", gap: 12 }}>
            <button onClick={onCancel} style={{
              padding: "8px 16px", borderRadius: 6, border: "1px solid var(--border-2)", background: "white",
              cursor: "pointer", fontSize: 12, fontWeight: 600, color: "var(--ink-900)",
            }}>
              {lang === "en" ? "Cancel" : "Annuler"}
            </button>
            <button onClick={handleOpenTemplate} disabled={!selectedTemplate && tab === "builtin"} style={{
              padding: "8px 16px", borderRadius: 6, border: 0, background: selectedTemplate || tab === "import" ? "#2B5FA8" : "#CCC",
              color: "#FBF8F2", cursor: selectedTemplate || tab === "import" ? "pointer" : "not-allowed",
              fontSize: 12, fontWeight: 600,
            }}>
              {lang === "en" ? "Open template" : "Ouvrir le modèle"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

Object.assign(window, { TemplateSelector });
