/* eslint-disable */
// Document editor WYSIWYG — with template selector on load.

const DocumentEditor = ({ lang, screenId, onNav, tweaks }) => {
  const [docType, setDocType] = React.useState("motion");
  const [generating, setGenerating] = React.useState(false);
  const [selectedText, setSelectedText] = React.useState("");
  const [showToolbar, setShowToolbar] = React.useState(false);
  const [toolbarPos, setToolbarPos] = React.useState({ top: 0, left: 0 });
  const [templateSelected, setTemplateSelected] = React.useState(false);
  const [documentContent, setDocumentContent] = React.useState("");
  const [editingDoc, setEditingDoc] = React.useState(null);
  const [showOfficialTemplates, setShowOfficialTemplates] = React.useState(false);
  const [fontSize, setFontSize] = React.useState("12");
  const [fontFamily, setFontFamily] = React.useState("georgia");
  const [textColor, setTextColor] = React.useState("#000000");
  const [wordCount, setWordCount] = React.useState(0);
  const [showFindReplace, setShowFindReplace] = React.useState(false);
  const [findText, setFindText] = React.useState("");
  const [replaceText, setReplaceText] = React.useState("");
  const [trackChanges, setTrackChanges] = React.useState(false);

  const editorRef = React.useRef(null);

  // Check if opening an existing document
  React.useEffect(() => {
    const storedDoc = sessionStorage.getItem("editingDoc");
    if (storedDoc) {
      const doc = JSON.parse(storedDoc);
      setEditingDoc(doc);
      // Load template content based on document type
      const templates = {
        "Requête en réintégration": "REQUÊTE EN RÉINTÉGRATION\n\nMonsieur/Madame,\n\n",
        "Mémoire d'audience": "MÉMOIRE D'AUDIENCE\n\nIntroduction du dossier...\n\n",
        "Liste de jurisprudence": "LISTE DE JURISPRUDENCE\n\nPrécédents pertinents:\n\n",
        "Documents découverte": "DOCUMENTS DÉCOUVERTE\n\n",
        "Motion for reinstatement": "MOTION FOR REINSTATEMENT\n\nYour Honour,\n\n",
        "Hearing brief": "HEARING BRIEF\n\nIntroduction...\n\n",
      };
      setDocumentContent(templates[doc.name] || "");
      setTemplateSelected(true);
      sessionStorage.removeItem("editingDoc");
    }
  }, []);

  const handleTemplateSelected = (template) => {
    setDocType(template.category || "motion");
    setDocumentContent(template.content);
    setTemplateSelected(true);
  };

  const handleCancelTemplate = () => {
    onNav("dossiers");
  };

  // Si pas de template sélectionné, afficher le sélecteur
  if (!templateSelected) {
    return (
      <>
        <TemplateSelector lang={lang} onSelect={handleTemplateSelected} onCancel={handleCancelTemplate} onOpenOfficial={() => setShowOfficialTemplates(true)} />
        {showOfficialTemplates && (
          <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 3000, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}>
            <div style={{ background: "white", borderRadius: 12, padding: "24px", maxHeight: "90vh", width: "100%", maxWidth: 600, overflow: "auto", boxShadow: "0 10px 40px rgba(0,0,0,0.3)" }}>
              <h2 style={{ fontSize: 18, fontWeight: 700, color: "#0E1626", marginBottom: 20, marginTop: 0 }}>
                🌐 {lang === "en" ? "Official Templates" : "Modèles officiels"}
              </h2>
              <OfficialTemplates 
                lang={lang} 
                onSelectTemplate={(template) => {
                  setDocumentContent(`[${template.name[lang] || template.name.en}]\n\n`);
                  setTemplateSelected(true);
                  setShowOfficialTemplates(false);
                }}
                onClose={() => setShowOfficialTemplates(false)}
              />
            </div>
          </div>
        )}
      </>
    );
  }

  const CASE_CONTEXT = {
    "dossier-dupont": { title: "Dupont c. Industries XYZ", file: "500-17-128744-241", plaintiff: "Pierre Dupont", defendant: "Industries XYZ Inc.", area: "Labour", issue: "Wrongful dismissal without just cause", court: { fr: "Cour supérieure du Québec", en: "Quebec Superior Court" } },
    "dossier-tremblay": { title: "Tremblay c. PG du Québec", file: "200-12-088210-244", plaintiff: "Sophie Tremblay", defendant: "PG du Québec", area: "Family", issue: "Child custody and support", court: { fr: "Cour supérieure du Québec", en: "Quebec Superior Court" } },
    "dossier-lapointe": { title: "Lapointe c. CHUM", file: "500-17-130044-258", plaintiff: "Marc Lapointe", defendant: "CHUM", area: "Medical", issue: "Medical malpractice and damages", court: { fr: "Cour supérieure du Québec", en: "Quebec Superior Court" } },
  };

  const caseData = CASE_CONTEXT[screenId] || CASE_CONTEXT["dossier-dupont"];

  const docTypeLabels = { motion: { fr: "Requête", en: "Motion" }, brief: { fr: "Mémoire d'audience", en: "Hearing brief" }, appeal: { fr: "Mémoire d'appel", en: "Appeal brief" }, contract: { fr: "Contrat", en: "Contract" } };

  const tone = tweaks?.tone || "associate";

  // Handle text selection
  const handleEditorMouseUp = () => {
    const selection = window.getSelection();
    const text = selection.toString().trim();
    
    if (text.length > 0) {
      setSelectedText(text);
      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();
      setToolbarPos({ top: rect.top - 60, left: rect.left + rect.width / 2 });
      setShowToolbar(true);
    } else {
      setShowToolbar(false);
    }
  };

  // Expand selected text with AI
  const expandSelectedText = async () => {
    if (!selectedText.trim()) return;
    
    setGenerating(true);
    setShowToolbar(false);

    const expandPrompt = lang === "fr"
      ? `Tu es un avocat québécois. L'avocat a écrit: "${selectedText}" pour ce dossier: ${caseData.title}. Issue: ${caseData.issue}. Développe ce concept en un ou deux paragraphes professionnels. Ton: ${tone}. Réponds en français, 150-200 mots. Juste le texte.`
      : `You are a Canadian lawyer. The lawyer wrote: "${selectedText}" for this case: ${caseData.title}. Issue: ${caseData.issue}. Develop into one or two professional paragraphs. Tone: ${tone}. Respond in English, 150-200 words. Just the text.`;

    try {
      const expandedText = await window.claude.complete(expandPrompt);
      const selection = window.getSelection();
      if (selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        const span = document.createElement('span');
        span.style.fontStyle = 'italic';
        span.style.color = '#2B5FA8';
        span.textContent = expandedText;
        range.deleteContents();
        range.insertNode(span);
        selection.removeAllRanges();
        setSelectedText("");
      }
    } catch (err) {
      console.error("AI expansion failed:", err);
    }

    setGenerating(false);
  };

  const execCommand = (cmd, value = null) => {
    document.execCommand(cmd, false, value);
    editorRef.current?.focus();
  };

  const applyFontSize = (size) => {
    setFontSize(size);
    execCommand('fontSize', size);
  };

  const applyFontFamily = (family) => {
    setFontFamily(family);
    execCommand('fontName', family);
  };

  const applyTextColor = (color) => {
    setTextColor(color);
    execCommand('foreColor', color);
  };

  const applyAlignment = (alignment) => {
    execCommand('justify' + alignment);
  };

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0, minHeight: 0, background: "#F5F5F5" }}>
      {/* RIBBON MENU — Like Microsoft Word */}
      <div style={{ background: "#2B5FA8", color: "#FBF8F2", padding: "0 24px", display: "flex", alignItems: "center", height: 44, gap: 32, fontSize: 13, fontWeight: 500, borderBottom: "1px solid #1F3F66" }}>
        <button style={{ background: "transparent", color: "#FBF8F2", border: 0, cursor: "pointer", fontWeight: 600, padding: "8px 0", transition: "opacity 120ms" }} onMouseEnter={(e) => e.target.style.opacity = "0.8"} onMouseLeave={(e) => e.target.style.opacity = "1"}>
          {lang === "en" ? "File" : "Fichier"}
        </button>
        <button style={{ background: "transparent", color: "#FBF8F2", border: 0, cursor: "pointer", fontWeight: 600, padding: "8px 0", transition: "opacity 120ms" }} onMouseEnter={(e) => e.target.style.opacity = "0.8"} onMouseLeave={(e) => e.target.style.opacity = "1"}>
          {lang === "en" ? "Home" : "Accueil"}
        </button>
        <button style={{ background: "transparent", color: "#FBF8F2", border: 0, cursor: "pointer", fontWeight: 500, padding: "8px 0", opacity: 0.9, transition: "opacity 120ms" }} onMouseEnter={(e) => e.target.style.opacity = "1"} onMouseLeave={(e) => e.target.style.opacity = "0.9"}>
          {lang === "en" ? "Insert" : "Insertion"}
        </button>
        <button style={{ background: "transparent", color: "#FBF8F2", border: 0, cursor: "pointer", fontWeight: 500, padding: "8px 0", opacity: 0.9, transition: "opacity 120ms" }} onMouseEnter={(e) => e.target.style.opacity = "1"} onMouseLeave={(e) => e.target.style.opacity = "0.9"}>
          {lang === "en" ? "Page layout" : "Mise en page"}
        </button>
        <button style={{ background: "transparent", color: "#FBF8F2", border: 0, cursor: "pointer", fontWeight: 500, padding: "8px 0", opacity: 0.9, transition: "opacity 120ms" }} onMouseEnter={(e) => e.target.style.opacity = "1"} onMouseLeave={(e) => e.target.style.opacity = "0.9"}>
          {lang === "en" ? "References" : "Références"}
        </button>
        <button style={{ background: "transparent", color: "#FBF8F2", border: 0, cursor: "pointer", fontWeight: 500, padding: "8px 0", opacity: 0.9, transition: "opacity 120ms" }} onMouseEnter={(e) => e.target.style.opacity = "1"} onMouseLeave={(e) => e.target.style.opacity = "0.9"}>
          {lang === "en" ? "Review" : "Révision"}
        </button>
        <button style={{ background: "transparent", color: "#FBF8F2", border: 0, cursor: "pointer", fontWeight: 500, padding: "8px 0", opacity: 0.9, transition: "opacity 120ms" }} onMouseEnter={(e) => e.target.style.opacity = "1"} onMouseLeave={(e) => e.target.style.opacity = "0.9"}>
          {lang === "en" ? "View" : "Affichage"}
        </button>
        <div style={{ marginLeft: "auto" }}/>
        <div style={{ fontSize: 12, fontWeight: 600 }}>📋 LexiBridge</div>
      </div>

      {/* TOP BAR — Title & Close/Save */}
      <div style={{ background: "var(--bg-app)", borderBottom: "1px solid var(--border-1)", padding: "12px 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <Overline style={{ marginBottom: 3 }}>{lang === "en" ? "Document editor" : "Rédacteur de documents"}</Overline>
          <h2 style={{ fontFamily: "var(--font-display)", fontStyle: "italic", fontSize: 18, color: "var(--ink-950)", margin: 0 }}>
            {tr(docTypeLabels[docType], lang)}
          </h2>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={() => onNav("dossiers")} style={{ padding: "8px 14px", borderRadius: 6, border: "1px solid var(--border-2)", background: "var(--paper)", cursor: "pointer", fontSize: 12, fontWeight: 600, color: "var(--ink-900)" }}>
            {lang === "en" ? "Close" : "Fermer"}
          </button>
          <button style={{ padding: "8px 14px", borderRadius: 6, border: 0, background: "#7A1F2B", color: "#FBF8F2", cursor: "pointer", fontSize: 12, fontWeight: 600 }}>
            {lang === "en" ? "Save & export" : "Enregistrer & exporter"}
          </button>
        </div>
      </div>

      {/* FORMATTING TOOLBAR — Like Word */}
      <div style={{ background: "var(--paper)", borderBottom: "1px solid var(--border-1)", padding: "10px 24px", display: "flex", gap: 16, alignItems: "center", flexWrap: "wrap" }}>
        
        {/* Text formatting */}
        <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
          <button onClick={() => execCommand('bold')} title="Bold (Ctrl+B)" style={{ padding: "6px 10px", borderRadius: 4, border: "1px solid var(--border-2)", background: "transparent", color: "var(--ink-900)", cursor: "pointer", fontWeight: 700, fontSize: 12, transition: "all 120ms" }} onMouseEnter={(e) => e.target.style.background = "var(--ink-50)"} onMouseLeave={(e) => e.target.style.background = "transparent"}>
            B
          </button>
          <button onClick={() => execCommand('italic')} title="Italic (Ctrl+I)" style={{ padding: "6px 10px", borderRadius: 4, border: "1px solid var(--border-2)", background: "transparent", color: "var(--ink-900)", cursor: "pointer", fontStyle: "italic", fontWeight: 600, fontSize: 12, transition: "all 120ms" }} onMouseEnter={(e) => e.target.style.background = "var(--ink-50)"} onMouseLeave={(e) => e.target.style.background = "transparent"}>
            I
          </button>
          <button onClick={() => execCommand('underline')} title="Underline (Ctrl+U)" style={{ padding: "6px 10px", borderRadius: 4, border: "1px solid var(--border-2)", background: "transparent", color: "var(--ink-900)", cursor: "pointer", fontWeight: 600, fontSize: 12, textDecoration: "underline", transition: "all 120ms" }} onMouseEnter={(e) => e.target.style.background = "var(--ink-50)"} onMouseLeave={(e) => e.target.style.background = "transparent"}>
            U
          </button>
        </div>

        <div style={{ width: 1, height: 20, background: "var(--border-1)" }}/>

        {/* Font family dropdown */}
        <select value={fontFamily} onChange={(e) => applyFontFamily(e.target.value)} style={{ padding: "6px 10px", borderRadius: 4, border: "1px solid var(--border-2)", background: "var(--paper)", color: "var(--ink-900)", cursor: "pointer", fontSize: 12, fontFamily: "var(--font-sans)" }}>
          <option value="georgia">Georgia</option>
          <option value="times">Times New Roman</option>
          <option value="courier">Courier New</option>
          <option value="arial">Arial</option>
        </select>

        {/* Font size dropdown */}
        <select value={fontSize} onChange={(e) => applyFontSize(e.target.value)} style={{ padding: "6px 10px", borderRadius: 4, border: "1px solid var(--border-2)", background: "var(--paper)", color: "var(--ink-900)", cursor: "pointer", fontSize: 12 }}>
          {["9", "10", "11", "12", "13", "14", "16", "18", "20", "24", "28", "32"].map(s => <option key={s} value={s}>{s}</option>)}
        </select>

        {/* Text color */}
        <input type="color" value={textColor} onChange={(e) => applyTextColor(e.target.value)} title="Text color" style={{ width: 32, height: 32, borderRadius: 4, border: "1px solid var(--border-2)", cursor: "pointer", padding: 2 }}/>

        <div style={{ width: 1, height: 20, background: "var(--border-1)" }}/>

        {/* Alignment */}
        <button onClick={() => applyAlignment('Left')} title="Align left" style={{ padding: "6px 10px", borderRadius: 4, border: "1px solid var(--border-2)", background: "transparent", color: "var(--ink-900)", cursor: "pointer", fontSize: 12, transition: "all 120ms" }} onMouseEnter={(e) => e.target.style.background = "var(--ink-50)"} onMouseLeave={(e) => e.target.style.background = "transparent"}>
          ⬅
        </button>
        <button onClick={() => applyAlignment('Center')} title="Align center" style={{ padding: "6px 10px", borderRadius: 4, border: "1px solid var(--border-2)", background: "transparent", color: "var(--ink-900)", cursor: "pointer", fontSize: 12, transition: "all 120ms" }} onMouseEnter={(e) => e.target.style.background = "var(--ink-50)"} onMouseLeave={(e) => e.target.style.background = "transparent"}>
          ↔
        </button>
        <button onClick={() => applyAlignment('Right')} title="Align right" style={{ padding: "6px 10px", borderRadius: 4, border: "1px solid var(--border-2)", background: "transparent", color: "var(--ink-900)", cursor: "pointer", fontSize: 12, transition: "all 120ms" }} onMouseEnter={(e) => e.target.style.background = "var(--ink-50)"} onMouseLeave={(e) => e.target.style.background = "transparent"}>
          ➡
        </button>
        <button onClick={() => applyAlignment('Justify')} title="Justify" style={{ padding: "6px 10px", borderRadius: 4, border: "1px solid var(--border-2)", background: "transparent", color: "var(--ink-900)", cursor: "pointer", fontSize: 12, transition: "all 120ms" }} onMouseEnter={(e) => e.target.style.background = "var(--ink-50)"} onMouseLeave={(e) => e.target.style.background = "transparent"}>
          ≡
        </button>

        <div style={{ width: 1, height: 20, background: "var(--border-1)" }}/>

        {/* Lists */}
        <button onClick={() => execCommand('insertUnorderedList')} title="Bullet list" style={{ padding: "6px 10px", borderRadius: 4, border: "1px solid var(--border-2)", background: "transparent", color: "var(--ink-900)", cursor: "pointer", fontSize: 12, transition: "all 120ms" }} onMouseEnter={(e) => e.target.style.background = "var(--ink-50)"} onMouseLeave={(e) => e.target.style.background = "transparent"}>
          • List
        </button>
        <button onClick={() => execCommand('insertOrderedList')} title="Numbered list" style={{ padding: "6px 10px", borderRadius: 4, border: "1px solid var(--border-2)", background: "transparent", color: "var(--ink-900)", cursor: "pointer", fontSize: 12, transition: "all 120ms" }} onMouseEnter={(e) => e.target.style.background = "var(--ink-50)"} onMouseLeave={(e) => e.target.style.background = "transparent"}>
          1. List
        </button>

        {/* Indentation */}
        <button onClick={() => execCommand('indent')} title="Increase indent" style={{ padding: "6px 10px", borderRadius: 4, border: "1px solid var(--border-2)", background: "transparent", color: "var(--ink-900)", cursor: "pointer", fontSize: 12, transition: "all 120ms" }} onMouseEnter={(e) => e.target.style.background = "var(--ink-50)"} onMouseLeave={(e) => e.target.style.background = "transparent"}>
          ↦
        </button>
        <button onClick={() => execCommand('outdent')} title="Decrease indent" style={{ padding: "6px 10px", borderRadius: 4, border: "1px solid var(--border-2)", background: "transparent", color: "var(--ink-900)", cursor: "pointer", fontSize: 12, transition: "all 120ms" }} onMouseEnter={(e) => e.target.style.background = "var(--ink-50)"} onMouseLeave={(e) => e.target.style.background = "transparent"}>
          ↤
        </button>

        <div style={{ marginLeft: "auto" }}/>

        {/* Undo/Redo */}
        <button onClick={() => execCommand('undo')} title="Undo" style={{ padding: "6px 10px", borderRadius: 4, border: "1px solid var(--border-2)", background: "transparent", color: "var(--ink-900)", cursor: "pointer", fontSize: 12, transition: "all 120ms" }} onMouseEnter={(e) => e.target.style.background = "var(--ink-50)"} onMouseLeave={(e) => e.target.style.background = "transparent"}>
          ↶
        </button>
        <button onClick={() => execCommand('redo')} title="Redo" style={{ padding: "6px 10px", borderRadius: 4, border: "1px solid var(--border-2)", background: "transparent", color: "var(--ink-900)", cursor: "pointer", fontSize: 12, transition: "all 120ms" }} onMouseEnter={(e) => e.target.style.background = "var(--ink-50)"} onMouseLeave={(e) => e.target.style.background = "transparent"}>
          ↷
        </button>
      </div>

      {/* DOCUMENT AREA — Multi-page like Word */}
      <div style={{ flex: 1, overflow: "auto", padding: "40px 20px", display: "flex", flexDirection: "column", alignItems: "center", background: "#D3D3D3", gap: 20 }}>
        
        {/* PAGE 1 */}
        <div style={{ width: "950px", minHeight: "1200px", background: "white", boxShadow: "0 4px 12px rgba(0,0,0,0.2)", padding: "60px 60px", fontFamily: "Georgia, serif", fontSize: "12pt", lineHeight: 1.6, color: "var(--ink-950)" }}>
          {/* COURT HEADER */}
          <div style={{ textAlign: "center", marginBottom: 40, paddingBottom: 20, borderBottom: "1px solid var(--border-1)" }}>
            <div style={{ fontSize: 11, fontWeight: "bold", letterSpacing: "0.1em", color: "var(--ink-900)", marginBottom: 8, textTransform: "uppercase" }}>
              {tr(caseData.court, lang)}
            </div>
            <div style={{ fontSize: 11, fontFamily: "monospace", color: "var(--ink-700)", marginBottom: 12 }}>
              {caseData.file}
            </div>
          </div>

          {/* CONTENTEDITABLE DOCUMENT */}
          <div
            ref={editorRef}
            contentEditable
            onMouseUp={handleEditorMouseUp}
            suppressContentEditableWarning
            style={{ outline: "none" }}
          >
            <p style={{ textAlign: "center", fontWeight: "bold", marginBottom: 24, fontSize: "14pt" }}>
              {lang === "en" ? "MOTION" : "REQUÊTE"}
            </p>
            <p style={{ marginBottom: 16, textAlign: "justify" }}>
              {lang === "en" 
                ? `Your client, ${caseData.plaintiff}, brings this motion in respect of the dispute with ${caseData.defendant} concerning ${caseData.issue}.`
                : `Votre client, ${caseData.plaintiff}, présente cette requête au sujet du différend avec ${caseData.defendant} concernant ${caseData.issue}.`}
            </p>
            <p style={{ marginBottom: 16, textAlign: "justify" }}>
              {lang === "en"
                ? "Start typing or pasting your document here. Format using the toolbar above. As you add more content, additional pages will be created."
                : "Commencez à taper ou collez votre document ici. Formatez à l'aide de la barre d'outils. De nouvelles pages seront créées automatiquement."}
            </p>
            <p style={{ marginBottom: 16, textAlign: "justify" }}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
            </p>
            <p style={{ marginBottom: 16, textAlign: "justify" }}>
              Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.
            </p>
            <p style={{ marginBottom: 16, textAlign: "justify" }}>
              Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit.
            </p>
          </div>

          {/* PAGE NUMBER */}
          <div style={{ textAlign: "center", fontSize: 10, color: "var(--ink-500)", borderTop: "1px solid var(--border-1)", paddingTop: 16, marginTop: 40 }}>
            1
          </div>
        </div>

        {/* PAGE 2 */}
        <div style={{ width: "950px", minHeight: "1200px", background: "white", boxShadow: "0 4px 12px rgba(0,0,0,0.2)", padding: "60px 60px", fontFamily: "Georgia, serif", fontSize: "12pt", lineHeight: 1.6, color: "var(--ink-950)" }}>
          <div style={{ marginBottom: 16, textAlign: "justify" }}>
            <p style={{ marginBottom: 16, textAlign: "justify" }}>
              Sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur.
            </p>
            <p style={{ marginBottom: 16, textAlign: "justify" }}>
              Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur. At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti.
            </p>
            <p style={{ marginBottom: 16, textAlign: "justify" }}>
              Quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus.
            </p>
            <p style={{ marginBottom: 16, textAlign: "justify" }}>
              Omnis voluptas assumenda est, omnis dolor repellendus. Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et voluptates repudiandae sint et molestiae non recusandae. Itaque earum rerum hic tenetur a sapiente delectus.
            </p>
          </div>

          {/* PAGE NUMBER */}
          <div style={{ textAlign: "center", fontSize: 10, color: "var(--ink-500)", borderTop: "1px solid var(--border-1)", paddingTop: 16, marginTop: 40 }}>
            2
          </div>
        </div>

        {/* PAGE 3 */}
        <div style={{ width: "950px", minHeight: "1200px", background: "white", boxShadow: "0 4px 12px rgba(0,0,0,0.2)", padding: "60px 60px", fontFamily: "Georgia, serif", fontSize: "12pt", lineHeight: 1.6, color: "var(--ink-950)" }}>
          <div style={{ marginBottom: 16, textAlign: "justify", color: "var(--ink-600)" }}>
            <p style={{ marginBottom: 16, textAlign: "justify", fontStyle: "italic" }}>
              {lang === "en" ? "Additional pages will appear as needed. You can add more content to any page above." : "Des pages supplémentaires apparaîtront selon les besoins. Vous pouvez ajouter du contenu à n'importe quelle page ci-dessus."}
            </p>
          </div>

          {/* PAGE NUMBER */}
          <div style={{ textAlign: "center", fontSize: 10, color: "var(--ink-500)", borderTop: "1px solid var(--border-1)", paddingTop: 16, marginTop: 40 }}>
            3
          </div>
        </div>

      </div>

      {/* Floating expand toolbar */}
      {showToolbar && selectedText && (
        <div style={{
          position: "fixed", top: toolbarPos.top, left: toolbarPos.left, transform: "translateX(-50%)", zIndex: 1000,
          background: "#2B5FA8", color: "#FBF8F2", padding: "8px 12px", borderRadius: 6, boxShadow: "0 4px 12px rgba(0,0,0,0.2)", display: "flex", alignItems: "center", gap: 10, fontSize: 13, fontWeight: 600,
        }}>
          {generating ? (
            <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span className="lb-thinking-dot" style={{ display: "inline-block", width: 6, height: 6, borderRadius: "50%", background: "#FBF8F2" }}></span>
              {lang === "en" ? "Expanding..." : "Développement..."}
            </span>
          ) : (
            <>
              <span>✨</span>
              <button onClick={expandSelectedText} style={{ background: "transparent", color: "#FBF8F2", border: 0, cursor: "pointer", fontWeight: 600, fontSize: 13, padding: 0 }}>
                {lang === "en" ? "Expand" : "Développer"}
              </button>
            </>
          )}
        </div>
      )}
      {/* Official Templates Modal */}
      {showOfficialTemplates && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 3000, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}>
          <div style={{ background: "white", borderRadius: 12, padding: "24px", maxHeight: "90vh", width: "100%", maxWidth: 600, overflow: "auto", boxShadow: "0 10px 40px rgba(0,0,0,0.3)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <h2 style={{ fontSize: 18, fontWeight: 700, color: "#0E1626", margin: 0 }}>
                🌐 {lang === "en" ? "Official Templates" : "Modèles officiels"}
              </h2>
              <button onClick={() => setShowOfficialTemplates(false)} style={{ background: "transparent", border: 0, cursor: "pointer", fontSize: 20 }}>✕</button>
            </div>
            <OfficialTemplates 
              lang={lang} 
              onSelectTemplate={(template) => {
                setDocumentContent(`[${template.name[lang] || template.name.en}]\n\n`);
                setShowOfficialTemplates(false);
              }}
              onClose={() => setShowOfficialTemplates(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

Object.assign(window, { DocumentEditor });
