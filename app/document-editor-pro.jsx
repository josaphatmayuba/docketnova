/* eslint-disable */
// Document Editor PRO — Full Microsoft Word features for legal documents

const DocumentEditorPro = ({ lang, screenId, onNav, tweaks }) => {
  const isMobile = useIsMobile(768);
  const [docType, setDocType] = React.useState("motion");
  const [fontSize, setFontSize] = React.useState("12");
  const [fontFamily, setFontFamily] = React.useState("georgia");
  const [textColor, setTextColor] = React.useState("#000000");
  const [wordCount, setWordCount] = React.useState(0);
  const [pageCount, setPageCount] = React.useState(1);
  const [showFindReplace, setShowFindReplace] = React.useState(false);
  const [findText, setFindText] = React.useState("");
  const [replaceText, setReplaceText] = React.useState("");
  const [trackChanges, setTrackChanges] = React.useState(false);
  const [showStyles, setShowStyles] = React.useState(true);
  const [templateSelected, setTemplateSelected] = React.useState(false);
  const [showOfficialTemplates, setShowOfficialTemplates] = React.useState(false);
  const [currentStyle, setCurrentStyle] = React.useState("body");
  const [selectedText, setSelectedText] = React.useState("");
  const [showAIToolbar, setShowAIToolbar] = React.useState(false);
  const [aiToolbarPos, setAIToolbarPos] = React.useState({ top: 0, left: 0 });
  const [generating, setGenerating] = React.useState(false);
  const [showHeaderFooterPanel, setShowHeaderFooterPanel] = React.useState(false);
  const [headerText, setHeaderText] = React.useState("");
  const [footerText, setFooterText] = React.useState("");
  const [pageNumbering, setPageNumbering] = React.useState(true);
  const [pageNumberPos, setPageNumberPos] = React.useState("bottom-right");
  const [showFootnotesPanel, setShowFootnotesPanel] = React.useState(false);
  const [footnotes, setFootnotes] = React.useState([]);
  const [footnoteMode, setFootnoteMode] = React.useState("footnote"); // "footnote" or "endnote"
  const [nextFootnoteNum, setNextFootnoteNum] = React.useState(1);

  const editorRef = React.useRef(null);

  // Legal document styles
  const LEGAL_STYLES = {
    h1: { fr: "Titre 1", en: "Heading 1", fontSize: "18pt", fontWeight: "bold", marginBottom: "12px", marginTop: "18px" },
    h2: { fr: "Titre 2", en: "Heading 2", fontSize: "16pt", fontWeight: "bold", marginBottom: "10px", marginTop: "14px" },
    h3: { fr: "Titre 3", en: "Heading 3", fontSize: "14pt", fontWeight: "bold", marginBottom: "8px", marginTop: "12px" },
    body: { fr: "Corps de texte", en: "Body text", fontSize: "12pt", marginBottom: "8px" },
    citation: { fr: "Citation juridique", en: "Legal citation", fontSize: "11pt", fontFamily: "monospace", color: "#2B5FA8", marginBottom: "6px" },
    caseName: { fr: "Nom de l'affaire", en: "Case name", fontSize: "12pt", fontStyle: "italic", fontWeight: "500", color: "#7A1F2B" },
    statute: { fr: "Loi/Jurisprudence", en: "Statute/Law", fontSize: "12pt", fontWeight: "bold", color: "#2B5FA8" },
  };

  React.useEffect(() => {
    const storedDoc = sessionStorage.getItem("editingDoc");
    if (storedDoc) {
      const doc = JSON.parse(storedDoc);
      setTemplateSelected(true);
      sessionStorage.removeItem("editingDoc");
    }
  }, []);

  // Count words
  React.useEffect(() => {
    if (editorRef.current) {
      const text = editorRef.current.innerText || "";
      const words = text.trim().split(/\s+/).filter(w => w.length > 0).length;
      setWordCount(words);
      
      // Estimate pages (250 words per page)
      const pages = Math.ceil(words / 250);
      setPageCount(pages);
    }
  }, []);

  const handleTemplateSelected = (template) => {
    setDocType(template.category || "motion");
    setTemplateSelected(true);
  };

  const execCommand = (cmd, value = null) => {
    document.execCommand(cmd, false, value);
    editorRef.current?.focus();
  };

  const applyStyle = (styleName) => {
    const style = LEGAL_STYLES[styleName];
    if (style) {
      setCurrentStyle(styleName);
      let styleString = `font-size: ${style.fontSize || "12pt"};`;
      if (style.fontWeight) styleString += `font-weight: ${style.fontWeight};`;
      if (style.fontStyle) styleString += `font-style: ${style.fontStyle};`;
      if (style.fontFamily) styleString += `font-family: ${style.fontFamily};`;
      if (style.color) styleString += `color: ${style.color};`;
      
      const selection = window.getSelection();
      if (selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        const span = document.createElement('span');
        span.setAttribute('style', styleString);
        span.setAttribute('class', `style-${styleName}`);
        range.surroundContents(span);
      }
    }
  };

  const findAndReplace = () => {
    if (!findText.trim()) return;
    
    const text = editorRef.current.innerText;
    const newText = text.replaceAll(findText, replaceText);
    editorRef.current.innerText = newText;
    setShowFindReplace(false);
  };

  const findNext = () => {
    const text = editorRef.current.innerText;
    const index = text.indexOf(findText);
    if (index !== -1) {
      const range = document.createRange();
      range.setStart(editorRef.current, 0);
      range.setEnd(editorRef.current, findText.length);
      const selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(range);
    }
  };

  // Insert footnote/endnote
  const insertFootnote = () => {
    const newFootnote = {
      id: nextFootnoteNum,
      type: footnoteMode,
      text: "",
      timestamp: new Date().toLocaleString(lang === "en" ? "en-CA" : "fr-CA")
    };
    setFootnotes([...footnotes, newFootnote]);
    setNextFootnoteNum(nextFootnoteNum + 1);

    // Insert reference in editor
    if (editorRef.current) {
      const sup = document.createElement('sup');
      sup.style.color = "#2B5FA8";
      sup.style.cursor = "pointer";
      sup.style.fontWeight = "bold";
      sup.textContent = nextFootnoteNum;
      sup.title = `${footnoteMode === "footnote" ? "Footnote" : "Endnote"} ${nextFootnoteNum}`;
      sup.onclick = () => setShowFootnotesPanel(true);
      
      const selection = window.getSelection();
      if (selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        range.insertNode(sup);
      }
    }
  };

  // Handle text selection for AI expansion
  const handleEditorMouseUp = React.useCallback(() => {
    const selection = window.getSelection();
    const text = selection.toString().trim();
    
    if (text.length > 0) {
      setSelectedText(text);
    } else {
      setSelectedText("");
      setShowAIToolbar(false);
    }
  }, []);

  // Expand selected text with AI
  const expandSelectedText = async () => {
    if (!selectedText.trim()) return;
    
    setGenerating(true);
    setShowAIToolbar(false);

    const expandPrompt = lang === "fr"
      ? `Tu es un avocat québécois expert en rédaction juridique. L'avocat a écrit: "${selectedText}". Développe ce concept en 2-3 paragraphes professionnels et persuasifs. Utilise un ton formel et précis. Réponds en français, 200-300 mots. Juste le texte développé.`
      : `You are a Canadian legal expert. The lawyer wrote: "${selectedText}". Develop this concept into 2-3 professional paragraphs. Use formal and precise language. Respond in English, 200-300 words. Just the developed text.`;

    try {
      const expandedText = await window.claude.complete(expandPrompt);
      const selection = window.getSelection();
      if (selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        const span = document.createElement('span');
        span.style.color = '#2B5FA8';
        span.style.fontStyle = 'italic';
        span.textContent = ' ' + expandedText;
        range.collapse(false);
        range.insertNode(span);
        selection.removeAllRanges();
        setSelectedText("");
      }
    } catch (err) {
      console.error("AI expansion failed:", err);
    }

    setGenerating(false);
  };

  if (!templateSelected) {
    return (
      <>
        <TemplateSelector lang={lang} onSelect={handleTemplateSelected} onCancel={() => onNav("dossiers")} onOpenOfficial={() => setShowOfficialTemplates(true)} />
        {showOfficialTemplates && (
          <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 3000, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}>
            <div style={{ background: "white", borderRadius: 12, padding: "24px", maxHeight: "90vh", width: "100%", maxWidth: 600, overflow: "auto", boxShadow: "0 10px 40px rgba(0,0,0,0.3)" }}>
              <OfficialTemplates lang={lang} onSelectTemplate={() => setTemplateSelected(true)} onClose={() => setShowOfficialTemplates(false)} />
            </div>
          </div>
        )}
      </>
    );
  }

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0, minHeight: 0, background: "#F5F5F5" }}>
      {/* RIBBON MENU */}
      <div style={{ background: "#2B5FA8", color: "#FBF8F2", padding: isMobile ? "0 14px" : "0 24px", display: "flex", alignItems: "center", height: 44, gap: isMobile ? 18 : 32, fontSize: 13, fontWeight: 500, borderBottom: "1px solid #1F3F66", overflowX: "auto", flexShrink: 0 }}>
        <button style={{ background: "transparent", color: "#FBF8F2", border: 0, cursor: "pointer", fontWeight: 600, padding: "8px 0" }}>
          {lang === "en" ? "File" : "Fichier"}
        </button>
        <button style={{ background: "transparent", color: "#FBF8F2", border: 0, cursor: "pointer", fontWeight: 600, padding: "8px 0" }}>
          {lang === "en" ? "Home" : "Accueil"}
        </button>
        <button style={{ background: "transparent", color: "#FBF8F2", border: 0, cursor: "pointer", fontWeight: 500, padding: "8px 0", opacity: 0.9 }}>
          {lang === "en" ? "Insert" : "Insertion"}
        </button>
        <button style={{ background: "transparent", color: "#FBF8F2", border: 0, cursor: "pointer", fontWeight: 500, padding: "8px 0", opacity: 0.9 }}>
          {lang === "en" ? "Review" : "Révision"}
        </button>
        <div style={{ marginLeft: "auto" }}/>
        <span style={{ fontSize: 12, fontWeight: 600 }}>📋 LexiBridge</span>
      </div>

      {/* TOP BAR */}
      <div style={{ background: "var(--bg-app)", borderBottom: "1px solid var(--border-1)", padding: "10px 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", gap: 12, alignItems: "center", flex: 1 }}>
          <button onClick={() => setShowFindReplace(!showFindReplace)} style={{ padding: "6px 12px", borderRadius: 4, border: "1px solid var(--border-2)", background: "var(--paper)", cursor: "pointer", fontSize: 11, fontWeight: 600 }}>
            🔍 Find & Replace
          </button>
          <button onClick={() => setTrackChanges(!trackChanges)} style={{ padding: "6px 12px", borderRadius: 4, border: trackChanges ? "2px solid #7A1F2B" : "1px solid var(--border-2)", background: trackChanges ? "var(--oxblood-50)" : "var(--paper)", cursor: "pointer", fontSize: 11, fontWeight: 600, color: trackChanges ? "#7A1F2B" : "var(--ink-900)" }}>
            Track Changes
          </button>
          <button onClick={() => setShowHeaderFooterPanel(!showHeaderFooterPanel)} style={{ padding: "6px 12px", borderRadius: 4, border: showHeaderFooterPanel ? "2px solid #7A1F2B" : "1px solid var(--border-2)", background: showHeaderFooterPanel ? "var(--oxblood-50)" : "var(--paper)", cursor: "pointer", fontSize: 11, fontWeight: 600, color: showHeaderFooterPanel ? "#7A1F2B" : "var(--ink-900)" }}>
            📄 {lang === "en" ? "Header & Footer" : "En-tête & Pied"}
          </button>
          <button onClick={() => setShowFootnotesPanel(!showFootnotesPanel)} style={{ padding: "6px 12px", borderRadius: 4, border: showFootnotesPanel ? "2px solid #7A1F2B" : "1px solid var(--border-2)", background: showFootnotesPanel ? "var(--oxblood-50)" : "var(--paper)", cursor: "pointer", fontSize: 11, fontWeight: 600, color: showFootnotesPanel ? "#7A1F2B" : "var(--ink-900)" }}>
            📑 {lang === "en" ? "Footnotes & Endnotes" : "Notes & Renvois"}
          </button>
          <button onClick={insertFootnote} style={{ padding: "6px 12px", borderRadius: 4, border: "1px solid var(--border-2)", background: "var(--paper)", cursor: "pointer", fontSize: 11, fontWeight: 600 }}>
            + {lang === "en" ? "Insert footnote" : "Insérer note"}
          </button>
          <button onClick={expandSelectedText} disabled={!selectedText || generating} style={{ padding: "6px 12px", borderRadius: 4, border: "1px solid var(--border-2)", background: generating ? "var(--oxblood-50)" : selectedText ? "#2B5FA8" : "var(--paper)", color: selectedText ? "white" : "var(--ink-600)", cursor: selectedText && !generating ? "pointer" : "default", fontSize: 11, fontWeight: 600, opacity: !selectedText || generating ? 0.6 : 1 }}>
            {generating ? "⏳ " : "✨ "} {lang === "en" ? "Expand with AI" : "Développer avec IA"}
          </button>
        </div>
        <div style={{ display: "flex", gap: 16, fontSize: 11, color: "var(--ink-600)", fontWeight: 600 }}>
          <span>{wordCount} {lang === "en" ? "words" : "mots"}</span>
          <span>Page {pageCount}</span>
        </div>
      </div>

      {/* Find & Replace Panel */}
      {showFindReplace && (
        <div style={{ background: "var(--paper)", borderBottom: "1px solid var(--border-1)", padding: isMobile ? "12px 14px" : "12px 24px", display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
          <input
            type="text"
            placeholder={lang === "en" ? "Find…" : "Chercher…"}
            value={findText}
            onChange={(e) => setFindText(e.target.value)}
            style={{ padding: "6px 10px", borderRadius: 4, border: "1px solid var(--border-2)", fontSize: 12 }}
          />
          <input
            type="text"
            placeholder={lang === "en" ? "Replace with…" : "Remplacer par…"}
            value={replaceText}
            onChange={(e) => setReplaceText(e.target.value)}
            style={{ padding: "6px 10px", borderRadius: 4, border: "1px solid var(--border-2)", fontSize: 12 }}
          />
          <button onClick={findNext} style={{ padding: "6px 12px", borderRadius: 4, border: "1px solid var(--border-2)", background: "var(--paper)", cursor: "pointer", fontSize: 11, fontWeight: 600 }}>
            {lang === "en" ? "Find next" : "Suivant"}
          </button>
          <button onClick={findAndReplace} style={{ padding: "6px 12px", borderRadius: 4, border: 0, background: "#7A1F2B", color: "white", cursor: "pointer", fontSize: 11, fontWeight: 600 }}>
            {lang === "en" ? "Replace all" : "Remplacer tout"}
          </button>
          <button onClick={() => setShowFindReplace(false)} style={{ padding: "6px 12px", borderRadius: 4, border: "1px solid var(--border-2)", background: "var(--paper)", cursor: "pointer", fontSize: 11 }}>
            ✕
          </button>
        </div>
      )}

      {/* Header & Footer Panel */}
      {showHeaderFooterPanel && (
        <div style={{ background: "#F9F9F9", borderBottom: "1px solid var(--border-1)", padding: "16px 24px", display: "flex", flexDirection: "column", gap: 12 }}>
          <div>
            <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "var(--ink-600)", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.05em" }}>
              {lang === "en" ? "Header" : "En-tête"}
            </label>
            <textarea
              value={headerText}
              onChange={(e) => setHeaderText(e.target.value)}
              placeholder={lang === "en" ? "Enter header text (e.g. case name, date)…" : "Entrez le texte d'en-tête (p. ex. nom du dossier, date)…"}
              style={{ width: "100%", padding: "8px 10px", borderRadius: 4, border: "1px solid var(--border-2)", fontSize: 12, minHeight: 50, resize: "vertical", fontFamily: "var(--font-sans)" }}
            />
          </div>

          <div>
            <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "var(--ink-600)", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.05em" }}>
              {lang === "en" ? "Footer" : "Pied de page"}
            </label>
            <textarea
              value={footerText}
              onChange={(e) => setFooterText(e.target.value)}
              placeholder={lang === "en" ? "Enter footer text (e.g. file number, counsel name)…" : "Entrez le texte du pied (p. ex. numéro de dossier, avocat)…"}
              style={{ width: "100%", padding: "8px 10px", borderRadius: 4, border: "1px solid var(--border-2)", fontSize: 12, minHeight: 50, resize: "vertical", fontFamily: "var(--font-sans)" }}
            />
          </div>

          <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
            <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", fontSize: 12, fontWeight: 600 }}>
              <input 
                type="checkbox" 
                checked={pageNumbering} 
                onChange={(e) => setPageNumbering(e.target.checked)}
                style={{ width: 16, height: 16, cursor: "pointer" }}
              />
              {lang === "en" ? "Add page numbers" : "Ajouter la numérotation"}
            </label>
            {pageNumbering && (
              <select 
                value={pageNumberPos} 
                onChange={(e) => setPageNumberPos(e.target.value)}
                style={{ padding: "6px 10px", borderRadius: 4, border: "1px solid var(--border-2)", fontSize: 11, fontFamily: "var(--font-sans)" }}
              >
                <option value="bottom-right">{lang === "en" ? "Bottom right" : "Bas à droite"}</option>
                <option value="bottom-center">{lang === "en" ? "Bottom center" : "Bas au centre"}</option>
                <option value="bottom-left">{lang === "en" ? "Bottom left" : "Bas à gauche"}</option>
                <option value="top-right">{lang === "en" ? "Top right" : "Haut à droite"}</option>
                <option value="top-center">{lang === "en" ? "Top center" : "Haut au centre"}</option>
                <option value="top-left">{lang === "en" ? "Top left" : "Haut à gauche"}</option>
              </select>
            )}
          </div>

          <button onClick={() => setShowHeaderFooterPanel(false)} style={{ padding: "8px 12px", borderRadius: 4, border: 0, background: "#7A1F2B", color: "white", cursor: "pointer", fontSize: 11, fontWeight: 600, alignSelf: "flex-end" }}>
            {lang === "en" ? "Done" : "Terminé"}
          </button>
        </div>
      )}

      {/* Footnotes & Endnotes Panel */}
      {showFootnotesPanel && (
        <div style={{ background: "#F9F9F9", borderBottom: "1px solid var(--border-1)", padding: "16px 24px", display: "flex", flexDirection: "column", gap: 12, maxHeight: 300, overflow: "auto" }}>
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11, fontWeight: 600, cursor: "pointer" }}>
              <input 
                type="radio" 
                name="footnote-mode"
                value="footnote"
                checked={footnoteMode === "footnote"}
                onChange={(e) => setFootnoteMode(e.target.value)}
                style={{ cursor: "pointer" }}
              />
              {lang === "en" ? "Footnotes" : "Notes de bas de page"}
            </label>
            <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11, fontWeight: 600, cursor: "pointer" }}>
              <input 
                type="radio" 
                name="footnote-mode"
                value="endnote"
                checked={footnoteMode === "endnote"}
                onChange={(e) => setFootnoteMode(e.target.value)}
                style={{ cursor: "pointer" }}
              />
              {lang === "en" ? "Endnotes" : "Renvois"}
            </label>
          </div>

          <div style={{ borderTop: "1px solid var(--border-2)", paddingTop: 12 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "var(--ink-600)", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.05em" }}>
              {footnotes.length} {lang === "en" ? "notes" : "notes"}
            </div>
            {footnotes.length === 0 ? (
              <div style={{ fontSize: 11, color: "var(--ink-500)", fontStyle: "italic" }}>
                {lang === "en" ? "No notes yet. Click insert to add." : "Aucune note. Cliquez sur insérer pour en ajouter."}
              </div>
            ) : (
              footnotes.map((note) => (
                <div key={note.id} style={{ padding: "10px", background: "var(--paper)", borderRadius: 6, marginBottom: 8, borderLeft: "3px solid #2B5FA8" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                    <span style={{ fontSize: 11, fontWeight: 600, color: "var(--ink-900)" }}>
                      <sup style={{ color: "#2B5FA8", fontWeight: "bold" }}>{note.id}</sup> {note.type === "footnote" ? lang === "en" ? "Footnote" : "Note" : lang === "en" ? "Endnote" : "Renvoi"}
                    </span>
                    <button onClick={() => setFootnotes(footnotes.filter(f => f.id !== note.id))} style={{ background: "transparent", border: 0, color: "#7A1F2B", cursor: "pointer", fontSize: 12, fontWeight: 600 }}>
                      ✕
                    </button>
                  </div>
                  <textarea 
                    value={note.text}
                    onChange={(e) => {
                      const updatedNotes = footnotes.map(f => f.id === note.id ? {...f, text: e.target.value} : f);
                      setFootnotes(updatedNotes);
                    }}
                    placeholder={lang === "en" ? "Enter note text…" : "Entrez le texte de la note…"}
                    style={{ width: "100%", padding: "6px 8px", borderRadius: 4, border: "1px solid var(--border-2)", fontSize: 10, minHeight: 50, resize: "vertical", fontFamily: "var(--font-sans)", boxSizing: "border-box" }}
                  />
                  <div style={{ fontSize: 9, color: "var(--ink-500)", marginTop: 4 }}>
                    {note.timestamp}
                  </div>
                </div>
              ))
            )}
          </div>

          <button onClick={() => setShowFootnotesPanel(false)} style={{ padding: "8px 12px", borderRadius: 4, border: 0, background: "#7A1F2B", color: "white", cursor: "pointer", fontSize: 11, fontWeight: 600, alignSelf: "flex-end" }}>
            {lang === "en" ? "Done" : "Terminé"}
          </button>
        </div>
      )}

      {/* FORMATTING TOOLBAR */}
      <div style={{ background: "var(--paper)", borderBottom: "1px solid var(--border-1)", padding: "10px 24px", display: "flex", gap: 16, alignItems: "center", flexWrap: "wrap" }}>
        
        <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
          <button onClick={() => execCommand('bold')} style={{ padding: "6px 10px", borderRadius: 4, border: "1px solid var(--border-2)", background: "transparent", color: "var(--ink-900)", cursor: "pointer", fontWeight: 700, fontSize: 12 }}>
            B
          </button>
          <button onClick={() => execCommand('italic')} style={{ padding: "6px 10px", borderRadius: 4, border: "1px solid var(--border-2)", background: "transparent", color: "var(--ink-900)", cursor: "pointer", fontStyle: "italic", fontWeight: 600, fontSize: 12 }}>
            I
          </button>
          <button onClick={() => execCommand('underline')} style={{ padding: "6px 10px", borderRadius: 4, border: "1px solid var(--border-2)", background: "transparent", color: "var(--ink-900)", cursor: "pointer", fontWeight: 600, fontSize: 12, textDecoration: "underline" }}>
            U
          </button>
        </div>

        <div style={{ width: 1, height: 20, background: "var(--border-1)" }}/>

        <select value={fontFamily} onChange={(e) => execCommand('fontName', e.target.value)} style={{ padding: "6px 10px", borderRadius: 4, border: "1px solid var(--border-2)", background: "var(--paper)", color: "var(--ink-900)", cursor: "pointer", fontSize: 12 }}>
          <option value="georgia">Georgia</option>
          <option value="times">Times New Roman</option>
          <option value="courier">Courier New</option>
          <option value="arial">Arial</option>
        </select>

        <select value={fontSize} onChange={(e) => execCommand('fontSize', e.target.value)} style={{ padding: "6px 10px", borderRadius: 4, border: "1px solid var(--border-2)", background: "var(--paper)", color: "var(--ink-900)", cursor: "pointer", fontSize: 12 }}>
          {["9", "10", "11", "12", "13", "14", "16", "18", "20"].map(s => <option key={s} value={s}>{s}</option>)}
        </select>

        <input type="color" value={textColor} onChange={(e) => execCommand('foreColor', e.target.value)} title="Text color" style={{ width: 32, height: 32, borderRadius: 4, border: "1px solid var(--border-2)", cursor: "pointer", padding: 2 }}/>

        <div style={{ width: 1, height: 20, background: "var(--border-1)" }}/>

        <button onClick={() => execCommand('insertUnorderedList')} style={{ padding: "6px 10px", borderRadius: 4, border: "1px solid var(--border-2)", background: "transparent", color: "var(--ink-900)", cursor: "pointer", fontSize: 12 }}>
          • List
        </button>
        <button onClick={() => execCommand('insertOrderedList')} style={{ padding: "6px 10px", borderRadius: 4, border: "1px solid var(--border-2)", background: "transparent", color: "var(--ink-900)", cursor: "pointer", fontSize: 12 }}>
          1. List
        </button>
      </div>

      {/* MAIN LAYOUT — Sidebar + Editor (empilés sur mobile) */}
      <div style={{ flex: 1, display: "flex", flexDirection: isMobile ? "column" : "row", overflow: isMobile ? "auto" : "hidden", minWidth: 0 }}>

        {/* STYLES SIDEBAR */}
        {showStyles && (
          <div style={{ width: isMobile ? "100%" : "220px", flexShrink: 0,
                        background: "var(--paper)",
                        borderRight: isMobile ? "none" : "1px solid var(--border-1)",
                        borderBottom: isMobile ? "1px solid var(--border-1)" : "none",
                        overflow: "auto", padding: "16px 12px",
                        maxHeight: isMobile ? 160 : "none",
                        display: isMobile ? "flex" : "block", gap: isMobile ? 8 : 0, flexWrap: isMobile ? "wrap" : "nowrap" }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: "var(--ink-500)", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 12, width: isMobile ? "100%" : "auto" }}>
              {lang === "en" ? "Styles" : "Styles"}
            </div>
            {Object.entries(LEGAL_STYLES).map(([key, style]) => (
              <button key={key} onClick={() => applyStyle(key)} style={{
                width: isMobile ? "auto" : "100%", padding: "10px 12px", borderRadius: 6, border: currentStyle === key ? "2px solid #7A1F2B" : "1px solid transparent",
                background: currentStyle === key ? "var(--oxblood-50)" : "transparent", cursor: "pointer", textAlign: "left", marginBottom: isMobile ? 0 : 8,
                fontSize: 12, fontWeight: currentStyle === key ? 600 : 500, color: "var(--ink-900)", whiteSpace: "nowrap"
              }}>
                {tr(style, lang)}
              </button>
            ))}
          </div>
        )}

        {/* DOCUMENT AREA */}
        <div style={{ flex: 1, overflow: "auto", padding: isMobile ? "20px 10px" : "40px 20px", display: "flex", justifyContent: "center", background: "#D3D3D3" }}>
          <div style={{ width: isMobile ? "100%" : "950px", maxWidth: "100%", minHeight: isMobile ? "auto" : "1200px", background: "white", boxShadow: "0 4px 12px rgba(0,0,0,0.2)", padding: isMobile ? "24px 20px" : "60px 60px", fontFamily: "Georgia, serif", fontSize: "12pt", lineHeight: 1.6, color: "var(--ink-950)" }}>
            <div
              ref={editorRef}
              contentEditable
              suppressContentEditableWarning
              style={{ outline: "none", minHeight: "600px" }}
              onMouseUp={handleEditorMouseUp}
              onInput={() => {
                const text = editorRef.current.innerText;
                const words = text.trim().split(/\s+/).filter(w => w.length > 0).length;
                setWordCount(words);
                setPageCount(Math.ceil(words / 250));
              }}
            >
              <p style={{ textAlign: "center", fontWeight: "bold", marginBottom: 24, fontSize: "18pt" }}>
                {lang === "en" ? "MOTION" : "REQUÊTE"}
              </p>
              <p style={{ marginBottom: 16, textAlign: "justify" }}>
                {lang === "en" 
                  ? "Start typing your legal document here. Use the styles panel on the left to format your document professionally. All Word features are available."
                  : "Commencez à taper votre document juridique ici. Utilisez le panneau de styles à gauche pour formater votre document professionnellement."}
              </p>
            </div>

            {/* AI Expansion Toolbar */}
            {showAIToolbar && (
              <div
                style={{
                  position: "fixed",
                  top: aiToolbarPos.top,
                  left: aiToolbarPos.left,
                  transform: "translateX(-50%)",
                  background: "#2B5FA8",
                  color: "white",
                  padding: "8px 12px",
                  borderRadius: "6px",
                  fontSize: "13px",
                  fontWeight: 500,
                  zIndex: 10000,
                  cursor: "pointer",
                  display: "flex",
                  gap: "8px",
                  alignItems: "center",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                  pointerEvents: "auto"
                }}
              >
                <button
                  onClick={expandSelectedText}
                  disabled={generating}
                  style={{
                    background: "white",
                    color: "#2B5FA8",
                    border: "none",
                    padding: "4px 10px",
                    borderRadius: "4px",
                    cursor: generating ? "default" : "pointer",
                    fontWeight: 600,
                    fontSize: "12px",
                    opacity: generating ? 0.6 : 1
                  }}
                >
                  {generating ? "..." : lang === "fr" ? "Développer" : "Expand"}
                </button>
              </div>
            )}
            <div style={{ textAlign: "center", fontSize: 10, color: "var(--ink-500)", borderTop: "1px solid var(--border-1)", paddingTop: 16, marginTop: 40 }}>
              1
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

Object.assign(window, { DocumentEditorPro });
