/* eslint-disable */
// Dossiers List — Clio-like matter management. Group by client, new matter button, full list view.

const MATTERS = [
  {
    id: "dupont", client: "Pierre Dupont", clientPhone: "(514) 555-0123",
    name: "Dupont c. Industries XYZ",
    area: { fr: "Travail · congédiement", en: "Labour · dismissal" },
    court: { fr: "Cour supérieure du Québec", en: "Quebec Superior Court" },
    docket: "500-17-128744-241", judge: "L'hon. Hélène Côté",
    next: { fr: "Audience demain · 9 h 30", en: "Hearing tomorrow · 9:30 AM" },
    hot: true, sol: 76, per: 81, aut: 78, sources: 12, todo: 2,
    nudge: { fr: "L'employeur citera *Gagnon* — réplique prête, Sol 41 %.", en: "Employer will cite *Gagnon* — reply ready, Sol 41%." },
    detail: "dossier-dupont",
  },
  {
    id: "tremblay", client: "Sophie Tremblay", clientPhone: "(514) 555-0456",
    name: "Tremblay c. PG du Québec",
    area: { fr: "Famille · garde partagée", en: "Family · shared custody" },
    court: { fr: "Cour supérieure du Québec", en: "Quebec Superior Court" },
    docket: "200-12-088210-244", judge: "L'hon. Marc Bernier",
    next: { fr: "Jeudi 14 h", en: "Thursday 2 PM" },
    hot: false, sol: 79, per: 88, aut: 70, sources: 9, todo: 1,
    nudge: { fr: "Point faible : la distance. Argument *continuité scolaire* construit.", en: "Weak point: distance. *School-continuity* argument built." },
    detail: "dossier-tremblay",
    syncedFrom: "practicepanther",
  },
  {
    id: "lapointe", client: "Marc Lapointe", clientPhone: "(514) 555-0789",
    name: "Lapointe c. CHUM",
    area: { fr: "Responsabilité médicale", en: "Medical liability" },
    court: { fr: "Cour supérieure du Québec", en: "Quebec Superior Court" },
    docket: "500-17-130044-258", judge: { fr: "À désigner", en: "To be assigned" },
    next: { fr: "Mémoire dû · 18 mai", en: "Brief due · May 18" },
    hot: false, sol: 71, per: 92, aut: 72, sources: 14, todo: 4,
    nudge: { fr: "Trois arrêts récents renforcent le devoir d'information. *Therrien* (2024) à citer.", en: "Three recent rulings reinforce the duty to inform. Cite *Therrien* (2024)." },
    detail: "dossier-lapointe",
    syncedFrom: "mycase",
  },
  {
    id: "roy", client: "Robert Roy", clientPhone: "(514) 555-0321",
    name: "Roy c. Trudel",
    area: { fr: "Contrat commercial", en: "Commercial contract" },
    court: { fr: "Cour du Québec", en: "Court of Québec" },
    docket: "500-22-298021-237", judge: "L'hon. Sylvie Dubois",
    next: { fr: "Aucun délai urgent", en: "No urgent deadline" },
    hot: false, sol: 58, per: 64, aut: 60, sources: 6, todo: 0,
    nudge: { fr: "Recherche complémentaire en pause — aucune évolution depuis 11 jours.", en: "Research paused — no movement in 11 days." },
    detail: "dossier-roy",
    syncedFrom: "clio",
  },
  {
    id: "beaulieu", client: "Jean Beaulieu (défendeur)", clientPhone: "(514) 555-0654",
    name: "R. c. Beaulieu",
    area: { fr: "Criminel · stupéfiants", en: "Criminal · narcotics" },
    court: { fr: "Cour supérieure · chambre criminelle", en: "Superior Court · Criminal" },
    docket: "500-01-209441-241", judge: "L'hon. Pierre Lacasse",
    next: { fr: "Requête 24-1 · lundi 9 h", en: "24-1 motion · Monday 9 AM" },
    hot: true, sol: 82, per: 90, aut: 80, sources: 11, todo: 1,
    nudge: { fr: "Fouille sans mandat — *R. c. Grant* favorise l'exclusion de la preuve (art. 24(2) Charte).", en: "Warrantless search — *R. c. Grant* favours exclusion under s. 24(2) of the Charter." },
    detail: "dossier-beaulieu",
  },
  {
    id: "lemieux", client: "Claude Lemieux (défendeur)", clientPhone: "(514) 555-0987",
    name: "R. c. Lemieux",
    area: { fr: "Criminel · voies de fait graves", en: "Criminal · aggravated assault" },
    court: { fr: "Cour du Québec · chambre criminelle", en: "Court of Québec · Criminal" },
    docket: "500-01-211089-258", judge: "L'hon. Marie-Claude Audet",
    next: { fr: "Procès · 27 mai", en: "Trial · May 27" },
    hot: false, sol: 64, per: 78, aut: 70, sources: 8, todo: 2,
    nudge: { fr: "Procès approche — préparer les témoins clés.", en: "Trial approaching — prepare key witnesses." },
    detail: "dossier-lemieux",
  },
];

const DossiersList = ({ lang, onNav, density }) => {
  const [filter, setFilter] = React.useState("all");
  const [searchText, setSearchText] = React.useState("");
  const [showNewMatterModal, setShowNewMatterModal] = React.useState(false);
  const [newMatter, setNewMatter] = React.useState({
    clientName: "",
    matterName: "",
    area: "labour",
    court: "quebec-superior",
    docket: "",
    judge: ""
  });

  const createNewMatter = () => {
    if (!newMatter.clientName.trim() || !newMatter.matterName.trim()) return;
    // TODO: API call to create matter
    console.log("Creating new matter:", newMatter);
    setShowNewMatterModal(false);
    setNewMatter({ clientName: "", matterName: "", area: "labour", court: "quebec-superior", docket: "", judge: "" });
  };
  
  // Group matters by client
  const clientMap = {};
  MATTERS.forEach(m => {
    if (!clientMap[m.client]) clientMap[m.client] = [];
    clientMap[m.client].push(m);
  });

  // Filter
  const filtered = Object.entries(clientMap).reduce((acc, [client, matters]) => {
    let mats = matters;
    if (filter === "hot") mats = mats.filter(m => m.hot);
    if (searchText) mats = mats.filter(m => m.name.toLowerCase().includes(searchText.toLowerCase()) || client.toLowerCase().includes(searchText.toLowerCase()));
    if (mats.length > 0) acc[client] = mats;
    return acc;
  }, {});

  const totalMatters = Object.values(filtered).reduce((sum, mats) => sum + mats.length, 0);

  const MatterRow = ({ m }) => (
    <div style={{
      padding: "12px 14px", borderRadius: 8, border: "1px solid var(--border-1)",
      background: "var(--paper)", display: "flex", alignItems: "center", gap: 12,
    }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 3 }}>
          <div style={{ fontFamily: "var(--font-display)", fontStyle: "italic", fontSize: 14, fontWeight: 500, color: "var(--ink-950)" }}>
            {m.name}
          </div>
          {m.syncedFrom && (
            <span style={{
              fontSize: 10, fontWeight: 600, padding: "3px 8px", borderRadius: 3,
              background: m.syncedFrom === "clio" ? "#E8F0FF" : m.syncedFrom === "practicepanther" ? "#FFF3E0" : "#F3E5F5",
              color: m.syncedFrom === "clio" ? "#0066CC" : m.syncedFrom === "practicepanther" ? "#D97757" : "#7A1F2B",
              textTransform: "uppercase", letterSpacing: "0.05em",
              display: "inline-flex", alignItems: "center", gap: 5
            }}>
              {m.syncedFrom === "clio" ? (
                <>
                  <img src="data:image/svg+xml,%3Csvg width='16' height='16' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='50' cy='50' r='45' fill='%230066CC'/%3E%3Cpath d='M35 50L45 60L65 35' stroke='white' stroke-width='6' fill='none' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E" alt="Clio" style={{width: 14, height: 14}}/>
                  Clio
                </>
              ) : m.syncedFrom === "practicepanther" ? (
                <>
                  <img src="data:image/svg+xml,%3Csvg width='16' height='16' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M50 10L20 30V60C20 80 50 95 50 95C50 95 80 80 80 60V30L50 10Z' fill='%23D97757' stroke='%23D97757' stroke-width='2'/%3E%3Ctext x='50' y='60' font-size='40' font-weight='bold' fill='white' text-anchor='middle'%3EP%3C/text%3E%3C/svg%3E" alt="PracticePanther" style={{width: 14, height: 14}}/>
                  PracticePanther
                </>
              ) : (
                <>
                  <img src="data:image/svg+xml,%3Csvg width='16' height='16' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Crect x='20' y='15' width='60' height='75' rx='4' fill='%237A1F2B' stroke='%237A1F2B' stroke-width='2'/%3E%3Cline x1='35' y1='35' x2='65' y2='35' stroke='white' stroke-width='3' stroke-linecap='round'/%3E%3Cline x1='35' y1='50' x2='65' y2='50' stroke='white' stroke-width='3' stroke-linecap='round'/%3E%3Cline x1='35' y1='65' x2='65' y2='65' stroke='white' stroke-width='3' stroke-linecap='round'/%3E%3C/svg%3E" alt="MyCase" style={{width: 14, height: 14}}/>
                  MyCase
                </>
              )}
            </span>
          )}
        </div>
        <div style={{ display: "flex", gap: 10, fontSize: 11, color: "var(--ink-600)" }}>
          <span>{tr(m.area, lang)}</span>
          <span>·</span>
          <span>{m.docket}</span>
          <span>·</span>
          <span>{m.hot && "⚠ "}{tr(m.next, lang)}</span>
        </div>
      </div>
      <div style={{ display: "flex", gap: 6 }}>
        <button onClick={() => onNav && onNav("assistant")} className="lb-chip" style={{
          background: "var(--paper)", border: "1px solid var(--border-2)",
          padding: "6px 11px", borderRadius: 6, fontSize: 11, fontWeight: 600,
          cursor: "pointer", color: "var(--ink-900)", display: "inline-flex", alignItems: "center", gap: 5,
        }}><Icon name="chat" size={11}/>{lang === "en" ? "Brief" : "Briefer"}</button>
        <button onClick={() => onNav && onNav(m.detail)} className="lb-chip" style={{
          background: "var(--paper)", border: "1px solid var(--border-2)",
          padding: "6px 11px", borderRadius: 6, fontSize: 11, fontWeight: 600,
          cursor: "pointer", color: "var(--ink-900)", display: "inline-flex", alignItems: "center", gap: 5,
        }}><Icon name="folder" size={11}/>{lang === "en" ? "Open" : "Ouvrir"}</button>
      </div>
    </div>
  );

  return (
    <div style={{ flex: 1, overflow: "auto", padding: "28px 36px 48px", minHeight: 0 }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 20 }}>
          <div>
            <Overline style={{ marginBottom: 4 }}>{lang === "en" ? "Matter management" : "Gestion de dossier"}</Overline>
            <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 500, fontSize: 34, color: "var(--ink-950)", letterSpacing: "-0.02em", margin: 0 }}>
              {lang === "en" ? "Your active matters" : "Vos dossiers actifs"}
            </h1>
          </div>
          <button onClick={() => setShowNewMatterModal(true)} style={{
            padding: "10px 16px", borderRadius: 8, border: 0, background: "#7A1F2B",
            color: "#FBF8F2", cursor: "pointer", fontWeight: 600, fontSize: 13,
            display: "inline-flex", alignItems: "center", gap: 8,
          }}>
            <Icon name="plus" size={14} color="#FBF8F2"/>{lang === "en" ? "New matter" : "+ Nouveau dossier"}
          </button>
        </div>

        {/* Search + Filter */}
        <div style={{ display: "flex", gap: 12, marginBottom: 22 }}>
          <input type="text" placeholder={lang === "en" ? "Search by matter or client…" : "Rechercher par dossier ou client…"}
            value={searchText} onChange={(e) => setSearchText(e.target.value)}
            style={{
              flex: 1, padding: "10px 14px", border: "1px solid var(--border-2)", borderRadius: 8,
              fontFamily: "var(--font-sans)", fontSize: 13, background: "var(--paper)",
              color: "var(--ink-900)",
            }}
          />
          <button onClick={() => setFilter(filter === "hot" ? "all" : "hot")} style={{
            padding: "10px 14px", borderRadius: 8, border: "1px solid " + (filter === "hot" ? "var(--oxblood-700)" : "var(--border-2)"),
            background: filter === "hot" ? "var(--oxblood-50)" : "var(--paper)",
            color: filter === "hot" ? "var(--oxblood-700)" : "var(--ink-700)",
            cursor: "pointer", fontSize: 12, fontWeight: 600, display: "inline-flex", gap: 6, alignItems: "center",
          }}>
            <Icon name="alert" size={12}/>{lang === "en" ? "Hot" : "Urgent"}
          </button>
        </div>

        {/* Stats strip */}
        <div style={{
          background: "var(--paper)", border: "1px solid var(--border-1)", borderRadius: 12,
          padding: "12px 18px", display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 0, marginBottom: 22,
        }}>
          <div style={{ borderRight: "1px solid var(--border-2)", paddingRight: 18 }}>
            <div style={{ fontSize: 10, fontWeight: 600, color: "var(--ink-500)", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 4 }}>
              {lang === "en" ? "Total matters" : "Dossiers au total"}
            </div>
            <div style={{ fontFamily: "var(--font-display)", fontSize: 28, fontWeight: 500, color: "#7A1F2B" }}>
              {totalMatters}
            </div>
          </div>
          <div style={{ borderRight: "1px solid var(--border-2)", paddingLeft: 18, paddingRight: 18 }}>
            <div style={{ fontSize: 10, fontWeight: 600, color: "var(--ink-500)", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 4 }}>
              {lang === "en" ? "Clients" : "Clients"}
            </div>
            <div style={{ fontFamily: "var(--font-display)", fontSize: 28, fontWeight: 500, color: "#2B5FA8" }}>
              {Object.keys(filtered).length}
            </div>
          </div>
          <div style={{ borderRight: "1px solid var(--border-2)", paddingLeft: 18, paddingRight: 18 }}>
            <div style={{ fontSize: 10, fontWeight: 600, color: "var(--ink-500)", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 4 }}>
              {lang === "en" ? "Hot matters" : "Dossiers urgents"}
            </div>
            <div style={{ fontFamily: "var(--font-display)", fontSize: 28, fontWeight: 500, color: "#C8941F" }}>
              {Object.values(filtered).reduce((sum, mats) => sum + mats.filter(m => m.hot).length, 0)}
            </div>
          </div>
          <div style={{ paddingLeft: 18 }}>
            <div style={{ fontSize: 10, fontWeight: 600, color: "var(--ink-500)", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 4 }}>
              {lang === "en" ? "To-dos" : "À faire"}
            </div>
            <div style={{ fontFamily: "var(--font-display)", fontSize: 28, fontWeight: 500, color: "#1B3D26" }}>
              {Object.values(filtered).reduce((sum, mats) => sum + mats.reduce((s, m) => s + m.todo, 0), 0)}
            </div>
          </div>
        </div>

        {/* Clients grouped */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {Object.entries(filtered).map(([client, matters]) => (
            <div key={client}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
                <Icon name="user" size={18} color="#7A1F2B"/>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 600, color: "var(--ink-950)" }}>{client}</div>
                  {matters[0].clientPhone && <div style={{ fontSize: 11, color: "var(--ink-600)" }}>{matters[0].clientPhone}</div>}
                </div>
                <span style={{ marginLeft: "auto", fontSize: 11, color: "var(--ink-500)", fontWeight: 600 }}>
                  {matters.length} {lang === "en" ? "matter(s)" : "dossier(s)"}
                </span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {matters.map(m => <MatterRow key={m.id} m={m}/>)}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* New Matter Modal */}
      {showNewMatterModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 3000, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ background: "white", borderRadius: 12, padding: "32px", maxWidth: 500, width: "90%", maxHeight: "90vh", overflow: "auto", boxShadow: "0 10px 40px rgba(0,0,0,0.3)" }}>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: 24, fontWeight: 500, color: "var(--ink-950)", marginBottom: 24, margin: "0 0 24px" }}>
              {lang === "en" ? "Create new matter" : "Créer un nouveau dossier"}
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div>
                <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "var(--ink-700)", marginBottom: 6 }}>
                  {lang === "en" ? "Client name" : "Nom du client"}
                </label>
                <input type="text" value={newMatter.clientName} onChange={(e) => setNewMatter({ ...newMatter, clientName: e.target.value })} placeholder={lang === "en" ? "John Smith" : "Jean Dupont"} style={{ width: "100%", padding: "10px 12px", border: "1px solid var(--border-2)", borderRadius: 6, fontSize: 13, boxSizing: "border-box" }} />
              </div>
              <div>
                <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "var(--ink-700)", marginBottom: 6 }}>
                  {lang === "en" ? "Matter name" : "Nom du dossier"}
                </label>
                <input type="text" value={newMatter.matterName} onChange={(e) => setNewMatter({ ...newMatter, matterName: e.target.value })} placeholder={lang === "en" ? "Smith v. ABC Corp" : "Dupont c. Industries XYZ"} style={{ width: "100%", padding: "10px 12px", border: "1px solid var(--border-2)", borderRadius: 6, fontSize: 13, boxSizing: "border-box" }} />
              </div>
              <div>
                <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "var(--ink-700)", marginBottom: 6 }}>
                  {lang === "en" ? "Practice area" : "Domaine"}
                </label>
                <select value={newMatter.area} onChange={(e) => setNewMatter({ ...newMatter, area: e.target.value })} style={{ width: "100%", padding: "10px 12px", border: "1px solid var(--border-2)", borderRadius: 6, fontSize: 13, boxSizing: "border-box", background: "var(--paper)" }}>
                  <option value="labour">{lang === "en" ? "Labour" : "Travail"}</option>
                  <option value="family">{lang === "en" ? "Family" : "Famille"}</option>
                  <option value="criminal">{lang === "en" ? "Criminal" : "Criminel"}</option>
                </select>
              </div>
              <div style={{ display: "flex", gap: 12, marginTop: 20 }}>
                <button onClick={() => setShowNewMatterModal(false)} style={{ flex: 1, padding: "10px 16px", border: "1px solid var(--border-2)", background: "var(--paper)", borderRadius: 6, cursor: "pointer", fontWeight: 600, fontSize: 13 }}>
                  {lang === "en" ? "Cancel" : "Annuler"}
                </button>
                <button onClick={createNewMatter} disabled={!newMatter.clientName.trim() || !newMatter.matterName.trim()} style={{ flex: 1, padding: "10px 16px", border: 0, background: !newMatter.clientName.trim() || !newMatter.matterName.trim() ? "var(--ink-300)" : "#7A1F2B", color: "white", borderRadius: 6, cursor: "pointer", fontWeight: 600, fontSize: 13, opacity: !newMatter.clientName.trim() || !newMatter.matterName.trim() ? 0.5 : 1 }}>
                  {lang === "en" ? "Create" : "Créer"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

Object.assign(window, { DossiersList });
