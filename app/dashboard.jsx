/* eslint-disable */
// Tableau de bord — the lawyer's morning overview. Also doubles as a
// landing page that surfaces the 10 features in a glanceable way.

const Dashboard = ({ lang, onNav }) => {
  const isMobile = useIsMobile(768);
  return (
  <div style={{ flex: 1, overflow: "auto", padding: isMobile ? "20px 16px 40px" : "28px 36px 48px" }}>
    <div style={{ maxWidth: 1100, margin: "0 auto" }}>

      {/* Hero greeting */}
      <div style={{ display: "flex", flexDirection: isMobile ? "column" : "row", alignItems: "flex-start", justifyContent: "space-between", gap: isMobile ? 18 : 32, marginBottom: 28 }}>
        <div style={{ flex: 1 }}>
          <Overline style={{ marginBottom: 6 }}>{lang === "en" ? "Mardi · May 14, 2026" : "Mardi · 14 mai 2026"}</Overline>
          <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 500, fontSize: isMobile ? 30 : 44, color: "var(--ink-950)", letterSpacing: "-0.02em", margin: 0, lineHeight: 1.1 }}>
            {lang === "en"
              ? <>Bonjour Me Côté.<br/><i style={{ color: "#7A1F2B" }}>Three things</i> need your attention today.</>
              : <>Bonjour Me Côté.<br/><i style={{ color: "#7A1F2B" }}>Trois choses</i> méritent votre attention aujourd'hui.</>
            }
          </h1>
        </div>
        <button onClick={() => onNav("assistant")} style={{
          background: "#0E1626", color: "#FBF8F2", border: 0,
          padding: "14px 18px", borderRadius: 12, cursor: "pointer",
          display: "inline-flex", alignItems: "center", gap: 10,
          fontFamily: "var(--font-sans)", boxShadow: "var(--shadow-2)",
        }}>
          <div style={{ width: 26, height: 26, borderRadius: 6, background: "#16243C", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <BrandMark size={16} color="#FBF8F2" accent="#E5A8B1"/>
          </div>
          <div style={{ textAlign: "left" }}>
            <div style={{ fontSize: 9.5, color: "#8590A4", letterSpacing: "0.12em", textTransform: "uppercase", fontWeight: 600 }}>{lang === "en" ? "Ask anything" : "Demandez tout"}</div>
            <div style={{ fontSize: 14, fontWeight: 600 }}>{lang === "en" ? "Open the assistant" : "Ouvrir l'assistant"}</div>
          </div>
          <Icon name="arrowRight" size={15} color="#FBF8F2"/>
        </button>
      </div>

      {/* 3 priority cards */}
      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)", gap: 16, marginBottom: 30 }}>
        <Priority
          tone="oxblood" tag={lang === "en" ? "Hearing tomorrow" : "Audience demain"}
          time="9 h 30"
          title="Dupont c. Industries XYZ"
          body={lang === "en"
            ? <>Outline + reinstatement motion are ready. <b>Brief and closing</b> remain.</>
            : <>Plan + requête en réintégration prêts. <b>Mémoire et conclusion</b> à rédiger.</>}
          score="76 %"
          scoreLabel={lang === "en" ? "Matter strength" : "Force du dossier"}
          actions={[
            { label: lang === "en" ? "Brief the assistant" : "Briefer l'assistant", icon: "chat", to: "assistant" },
            { label: lang === "en" ? "Open matter" : "Ouvrir le dossier", icon: "folder", to: "dossier-dupont" },
          ]}
          onNav={onNav}
        />
        <Priority
          tone="warn" tag={lang === "en" ? "Reversal detected" : "Revirement détecté"}
          time={lang === "en" ? "14 h ago" : "Il y a 14 h"}
          title={<i style={{ color: "var(--ink-900)" }}>Gagnon c. Cie ABC</i>}
          body={lang === "en"
            ? <>Solidity: <b>54 → 41</b>. Distinguished by the Court of Appeal. Two of your matters reference it.</>
            : <>Solidité : <b>54 → 41</b>. Distingué par la Cour d'appel. Deux de vos dossiers le citent.</>}
          score="41 %"
          scoreLabel="Solidité"
          actions={[
            { label: lang === "en" ? "View reversal" : "Voir le revirement", icon: "alert", to: "revirements" },
            { label: lang === "en" ? "Prepare reply" : "Préparer la réplique", icon: "quote", to: "argumentaires" },
          ]}
          onNav={onNav}
        />
        <Priority
          tone="info" tag={lang === "en" ? "Custody · Thursday" : "Garde · jeudi"}
          time="14 h"
          title="Tremblay c. PG du Québec"
          body={lang === "en"
            ? <>Diagnostic done — strong matter (79%) with one weak point: <b>geographic distance</b>.</>
            : <>Diagnostic fait — dossier solide (79 %) avec un point faible : <b>l'éloignement géographique</b>.</>}
          score="79 %"
          scoreLabel={lang === "en" ? "Strength" : "Solidité"}
          actions={[
            { label: lang === "en" ? "Strategize" : "Stratégie", icon: "chat", to: "assistant" },
            { label: lang === "en" ? "Judge Bernier" : "Juge Bernier", icon: "judge", to: "judges" },
          ]}
          onNav={onNav}
        />
      </div>

      {/* The 10 features grid */}
      <div style={{ marginBottom: 18 }}>
        <Overline style={{ marginBottom: 4 }}>{lang === "en" ? "Explore the platform" : "Explorer la plateforme"}</Overline>
        <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 500, fontSize: 22, color: "var(--ink-900)", margin: 0, letterSpacing: "-0.01em" }}>
          {lang === "en"
            ? "Eleven features, one bridge between civil law and common law."
            : "Onze fonctionnalités, un pont entre droit civil et common law."}
        </h2>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "repeat(2, 1fr)" : "repeat(4, 1fr)", gap: 12 }}>
        {[
          { n: 1, label: { fr: "Recherche unifiée",   en: "Unified search" },     icon: "search",  to: "search" },
          { n: 2, label: { fr: "Scoring 3D",          en: "3D Scoring" },         icon: "target",  to: "search", system: true },
          { n: 3, label: { fr: "Sémantique bilingue", en: "Bilingual semantic" }, icon: "globe",   to: "search", system: true },
          { n: 4, label: { fr: "Revirements",         en: "Reversal detection" },icon: "alert",   to: "revirements" },
          { n: 5, label: { fr: "Profil des juges",    en: "Judge profiles" },    icon: "judge",   to: "judges" },
          { n: 6, label: { fr: "Cartographie",        en: "Cartography" },       icon: "network", to: "cartography" },
          { n: 7, label: { fr: "Argumentaires",       en: "Argument drafting" },icon: "quote",   to: "argumentaires" },
          { n: 8, label: { fr: "Alertes",             en: "Smart alerts" },     icon: "bell",    to: "alerts" },
          { n: 9, label: { fr: "Gestion de dossier",  en: "Matter mgmt" },      icon: "folder",  to: "dossiers" },
          { n:10, label: { fr: "Assistant conv.",     en: "Conv. assistant" },  icon: "chat",    to: "assistant", hero: true },
          { n:11, label: { fr: "Écosystème",           en: "Ecosystem" },         icon: "layout",  to: "integrations", fresh: true },
        ].map((f, i) => (
          <button key={i} onClick={() => onNav(f.to)} style={{
            background: f.hero ? "#0E1626" : "var(--paper)",
            border: "1px solid " + (f.hero ? "#16243C" : "var(--border-1)"),
            borderRadius: 10, padding: "14px 14px 12px",
            textAlign: "left", cursor: "pointer", display: "flex", flexDirection: "column", gap: 8,
            transition: "transform var(--dur-fast) var(--ease-out), border-color var(--dur-fast) var(--ease-out)",
          }}
          onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-2px)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: f.hero ? "#E5A8B1" : "var(--ink-400)", fontWeight: 600 }}>
                {String(f.n).padStart(2, "0")}
              </span>
              {f.hero && (
                <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase",
                               background: "#7A1F2B", color: "#FBF8F2", padding: "2px 6px", borderRadius: 4 }}>
                  {lang === "en" ? "Hero" : "Vedette"}
                </span>
              )}
              {f.fresh && !f.hero && (
                <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase",
                               background: "#C8941F", color: "#FBF8F2", padding: "2px 6px", borderRadius: 4 }}>
                  {lang === "en" ? "New" : "Nouveau"}
                </span>
              )}
              {f.system && !f.hero && !f.fresh && (
                <span style={{ fontSize: 9, color: "var(--ink-400)", letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 600 }}>
                  {lang === "en" ? "System" : "Système"}
                </span>
              )}
            </div>
            <Icon name={f.icon} size={22} color={f.hero ? "#E5A8B1" : "var(--ink-700)"}/>
            <div style={{ fontFamily: "var(--font-sans)", fontWeight: 600, fontSize: 13.5,
                          color: f.hero ? "#FBF8F2" : "var(--ink-900)", marginTop: "auto" }}>{tr(f.label, lang)}</div>
          </button>
        ))}
      </div>
    </div>
  </div>
  );
};

const Priority = ({ tone, tag, time, title, body, score, scoreLabel, actions, onNav }) => {
  const tones = {
    oxblood: { bg: "#FBEEF0", border: "#F5DCE0", fg: "#4A0F18", bar: "#7A1F2B" },
    warn:    { bg: "#FBF3D9", border: "#F6E7B5", fg: "#6B4A0E", bar: "#C8941F" },
    info:    { bg: "#E4ECF5", border: "#C9D7EA", fg: "#102B57", bar: "#2B5FA8" },
  }[tone];
  return (
    <div style={{
      background: "var(--paper)", border: "1px solid var(--border-1)",
      borderRadius: 14, padding: "18px 18px 16px",
      display: "flex", flexDirection: "column", gap: 12,
      borderTop: `3px solid ${tones.bar}`,
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <span style={{
          fontSize: 10.5, letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 700,
          color: tones.fg, padding: "2px 8px", borderRadius: 4, background: tones.bg, border: "1px solid " + tones.border,
        }}>{tag}</span>
        <span style={{ fontSize: 11, color: "var(--ink-500)", fontFamily: "var(--font-mono)" }}>· {time}</span>
      </div>
      <h3 style={{ fontFamily: "var(--font-display)", fontStyle: typeof title === "string" ? "italic" : "normal",
                   fontWeight: 500, fontSize: 22, letterSpacing: "-0.01em", color: "var(--ink-950)", margin: 0 }}>{title}</h3>
      <p style={{ fontSize: 13.5, lineHeight: 1.55, color: "var(--ink-700)", margin: 0 }}>{body}</p>
      <div style={{ display: "flex", alignItems: "center", gap: 12, paddingTop: 8, borderTop: "1px dashed var(--border-1)" }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: "var(--font-display)", fontSize: 26, fontWeight: 500, color: tones.bar, lineHeight: 1 }}>{score}</div>
          <Overline style={{ marginTop: 2 }}>{scoreLabel}</Overline>
        </div>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", justifyContent: "flex-end", maxWidth: 220 }}>
          {actions.map((a, i) => (
            <button key={i} onClick={() => onNav(a.to)} className="lb-chip" style={{
              background: i === 0 ? "var(--ink-900)" : "var(--paper)",
              color: i === 0 ? "var(--parchment-50)" : "var(--ink-900)",
              border: "1px solid " + (i === 0 ? "var(--ink-900)" : "var(--border-2)"),
              padding: "6px 10px", borderRadius: 8, fontSize: 12, fontWeight: 500,
              cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 5,
            }}>
              <Icon name={a.icon} size={12} color={i === 0 ? "var(--parchment-50)" : "var(--ink-700)"}/>{a.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

Object.assign(window, { Dashboard });
