/* eslint-disable */
// Argumentaires — Feature 07. Two-pane drafting: outline on left, rich content on right.

const OUTLINE = [
  { id: "intro", label: { fr: "Ouverture", en: "Opening" }, status: "ok" },
  { id: "facts", label: { fr: "Trame factuelle", en: "Facts" }, status: "ok" },
  { id: "law",   label: { fr: "Droit applicable", en: "Law" }, status: "draft" },
  { id: "arg1",  label: { fr: "Argument 1", en: "Argument 1" }, status: "draft" },
  { id: "arg2",  label: { fr: "Argument 2", en: "Argument 2" }, status: "todo" },
  { id: "close", label: { fr: "Conclusion", en: "Conclusion" }, status: "todo" },
];

const SECTION_CONTENT = {
  intro: {
    fr: `L'honorable juge Côté,

Mon client, Jean-Paul Dupont, a été congédié sans cause juste le 15 mars 2024. L'employeur prétend qu'il y a insubordination grave. Nous soumettons que les faits ne soutiennent pas cette caractérisation.

La preuve démontrera que M. Dupont a agi de manière appropriée dans les circonstances.`,
    en: `Honourable Justice Côté,

My client, Jean-Paul Dupont, was dismissed without just cause on March 15, 2024. The employer claims gross insubordination. We submit that the facts do not support this characterization.

The evidence will demonstrate that Mr. Dupont acted appropriately in the circumstances.`,
  },
  facts: {
    fr: `M. Dupont a été embauché en 2006 comme superviseur de production. Au cours de ses 18 années de service, il n'a jamais fait l'objet de mesure disciplinaire.

Le 15 mars 2024, à 14 h 30, lors d'une réunion avec son supérieur immédiat, M. Dupont a exprimé son désaccord avec une nouvelle politique de gestion. Il a demandé une justification écrite avant de l'implémenter.

Le lendemain, il a été licencié par courriel.`,
    en: `Mr. Dupont was hired in 2006 as production supervisor. Over his 18 years of service, he has never been subject to disciplinary action.

On March 15, 2024, at 2:30 p.m., during a meeting with his immediate superior, Mr. Dupont expressed disagreement with a new management policy. He asked for written justification before implementing it.

The next day, he was fired by email.`,
  },
  law: {
    fr: `La norme applicable en matière de congédiement sans cause juste est énoncée dans *Gagnon c. Québec*, 2020 CSC 18.

Pour justifier un congédiement, l'employeur doit prouver, selon la prépondérance des probabilités, que la conduite du salarié était incompatible avec la poursuite de l'emploi.

Un seul incident de désaccord avec un superviseur ne satisfait pas à cette norme.`,
    en: `The applicable standard for dismissal without just cause is set out in *Gagnon v. Quebec*, 2020 SCC 18.

To justify dismissal, the employer must prove, on a balance of probabilities, that the employee's conduct was incompatible with continued employment.

A single incident of disagreement with a supervisor does not meet this standard.`,
  },
  arg1: {
    fr: `**Argument 1 : Absence de cause juste**

L'employeur n'a fourni aucune preuve que la conduite de M. Dupont constituait une cause juste de congédiement. 

Sous *Gagnon*, il faut démontrer soit une incompatibilité manifeste avec les fonctions, soit une rupture de confiance.

M. Dupont a simplement exercé son droit de questionner une directive. Cela ne peut constituer une faute grave.`,
    en: `**Argument 1: Absence of Just Cause**

The employer has provided no evidence that Mr. Dupont's conduct constituted just cause for dismissal.

Under *Gagnon*, one must demonstrate either manifest incompatibility with duties or a breach of trust.

Mr. Dupont merely exercised his right to question a directive. This cannot constitute serious misconduct.`,
  },
  arg2: {
    fr: `**Argument 2 : Facteurs atténuants**

- 18 ans de service impeccable
- Aucune discipline antérieure
- Licenciement précipité (24 heures après l'incident)
- Manque de processus équitable

Ces facteurs démontrent l'absence de réelle incompatibilité.`,
    en: `**Argument 2: Mitigating Factors**

- 18 years of unblemished service
- No prior discipline
- Precipitous dismissal (24 hours after incident)
- Lack of fair process

These factors demonstrate the absence of real incompatibility.`,
  },
  close: {
    fr: `Pour ces raisons, nous demandons à la Cour de constater que le congédiement était sans cause juste et de condamner l'employeur à verser les dommages appropriés.`,
    en: `For these reasons, we ask the Court to find that the dismissal was without just cause and to order the employer to pay appropriate damages.`,
  },
};

const Argumentaires = ({ lang, onNav }) => {
  const [active, setActive] = React.useState("intro");

  const activeOutline = OUTLINE.find((o) => o.id === active);
  const content = SECTION_CONTENT[active];

  return (
    <div style={{ flex: 1, overflow: "hidden", display: "flex", flexDirection: "column" }}>
      {/* Header */}
      <div style={{ padding: "20px 36px 12px", borderBottom: "1px solid var(--border-1)", display: "flex", alignItems: "center", gap: 16 }}>
        <div style={{ minWidth: 0, flex: 1 }}>
          <Overline style={{ marginBottom: 4 }}>{lang === "en" ? "Argument drafting" : "Génération d'argumentaires"}</Overline>
          <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 500, fontSize: 24, color: "var(--ink-950)", letterSpacing: "-0.015em", margin: 0,
                        overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {lang === "en" ? "Hearing brief · " : "Mémoire d'audience · "}<i style={{ color: "#7A1F2B" }}>Dupont c. Industries XYZ</i>
          </h1>
        </div>
        <button className="lb-chip" style={{
          background: "var(--paper)", border: "1px solid var(--border-2)",
          padding: "9px 12px", borderRadius: 8, fontSize: 12, fontWeight: 500,
          color: "var(--ink-700)", cursor: "pointer", display: "inline-flex", gap: 6,
        }}>
          <Icon name="copy" size={14}/>{lang === "en" ? "Export .docx" : "Exporter .docx"}
        </button>
      </div>

      {/* Two-pane layout */}
      <div style={{ flex: 1, display: "grid", gridTemplateColumns: "280px 1fr", minHeight: 0 }}>
        {/* Outline (left) */}
        <aside style={{ borderRight: "1px solid var(--border-1)", overflow: "auto", padding: "20px 18px", background: "#FBF8F2" }}>
          <Overline style={{ marginBottom: 10 }}>{lang === "en" ? "Outline" : "Plan"}</Overline>
          <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {OUTLINE.map((o, i) => {
              const isActive = active === o.id;
              const stateColors = { ok: "#3D7A4E", draft: "#C8941F", todo: "var(--ink-300)" };
              const stateLabels = { ok: { fr: "OK", en: "Done" }, draft: { fr: "Brouillon", en: "Draft" }, todo: { fr: "À faire", en: "To do" } };
              return (
                <button key={o.id} onClick={() => setActive(o.id)} style={{
                  display: "grid", gridTemplateColumns: "18px 1fr auto",
                  alignItems: "center", gap: 8, padding: "10px 12px",
                  border: 0, borderRadius: 6, cursor: "pointer", textAlign: "left",
                  background: isActive ? "var(--paper)" : "transparent",
                  boxShadow: isActive ? "var(--shadow-1)" : "none",
                  borderColor: isActive ? "var(--border-2)" : "transparent",
                  borderWidth: "1px",
                  transition: "all var(--dur-fast) var(--ease-out)",
                }}>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--ink-400)", fontWeight: 600 }}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontWeight: 500, fontSize: 13, color: "var(--ink-900)" }}>
                      {tr(o.label, lang)}
                    </div>
                  </div>
                  <span style={{ width: 8, height: 8, borderRadius: 999, background: stateColors[o.status], flexShrink: 0 }}/>
                </button>
              );
            })}
          </div>
        </aside>

        {/* Content (right) */}
        <div style={{ overflow: "auto", padding: "32px 40px", display: "flex", flexDirection: "column" }}>
          <div style={{ maxWidth: 720 }}>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: 28, fontWeight: 500, color: "var(--ink-950)", margin: "0 0 16px", letterSpacing: "-0.01em" }}>
              {tr(activeOutline.label, lang)}
            </h2>
            <div style={{ fontSize: 15, color: "var(--ink-700)", lineHeight: 1.75, whiteSpace: "pre-wrap", marginBottom: 24 }}>
              {lang === "en" ? content.en : content.fr}
            </div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <button className="lb-chip" style={{
                background: "var(--paper)", border: "1px solid var(--border-2)",
                padding: "9px 12px", borderRadius: 8, fontSize: 12, fontWeight: 500,
                color: "var(--ink-700)", cursor: "pointer", display: "inline-flex", gap: 6,
              }}>
                <Icon name="refresh" size={13}/>{lang === "en" ? "Regenerate" : "Régénérer"}
              </button>
              <button className="lb-chip" style={{
                background: "var(--paper)", border: "1px solid var(--border-2)",
                padding: "9px 12px", borderRadius: 8, fontSize: 12, fontWeight: 500,
                color: "var(--ink-700)", cursor: "pointer", display: "inline-flex", gap: 6,
              }}>
                <Icon name="copy" size={13}/>{lang === "en" ? "Copy" : "Copier"}
              </button>
              <button className="lb-chip" style={{
                background: "var(--paper)", border: "1px solid var(--border-2)",
                padding: "9px 12px", borderRadius: 8, fontSize: 12, fontWeight: 500,
                color: "var(--ink-700)", cursor: "pointer", display: "inline-flex", gap: 6,
              }}>
                <Icon name="edit" size={13}/>{lang === "en" ? "Edit" : "Éditer"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

Object.assign(window, { Argumentaires });
