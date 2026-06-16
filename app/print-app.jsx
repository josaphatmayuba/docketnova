/* eslint-disable */
// Print build — renders the five most-important screens in sequence,
// each on its own page. Streaming is disabled so the assistant's content
// is fully visible. Reuses every existing screen component as-is.

const PRINT_PAGES = [
  { id: "dashboard",   comp: Dashboard,   title: "Tableau de bord",            crumb: "Bienvenue, Me Côté" },
  { id: "assistant",   comp: Assistant,   title: "Assistant conversationnel",  crumb: "Dossier Dupont · audience demain",
    props: { scenarioId: "dupont", onScenario: () => {} } },
  { id: "search",      comp: Search,      title: "Recherche unifiée",          crumb: "Toute la jurisprudence canadienne" },
  { id: "revirements", comp: Revirements, title: "Détection de revirements",   crumb: "Vigie · 247 décisions suivies" },
  { id: "judges",      comp: Judge,       title: "L'hon. Hélène Côté",         crumb: "Profil judiciaire" },
  { id: "cartography", comp: Cartography, title: "Cartographie",               crumb: "Réseau de citations" },
  { id: "argumentaires",comp: Argumentaires, title: "Argumentaires",           crumb: "Rédaction assistée", chrome: "none" },
  { id: "alerts",      comp: Alerts,      title: "Alertes",                    crumb: "Vigie automatique" },
  { id: "integrations",comp: Integrations,title: "Écosystème connecté",        crumb: "Word · Outlook · Clio" },
  { id: "dossiers",    comp: Dossier,     title: "Dupont c. Industries XYZ",   crumb: "Dossier · Travail" },
];

const PRINT_TWEAKS = {
  lang: "fr", density: "comfortable", tone: "associate",
  streamSpeed: 100000, // effectively instant
  showRail: true, layout: "three-col",
};

const PrintApp = () => {
  // Force every AiMessage to consider itself "done" — we override the
  // streaming hook globally by setting a very high speed so the
  // RAF resolves instantly.
  return (
    <div className="print-deck">
      {PRINT_PAGES.map((p, i) => {
        const Comp = p.comp;
        return (
          <section key={p.id} className="print-page" data-page={p.title}>
            <div className="print-chrome">
              <Sidebar active={p.id} onNav={() => {}} density={PRINT_TWEAKS.density}/>
              <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
                {p.chrome !== "none" && (
                  <Topbar
                    title={p.title}
                    breadcrumb={p.crumb}
                    lang="fr"
                    onLang={() => {}}
                  />
                )}
                <Comp
                  tweaks={PRINT_TWEAKS}
                  lang="fr"
                  density="comfortable"
                  onNav={() => {}}
                  scenarioId="dupont"
                  onScenario={() => {}}
                  playAll={true}
                  {...(p.props || {})}
                />
              </div>
            </div>
          </section>
        );
      })}
    </div>
  );
};

ReactDOM.createRoot(document.getElementById("root")).render(<PrintApp/>);

// Auto-print once fonts + Babel-compiled scripts have settled.
(function autoPrint() {
  const ready = async () => {
    if (document.fonts && document.fonts.ready) {
      try { await document.fonts.ready; } catch (e) {}
    }
    // Extra slack so the streamed text completes (even at fast speed, the
    // first RAF tick happens after mount).
    await new Promise((r) => setTimeout(r, 1500));
    window.print();
  };
  if (document.readyState === "complete") ready();
  else window.addEventListener("load", ready);
})();
