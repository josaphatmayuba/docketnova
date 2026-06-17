/* eslint-disable */
// LexiBridge prototype root. Wires the sidebar, topbar, screens, Tweaks panel,
// and shared `lang` / `density` state.

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "lang": "fr",
  "density": "comfortable",
  "tone": "associate",
  "streamSpeed": 95,
  "showRail": true,
  "layout": "three-col"
}/*EDITMODE-END*/;

// Two small placeholder screens for the "system-wide" features (Scoring 3D,
// Sémantique bilingue). They render an explainer rather than a separate UI
// because both features are visible everywhere in the product.

const ScoringExplainer = ({ lang, onNav }) => (
  <div style={{ flex: 1, overflow: "auto", padding: "40px 36px" }}>
    <div style={{ maxWidth: 760, margin: "0 auto" }}>
      <Overline style={{ marginBottom: 6 }}>{lang === "en" ? "System feature · 02" : "Fonctionnalité système · 02"}</Overline>
      <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 500, fontSize: 44, color: "var(--ink-950)", letterSpacing: "-0.02em", margin: "0 0 8px" }}>
        {lang === "en" ? <>The <i style={{ color: "#7A1F2B" }}>3D Score</i></> : <>Le <i style={{ color: "#7A1F2B" }}>Scoring 3D</i></>}
      </h1>
      <p style={{ fontSize: 16, lineHeight: 1.55, color: "var(--ink-700)", margin: "0 0 28px" }}>
        {lang === "en"
          ? "Every ruling indexed in LexiBridge carries three independent scores. They appear on every search result, every cited case, every alert. Together they tell you, at a glance, whether a precedent is worth citing."
          : "Chaque arrêt indexé dans LexiBridge porte trois scores indépendants. Ils apparaissent sur chaque résultat de recherche, chaque arrêt cité, chaque alerte. Ensemble, ils vous disent en un coup d'œil si un précédent vaut la peine d'être cité."}
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 12, marginBottom: 32 }}>
        {[
          { axis: "aut", name: "Autorité",   en: "Authority",  color: "#6B4A0E", bg: "#FBF3D9", v: 88,
            body: lang === "en" ? "Court hierarchy and binding weight. SCC = 100, Court of Appeal = 80–90." : "Hiérarchie de la cour et force contraignante. CSC = 100, Cour d'appel = 80–90." },
          { axis: "per", name: "Pertinence", en: "Relevance",  color: "#102B57", bg: "#E4ECF5", v: 81,
            body: lang === "en" ? "Semantic match to the current matter or query. Bilingual — handles FR + EN side by side." : "Correspondance sémantique au dossier ou à la requête. Bilingue — gère FR + EN côte à côte." },
          { axis: "sol", name: "Solidité",   en: "Solidity",   color: "#1B3D26", bg: "#E7F0EA", v: 92,
            body: lang === "en" ? "Does the precedent still hold? Drops when a case is distinguished, criticized, or overruled." : "Le précédent tient-il encore ? Chute quand un arrêt est distingué, critiqué ou renversé." },
        ].map((s, i) => (
          <div key={i} style={{ background: s.bg, borderRadius: 12, padding: "18px 20px", border: "1px solid var(--border-1)" }}>
            <div style={{ fontSize: 10, letterSpacing: "0.14em", textTransform: "uppercase", fontWeight: 700, color: s.color, marginBottom: 6 }}>
              {lang === "en" ? s.en : s.name}
            </div>
            <div style={{ fontFamily: "var(--font-display)", fontSize: 44, fontWeight: 500, color: s.color, lineHeight: 1, letterSpacing: "-0.02em" }}>{s.v}</div>
            <p style={{ fontSize: 12.5, color: "var(--ink-700)", lineHeight: 1.5, margin: "12px 0 0" }}>{s.body}</p>
          </div>
        ))}
      </div>

      <div style={{ background: "var(--paper)", border: "1px solid var(--border-1)", borderRadius: 12, padding: "20px 22px", marginBottom: 22 }}>
        <Overline style={{ marginBottom: 14 }}>{lang === "en" ? "Live example" : "Exemple vivant"}</Overline>
        <CaseCard data={CASES.Bombardier}/>
      </div>

      <InkButton icon="search" onClick={() => onNav("search")}>
        {lang === "en" ? "Try in search" : "Essayer dans la recherche"}
      </InkButton>
    </div>
  </div>
);

const BilingualExplainer = ({ lang, onNav }) => {
  const isMobile = useIsMobile(768);
  return (
  <div style={{ flex: 1, overflow: "auto", padding: isMobile ? "24px 16px" : "40px 36px" }}>
    <div style={{ maxWidth: 760, margin: "0 auto" }}>
      <Overline style={{ marginBottom: 6 }}>{lang === "en" ? "System feature · 03" : "Fonctionnalité système · 03"}</Overline>
      <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 500, fontSize: isMobile ? 30 : 44, color: "var(--ink-950)", letterSpacing: "-0.02em", margin: "0 0 8px" }}>
        {lang === "en" ? <><i style={{ color: "#7A1F2B" }}>Bilingual</i> by design</> : <>Bilingue <i style={{ color: "#7A1F2B" }}>par construction</i></>}
      </h1>
      <p style={{ fontSize: 16, lineHeight: 1.55, color: "var(--ink-700)", margin: "0 0 28px" }}>
        {lang === "en"
          ? "Search a French phrase, get English results when they're relevant. Cite a common-law ruling in a civil-law brief without breaking your flow. LexiBridge understands legal nuance across both traditions."
          : "Cherchez en français, obtenez aussi des arrêts en anglais quand ils sont pertinents. Citez un arrêt de common law dans un mémoire civiliste sans interrompre votre cadence. LexiBridge comprend la nuance juridique des deux traditions."}
      </p>

      <div style={{ background: "var(--paper)", border: "1px solid var(--border-1)", borderRadius: 12, overflow: "hidden", marginBottom: 22 }}>
        <div style={{ padding: "14px 18px", background: "#E4ECF5", borderBottom: "1px solid var(--border-1)", display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
          <Icon name="search" size={16} color="#102B57"/>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 13, color: "#102B57", fontWeight: 500, minWidth: 0, wordBreak: "break-word" }}>
            "{lang === "en" ? "dismissal without just cause" : "congédiement sans cause juste"}"
          </span>
          <span style={{ marginLeft: "auto", fontSize: 11, color: "#102B57", fontFamily: "var(--font-mono)" }}>47 ms</span>
        </div>
        <div style={{ padding: "16px 18px", display: "flex", flexDirection: "column", gap: 10 }}>
          {[CASES.Bombardier, CASES.McLeod].map((c, i) => (
            <div key={i} style={{ display: "flex", flexDirection: isMobile ? "column" : "row",
                                  justifyContent: "space-between", alignItems: isMobile ? "stretch" : "center",
                                  padding: "10px 12px", border: "1px solid var(--border-1)", borderRadius: 10, gap: isMobile ? 10 : 14 }}>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontFamily: "var(--font-display)", fontStyle: "italic", fontSize: 15, color: "var(--ink-900)" }}>{c.title}</div>
                <div style={{ display: "flex", gap: 8, marginTop: 3, flexWrap: "wrap", alignItems: "center" }}>
                  <LangTag lang={c.lang}/>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--ink-500)" }}>{c.citation}</span>
                </div>
              </div>
              <div style={{ flexShrink: 0 }}>
                <ScoreTriplet aut={c.aut} per={c.per} sol={c.sol} size="sm"/>
              </div>
            </div>
          ))}
        </div>
        <div style={{ padding: "10px 18px", borderTop: "1px solid var(--border-1)", background: "#FBF8F2",
                      fontSize: 12, color: "var(--ink-600)", display: "flex", alignItems: "center", gap: 8 }}>
          <Icon name="globe" size={13} color="#2B5FA8"/>
          {lang === "en"
            ? "One ruling in French civil law, one in English common law — both surface because the meaning matches."
            : "Un arrêt en droit civil français, un en common law anglaise — les deux remontent parce que le sens correspond."}
        </div>
      </div>

      <InkButton icon="search" onClick={() => onNav("search")}>
        {lang === "en" ? "Try in search" : "Essayer dans la recherche"}
      </InkButton>
    </div>
  </div>
  );
};

// ─── Screen registry ────────────────────────────────────────────────
const SCREENS = {
  dashboard:   { title:  { fr: "Tableau de bord",            en: "Dashboard" },
                 crumb:  { fr: "Bienvenue, Me Côté",          en: "Welcome, Me Côté" },        comp: Dashboard,    chrome: "topbar" },
  assistant:   { title:  { fr: "Assistant conversationnel",  en: "Conversational assistant" },
                 crumb:  { fr: "Dialogue · français + anglais", en: "Dialogue · French + English" }, comp: Assistant, chrome: "topbar" },
  search:      { title:  { fr: "Recherche unifiée",          en: "Unified search" },
                 crumb:  { fr: "Toute la jurisprudence canadienne", en: "Full Canadian jurisprudence" }, comp: Search, chrome: "topbar" },
  scoring:     { title:  { fr: "Scoring 3D",                 en: "3D Scoring" },
                 crumb:  { fr: "Fonctionnalité système",      en: "System feature" },          comp: ScoringExplainer, chrome: "topbar" },
  bilingual:   { title:  { fr: "Sémantique bilingue",        en: "Bilingual semantic" },
                 crumb:  { fr: "Fonctionnalité système",      en: "System feature" },          comp: BilingualExplainer, chrome: "topbar" },
  revirements: { title:  { fr: "Revirements",              en: "Reversals" },
                 crumb:  { fr: "Recherche par revirement",    en: "Search by reversal" },         comp: ReversalsList, chrome: "topbar" },
  "reversal-detail": { title: { fr: "Détection de revirements", en: "Reversal detection" },
                 crumb:  { fr: "Vigie · 247 décisions suivies", en: "Watch · 247 rulings tracked" }, comp: Revirements, chrome: "topbar" },
  "judges":     { title:  { fr: "Juges",                    en: "Judges" },
                 crumb:  { fr: "Recherche par juge",          en: "Search by judge" },         comp: JudgesList,   chrome: "topbar" },
  "judge-detail": { title: { fr: "L'hon. Hélène Côté",         en: "Hon. Hélène Côté" },
                 crumb:  { fr: "Profil judiciaire",            en: "Judicial profile" },        comp: Judge,        chrome: "topbar" },
  cartography: { title:  { fr: "Cartographie",            en: "Cartography" },
                 crumb:  { fr: "Recherche par réseau",        en: "Search by network" },       comp: CartographyList, chrome: "topbar" },
  "cartography-detail": { title: { fr: "Cartographie",        en: "Cartography" },
                 crumb:  { fr: "Réseau de citations",          en: "Citation network" },       comp: Cartography,  chrome: "topbar" },
  argumentaires:{ title: { fr: "Argumentaires",             en: "Arguments" },
                 crumb:  { fr: "Recherche par argument",       en: "Search by argument" },    comp: ArgumentairesList, chrome: "topbar" },
  "argumentaire-detail":{ title: { fr: "Argumentaires",       en: "Argument drafting" },
                 crumb:  { fr: "Rédaction assistée",            en: "Assisted drafting" },     comp: Argumentaires, chrome: "none" },
  alerts:      { title:  { fr: "Alertes",                    en: "Alerts" },
                 crumb:  { fr: "Vigie automatique",            en: "Automatic watch" },         comp: Alerts,       chrome: "topbar" },
  integrations:{ title:  { fr: "Écosystème connecté",          en: "Connected ecosystem" },
                 crumb:  { fr: "Word · Outlook · Clio",          en: "Word · Outlook · Clio" },     comp: Integrations, chrome: "topbar" },
  dossiers:    { title:  { fr: "Gestion de dossier",        en: "Matter management" },
                 crumb:  { fr: "Clio-like interface",           en: "Clio-like interface" },    comp: DossiersList, chrome: "topbar" },
  "documents": { title:  { fr: "Rédacteur de documents",     en: "Document builder" },
                 crumb:  { fr: "Requête · Mémoire · Appel",    en: "Motion · Brief · Appeal" },    comp: DocumentBuilder, chrome: "topbar" },
  "dossier-dupont": { title: { fr: "Dupont c. Industries XYZ",   en: "Dupont c. Industries XYZ" },
                 crumb:  { fr: "Dossier · Travail",             en: "Matter · Labour" },       comp: Dossier,      chrome: "topbar" },
  "dossier-tremblay": { title: { fr: "Tremblay c. PG du Québec",  en: "Tremblay c. PG of Québec" },
                 crumb:  { fr: "Dossier · Famille",             en: "Matter · Family" },       comp: Dossier,      chrome: "topbar" },
  "dossier-lapointe": { title: { fr: "Lapointe c. CHUM",          en: "Lapointe c. CHUM" },
                 crumb:  { fr: "Dossier · Médical",             en: "Matter · Medical" },      comp: Dossier,      chrome: "topbar" },
  "dossier-roy": { title: { fr: "Roy c. Trudel",                 en: "Roy c. Trudel" },
                 crumb:  { fr: "Dossier · Contrat",             en: "Matter · Contract" },     comp: Dossier,      chrome: "topbar" },
  "dossier-beaulieu": { title: { fr: "R. c. Beaulieu",           en: "R. v. Beaulieu" },
                 crumb:  { fr: "Dossier · Criminel",            en: "Matter · Criminal" },     comp: Dossier,      chrome: "topbar" },
  "dossier-lemieux": { title: { fr: "R. c. Lemieux",            en: "R. v. Lemieux" },
                 crumb:  { fr: "Dossier · Criminel",            en: "Matter · Criminal" },     comp: Dossier,      chrome: "topbar" },
  "doc-editor":    { title:  { fr: "Rédacteur de documents",     en: "Document editor" },
                 crumb:  { fr: "Rédaction avec IA",             en: "Draft with AI" },         comp: DocumentEditorPro, chrome: "topbar" },
};

const App = () => {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const [active, setActive] = React.useState("dashboard");
  const [scenarioId, setScenarioId] = React.useState("dupont");
  const isMobile = useIsMobile(768);
  const [navOpen, setNavOpen] = React.useState(false);

  // Langue initiale = langue du navigateur (en/fr), une seule fois au montage.
  // L'utilisateur peut ensuite la changer via le sélecteur FR/EN.
  const langInit = React.useRef(false);
  React.useEffect(() => {
    if (langInit.current) return;
    langInit.current = true;
    // FR si le navigateur est en français, sinon EN par défaut.
    const nav = (navigator.language || navigator.userLanguage || "en").toLowerCase();
    const lang = nav.startsWith("fr") ? "fr" : "en";
    if (lang !== t.lang) setTweak("lang", lang);
  }, []);

  const screen = SCREENS[active] || SCREENS.dashboard;
  // Lazy-resolve DossiersClioBrowser from window in case it wasn't loaded yet
  let Comp = screen.comp;
  if (active === "dossiers" && typeof Comp === "string") {
    Comp = window.DossiersClioBrowser || Dashboard;
  } else if (typeof Comp === "string" && window[Comp]) {
    Comp = window[Comp];
  }
  Comp = Comp || Dashboard;
  
  const screenId = active;

  const handleNav = (id) => {
    setActive(id);
    // When the user navigates to Assistant via a deep link, reset to dupont.
    if (id === "assistant" && !scenarioId) setScenarioId("dupont");
  };

  const handleScenario = (id) => {
    setScenarioId(id);
    setActive("assistant");
  };

  return (
    <div style={{
      display: "flex", height: "100vh", width: "100vw",
      background: "var(--bg-app)", overflow: "hidden",
    }}>
      <Sidebar active={active} onNav={handleNav} density={t.density}
               isMobile={isMobile} open={navOpen} onClose={() => setNavOpen(false)}/>

      {/* Overlay sombre derrière le tiroir (mobile uniquement) */}
      {isMobile && navOpen && (
        <div onClick={() => setNavOpen(false)} style={{
          position: "fixed", inset: 0, zIndex: 40,
          background: "rgba(14,22,38,0.45)",
        }}/>
      )}

      <div data-screen-label={tr(screen.title, t.lang)} style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0, minHeight: 0 }}>
        {screen.chrome === "topbar" ? (
          <Topbar
            title={tr(screen.title, t.lang)}
            breadcrumb={tr(screen.crumb, t.lang)}
            lang={t.lang}
            onLang={(l) => setTweak("lang", l)}
            isMobile={isMobile}
            onMenu={() => setNavOpen(true)}
          />
        ) : (
          // Écrans sans topbar : bouton menu flottant sur mobile
          isMobile && (
            <button onClick={() => setNavOpen(true)} aria-label="Menu" style={{
              position: "fixed", top: 12, left: 12, zIndex: 30,
              width: 40, height: 40, borderRadius: 10,
              background: "var(--paper)", border: "1px solid var(--border-2)",
              boxShadow: "0 2px 8px rgba(14,22,38,0.12)",
              display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer",
            }}>
              <Icon name="menu" size={20} color="var(--ink-900)"/>
            </button>
          )
        )}
        <Comp
          tweaks={t}
          lang={t.lang}
          density={t.density}
          onNav={handleNav}
          scenarioId={scenarioId}
          onScenario={handleScenario}
          screenId={screenId}
          style={{ flex: 1, minHeight: 0 }}
        />
      </div>

      <TweaksPanel>
        <TweakSection label={t.lang === "en" ? "Conversation" : "Conversation"}/>
        <TweakRadio
          label={t.lang === "en" ? "Language" : "Langue"}
          value={t.lang}
          options={[
            { value: "fr", label: "Français" },
            { value: "en", label: "English" },
          ]}
          onChange={(v) => setTweak("lang", v)}
        />
        <TweakRadio
          label={t.lang === "en" ? "Tone" : "Ton"}
          value={t.tone}
          options={[
            { value: "associate", label: t.lang === "en" ? "Associate" : "Associé" },
            { value: "teacher",   label: t.lang === "en" ? "Teacher"   : "Pédagogue" },
            { value: "brief",     label: t.lang === "en" ? "Brief"     : "Bref" },
          ]}
          onChange={(v) => setTweak("tone", v)}
        />
        <TweakSlider
          label={t.lang === "en" ? "Streaming speed" : "Vitesse de streaming"}
          value={t.streamSpeed} min={20} max={300} step={5} unit=" c/s"
          onChange={(v) => setTweak("streamSpeed", v)}
        />

        <TweakSection label={t.lang === "en" ? "Layout" : "Mise en page"}/>
        <TweakRadio
          label={t.lang === "en" ? "Density" : "Densité"}
          value={t.density}
          options={[
            { value: "compact",      label: t.lang === "en" ? "Compact" : "Compacte" },
            { value: "comfortable",  label: t.lang === "en" ? "Comfy"   : "Confort." },
          ]}
          onChange={(v) => setTweak("density", v)}
        />
        <TweakRadio
          label={t.lang === "en" ? "Columns" : "Colonnes"}
          value={t.layout}
          options={[
            { value: "two-col",   label: t.lang === "en" ? "2 cols" : "2 col." },
            { value: "three-col", label: t.lang === "en" ? "3 cols" : "3 col." },
          ]}
          onChange={(v) => setTweak("layout", v)}
        />
        <TweakToggle
          label={t.lang === "en" ? "Sources rail" : "Panneau Sources"}
          value={t.showRail}
          onChange={(v) => setTweak("showRail", v)}
        />

        <TweakSection label={t.lang === "en" ? "Scenarios" : "Scénarios"}/>
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          {SCENARIOS.map((s) => (
            <button key={s.id} onClick={() => handleScenario(s.id)} style={{
              display: "flex", alignItems: "center", gap: 8,
              padding: "6px 8px", border: 0, borderRadius: 5,
              background: scenarioId === s.id && active === "assistant" ? "rgba(122,31,43,0.10)" : "transparent",
              cursor: "pointer", textAlign: "left", width: "100%",
              font: "11.5px/1.4 ui-sans-serif, system-ui, sans-serif",
              color: scenarioId === s.id && active === "assistant" ? "#7A1F2B" : "rgba(41,38,27,.85)",
              fontWeight: scenarioId === s.id && active === "assistant" ? 600 : 500,
            }}>
              <span style={{ width: 12, display: "flex", alignItems: "center", justifyContent: "center" }}>
                {scenarioId === s.id && active === "assistant" ? "▸" : <span style={{ width: 4, height: 4, borderRadius: 999, background: "rgba(41,38,27,.35)" }}/>}
              </span>
              {tr(s.label, t.lang)}
            </button>
          ))}
        </div>
      </TweaksPanel>
    </div>
  );
};

ReactDOM.createRoot(document.getElementById("root")).render(<App/>);
