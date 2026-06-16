/* eslint-disable */
// Document Builder — Feature 12. Formal legal document drafting with templates (Word-style).

const DocumentBuilder = ({ lang, onNav }) => {
  const [docType, setDocType] = React.useState("motion");
  const [fontSize, setFontSize] = React.useState("12");
  const [fontFamily, setFontFamily] = React.useState("georgia");
  const [textColor, setTextColor] = React.useState("#000000");
  const [isSaved, setIsSaved] = React.useState(true);

  const editorRef = React.useRef(null);

  const TEMPLATES = {
    motion: {
      name: { fr: "Requête", en: "Motion" },
      icon: "fileText",
      category: { fr: "Mouvements judiciaires", en: "Judicial motions" },
      template: lang === "en"
        ? `MOTION

IN THE MATTER OF THE [JURISDICTION] RULES OF COURT;

AND IN THE MATTER OF AN ACTION BETWEEN:

Plaintiff(s)
- and -
Defendant(s)

TO THE HONOURABLE COURT:

The [Movant] respectfully submits this motion for [RELIEF SOUGHT].

FACTS

[Set out the facts relevant to the motion]

LAW

[Cite applicable law and precedent]

ARGUMENT

[Develop the argument in support of the motion]

RELIEF SOUGHT

The Movant requests that this Honourable Court:

1. [First relief]
2. [Second relief]

Dated this [date]

[Name and address of movant's counsel]`
        : `REQUÊTE

DEVANT LA COUR [JURIDICTION];

ET DANS L'AFFAIRE D'UNE ACTION ENTRE :

Demandeur(s)
- c. -
Défendeur(s)

À L'HONORABLE COUR :

Le [requérant] respectueusement soumet cette requête pour [CONCLUSIONS DEMANDÉES].

FAITS

[Énoncez les faits pertinents à la requête]

DROIT APPLICABLE

[Citez la jurisprudence et la loi applicable]

ARGUMENTATION

[Développez l'argument en soutien de la requête]

CONCLUSIONS DEMANDÉES

Le requérant demande à l'honorable Cour :

1. [Première conclusion]
2. [Deuxième conclusion]

Datée ce [date]

[Nom et adresse de l'avocat du requérant]`,
    },
    brief: {
      name: { fr: "Mémoire d'audience", en: "Hearing brief" },
      icon: "book",
      category: { fr: "Mémoires et plaidoiries", en: "Briefs & pleadings" },
      template: lang === "en"
        ? `HEARING BRIEF

PARTIES

[Plaintiff] v. [Defendant]

BACKGROUND

[Provide context and background of the case]

ISSUES

1. [First issue]
2. [Second issue]

FACTS

[Set out the relevant facts]

LAW & ANALYSIS

[Analyze applicable law and how it applies to the facts]

ARGUMENT

[Develop full argument with supporting authority]

CONCLUSION

For these reasons, [party] requests that this Court:

1. [First relief]
2. [Second relief]

Respectfully submitted,

[Counsel name and address]`
        : `MÉMOIRE D'AUDIENCE

PARTIES

[Demandeur] c. [Défendeur]

CONTEXTE

[Fournissez le contexte et l'historique du dossier]

QUESTIONS EN JEU

1. [Première question]
2. [Deuxième question]

FAITS

[Énoncez les faits pertinents]

DROIT ET ANALYSE

[Analysez le droit applicable et son application aux faits]

ARGUMENTATION

[Développez l'argumentation complète avec autorités]

CONCLUSION

Pour ces raisons, [partie] demande à la Cour :

1. [Première conclusion]
2. [Deuxième conclusion]

Respectueusement présenté,

[Nom et adresse de l'avocat]`,
    },
    contract: {
      name: { fr: "Contrat commercial", en: "Commercial contract" },
      icon: "handshake",
      category: { fr: "Contrats", en: "Contracts" },
      template: lang === "en"
        ? `COMMERCIAL AGREEMENT

THIS AGREEMENT made as of [DATE]

BETWEEN:

[PARTY A NAME]
(hereinafter called the "Purchaser")

- and -

[PARTY B NAME]
(hereinafter called the "Vendor")

WHEREAS the Vendor agrees to sell and the Purchaser agrees to purchase certain goods or services;

NOW THEREFORE in consideration of the mutual covenants:

1. DESCRIPTION OF GOODS/SERVICES

[Describe in detail what is being sold]

2. PRICE AND PAYMENT TERMS

The Purchaser shall pay to the Vendor the sum of $[amount], payable as follows:
[Payment terms and conditions]

3. DELIVERY

[Specify delivery terms, dates, and conditions]

4. WARRANTIES

[Include appropriate warranties]

5. LIABILITIES AND INDEMNIFICATION

[Define liability limitations and indemnification obligations]

IN WITNESS WHEREOF

[Signatures and dates]`
        : `CONTRAT COMMERCIAL

CET ACCORD fait en date du [DATE]

ENTRE :

[NOM DE LA PARTIE A]
(ci-après appelée l'« Acheteur »)

- et -

[NOM DE LA PARTIE B]
(ci-après appelée le « Vendeur »)

ATTENDU QUE le Vendeur s'engage à vendre et l'Acheteur s'engage à acheter certains biens ou services;

EN CONSÉQUENCE en contrepartie des engagements mutuels:

1. DESCRIPTION DES BIENS/SERVICES

[Décrire en détail ce qui est vendu]

2. PRIX ET CONDITIONS DE PAIEMENT

L'Acheteur paiera au Vendeur la somme de [montant] $, payable comme suit :
[Conditions et modalités de paiement]

3. LIVRAISON

[Spécifier les conditions, dates et modalités de livraison]

4. GARANTIES

[Inclure les garanties appropriées]

5. RESPONSABILITÉ ET INDEMNISATION

[Définir les limitations de responsabilité et les obligations d'indemnisation]

[Signatures et dates]`,
    },
    settlement: {
      name: { fr: "Accord de règlement", en: "Settlement agreement" },
      icon: "checkCircle",
      category: { fr: "Règlements", en: "Settlements" },
      template: lang === "en"
        ? `SETTLEMENT AGREEMENT

THIS AGREEMENT made as of [DATE]

BETWEEN:

[PLAINTIFF/CLAIMANT]
(hereinafter called the "Claimant")

- and -

[DEFENDANT/RESPONDENT]
(hereinafter called the "Defendant")

WHEREAS the parties wish to settle all disputes between them;

NOW THEREFORE in consideration of the mutual covenants:

1. SETTLEMENT AMOUNT

The Defendant shall pay to the Claimant the sum of $[amount] as full and final settlement.

2. PAYMENT TERMS

[Specify payment schedule and conditions]

3. RELEASE

The Claimant hereby releases and forever discharges the Defendant from all claims.

4. CONFIDENTIALITY

The parties agree to keep the terms of this settlement confidential.

5. DISMISSAL

[Specify how litigation or claims will be dismissed]

IN WITNESS WHEREOF

[Signatures]`
        : `ACCORD DE RÈGLEMENT

CET ACCORD fait en date du [DATE]

ENTRE :

[DEMANDEUR/RÉCLAMANT]
(ci-après appelé le « Réclamant »)

- et -

[DÉFENDEUR/INTIMÉ]
(ci-après appelé le « Défendeur »)

ATTENDU QUE les parties désirent régler tous les différends entre elles;

EN CONSÉQUENCE en contrepartie des engagements mutuels:

1. MONTANT DU RÈGLEMENT

Le Défendeur paiera au Réclamant la somme de [montant] $ comme règlement complet et définitif.

2. CONDITIONS DE PAIEMENT

[Spécifier le calendrier et les conditions de paiement]

3. LIBÉRATION

Le Réclamant libère et décharge entièrement le Défendeur de tous les réclamations.

4. CONFIDENTIALITÉ

Les parties s'engagent à garder les conditions de ce règlement confidentielles.

5. REJET

[Spécifier comment le litige ou les réclamations seront rejetées]

[Signatures]`,
    },
  };

  const currentTemplate = TEMPLATES[docType];

  const execCommand = (cmd, value = null) => {
    document.execCommand(cmd, false, value);
    editorRef.current?.focus();
    setIsSaved(false);
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

  React.useEffect(() => {
    if (editorRef.current) {
      editorRef.current.innerHTML = `<p style="white-space: pre-wrap;">${currentTemplate.template}</p>`;
    }
  }, [docType]);

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0, minHeight: 0, background: "#F5F5F5" }}>
      {/* RIBBON MENU */}
      <div style={{ background: "#2B5FA8", color: "#FBF8F2", padding: "0 24px", display: "flex", alignItems: "center", height: 44, gap: 32, fontSize: 13, fontWeight: 500, borderBottom: "1px solid #1F3F66" }}>
        <button style={{ background: "transparent", color: "#FBF8F2", border: 0, cursor: "pointer", fontWeight: 600, padding: "8px 0" }}>
          {lang === "en" ? "File" : "Fichier"}
        </button>
        <button style={{ background: "transparent", color: "#FBF8F2", border: 0, cursor: "pointer", fontWeight: 600, padding: "8px 0" }}>
          {lang === "en" ? "Home" : "Accueil"}
        </button>
        <button style={{ background: "transparent", color: "#FBF8F2", border: 0, cursor: "pointer", fontWeight: 500, padding: "8px 0", opacity: 0.9 }}>
          {lang === "en" ? "Insert" : "Insertion"}
        </button>
        <div style={{ marginLeft: "auto" }}/>
        <span style={{ fontSize: 12, fontWeight: 600 }}>⚖ LexiBridge</span>
      </div>



      {/* FORMATTING TOOLBAR */}
      <div style={{ background: "var(--paper)", borderBottom: "1px solid var(--border-1)", padding: "10px 24px", display: "flex", gap: 16, alignItems: "center", flexWrap: "wrap" }}>
        
        <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
          <button onClick={() => execCommand('bold')} title="Bold" style={{ padding: "6px 10px", borderRadius: 4, border: "1px solid var(--border-2)", background: "transparent", color: "var(--ink-900)", cursor: "pointer", fontWeight: 700, fontSize: 12 }}>
            B
          </button>
          <button onClick={() => execCommand('italic')} title="Italic" style={{ padding: "6px 10px", borderRadius: 4, border: "1px solid var(--border-2)", background: "transparent", color: "var(--ink-900)", cursor: "pointer", fontStyle: "italic", fontWeight: 600, fontSize: 12 }}>
            I
          </button>
          <button onClick={() => execCommand('underline')} title="Underline" style={{ padding: "6px 10px", borderRadius: 4, border: "1px solid var(--border-2)", background: "transparent", color: "var(--ink-900)", cursor: "pointer", fontWeight: 600, fontSize: 12, textDecoration: "underline" }}>
            U
          </button>
        </div>

        <div style={{ width: 1, height: 20, background: "var(--border-1)" }}/>

        <select value={fontFamily} onChange={(e) => applyFontFamily(e.target.value)} style={{ padding: "6px 10px", borderRadius: 4, border: "1px solid var(--border-2)", background: "var(--paper)", color: "var(--ink-900)", cursor: "pointer", fontSize: 12 }}>
          <option value="georgia">Georgia</option>
          <option value="times">Times New Roman</option>
          <option value="courier">Courier New</option>
          <option value="arial">Arial</option>
        </select>

        <select value={fontSize} onChange={(e) => applyFontSize(e.target.value)} style={{ padding: "6px 10px", borderRadius: 4, border: "1px solid var(--border-2)", background: "var(--paper)", color: "var(--ink-900)", cursor: "pointer", fontSize: 12 }}>
          {["9", "10", "11", "12", "13", "14", "16", "18", "20", "24"].map(s => <option key={s} value={s}>{s}</option>)}
        </select>

        <input type="color" value={textColor} onChange={(e) => applyTextColor(e.target.value)} title="Text color" style={{ width: 32, height: 32, borderRadius: 4, border: "1px solid var(--border-2)", cursor: "pointer", padding: 2 }}/>

        <div style={{ width: 1, height: 20, background: "var(--border-1)" }}/>

        <button onClick={() => applyAlignment('Left')} title="Align left" style={{ padding: "6px 10px", borderRadius: 4, border: "1px solid var(--border-2)", background: "transparent", color: "var(--ink-900)", cursor: "pointer", fontSize: 12 }}>
          ⬅
        </button>
        <button onClick={() => applyAlignment('Center')} title="Align center" style={{ padding: "6px 10px", borderRadius: 4, border: "1px solid var(--border-2)", background: "transparent", color: "var(--ink-900)", cursor: "pointer", fontSize: 12 }}>
          ↔
        </button>
        <button onClick={() => applyAlignment('Right')} title="Align right" style={{ padding: "6px 10px", borderRadius: 4, border: "1px solid var(--border-2)", background: "transparent", color: "var(--ink-900)", cursor: "pointer", fontSize: 12 }}>
          ➡
        </button>
        <button onClick={() => applyAlignment('Justify')} title="Justify" style={{ padding: "6px 10px", borderRadius: 4, border: "1px solid var(--border-2)", background: "transparent", color: "var(--ink-900)", cursor: "pointer", fontSize: 12 }}>
          ≡
        </button>

        <div style={{ width: 1, height: 20, background: "var(--border-1)" }}/>

        <button onClick={() => execCommand('insertUnorderedList')} title="Bullet list" style={{ padding: "6px 10px", borderRadius: 4, border: "1px solid var(--border-2)", background: "transparent", color: "var(--ink-900)", cursor: "pointer", fontSize: 12 }}>
          • List
        </button>
        <button onClick={() => execCommand('insertOrderedList')} title="Numbered list" style={{ padding: "6px 10px", borderRadius: 4, border: "1px solid var(--border-2)", background: "transparent", color: "var(--ink-900)", cursor: "pointer", fontSize: 12 }}>
          1. List
        </button>

        <div style={{ marginLeft: "auto" }}/>

        <button onClick={() => execCommand('undo')} title="Undo" style={{ padding: "6px 10px", borderRadius: 4, border: "1px solid var(--border-2)", background: "transparent", color: "var(--ink-900)", cursor: "pointer", fontSize: 12 }}>
          ↶
        </button>
        <button onClick={() => execCommand('redo')} title="Redo" style={{ padding: "6px 10px", borderRadius: 4, border: "1px solid var(--border-2)", background: "transparent", color: "var(--ink-900)", cursor: "pointer", fontSize: 12 }}>
          ↷
        </button>
      </div>

      {/* DOCUMENT AREA — Multi-page */}
      <div style={{ flex: 1, overflow: "auto", padding: "40px 20px", display: "flex", flexDirection: "column", alignItems: "center", background: "#D3D3D3", gap: 20 }}>
        
        {/* PAGE 1 */}
        <div style={{ width: "950px", minHeight: "1200px", background: "white", boxShadow: "0 4px 12px rgba(0,0,0,0.2)", padding: "60px 60px", fontFamily: "Georgia, serif", fontSize: "12pt", lineHeight: 1.6, color: "var(--ink-950)" }}>
          <div
            ref={editorRef}
            contentEditable
            suppressContentEditableWarning
            style={{ outline: "none" }}
            onInput={() => setIsSaved(false)}
          >
            {/* Template content loads here */}
          </div>
          <div style={{ textAlign: "center", fontSize: 10, color: "var(--ink-500)", borderTop: "1px solid var(--border-1)", paddingTop: 16, marginTop: 40 }}>
            1
          </div>
        </div>

        {/* PAGE 2 */}
        <div style={{ width: "950px", minHeight: "1200px", background: "white", boxShadow: "0 4px 12px rgba(0,0,0,0.2)", padding: "60px 60px", fontFamily: "Georgia, serif", fontSize: "12pt", lineHeight: 1.6, color: "var(--ink-950)" }}>
          <div style={{ color: "var(--ink-400)", fontStyle: "italic", textAlign: "center", paddingTop: "50%" }}>
            {lang === "en" ? "Additional content will appear here" : "Le contenu supplémentaire apparaîtra ici"}
          </div>
          <div style={{ textAlign: "center", fontSize: 10, color: "var(--ink-500)", borderTop: "1px solid var(--border-1)", paddingTop: 16, marginTop: 40 }}>
            2
          </div>
        </div>

      </div>
    </div>
  );
};

Object.assign(window, { DocumentBuilder });
