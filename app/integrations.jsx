/* eslint-disable */
// Écosystème — connected integrations. Word plugin, Outlook calendar,
// Clio / JurisConcept sync. Three tabs, each a high-fidelity mock that
// embeds LexiBridge into the lawyer's existing tools so the workflow is
// frictionless. This is the bridge from product → daily habit.

// Badges de marque (logos stylisés en SVG inline)
const BrandBadge = ({ brand, size = 26 }) => {
  const s = { width: size, height: size, borderRadius: 6, flexShrink: 0, display: "block" };
  if (brand === "clio") return (
    <svg viewBox="0 0 24 24" style={s}><rect width="24" height="24" rx="4" fill="#0066CC"/><path d="M7 12.5l3 3 7-7" stroke="#fff" strokeWidth="2.2" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>
  );
  if (brand === "mycase") return (
    <svg viewBox="0 0 24 24" style={s}><rect width="24" height="24" rx="4" fill="#1FA463"/><text x="12" y="17" fontSize="12" fontWeight="700" fill="#fff" textAnchor="middle" fontFamily="system-ui, sans-serif">M</text></svg>
  );
  // jurisconcept (Québec)
  return (
    <svg viewBox="0 0 24 24" style={s}><rect width="24" height="24" rx="4" fill="#7A1F2B"/><text x="12" y="17" fontSize="12" fontWeight="700" fill="#fff" textAnchor="middle" fontFamily="Georgia, serif">JC</text></svg>
  );
};

const Integrations = ({ lang, onNav }) => {
  const [tab, setTab] = React.useState("clio");
  const isMobile = useIsMobile(768);

  const tabs = [
    { id: "clio",         brand: "clio",        label: { fr: "Clio",         en: "Clio" },         short: "Clio",         sub: { fr: "Gestion de cabinet · cloud", en: "Practice management · cloud" } },
    { id: "mycase",       brand: "mycase",      label: { fr: "MyCase",       en: "MyCase" },       short: "MyCase",       sub: { fr: "Gestion de dossiers", en: "Case management" } },
    { id: "jurisconcept", brand: "jurisconcept", label: { fr: "JurisConcept", en: "JurisConcept" }, short: "JurisConcept", sub: { fr: "Gestion de cabinet · Québec", en: "Practice management · Quebec" } },
  ];

  return (
    <div style={{ flex: 1, overflow: "auto", padding: isMobile ? "20px 16px 40px" : "28px 36px 48px" }}>
      <div style={{ maxWidth: 1180, margin: "0 auto" }}>

        {/* Header */}
        <div style={{ marginBottom: 22 }}>
          <Overline style={{ marginBottom: 6 }}>{lang === "en" ? "Connected ecosystem · feature 11" : "Écosystème connecté · fonctionnalité 11"}</Overline>
          <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 500, fontSize: isMobile ? 28 : 40, color: "var(--ink-950)", letterSpacing: "-0.02em", margin: 0, lineHeight: 1.1 }}>
            {lang === "en"
              ? <>LexiBridge lives <i style={{ color: "#7A1F2B" }}>where you already work</i>.</>
              : <>LexiBridge vit <i style={{ color: "#7A1F2B" }}>là où vous travaillez déjà</i>.</>}
          </h1>
          <p style={{ fontSize: 15, lineHeight: 1.55, color: "var(--ink-700)", margin: "10px 0 0", maxWidth: 640 }}>
            {lang === "en"
              ? "A tool that demands manual steps gets abandoned. So LexiBridge plugs into Word, Outlook and your practice-management software — no double entry, no copying, no leaving the document."
              : "Un outil qui demande des étapes manuelles finit par être abandonné. LexiBridge se branche donc à Word, Outlook et votre logiciel de gestion de cabinet — pas de double saisie, pas de copier-coller, jamais quitter le document."}
          </p>
        </div>

        {/* Tabs — chips compacts à badge de marque sur mobile */}
        {isMobile ? (
          <div style={{ display: "flex", gap: 8, marginBottom: 20, overflowX: "auto", paddingBottom: 2 }}>
            {tabs.map((t) => {
              const isActive = tab === t.id;
              return (
                <button key={t.id} onClick={() => setTab(t.id)} style={{
                  display: "inline-flex", alignItems: "center", gap: 8, flexShrink: 0,
                  padding: "8px 14px", borderRadius: 999, cursor: "pointer",
                  border: "1px solid " + (isActive ? "var(--oxblood-700)" : "var(--border-2)"),
                  background: isActive ? "var(--oxblood-50)" : "var(--paper)",
                  fontFamily: "var(--font-sans)", fontWeight: 600, fontSize: 13,
                  color: isActive ? "var(--oxblood-700)" : "var(--ink-700)", whiteSpace: "nowrap",
                }}>
                  <BrandBadge brand={t.brand} size={20}/>
                  {t.short}
                </button>
              );
            })}
          </div>
        ) : (
          <div style={{ display: "flex", gap: 8, marginBottom: 20, borderBottom: "1px solid var(--border-1)" }}>
            {tabs.map((t) => {
              const isActive = tab === t.id;
              return (
                <button key={t.id} onClick={() => setTab(t.id)} style={{
                  display: "flex", alignItems: "center", gap: 10,
                  padding: "12px 16px 14px", border: 0, background: "transparent",
                  cursor: "pointer", borderBottom: "2px solid " + (isActive ? "var(--oxblood-700)" : "transparent"),
                  marginBottom: -1,
                }}>
                  <BrandBadge brand={t.brand} size={26}/>
                  <div style={{ textAlign: "left" }}>
                    <div style={{ fontFamily: "var(--font-sans)", fontWeight: 600, fontSize: 13.5,
                                  color: isActive ? "var(--ink-950)" : "var(--ink-600)" }}>{tr(t.label, lang)}</div>
                    <div style={{ fontSize: 11, color: "var(--ink-500)", marginTop: 1 }}>{tr(t.sub, lang)}</div>
                  </div>
                </button>
              );
            })}
          </div>
        )}

        <ClioSync lang={lang} onNav={onNav} product={tabs.find((t) => t.id === tab)?.short || "Clio"}/>

        {/* Security strip — common to all three tabs */}
        <SecurityStrip lang={lang}/>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════
// WORD PLUGIN — desktop Word window with a LexiBridge side panel.
// The left pane shows a draft brief; the right pane is the live add-in
// that catches a reversed citation in real time.
// ═══════════════════════════════════════════════════════════════════
const WordPlugin = ({ lang, onNav }) => {
  const isMobile = useIsMobile(768);
  return (
  <div style={{
    background: "var(--paper)", border: "1px solid var(--border-1)",
    borderRadius: 14, overflow: "hidden", boxShadow: "var(--shadow-2)",
  }}>
    {/* Window chrome */}
    <div style={{ background: "#F3F1EE", borderBottom: "1px solid #DCD8D1", padding: "8px 12px",
                  display: "flex", alignItems: "center", gap: 10 }}>
      <span style={{ display: "flex", gap: 6 }}>
        {["#ED6A5E", "#F4BF4F", "#61C554"].map((c, i) => <span key={i} style={{ width: 11, height: 11, borderRadius: 999, background: c }}/>)}
      </span>
      <span style={{ fontSize: 12, color: "#3D3833", fontFamily: "system-ui, -apple-system, Segoe UI" }}>
        Mémoire — Dupont c. Industries XYZ.docx — Word
      </span>
    </div>

    {/* Word ribbon */}
    <div style={{ background: "#2B579A", color: "#fff", padding: "5px 12px", display: "flex", alignItems: "center", gap: 16, fontFamily: "system-ui, -apple-system, Segoe UI", fontSize: 12 }}>
      {["Fichier", "Accueil", "Insertion", "Mise en page", "Références", "Révision", "Affichage"].map((t, i) => (
        <span key={i} style={{ padding: "3px 8px", borderRadius: 3, background: i === 4 ? "rgba(255,255,255,0.15)" : "transparent", fontWeight: i === 4 ? 600 : 400 }}>{t}</span>
      ))}
      <span style={{ padding: "3px 8px", borderRadius: 3, background: "rgba(229,168,177,0.2)", marginLeft: "auto", display: "inline-flex", alignItems: "center", gap: 6, fontWeight: 600 }}>
        <BrandMark size={12} color="#FBF8F2" accent="#E5A8B1"/> LexiBridge
      </span>
    </div>

    {/* Body: doc + sidebar (empilés sur mobile, hauteur réduite) */}
    <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "minmax(0,1fr) minmax(220px,360px)", minHeight: isMobile ? "auto" : 560 }}>
      {/* Doc page */}
      <div style={{ background: "#E8E6E1", padding: isMobile ? "16px 18px" : "24px 32px", overflow: "auto" }}>
        <div style={{
          background: "#fff", maxWidth: 540, margin: "0 auto", padding: "56px 64px",
          boxShadow: "0 1px 3px rgba(0,0,0,0.08), 0 8px 24px rgba(0,0,0,0.08)",
          fontFamily: "'Times New Roman', Times, serif", fontSize: 12.5, lineHeight: 1.65, color: "#1c1c1c",
          minHeight: 480,
        }}>
          <div style={{ textAlign: "center", marginBottom: 24, fontWeight: 700, letterSpacing: "0.02em", fontSize: 13 }}>
            COUR SUPÉRIEURE DU QUÉBEC<br/>
            <span style={{ fontSize: 11, fontWeight: 400 }}>500-17-128744-241</span>
          </div>

          <p style={{ margin: "0 0 12px", textIndent: 24 }}>
            Monsieur le juge, mon client, M. Dupont, a consacré <b>douze ans</b> de sa carrière à cette entreprise.
          </p>
          <p style={{ margin: "0 0 12px", textIndent: 24 }}>
            La Cour d'appel a tranché cette question dans <i>Syndicat c. Bombardier</i> (2023 QCCA 412) : un tel congédiement, dénué de tout substrat procédural, ouvre droit à l'indemnité maximale.
          </p>
          <p style={{ margin: "0 0 12px", textIndent: 24 }}>
            La partie adverse invoquera probablement <span style={{
              background: "rgba(176,57,74,0.18)", borderBottom: "2px wavy #B0394A",
              cursor: "help", position: "relative",
            }}>
              <i>Gagnon c. Cie ABC</i> (2018 QCCS 9912)
            </span>{". Cet argument ne peut prospérer : le précédent est aujourd'hui distingué."}
          </p>
          <p style={{ margin: "0 0 12px", textIndent: 24 }}>
            Comme l'a confirmé la Cour d'appel, le standard procédural prévu à la <i>Loi sur les normes du travail</i> est <span style={{ background: "rgba(43,95,168,0.12)" }}>impératif</span> et son non-respect constitue, en soi, un motif suffisant.
          </p>
        </div>
      </div>

      {/* LexiBridge sidebar add-in */}
      <div style={{ borderLeft: "1px solid #DCD8D1", background: "var(--bg-app)", display: "flex", flexDirection: "column" }}>
        {/* Add-in header */}
        <div style={{ background: "#0E1626", color: "#FBF8F2", padding: "12px 14px", display: "flex", alignItems: "center", gap: 10 }}>
          <BrandMark size={20} color="#FBF8F2" accent="#E5A8B1"/>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: "var(--font-display)", fontWeight: 500, fontSize: 14 }}>
              Lexi<span style={{ fontStyle: "italic", color: "#E5A8B1" }}>Bridge</span>
            </div>
            <div style={{ fontSize: 10, color: "#8590A4", letterSpacing: "0.08em" }}>{lang === "en" ? "Live citation check" : "Vérification en direct"}</div>
          </div>
          <span style={{ width: 8, height: 8, borderRadius: 999, background: "#3D7A4E", boxShadow: "0 0 0 2px rgba(61,122,78,0.25)" }}/>
        </div>

        {/* Live alert */}
        <div style={{ margin: 12, padding: "12px 14px", background: "#FBEEF0", border: "1px solid #F5DCE0", borderRadius: 10, borderLeft: "3px solid #7A1F2B" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
            <Icon name="alert" size={14} color="#7A1F2B"/>
            <span style={{ fontSize: 10.5, letterSpacing: "0.12em", textTransform: "uppercase", fontWeight: 700, color: "#7A1F2B" }}>
              {lang === "en" ? "Reversal · 1 citation flagged" : "Revirement · 1 citation alertée"}
            </span>
          </div>
          <div style={{ fontFamily: "var(--font-display)", fontStyle: "italic", fontWeight: 500, fontSize: 14.5, color: "#4A0F18", marginBottom: 3 }}>
            Gagnon c. Cie ABC
          </div>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "#5E1620" }}>2018 QCCS 9912 · § 3 du document</div>
          <div style={{ fontSize: 12, color: "#5E1620", lineHeight: 1.5, marginTop: 8 }}>
            {lang === "en"
              ? "Distinguished by the Court of Appeal in March 2025. Solidity 41%. Use the pre-built reply instead."
              : "Distingué par la Cour d'appel en mars 2025. Solidité 41 %. Utilisez plutôt la réplique pré-construite."}
          </div>
          <div style={{ display: "flex", gap: 6, marginTop: 10 }}>
            <button style={{ background: "#7A1F2B", color: "#FBF8F2", border: 0, padding: "5px 10px", borderRadius: 6, fontSize: 11, fontWeight: 600, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 4 }}>
              <Icon name="quote" size={11} color="#FBF8F2"/>{lang === "en" ? "Insert reply" : "Insérer la réplique"}
            </button>
            <button style={{ background: "transparent", color: "#7A1F2B", border: "1px solid #F5DCE0", padding: "5px 10px", borderRadius: 6, fontSize: 11, fontWeight: 600, cursor: "pointer" }}>
              {lang === "en" ? "Dismiss" : "Ignorer"}
            </button>
          </div>
        </div>

        {/* Cited authorities */}
        <div style={{ padding: "0 12px 12px", flex: 1, overflow: "auto" }}>
          <Overline style={{ margin: "4px 0 8px" }}>{lang === "en" ? "Citations in this document (4)" : "Citations dans ce document (4)"}</Overline>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {[
              { ref: "Bombardier", state: "ok",    para: "§ 2" },
              { ref: "Gagnon",     state: "warn",  para: "§ 3" },
              { ref: "Dupont",     state: "ok",    para: "§ 4 · à insérer", missing: true },
              { ref: null, title: "Loi sur les normes du travail", citation: "RLRQ c N-1.1, art. 124", state: "ok", para: "§ 4" },
            ].map((row, i) => {
              const c = row.ref ? CASES[row.ref] : { title: row.title, citation: row.citation, sol: null };
              const stateColor = row.state === "warn" ? "#7A1F2B" : "#3D7A4E";
              return (
                <div key={i} style={{
                  background: "var(--paper)", border: "1px solid var(--border-1)",
                  borderRadius: 8, padding: "9px 11px", display: "flex", gap: 10,
                  alignItems: "flex-start", borderLeft: "3px solid " + stateColor,
                  opacity: row.missing ? 0.95 : 1,
                }}>
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <div style={{ fontFamily: "var(--font-display)", fontStyle: "italic", fontSize: 12.5, color: "var(--ink-900)", fontWeight: 500,
                                  overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{c.title}</div>
                    <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--ink-500)", marginTop: 1 }}>{c.citation} · {row.para}</div>
                  </div>
                  {c.sol != null && <SolPill value={c.sol}/>}
                  {row.missing && (
                    <button style={{ background: "var(--ink-900)", color: "var(--parchment-50)", border: 0, padding: "3px 8px", borderRadius: 5, fontSize: 10.5, fontWeight: 600, cursor: "pointer" }}>
                      <Icon name="plus" size={10} color="var(--parchment-50)" style={{ verticalAlign: "-2px", marginRight: 3 }}/>
                      {lang === "en" ? "Insert" : "Insérer"}
                    </button>
                  )}
                </div>
              );
            })}
          </div>

          <Overline style={{ margin: "20px 0 8px" }}>
            {lang === "en" ? "Drag-drop into your draft" : "Glisser-déposer dans la rédaction"}
          </Overline>
          <DragDropPalette lang={lang}/>
        </div>

        {/* Footer */}
        <div style={{ padding: "10px 14px", borderTop: "1px solid var(--border-1)", background: "var(--paper)",
                      display: "flex", alignItems: "center", gap: 8, fontSize: 11, color: "var(--ink-500)" }}>
          <Icon name="check" size={12} color="#3D7A4E"/>
          {lang === "en" ? "Synced with dossier · Citations in McGill format" : "Synchronisé avec le dossier · Citations au format McGill"}
        </div>
      </div>
    </div>
  </div>
  );
};

const DragDropPalette = ({ lang }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
    {[
      { label: { fr: "Indemnité maximale (Bombardier)", en: "Maximum indemnity (Bombardier)" } },
      { label: { fr: "Manquement procédural", en: "Procedural failure" } },
      { label: { fr: "Réplique sur Gagnon", en: "Reply on Gagnon" } },
    ].map((s, i) => (
      <div key={i} style={{
        background: "#FBF8F2", border: "1px dashed var(--parchment-300)", borderRadius: 8,
        padding: "8px 10px", display: "flex", alignItems: "center", gap: 8,
        cursor: "grab", fontSize: 12, color: "var(--ink-800)",
      }}>
        <span style={{ color: "var(--ink-400)", fontFamily: "var(--font-mono)", fontSize: 10 }}>⠿</span>
        <span style={{ flex: 1 }}>{tr(s.label, lang)}</span>
        <span style={{ fontSize: 9.5, color: "var(--ink-400)", letterSpacing: "0.08em", fontWeight: 600 }}>
          {lang === "en" ? "DRAG" : "GLISSER"}
        </span>
      </div>
    ))}
  </div>
);

// ═══════════════════════════════════════════════════════════════════
// OUTLOOK — week view with LexiBridge-injected events
// ═══════════════════════════════════════════════════════════════════
const OutlookView = ({ lang }) => {
  const days = lang === "en"
    ? ["Mon May 14", "Tue May 15", "Wed May 16", "Thu May 17", "Fri May 18"]
    : ["Lun 14 mai", "Mar 15 mai", "Mer 16 mai", "Jeu 17 mai", "Ven 18 mai"];
  const events = [
    { day: 0, top: 30,  height: 60,  title: { fr: "Réunion équipe", en: "Team meeting" }, color: "#1F4682", bg: "#E4ECF5" },
    { day: 1, top: 90,  height: 90,  title: { fr: "Audience Dupont", en: "Hearing — Dupont" }, color: "#7A1F2B", bg: "#FBEEF0", lb: true, sub: { fr: "Préparé par LexiBridge", en: "Briefed by LexiBridge" } },
    { day: 2, top: 60,  height: 50,  title: { fr: "Appel client Lapointe", en: "Lapointe client call" }, color: "#1F4682", bg: "#E4ECF5" },
    { day: 3, top: 150, height: 100, title: { fr: "Audience Tremblay · garde", en: "Tremblay hearing · custody" }, color: "#7A1F2B", bg: "#FBEEF0", lb: true, sub: { fr: "Argumentaire prêt", en: "Argument ready" } },
    { day: 4, top: 40,  height: 40,  title: { fr: "Mémoire dû · Lapointe", en: "Brief due · Lapointe" }, color: "#6B4A0E", bg: "#FBF3D9", lb: true, sub: { fr: "12 sources prêtes", en: "12 sources ready" } },
    { day: 4, top: 220, height: 50,  title: { fr: "Comité du barreau", en: "Bar committee" }, color: "#1F4682", bg: "#E4ECF5" },
  ];

  return (
    <div style={{
      background: "var(--paper)", border: "1px solid var(--border-1)",
      borderRadius: 14, overflow: "hidden", boxShadow: "var(--shadow-2)",
    }}>
      {/* Outlook chrome */}
      <div style={{ background: "#0078D4", color: "#fff", padding: "10px 18px",
                    display: "flex", alignItems: "center", gap: 14, fontFamily: "system-ui, -apple-system, Segoe UI", fontSize: 13 }}>
        <span style={{ display: "flex", alignItems: "center", gap: 8, fontWeight: 600 }}>
          <svg width="18" height="18" viewBox="0 0 32 32"><rect x="2" y="6" width="20" height="20" rx="2" fill="#fff"/><text x="12" y="22" fontSize="14" fontWeight="700" fill="#0078D4" textAnchor="middle">O</text></svg>
          Outlook
        </span>
        <span style={{ opacity: 0.85 }}>{lang === "en" ? "Calendar · Week" : "Calendrier · Semaine"}</span>
        <span style={{ marginLeft: "auto", display: "inline-flex", alignItems: "center", gap: 6, fontSize: 11.5, background: "rgba(255,255,255,0.15)", padding: "3px 9px", borderRadius: 999 }}>
          <BrandMark size={12} color="#FBF8F2" accent="#E5A8B1"/>
          LexiBridge {lang === "en" ? "connected" : "connecté"}
        </span>
      </div>

      {/* Connector banner */}
      <div style={{ padding: "10px 18px", background: "#F5DCE0", borderBottom: "1px solid var(--border-1)",
                    display: "flex", alignItems: "center", gap: 12, fontSize: 12.5, color: "#4A0F18" }}>
        <Icon name="sparkle" size={14} color="#7A1F2B"/>
        <span><b>3 {lang === "en" ? "LexiBridge events" : "événements LexiBridge"}</b> {lang === "en" ? "added this week — hearings, briefs, and a fresh relevant ruling" : "ajoutés cette semaine — audiences, mémoire et un nouvel arrêt pertinent"}.</span>
        <span style={{ marginLeft: "auto", fontFamily: "var(--font-mono)", fontSize: 11 }}>
          {lang === "en" ? "Synced 2 min ago" : "Synchro · il y a 2 min"}
        </span>
      </div>

      {/* Week grid */}
      <div style={{ display: "grid", gridTemplateColumns: "60px repeat(5, 1fr)", minHeight: 460, fontFamily: "system-ui, -apple-system, Segoe UI" }}>
        {/* Hour column */}
        <div style={{ borderRight: "1px solid var(--border-1)", paddingTop: 40 }}>
          {[9, 10, 11, 12, 13, 14, 15, 16].map((h) => (
            <div key={h} style={{ height: 50, fontSize: 10.5, color: "var(--ink-500)", textAlign: "right", paddingRight: 8 }}>{h}:00</div>
          ))}
        </div>

        {/* Day columns */}
        {days.map((d, i) => (
          <div key={i} style={{ borderRight: i < days.length - 1 ? "1px solid var(--border-1)" : 0, position: "relative" }}>
            <div style={{ height: 40, padding: "10px 12px", borderBottom: "1px solid var(--border-1)",
                          fontSize: 12, fontWeight: 600, color: "var(--ink-900)" }}>
              {d}
            </div>
            <div style={{ position: "relative", height: 400 }}>
              {/* Hour grid lines */}
              {[0,1,2,3,4,5,6,7].map((h) => (
                <div key={h} style={{ position: "absolute", left: 0, right: 0, top: h * 50, borderTop: "1px solid var(--ink-100)" }}/>
              ))}
              {events.filter((e) => e.day === i).map((e, j) => (
                <div key={j} style={{
                  position: "absolute", left: 4, right: 4, top: e.top, height: e.height,
                  background: e.bg, borderLeft: "3px solid " + e.color, borderRadius: 4,
                  padding: "5px 8px", fontSize: 11, color: e.color, overflow: "hidden",
                }}>
                  <div style={{ fontWeight: 700, display: "flex", alignItems: "center", gap: 4, lineHeight: 1.25 }}>
                    {e.lb && <BrandMark size={10} color={e.color} accent={e.color}/>}
                    <span style={{ flex: 1, minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{tr(e.title, lang)}</span>
                  </div>
                  {e.sub && <div style={{ fontSize: 10, opacity: 0.85, marginTop: 2 }}>{tr(e.sub, lang)}</div>}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Footer — event detail preview */}
      <div style={{ padding: "14px 18px", borderTop: "1px solid var(--border-1)", background: "#FBF8F2", display: "flex", gap: 16, alignItems: "flex-start" }}>
        <div style={{ width: 36, height: 36, borderRadius: 8, background: "#0E1626", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <BrandMark size={20} color="#FBF8F2" accent="#E5A8B1"/>
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: "var(--font-sans)", fontWeight: 600, fontSize: 13.5, color: "var(--ink-900)" }}>
            {lang === "en" ? "Audience Dupont — Mardi 9:30 AM" : "Audience Dupont — mardi 9 h 30"}
          </div>
          <div style={{ fontSize: 12, color: "var(--ink-700)", lineHeight: 1.5, marginTop: 4 }}>
            {lang === "en"
              ? "Cour supérieure du Québec · Salle 2.08 · Justice Côté. The LexiBridge brief (4 sources, 1 anticipated reply, judge profile) opens in one click."
              : "Cour supérieure du Québec · Salle 2.08 · juge Côté. Le mémoire LexiBridge (4 sources, 1 réplique anticipée, profil du juge) s'ouvre en un clic."}
          </div>
        </div>
        <button style={{ background: "#7A1F2B", color: "#FBF8F2", border: 0, padding: "7px 12px", borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 6 }}>
          <Icon name="chat" size={13} color="#FBF8F2"/>
          {lang === "en" ? "Open the brief" : "Ouvrir le mémoire"}
        </button>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════
// CLIO / JURISCONCEPT SYNC — practice-management bridge
// ═══════════════════════════════════════════════════════════════════
const ClioSync = ({ lang, onNav, product = "Clio" }) => {
  const isMobile = useIsMobile(768);
  return (
  <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "minmax(0, 1.4fr) minmax(0, 1fr)", gap: 18 }}>
    {/* Left — practice-management app mock */}
    <div style={{ background: "var(--paper)", border: "1px solid var(--border-1)", borderRadius: 14, overflow: "hidden", boxShadow: "var(--shadow-2)" }}>
      <div style={{ background: "#1E3A5F", color: "#fff", padding: "10px 18px",
                    display: "flex", alignItems: "center", gap: 12, fontFamily: "system-ui, -apple-system, Segoe UI", fontSize: 12.5 }}>
        <span style={{ fontWeight: 700, letterSpacing: "0.04em", fontSize: 13, textTransform: "uppercase" }}>{product}</span>
        <span style={{ opacity: 0.7 }}>·</span>
        <span style={{ opacity: 0.85 }}>{lang === "en" ? "Matters" : "Dossiers"}</span>
        <span style={{ marginLeft: "auto", display: "inline-flex", alignItems: "center", gap: 6, fontSize: 11, background: "rgba(255,255,255,0.15)", padding: "3px 9px", borderRadius: 999 }}>
          <span style={{ width: 6, height: 6, borderRadius: 999, background: "#7DD3A0" }}/>
          LexiBridge {lang === "en" ? "linked" : "lié"}
        </span>
      </div>

      <div style={{ padding: "16px 18px", display: "flex", flexDirection: "column", gap: 10 }}>
        {[
          { name: "Dupont c. Industries XYZ", type: lang === "en" ? "Labour" : "Travail",       date: lang === "en" ? "Opened Apr 23" : "Ouvert le 23 avril", linked: true, hot: true },
          { name: "Tremblay c. PG du Québec", type: lang === "en" ? "Family · custody" : "Famille · garde", date: lang === "en" ? "Opened Feb 11" : "Ouvert le 11 fév.", linked: true },
          { name: "Lapointe c. CHUM",         type: lang === "en" ? "Medical liability" : "Responsabilité médicale", date: lang === "en" ? "Opened Mar 02" : "Ouvert le 2 mars", linked: true },
          { name: "Roy c. Trudel",            type: lang === "en" ? "Contract" : "Contrat",     date: lang === "en" ? "Opened Jan 14" : "Ouvert le 14 janv.", linked: false },
        ].map((m, i) => (
          <div key={i} style={{
            display: "grid", gridTemplateColumns: "auto 1fr auto auto", alignItems: "center", gap: 12,
            padding: "12px 14px", border: "1px solid var(--border-1)", borderRadius: 10,
            background: m.hot ? "#FBEEF0" : "var(--paper)",
            borderColor: m.hot ? "#F5DCE0" : "var(--border-1)",
          }}>
            <span style={{ width: 8, height: 8, borderRadius: 999, background: m.hot ? "#B0394A" : (m.linked ? "#3D7A4E" : "var(--ink-300)") }}/>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontFamily: "var(--font-display)", fontStyle: "italic", fontWeight: 500, fontSize: 14.5, color: "var(--ink-900)" }}>{m.name}</div>
              <div style={{ fontSize: 11.5, color: "var(--ink-500)", marginTop: 2 }}>{m.type} · {m.date}</div>
            </div>
            {m.linked ? (
              <span style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 11, background: "#E7F0EA", color: "#1B3D26", padding: "3px 9px", borderRadius: 999, fontWeight: 600 }}>
                <BrandMark size={10} color="#1B3D26" accent="#1B3D26"/>
                {lang === "en" ? "Synced" : "Synchronisé"}
              </span>
            ) : (
              <button style={{ background: "transparent", color: "#7A1F2B", border: "1px solid #F5DCE0", padding: "4px 10px", borderRadius: 6, fontSize: 11, fontWeight: 600, cursor: "pointer" }}>
                {lang === "en" ? "Link to LexiBridge" : "Lier à LexiBridge"}
              </button>
            )}
            <Icon name="moreH" size={14} color="var(--ink-400)"/>
          </div>
        ))}
      </div>
    </div>

    {/* Right — sync flow card */}
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ background: "var(--paper)", border: "1px solid var(--border-1)", borderRadius: 14, padding: "18px 20px" }}>
        <Overline style={{ marginBottom: 10 }}>{lang === "en" ? "What syncs, automatically" : "Ce qui se synchronise, automatiquement"}</Overline>
        <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 11 }}>
          {[
            { fr: "Noms des parties, type de dossier, tribunal", en: "Party names, matter type, court" },
            { fr: "Dates clés et délais procéduraux",            en: "Key dates and procedural deadlines" },
            { fr: "Documents joints (lecture seule)",            en: "Attached documents (read-only)" },
            { fr: "Heures facturables sur la recherche",         en: "Billable hours on research" },
          ].map((t, i) => (
            <li key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
              <span style={{ width: 18, height: 18, borderRadius: 999, background: "#E7F0EA", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1 }}>
                <Icon name="check" size={11} color="#1B3D26"/>
              </span>
              <span style={{ fontSize: 13, color: "var(--ink-800)", lineHeight: 1.5 }}>{tr(t, lang)}</span>
            </li>
          ))}
        </ul>
      </div>

      <div style={{ background: "#FBF8F2", border: "1px solid var(--parchment-200)", borderRadius: 14, padding: "18px 20px", borderLeft: "3px solid var(--oxblood-700)" }}>
        <Overline color="var(--oxblood-700)" style={{ marginBottom: 8 }}>{lang === "en" ? "Zero double entry" : "Zéro double saisie"}</Overline>
        <div style={{ fontFamily: "var(--font-display)", fontSize: 17, fontWeight: 500, color: "var(--ink-900)", lineHeight: 1.45, marginBottom: 10 }}>
          {lang === "en"
            ? <>Open a matter in {product} at 9:02. By 9:03, LexiBridge has it indexed, scored, and 12 relevant precedents waiting.</>
            : <>Vous ouvrez un dossier dans {product} à 9 h 02. À 9 h 03, LexiBridge l'a indexé, scoré, et 12 précédents pertinents vous attendent.</>}
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={() => onNav && onNav("dossiers")} className="lb-chip" style={{
            background: "var(--paper)", border: "1px solid var(--border-2)",
            padding: "7px 12px", borderRadius: 8, fontSize: 12.5, fontWeight: 500,
            cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 6, color: "var(--ink-900)",
          }}>
            <Icon name="folder" size={14}/>{lang === "en" ? "View synced dossier" : "Voir le dossier synchronisé"}
          </button>
        </div>
      </div>

      <div style={{ background: "var(--paper)", border: "1px solid var(--border-1)", borderRadius: 14, padding: "16px 20px" }}>
        <Overline style={{ marginBottom: 12 }}>{lang === "en" ? "Supported today" : "Pris en charge aujourd'hui"}</Overline>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          {[
            { name: "Clio",          state: "live" },
            { name: "JurisConcept",  state: "live" },
            { name: "MyCase",        state: "live" },
            { name: "PracticePanther", state: "soon" },
          ].map((p, i) => (
            <div key={i} style={{
              display: "flex", justifyContent: "space-between", alignItems: "center",
              padding: "9px 12px", border: "1px solid var(--border-1)", borderRadius: 8,
              background: p.state === "live" ? "#E7F0EA" : "var(--paper)",
            }}>
              <span style={{ fontFamily: "var(--font-sans)", fontWeight: 600, fontSize: 13, color: "var(--ink-900)" }}>{p.name}</span>
              <span style={{
                fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 700,
                color: p.state === "live" ? "#1B3D26" : "var(--ink-500)",
              }}>
                {p.state === "live" ? (lang === "en" ? "Live" : "Actif") : (lang === "en" ? "Soon" : "À venir")}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
  );
};

// ═══════════════════════════════════════════════════════════════════
// SECURITY / Barreaux compliance strip
// ═══════════════════════════════════════════════════════════════════
const SecurityStrip = ({ lang }) => {
  const isMobile = useIsMobile(768);
  return (
  <div style={{
    marginTop: 22, background: "#0E1626", color: "#FBF8F2",
    borderRadius: 14, padding: "22px 24px",
    display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1.4fr 1fr 1fr 1fr", gap: isMobile ? 18 : 24, alignItems: "flex-start",
  }}>
    <div>
      <Overline color="#E5A8B1" style={{ marginBottom: 6 }}>{lang === "en" ? "Built for Canadian bars" : "Conçu pour les Barreaux canadiens"}</Overline>
      <div style={{ fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 500, letterSpacing: "-0.01em", lineHeight: 1.25 }}>
        {lang === "en"
          ? <>Confidentiality first. <i style={{ color: "#E5A8B1" }}>Always.</i></>
          : <>Confidentialité d'abord. <i style={{ color: "#E5A8B1" }}>Toujours.</i></>}
      </div>
    </div>
    {[
      { title: lang === "en" ? "Data residency" : "Hébergement",
        body: lang === "en" ? "Servers in Quebec & Ontario. No data crosses the border." : "Serveurs au Québec et en Ontario. Aucune donnée ne traverse la frontière." },
      { title: lang === "en" ? "Privilege preserved" : "Secret professionnel",
        body: lang === "en" ? "Your matters never train a public model. Encrypted at rest, in transit, and in inference." : "Vos dossiers n'alimentent jamais un modèle public. Chiffrement au repos, en transit, en inférence." },
      { title: lang === "en" ? "Bar-aligned" : "Aligné aux Barreaux",
        body: lang === "en" ? "ISO 27001, SOC 2 type II. Reviewed by counsel from the Barreau du Québec and LSO." : "ISO 27001, SOC 2 type II. Revu par des conseillers du Barreau du Québec et du LSO." },
    ].map((s, i) => (
      <div key={i}>
        <div style={{ fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", fontWeight: 700, color: "#E5A8B1", marginBottom: 6 }}>{s.title}</div>
        <div style={{ fontSize: 12.5, lineHeight: 1.5, color: "#D6DCE5" }}>{s.body}</div>
      </div>
    ))}
  </div>
  );
};

Object.assign(window, { Integrations });
