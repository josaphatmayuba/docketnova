/* eslint-disable */
// Alertes intelligentes — Feature 08. Inbox of automated nudges from the
// whole product (revirements, new rulings, dossier risks, judge updates).

const Alerts = ({ lang, onNav, tweaks, density, scenarioId, onScenario, screenId }) => {
  const ALERTS = [
    {
      kind: "revirement",
      tone: "danger",
      icon: "alert",
      time: { fr: "Il y a 14 h", en: "14 h ago" },
      title: { fr: "Gagnon c. Cie ABC — distingué", en: "Gagnon c. Cie ABC — distinguished" },
      body: {
        fr: "Sa Solidité chute de 54 % à 41 %. Vous l'avez cité dans le mémoire Lavoie — vérifiez avant de plaider.",
        en: "Its Solidity drops from 54% to 41%. You cited it in the Lavoie brief — review before pleading.",
      },
      meta: { fr: "Dossier Lavoie · Dossier Dupont", en: "Lavoie matter · Dupont matter" },
      cta: { label: { fr: "Voir le revirement", en: "View reversal" }, screen: "revirements" },
    },
    {
      kind: "ruling",
      tone: "info",
      icon: "sparkle",
      time: { fr: "Ce matin · 7 h 12", en: "This morning · 7:12 AM" },
      title: { fr: "Trois nouveaux arrêts pertinents", en: "Three relevant new rulings" },
      body: {
        fr: "Sur la responsabilité médicale au Québec — tous indexés et notés. L'un d'eux pourrait renforcer le dossier Lapointe.",
        en: "On Quebec medical liability — all indexed and scored. One could strengthen the Lapointe matter.",
      },
      meta: { fr: "Pertinence sémantique 92 %", en: "Semantic match 92%" },
      cta: { label: { fr: "Ouvrir la recherche", en: "Open search" }, screen: "search" },
    },
    {
      kind: "dossier",
      tone: "warn",
      icon: "clock",
      time: { fr: "Hier · 18 h 02", en: "Yesterday · 6:02 PM" },
      title: { fr: "Mémoire d'audience Dupont — à rédiger", en: "Dupont hearing brief — to draft" },
      body: {
        fr: "Audience demain 9 h 30. La structure est prête, deux sections restent à générer.",
        en: "Hearing tomorrow at 9:30. Outline is ready, two sections remain to generate.",
      },
      meta: { fr: "Sections : Argument procédural · Conclusion", en: "Sections: Procedural argument · Conclusion" },
      cta: { label: { fr: "Ouvrir le brouillon", en: "Open draft" }, screen: "argumentaires" },
    },
    {
      kind: "judge",
      tone: "info",
      icon: "judge",
      time: { fr: "Lundi", en: "Monday" },
      title: { fr: "Juge Bernier — nouveau jugement", en: "Justice Bernier — new ruling" },
      body: {
        fr: "Première décision sur la garde partagée en 2026. Tendance : sensible à la continuité scolaire.",
        en: "First 2026 ruling on shared custody. Trend: sensitive to school continuity.",
      },
      meta: { fr: "Pertinent pour le dossier Tremblay", en: "Relevant to Tremblay matter" },
      cta: { label: { fr: "Voir le profil", en: "View profile" }, screen: "judges" },
    },
    {
      kind: "dossier",
      tone: "success",
      icon: "check",
      time: { fr: "Vendredi", en: "Friday" },
      title: { fr: "Requête en réintégration générée", en: "Reinstatement motion generated" },
      body: {
        fr: "Requête prête, sources citées, signée numériquement. Disponible dans le dossier Dupont.",
        en: "Motion ready, sources cited, e-signed. Available in the Dupont matter.",
      },
      meta: "Dupont c. Industries XYZ",
      cta: { label: { fr: "Ouvrir le dossier", en: "Open matter" }, screen: "dossier-dupont" },
    },
  ];

  return (
    <div style={{ flex: 1, overflow: "auto", padding: "28px 36px 48px" }}>
      <div style={{ maxWidth: 880, margin: "0 auto" }}>
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 18 }}>
          <div>
            <Overline style={{ marginBottom: 4 }}>{lang === "en" ? "Smart alerts · feature 08" : "Alertes intelligentes · fonctionnalité 08"}</Overline>
            <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 500, fontSize: 34, color: "var(--ink-950)", letterSpacing: "-0.02em", margin: 0 }}>
              {lang === "en" ? "What changed since yesterday" : "Ce qui a changé depuis hier"}
            </h1>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <GhostButton icon="check">{lang === "en" ? "Mark all read" : "Tout marquer lu"}</GhostButton>
            <GhostButton icon="settings">{lang === "en" ? "Rules" : "Règles"}</GhostButton>
          </div>
        </div>

        {/* Summary strip */}
        <div style={{
          background: "var(--paper)", border: "1px solid var(--border-1)", borderRadius: 12,
          padding: "14px 18px", display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 0, marginBottom: 22,
        }}>
          <Sum label={lang === "en" ? "Reversals" : "Revirements"} value="1" tone="oxblood"/>
          <Sum label={lang === "en" ? "New rulings" : "Nouveaux arrêts"} value="3" tone="pertinence"/>
          <Sum label={lang === "en" ? "Matter to-dos" : "Dossiers à traiter"} value="2" tone="autorite"/>
          <Sum label={lang === "en" ? "Generated docs" : "Documents générés"} value="4" tone="solidite" last/>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {ALERTS.map((a, i) => {
            const tones = {
              danger:  { bar: "#7A1F2B", bg: "#FBEEF0", fg: "#4A0F18", chip: "#94293A" },
              warn:    { bar: "#C8941F", bg: "#FBF3D9", fg: "#6B4A0E", chip: "#A87E1A" },
              info:    { bar: "#2B5FA8", bg: "#E4ECF5", fg: "#102B57", chip: "#1F4682" },
              success: { bar: "#3D7A4E", bg: "#E7F0EA", fg: "#1B3D26", chip: "#2B5C3A" },
            }[a.tone];
            return (
              <div key={i} style={{
                background: "var(--paper)", border: "1px solid var(--border-1)",
                borderRadius: 12, padding: "16px 18px",
                display: "flex", gap: 14, alignItems: "flex-start",
                borderLeft: `3px solid ${tones.bar}`,
              }}>
                <div style={{
                  width: 36, height: 36, borderRadius: 999, background: tones.bg,
                  display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                }}>
                  <Icon name={a.icon} size={16} color={tones.fg}/>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 2 }}>
                    <span style={{ fontSize: 13.5, fontWeight: 600, color: "var(--ink-900)" }}>{tr(a.title, lang)}</span>
                    <span style={{ fontSize: 11, color: "var(--ink-500)", fontFamily: "var(--font-mono)" }}>· {tr(a.time, lang)}</span>
                  </div>
                  <div style={{ fontSize: 13, color: "var(--ink-700)", lineHeight: 1.5 }}>{tr(a.body, lang)}</div>
                  <div style={{ fontSize: 11.5, color: "var(--ink-500)", marginTop: 6, display: "flex", gap: 10, alignItems: "center" }}>
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "2px 8px", borderRadius: 999,
                                    background: tones.bg, color: tones.fg, fontWeight: 600, fontSize: 10.5,
                                    letterSpacing: "0.06em", textTransform: "uppercase" }}>{a.kind}</span>
                    <span>{tr(a.meta, lang)}</span>
                  </div>
                </div>
                <button onClick={() => a.cta?.screen && onNav(a.cta.screen)} className="lb-chip" style={{
                  alignSelf: "center", background: "var(--paper)", border: "1px solid var(--border-2)",
                  padding: "6px 11px", borderRadius: 6, fontSize: 12, fontWeight: 600,
                  cursor: "pointer", color: "var(--ink-900)", display: "inline-flex", alignItems: "center", gap: 5,
                }}>{tr(a.cta.label, lang)} <Icon name="arrowRight" size={12}/></button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

const Sum = ({ label, value, tone, last }) => {
  const colors = { solidite: "#1B3D26", pertinence: "#102B57", autorite: "#6B4A0E", oxblood: "#7A1F2B" };
  return (
    <div style={{ padding: "0 18px", borderRight: last ? 0 : "1px solid var(--border-1)" }}>
      <Overline style={{ marginBottom: 6 }}>{label}</Overline>
      <div style={{ fontFamily: "var(--font-display)", fontWeight: 500, fontSize: 28, lineHeight: 1, letterSpacing: "-0.02em", color: colors[tone] }}>{value}</div>
    </div>
  );
};

Object.assign(window, { Alerts });
