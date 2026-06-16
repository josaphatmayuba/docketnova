/* eslint-disable */
// Gestion de dossier — Clio-like interface with hierarchical dossier view,
// tabbed detail, advanced filtering, Clio palette (navy + cyan).

const CLIO_PALETTE = {
  navy:     "#1F2937",
  slate:    "#374151",
  gray:     "#6B7280",
  border:   "#E5E7EB",
  bg:       "#F9FAFB",
  accent:   "#06B6D4",
  success:  "#10B981",
  warn:     "#F59E0B",
  danger:   "#EF4444",
};

const DOSSIERS_CLIO = [
  {
    id: "dupont",
    parties: "Dupont c. Industries XYZ",
    type: { fr: "Travail", en: "Labour" },
    court: { fr: "Cour supérieure", en: "Superior Court" },
    docket: "500-17-098765-213",
    opened: "2025-09-15",
    status: "active",
    nextEvent: { fr: "Audience demain · 9 h 30", en: "Hearing tomorrow · 9:30" },
    strength: 76,
    documents: 23,
    notes: 8,
    communications: 12,
    sections: [
      { id: "pleadings", label: { fr: "Mémoires et requêtes", en: "Pleadings & Motions" }, count: 7 },
      { id: "evidence", label: { fr: "Preuve", en: "Evidence" }, count: 5 },
      { id: "comms", label: { fr: "Communications", en: "Communications" }, count: 12 },
      { id: "notes", label: { fr: "Notes", en: "Notes" }, count: 8 },
    ],
    content: {
      pleadings: [
        { name: "Mémoire principal", date: "2026-05-17", size: "2.3 MB", author: "Me Côté" },
        { name: "Requête en réintégration", date: "2026-05-14", size: "845 KB", author: "Me Côté" },
        { name: "Réplique à Gagnon", date: "2026-05-12", size: "1.1 MB", author: "Me Côté" },
      ],
      evidence: [
        { name: "Contrat de travail signé", date: "2025-09-15", size: "512 KB" },
        { name: "Correspondance RH (2024-2025)", date: "2026-03-20", size: "3.2 MB" },
        { name: "Témoignage expert — salaires (Qc)", date: "2026-04-10", size: "1.8 MB" },
      ],
      comms: [
        { from: "Couronne", subject: "Report de l'audience", date: "2026-05-16" },
        { from: "Me Côté", subject: "Stratégie pour la plaidoirie", date: "2026-05-14" },
        { from: "Cabinet", subject: "Facturation mai 2026", date: "2026-05-10" },
      ],
      notes: [
        { title: "Points clés pour la plaidoirie", date: "2026-05-12", preview: "Le juge Côté est sensible à…" },
        { title: "Vulnérabilité Dupont — établir", date: "2026-05-11", preview: "Salarié senior, âge 58, licenciement…" },
      ],
    },
  },
  {
    id: "beaulieu",
    parties: "R. c. Beaulieu",
    type: { fr: "Criminel · stup.", en: "Criminal · narcotics" },
    court: { fr: "Cour supérieure", en: "Superior Court" },
    docket: "500-01-209441-241",
    opened: "2025-11-03",
    status: "active",
    nextEvent: { fr: "Requête 24-1 · lundi 9 h", en: "24-1 motion · Monday 9 AM" },
    strength: 82,
    documents: 18,
    notes: 6,
    communications: 9,
    sections: [
      { id: "pleadings", label: { fr: "Requêtes et motions", en: "Motions" }, count: 4 },
      { id: "evidence", label: { fr: "Preuve (fouille)", en: "Search evidence" }, count: 6 },
      { id: "comms", label: { fr: "Correspondance", en: "Correspondence" }, count: 9 },
      { id: "notes", label: { fr: "Notes juridiques", en: "Legal notes" }, count: 6 },
    ],
    content: {
      pleadings: [
        { name: "Requête en exclusion 24(2)", date: "2026-05-17", size: "1.2 MB", author: "Me Côté" },
        { name: "Mémoire d'autorités", date: "2026-05-17", size: "890 KB", author: "Me Côté" },
      ],
      evidence: [
        { name: "Rapport de fouille (Police)", date: "2025-11-04", size: "2.1 MB" },
        { name: "Plan des lieux (photos)", date: "2025-11-04", size: "5.3 MB" },
      ],
      comms: [
        { from: "Police", subject: "Divulgation Stinchcombe", date: "2026-01-20" },
        { from: "Couronne", subject: "Convocation pour requête", date: "2026-05-10" },
      ],
      notes: [
        { title: "Test Grant — analyse complète", date: "2026-05-16", preview: "Étapes 1-3 : gravité 84, incidence 79…" },
      ],
    },
  },
  {
    id: "tremblay",
    parties: "Tremblay c. PG du Québec",
    type: { fr: "Famille", en: "Family" },
    court: { fr: "Cour du Québec", en: "Court of Québec" },
    docket: "200-04-087234-256",
    opened: "2025-08-22",
    status: "active",
    nextEvent: { fr: "Audience · jeudi 14 h", en: "Hearing · Thursday 2 PM" },
    strength: 64,
    documents: 19,
    notes: 7,
    communications: 11,
    sections: [
      { id: "pleadings", label: { fr: "Mémoires", en: "Pleadings" }, count: 5 },
      { id: "evidence", label: { fr: "Documents de garde", en: "Custody records" }, count: 7 },
      { id: "comms", label: { fr: "Correspondance", en: "Correspondence" }, count: 11 },
      { id: "notes", label: { fr: "Notes", en: "Notes" }, count: 7 },
    ],
    content: {
      pleadings: [
        { name: "Mémoire principal — garde", date: "2026-05-15", size: "1.4 MB", author: "Me Côté" },
      ],
      evidence: [
        { name: "Rapport du DPJ", date: "2026-03-10", size: "780 KB" },
        { name: "Évaluation psychologique enfant", date: "2026-02-28", size: "1.9 MB" },
      ],
      comms: [
        { from: "Autres parties", subject: "Échange sur la continuité scolaire", date: "2026-05-14" },
      ],
      notes: [
        { title: "Continuité scolaire — argument clé", date: "2026-05-12", preview: "L'enfant a changé d'école 3 fois…" },
      ],
    },
  },
];

const DossiersClioBrowser = ({ lang, onNav }) => {
  const [selectedDossier, setSelectedDossier] = React.useState(DOSSIERS_CLIO[0]);
  const [activeTab, setActiveTab] = React.useState("overview");
  const [filter, setFilter] = React.useState("all");
  const [search, setSearch] = React.useState("");

  const filtered = DOSSIERS_CLIO.filter((d) => {
    if (filter === "active" && d.status !== "active") return false;
    if (search && !d.parties.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div style={{ display: "flex", height: "100vh", background: CLIO_PALETTE.bg }}>
      {/* ─── Left sidebar: dossier list ─────────────────────────────────────── */}
      <div style={{
        width: 320,
        background: CLIO_PALETTE.navy,
        color: "white",
        overflow: "auto",
        borderRight: `1px solid ${CLIO_PALETTE.slate}`,
        display: "flex",
        flexDirection: "column",
      }}>
        {/* Header */}
        <div style={{ padding: "20px 16px", borderBottom: `1px solid ${CLIO_PALETTE.slate}` }}>
          <div style={{ fontSize: 12, letterSpacing: "0.1em", textTransform: "uppercase", opacity: 0.6, marginBottom: 8 }}>
            {lang === "en" ? "Matters" : "Dossiers"}
          </div>
          <input
            type="text"
            placeholder={lang === "en" ? "Search..." : "Chercher…"}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: "100%",
              padding: "8px 12px",
              borderRadius: 6,
              border: `1px solid ${CLIO_PALETTE.slate}`,
              background: "rgba(255,255,255,0.1)",
              color: "white",
              fontSize: 13,
              boxSizing: "border-box",
            }}
          />
        </div>

        {/* Filter pills */}
        <div style={{ padding: "12px 16px", borderBottom: `1px solid ${CLIO_PALETTE.slate}`, display: "flex", gap: 8 }}>
          <button
            onClick={() => setFilter("all")}
            style={{
              padding: "4px 10px",
              borderRadius: 4,
              border: 0,
              fontSize: 11,
              fontWeight: filter === "all" ? 600 : 500,
              background: filter === "all" ? CLIO_PALETTE.accent : "rgba(255,255,255,0.15)",
              color: "white",
              cursor: "pointer",
            }}
          >
            {lang === "en" ? "All" : "Tous"}
          </button>
          <button
            onClick={() => setFilter("active")}
            style={{
              padding: "4px 10px",
              borderRadius: 4,
              border: 0,
              fontSize: 11,
              fontWeight: filter === "active" ? 600 : 500,
              background: filter === "active" ? CLIO_PALETTE.accent : "rgba(255,255,255,0.15)",
              color: "white",
              cursor: "pointer",
            }}
          >
            {lang === "en" ? "Active" : "Actifs"}
          </button>
        </div>

        {/* Dossier list */}
        <div style={{ flex: 1, overflow: "auto" }}>
          {filtered.map((d) => (
            <button
              key={d.id}
              onClick={() => { setSelectedDossier(d); setActiveTab("overview"); }}
              style={{
                width: "100%",
                padding: "16px",
                border: 0,
                borderBottom: `1px solid ${CLIO_PALETTE.slate}`,
                background: selectedDossier.id === d.id ? CLIO_PALETTE.slate : "transparent",
                color: "white",
                textAlign: "left",
                cursor: "pointer",
                transition: "background 200ms",
              }}
              onMouseEnter={(e) => { if (selectedDossier.id !== d.id) e.currentTarget.style.background = "rgba(255,255,255,0.05)"; }}
              onMouseLeave={(e) => { if (selectedDossier.id !== d.id) e.currentTarget.style.background = "transparent"; }}
            >
              <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 4, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {d.parties}
                  </div>
                  <div style={{ fontSize: 11, opacity: 0.7, marginBottom: 6 }}>
                    {d.docket}
                  </div>
                  <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    <span style={{
                      fontSize: 10,
                      padding: "2px 6px",
                      borderRadius: 3,
                      background: "rgba(255,255,255,0.15)",
                    }}>
                      {tr(d.type, lang)}
                    </span>
                    <span style={{ fontSize: 10, opacity: 0.6 }}>
                      {d.strength}%
                    </span>
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* ─── Right panel: dossier detail ──────────────────────────────────────── */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        {/* Header bar */}
        <div style={{
          padding: "20px 32px",
          borderBottom: `1px solid ${CLIO_PALETTE.border}`,
          background: "white",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}>
          <div>
            <div style={{ fontSize: 12, color: CLIO_PALETTE.gray, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 4 }}>
              {selectedDossier.docket}
            </div>
            <div style={{ fontSize: 24, fontWeight: 600, color: CLIO_PALETTE.navy }}>
              {selectedDossier.parties}
            </div>
          </div>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <span style={{ fontSize: 11, color: CLIO_PALETTE.gray }}>
              {lang === "en" ? "Strength" : "Force"}
            </span>
            <div style={{
              width: 80,
              height: 6,
              borderRadius: 3,
              background: CLIO_PALETTE.border,
              overflow: "hidden",
            }}>
              <div style={{
                width: `${selectedDossier.strength}%`,
                height: "100%",
                background: CLIO_PALETTE.accent,
              }} />
            </div>
            <span style={{ fontSize: 12, fontWeight: 600, color: CLIO_PALETTE.navy }}>
              {selectedDossier.strength}%
            </span>
          </div>
        </div>

        {/* Tab bar */}
        <div style={{
          padding: "0 32px",
          borderBottom: `1px solid ${CLIO_PALETTE.border}`,
          background: "white",
          display: "flex",
          gap: 32,
        }}>
          {[
            { id: "overview", label: lang === "en" ? "Overview" : "Vue d'ensemble" },
            { id: "pleadings", label: lang === "en" ? "Pleadings" : "Mémoires" },
            { id: "evidence", label: lang === "en" ? "Evidence" : "Preuve" },
            { id: "comms", label: lang === "en" ? "Communications" : "Comms" },
            { id: "notes", label: lang === "en" ? "Notes" : "Notes" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: "16px 0",
                border: 0,
                background: "transparent",
                color: activeTab === tab.id ? CLIO_PALETTE.navy : CLIO_PALETTE.gray,
                fontWeight: activeTab === tab.id ? 600 : 500,
                fontSize: 13,
                cursor: "pointer",
                borderBottom: activeTab === tab.id ? `2px solid ${CLIO_PALETTE.accent}` : "2px solid transparent",
                transition: "all 200ms",
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content area */}
        <div style={{ flex: 1, overflow: "auto", padding: "32px", background: CLIO_PALETTE.bg }}>
          {activeTab === "overview" && (
            <OverviewTab dossier={selectedDossier} lang={lang} />
          )}
          {activeTab === "pleadings" && (
            <DocumentTab docs={selectedDossier.content.pleadings} title={lang === "en" ? "Pleadings & Motions" : "Mémoires et requêtes"} lang={lang} />
          )}
          {activeTab === "evidence" && (
            <DocumentTab docs={selectedDossier.content.evidence} title={lang === "en" ? "Evidence" : "Preuve"} lang={lang} />
          )}
          {activeTab === "comms" && (
            <CommunicationsTab comms={selectedDossier.content.comms} lang={lang} />
          )}
          {activeTab === "notes" && (
            <NotesTab notes={selectedDossier.content.notes} lang={lang} />
          )}
        </div>
      </div>
    </div>
  );
};

const OverviewTab = ({ dossier, lang }) => (
  <div style={{ maxWidth: 1000 }}>
    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 32 }}>
      <StatCard label={lang === "en" ? "Court" : "Tribunal"} value={tr(dossier.court, lang)} />
      <StatCard label={lang === "en" ? "Opened" : "Ouvert"} value={dossier.opened} />
      <StatCard label={lang === "en" ? "Next event" : "Prochain événement"} value={tr(dossier.nextEvent, lang)} accent />
    </div>

    <div style={{ background: "white", borderRadius: 8, padding: 24, marginBottom: 24, border: `1px solid ${CLIO_PALETTE.border}` }}>
      <div style={{ fontSize: 14, fontWeight: 600, color: CLIO_PALETTE.navy, marginBottom: 16 }}>
        {lang === "en" ? "Activity" : "Activité"}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
        <ActivityCard icon="📄" label={lang === "en" ? "Documents" : "Documents"} count={dossier.documents} />
        <ActivityCard icon="📝" label={lang === "en" ? "Notes" : "Notes"} count={dossier.notes} />
        <ActivityCard icon="💬" label={lang === "en" ? "Communications" : "Communications"} count={dossier.communications} />
        <ActivityCard icon="⚖️" label={lang === "en" ? "Strength" : "Force"} count={`${dossier.strength}%`} />
      </div>
    </div>
  </div>
);

const StatCard = ({ label, value, accent }) => (
  <div style={{ background: "white", borderRadius: 8, padding: 16, border: `1px solid ${CLIO_PALETTE.border}` }}>
    <div style={{ fontSize: 11, color: CLIO_PALETTE.gray, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 8 }}>
      {label}
    </div>
    <div style={{ fontSize: 14, fontWeight: 600, color: accent ? CLIO_PALETTE.accent : CLIO_PALETTE.navy }}>
      {value}
    </div>
  </div>
);

const ActivityCard = ({ icon, label, count }) => (
  <div style={{ textAlign: "center", padding: 16 }}>
    <div style={{ fontSize: 28, marginBottom: 8 }}>{icon}</div>
    <div style={{ fontSize: 12, color: CLIO_PALETTE.gray, marginBottom: 4 }}>{label}</div>
    <div style={{ fontSize: 18, fontWeight: 700, color: CLIO_PALETTE.navy }}>{count}</div>
  </div>
);

const DocumentTab = ({ docs, title, lang }) => (
  <div>
    <div style={{ fontSize: 16, fontWeight: 600, color: CLIO_PALETTE.navy, marginBottom: 16 }}>
      {title}
    </div>
    {docs.map((doc, i) => (
      <div key={i} style={{
        background: "white",
        borderRadius: 8,
        padding: 16,
        marginBottom: 12,
        border: `1px solid ${CLIO_PALETTE.border}`,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}>
        <div>
          <div style={{ fontSize: 13, fontWeight: 600, color: CLIO_PALETTE.navy, marginBottom: 4 }}>
            {doc.name}
          </div>
          <div style={{ fontSize: 11, color: CLIO_PALETTE.gray }}>
            {doc.date} · {doc.size}{doc.author ? ` · ${doc.author}` : ""}
          </div>
        </div>
        <button style={{
          padding: "6px 12px",
          borderRadius: 6,
          border: 0,
          background: CLIO_PALETTE.accent,
          color: "white",
          fontSize: 12,
          fontWeight: 600,
          cursor: "pointer",
        }}>
          {lang === "en" ? "Open" : "Ouvrir"}
        </button>
      </div>
    ))}
  </div>
);

const CommunicationsTab = ({ comms, lang }) => (
  <div>
    <div style={{ fontSize: 16, fontWeight: 600, color: CLIO_PALETTE.navy, marginBottom: 16 }}>
      {lang === "en" ? "Communications" : "Correspondance"}
    </div>
    {comms.map((c, i) => (
      <div key={i} style={{
        background: "white",
        borderRadius: 8,
        padding: 16,
        marginBottom: 12,
        border: `1px solid ${CLIO_PALETTE.border}`,
        cursor: "pointer",
        transition: "all 200ms",
      }}
      onMouseEnter={(e) => e.currentTarget.style.borderColor = CLIO_PALETTE.accent}
      onMouseLeave={(e) => e.currentTarget.style.borderColor = CLIO_PALETTE.border}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 11, color: CLIO_PALETTE.gray, marginBottom: 4, fontWeight: 500 }}>
              {lang === "en" ? "From" : "De"} {c.from}
            </div>
            <div style={{ fontSize: 13, fontWeight: 600, color: CLIO_PALETTE.navy, marginBottom: 8 }}>
              {c.subject}
            </div>
          </div>
          <div style={{ fontSize: 11, color: CLIO_PALETTE.gray, whiteSpace: "nowrap", marginLeft: 16 }}>
            {c.date}
          </div>
        </div>
      </div>
    ))}
  </div>
);

const NotesTab = ({ notes, lang }) => (
  <div>
    <div style={{ fontSize: 16, fontWeight: 600, color: CLIO_PALETTE.navy, marginBottom: 16 }}>
      {lang === "en" ? "Notes" : "Notes"}
    </div>
    {notes.map((n, i) => (
      <div key={i} style={{
        background: "white",
        borderRadius: 8,
        padding: 16,
        marginBottom: 12,
        border: `1px solid ${CLIO_PALETTE.border}`,
        cursor: "pointer",
      }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: CLIO_PALETTE.navy, marginBottom: 8 }}>
          {n.title}
        </div>
        <div style={{ fontSize: 12, color: CLIO_PALETTE.gray, marginBottom: 8 }}>
          {n.preview}
        </div>
        <div style={{ fontSize: 11, color: CLIO_PALETTE.gray }}>
          {n.date}
        </div>
      </div>
    ))}
  </div>
);

// Export globally so app.jsx can reference it
Object.assign(window, { DossiersClioBrowser, CLIO_PALETTE, DOSSIERS_CLIO });
