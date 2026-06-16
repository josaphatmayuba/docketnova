/* eslint-disable */
// Demo scenarios — the 6 pre-scripted conversations + case registry.
// Each AI message is delivered as a streamed `prelude` (typed char-by-char)
// followed by one or more rich `blocks` that fade in with stagger.

// ─── Case registry ──────────────────────────────────────────────────────
// Used by the [[ShortName]] inline syntax — every italic case name in the
// chat is hoverable and shows a mini score-card popover.
const CASES = {
  Bombardier: {
    title: "Syndicat c. Bombardier",
    citation: "2023 QCCA 412", court: "Cour d'appel du Québec", date: "14 nov. 2023",
    aut: 88, per: 81, sol: 92, lang: "FR",
    summary: "Congédiement sans cause juste — la Cour confirme l'indemnité maximale et précise les critères de respect de la procédure prévue par la Loi sur les normes du travail.",
  },
  Dupont: {
    title: "Dupont c. Industries XYZ",
    citation: "2024 QCCS 1247", court: "Cour supérieure du Québec", date: "3 mars 2024",
    aut: 72, per: 78, sol: 82, lang: "FR",
    summary: "Manquement procédural de l'employeur — la Cour ordonne la réintégration et accorde des dommages moraux.",
  },
  Gagnon: {
    title: "Gagnon c. Cie ABC",
    citation: "2018 QCCS 9912", court: "Cour supérieure du Québec", date: "12 juin 2018",
    aut: 64, per: 71, sol: 41, lang: "FR",
    summary: "Précédent invoqué par les employeurs pour limiter les indemnités — distingué par la Cour d'appel en mars 2025.",
  },
  McLeod: {
    title: "R. v. McLeod",
    citation: "2024 SCC 18", court: "Supreme Court of Canada", date: "Mar 22, 2024",
    aut: 99, per: 64, sol: 95, lang: "EN",
    summary: "Common-law treatment of just-cause termination — affirms procedural fairness standard. Binding pan-Canadian authority.",
  },
  Haida: {
    title: "Nation Haïda c. C.-B.",
    citation: "2004 CSC 73", court: "Cour suprême du Canada", date: "18 nov. 2004",
    aut: 100, per: 86, sol: 98, lang: "FR",
    summary: "Arrêt fondateur sur l'honneur de la Couronne et l'obligation de consultation des peuples autochtones.",
  },
  Mikisew: {
    title: "Mikisew Cree c. Canada",
    citation: "2018 CSC 40", court: "Cour suprême du Canada", date: "11 oct. 2018",
    aut: 99, per: 79, sol: 91, lang: "FR",
    summary: "Application de l'honneur de la Couronne au processus législatif — limites précisées.",
  },
  Tsilhqotin: {
    title: "Nation Tsilhqot'in c. C.-B.",
    citation: "2014 CSC 44", court: "Cour suprême du Canada", date: "26 juin 2014",
    aut: 100, per: 81, sol: 96, lang: "FR",
    summary: "Reconnaissance du titre ancestral — confirme la teneur de l'obligation fiduciaire de la Couronne.",
  },
  Tremblay: {
    title: "Tremblay c. PG du Québec",
    citation: "2025 QCCS 0431", court: "Cour supérieure du Québec", date: "À venir · jeudi 14 h",
    aut: 70, per: 88, sol: 79, lang: "FR",
    summary: "Garde partagée contestée — votre dossier actif. Audience jeudi.",
  },
  DroitFamille2019: {
    title: "Droit de la famille — 192418",
    citation: "2019 QCCA 1822", court: "Cour d'appel du Québec", date: "8 nov. 2019",
    aut: 88, per: 84, sol: 86, lang: "FR",
    summary: "Garde partagée — refusée si l'éloignement géographique compromet la stabilité de l'enfant.",
  },
  DroitFamille2023: {
    title: "Droit de la famille — 231447",
    citation: "2023 QCCA 991", court: "Cour d'appel du Québec", date: "21 août 2023",
    aut: 88, per: 91, sol: 88, lang: "FR",
    summary: "Réaffirme la primauté de l'intérêt de l'enfant — la Cour favorise la continuité du milieu scolaire.",
  },
  Lapointe: {
    title: "Lapointe c. CHUM",
    citation: "2024 QCCS 2891", court: "Cour supérieure du Québec", date: "12 fév. 2024",
    aut: 72, per: 92, sol: 87, lang: "FR",
    summary: "Responsabilité médicale — manquement au devoir d'information du patient.",
  },
  Therrien: {
    title: "Therrien c. Hôpital Maisonneuve",
    citation: "2024 QCCA 658", court: "Cour d'appel du Québec", date: "19 mai 2024",
    aut: 88, per: 84, sol: 90, lang: "FR",
    summary: "Norme du médecin prudent — affirme un standard élevé en chirurgie élective.",
  },
  Marcoux: {
    title: "Marcoux c. CIUSSS Estrie",
    citation: "2025 QCCS 0124", court: "Cour supérieure du Québec", date: "15 jan. 2025",
    aut: 72, per: 89, sol: 78, lang: "FR",
    summary: "Faute de service — pénurie de ressources, l'établissement reste responsable.",
  },
  Roy: {
    title: "Roy c. Trudel",
    citation: "2022 QCCS 7211", court: "Cour supérieure du Québec", date: "4 oct. 2022",
    aut: 64, per: 60, sol: 41, lang: "FR",
    summary: "Précédent affaibli — distingué dans 4 décisions ultérieures pour vice du raisonnement.",
  },
  Grant: {
    title: "R. c. Grant",
    citation: "2009 CSC 32", court: "Cour suprême du Canada", date: "17 juill. 2009",
    aut: 100, per: 92, sol: 95, lang: "FR",
    summary: "Cadre d'exclusion de la preuve obtenue en violation de la Charte — test en trois étapes (gravité de la conduite, incidence sur les droits, intérêt de la société).",
  },
  Stinchcombe: {
    title: "R. c. Stinchcombe",
    citation: "1991 CSC 45", court: "Cour suprême du Canada", date: "7 nov. 1991",
    aut: 100, per: 88, sol: 94, lang: "FR",
    summary: "Obligation de divulgation de la Couronne — toute preuve pertinente doit être communiquée à la défense.",
  },
  Jordan: {
    title: "R. c. Jordan",
    citation: "2016 CSC 27", court: "Cour suprême du Canada", date: "8 juill. 2016",
    aut: 100, per: 85, sol: 90, lang: "FR",
    summary: "Plafond présomptif du délai raisonnable : 18 mois en cour provinciale, 30 mois en cour supérieure.",
  },
  Lavallee: {
    title: "R. c. Lavallée",
    citation: "1990 CSC 87", court: "Cour suprême du Canada", date: "3 mai 1990",
    aut: 100, per: 82, sol: 91, lang: "FR",
    summary: "Légitime défense — appréciation du caractère raisonnable selon les circonstances vécues par l'accusé.",
  },
  Khill: {
    title: "R. c. Khill",
    citation: "2021 CSC 37", court: "Cour suprême du Canada", date: "14 oct. 2021",
    aut: 100, per: 88, sol: 92, lang: "FR",
    summary: "Légitime défense moderne (art. 34 C.cr.) — rôle des actes de l'accusé dans l'incident déclenchant.",
  },
  CollinsQC: {
    title: "R. c. Therrien-Boulanger",
    citation: "2024 QCCA 217", court: "Cour d'appel du Québec", date: "19 mars 2024",
    aut: 88, per: 90, sol: 86, lang: "FR",
    summary: "Application québécoise du test Grant — exclusion d'une preuve obtenue par fouille périmétrique sans motifs raisonnables.",
  },
};

// ─── Scenarios ───────────────────────────────────────────────────────────
// Every message carries `fr` and `en` fields. Some blocks are language-
// agnostic (cite cards) — those are kept as a single object with no
// translation needed beyond the title.

const SCENARIOS = [
  // ════════════════════════════════════════════════════════════════════
  // 1 · DUPONT — Audience demain
  // ════════════════════════════════════════════════════════════════════
  {
    id: "dupont",
    dossier: "Dupont c. Industries XYZ",
    label: { fr: "Audience demain · droit du travail", en: "Hearing tomorrow · labour law" },
    icon: "scales",
    summary: {
      fr: "Préparation 11e heure pour une audience de congédiement sans cause juste.",
      en: "Eleventh-hour prep for an unjust-dismissal hearing.",
    },
    messages: [
      {
        role: "user",
        text: {
          fr: "J'ai une audience demain matin en droit du travail. Mon client a été congédié sans cause juste. Qu'est-ce que je dois absolument avoir avec moi ?",
          en: "I have a labour-law hearing tomorrow morning. My client was dismissed without just cause. What do I absolutely need with me?",
        },
      },
      {
        role: "ai",
        prelude: {
          fr: "Pour votre audience de **demain** dans le dossier *Dupont*, voici ce que je vous recommande — j'ai déjà tout préparé.",
          en: "For your **hearing tomorrow** on the *Dupont* matter, here's what I'd bring — most of it is ready.",
        },
        blocks: [
          {
            kind: "cite-list",
            title: { fr: "Arrêts clés à citer", en: "Key cases to cite" },
            items: [
              { case: "Bombardier", note: { fr: "Cite-le en ouverture — indemnité maximale.", en: "Cite in opening — maximum award." } },
              { case: "Dupont",     note: { fr: "Manquement procédural — votre angle principal.", en: "Procedural failure — your main angle." } },
            ],
          },
          {
            kind: "warn",
            title: { fr: "Anticipez cet argument adverse", en: "Anticipate this counter-argument" },
            body: {
              fr: "L'employeur citera probablement [[Gagnon]]. Ce précédent est **distingué depuis mars 2025** — Solidité 41 %, il ne tient pas.",
              en: "Opposing counsel will likely cite [[Gagnon]]. That precedent has been **distinguished since March 2025** — Solidity 41%, it no longer holds.",
            },
          },
          {
            kind: "list",
            title: { fr: "Documents à préparer", en: "Documents to prepare" },
            items: [
              { state: "ok", label: { fr: "Requête en réintégration", en: "Reinstatement motion" }, meta: { fr: "Déjà générée", en: "Already generated" } },
              { state: "ok", label: { fr: "Liste de jurisprudence",   en: "Authorities list" },     meta: { fr: "Prête", en: "Ready" } },
              { state: "todo", label: { fr: "Mémoire d'audience",      en: "Hearing brief" },        meta: { fr: "À rédiger ce soir", en: "Draft tonight" } },
            ],
          },
          {
            kind: "judge",
            title: { fr: "Profil de l'hon. Hélène Côté", en: "Hon. Hélène Côté — profile" },
            body: {
              fr: "Accorde l'indemnité maximale dans **68 %** des cas similaires — insistez sur l'absence de procédure plutôt que sur la durée du service.",
              en: "Awards maximum indemnity in **68%** of similar matters — emphasize the procedural failure rather than length of service.",
            },
            stats: [
              { label: { fr: "Indemnité maximale accordée", en: "Maximum award granted" }, value: 68, axis: "sol" },
              { label: { fr: "Procédure jugée essentielle", en: "Procedure deemed essential" }, value: 84, axis: "per" },
            ],
          },
          {
            kind: "actions",
            items: [
              { label: { fr: "Rédiger le mémoire", en: "Draft the brief" }, icon: "quote", next: "draft" },
              { label: { fr: "Ouvrir le dossier", en: "Open the matter" }, icon: "folder", screen: "dossier-dupont" },
              { label: { fr: "Voir le profil du juge", en: "View judge profile" }, icon: "judge", screen: "judge-detail" },
            ],
          },
        ],
      },
      {
        role: "user",
        text: {
          fr: "Génère-moi une ouverture de plaidoirie.",
          en: "Draft me an opening statement.",
        },
        triggeredBy: "draft",
      },
      {
        role: "ai",
        prelude: {
          fr: "Voici une ébauche d'ouverture — calibrée pour le juge Côté. *À personnaliser avant l'audience.*",
          en: "Here's a draft opening — calibrated for Justice Côté. *Personalize before the hearing.*",
        },
        blocks: [
          {
            kind: "draft",
            body: {
              fr: [
                "Monsieur le juge,",
                "Mon client, M. Dupont, a consacré **12 ans** de sa vie à cette entreprise. Il a été congédié sans avertissement, sans motif valable et sans respect de la procédure prévue par la *Loi sur les normes du travail*.",
                "Comme l'a établi la Cour d'appel dans [[Bombardier]], un tel congédiement ouvre droit à une indemnité maximale. Les manquements procéduraux de l'employeur sont documentés à la pièce P-3 et corroborés par [[Dupont]].",
                "Nous demanderons donc à cette Cour d'ordonner la réintégration de M. Dupont, à défaut, l'indemnité plafonnée prévue par la Loi.",
              ],
              en: [
                "Your Honour,",
                "My client, Mr. Dupont, devoted **12 years** of his life to this company. He was dismissed without warning, without just cause, and without respect for the procedure set out in the *Act respecting labour standards*.",
                "As the Court of Appeal held in [[Bombardier]], such a dismissal triggers maximum statutory indemnity. The employer's procedural failures are documented at Exhibit P-3 and corroborated by [[Dupont]].",
                "We therefore ask this Court to order the reinstatement of Mr. Dupont, or failing that, the capped statutory indemnity.",
              ],
            },
          },
          {
            kind: "actions",
            items: [
              { label: { fr: "Copier", en: "Copy" }, icon: "copy" },
              { label: { fr: "Régénérer un ton plus ferme", en: "Regenerate — firmer tone" }, icon: "refresh" },
              { label: { fr: "Ajouter au dossier", en: "Save to matter" }, icon: "folder", screen: "dossier-dupont" },
            ],
          },
        ],
      },
    ],
  },

  // ════════════════════════════════════════════════════════════════════
  // 2 · TREMBLAY — Garde, stratégie
  // ════════════════════════════════════════════════════════════════════
  {
    id: "tremblay",
    dossier: "Tremblay c. PG du Québec",
    label: { fr: "Stratégie · garde partagée", en: "Strategy · shared custody" },
    icon: "judge",
    summary: {
      fr: "Diagnostic de la force de votre dossier de garde — avant le 14 h jeudi.",
      en: "Diagnostic of your custody matter's strength — before Thursday's 2 PM hearing.",
    },
    messages: [
      {
        role: "user",
        text: {
          fr: "Dans le dossier Tremblay, ai-je un bon argument sur la garde ?",
          en: "On the Tremblay matter — do I have a good custody argument?",
        },
      },
      {
        role: "ai",
        prelude: {
          fr: "Honnêtement : **votre dossier est solide — 79 %** sur l'axe Solidité — mais il a un point faible que je vous recommande de désamorcer en premier.",
          en: "Honestly: **your case is solid — 79%** on Solidity — but it has one weak point I'd defuse first.",
        },
        blocks: [
          {
            kind: "chart",
            title: { fr: "Diagnostic du dossier Tremblay", en: "Tremblay matter diagnostic" },
            bars: [
              { label: { fr: "Continuité du milieu scolaire", en: "School continuity" }, value: 88, axis: "sol" },
              { label: { fr: "Stabilité du parent demandeur", en: "Petitioner stability" }, value: 82, axis: "sol" },
              { label: { fr: "Éloignement géographique (risque)", en: "Geographic distance (risk)" }, value: 41, axis: "sol" },
              { label: { fr: "Pertinence sémantique aux arrêts", en: "Semantic match to precedent" }, value: 91, axis: "per" },
            ],
          },
          {
            kind: "concept",
            title: { fr: "Le point faible : la distance", en: "The weak point: distance" },
            body: {
              fr: "L'arrêt [[DroitFamille2019]] refuse la garde partagée quand l'éloignement compromet la stabilité. Vous devez **convaincre la Cour que votre client peut garantir la continuité scolaire** — l'arrêt [[DroitFamille2023]] l'autorise si la preuve est faite.",
              en: "[[DroitFamille2019]] denies shared custody where distance compromises stability. You must **persuade the Court that your client guarantees school continuity** — [[DroitFamille2023]] allows it when that proof is made.",
            },
          },
          {
            kind: "cite-list",
            title: { fr: "Arrêts qui vous renforcent", en: "Cases that strengthen you" },
            items: [
              { case: "DroitFamille2023", note: { fr: "Primauté de l'intérêt de l'enfant — votre pilier.", en: "Child's best interest — your anchor." } },
              { case: "DroitFamille2019", note: { fr: "L'arrêt à distinguer — préparez la distinction.", en: "The case to distinguish — prepare your reply." } },
            ],
          },
          {
            kind: "actions",
            items: [
              { label: { fr: "Construire l'argumentaire", en: "Build the argument" }, icon: "quote", next: "build" },
              { label: { fr: "Profil de la juge Bernier", en: "Justice Bernier's profile" }, icon: "judge", screen: "judge-detail" },
            ],
          },
        ],
      },
      {
        role: "user",
        text: {
          fr: "Construis-moi l'argument sur la continuité scolaire.",
          en: "Build me the argument on school continuity.",
        },
        triggeredBy: "build",
      },
      {
        role: "ai",
        prelude: {
          fr: "Voici l'ossature — trois paragraphes, calibrés sur [[DroitFamille2023]].",
          en: "Here's the skeleton — three paragraphs, calibrated on [[DroitFamille2023]].",
        },
        blocks: [
          {
            kind: "draft",
            body: {
              fr: [
                "Madame la juge,",
                "L'enfant fréquente la même école depuis la maternelle. Sa stabilité émotive, son cercle d'amis, son enseignante référente — tout cela s'inscrit dans un milieu que ma cliente s'engage à préserver, indépendamment de la garde partagée.",
                "Comme l'a réaffirmé la Cour d'appel dans [[DroitFamille2023]], la primauté de l'intérêt de l'enfant se mesure d'abord à la **continuité de son milieu** — milieu scolaire, milieu social, milieu affectif.",
                "La distance géographique invoquée par la partie adverse n'est qu'un facteur parmi d'autres, et la jurisprudence post-2023 l'a relativisé dès lors que le parent demandeur garantit, comme c'est ici le cas, le transport et le respect de l'horaire scolaire.",
              ],
              en: [
                "Madam Justice,",
                "The child has attended the same school since kindergarten. Her emotional stability, her circle of friends, her homeroom teacher — all of this is embedded in an environment that my client commits to preserving, regardless of shared custody.",
                "As the Court of Appeal reaffirmed in [[DroitFamille2023]], the primacy of the child's best interest is measured first by **the continuity of her environment** — school, social, emotional.",
                "The geographic distance invoked by opposing counsel is one factor among many, and post-2023 case law has put it in perspective whenever the petitioning parent guarantees, as is the case here, transport and adherence to the school schedule.",
              ],
            },
          },
          {
            kind: "actions",
            items: [
              { label: { fr: "Ouvrir en rédaction", en: "Open in drafting" }, icon: "quote", screen: "argumentaires" },
              { label: { fr: "Copier", en: "Copy" }, icon: "copy" },
            ],
          },
        ],
      },
    ],
  },

  // ════════════════════════════════════════════════════════════════════
  // 3 · MÉDICAL — Recherche pure
  // ════════════════════════════════════════════════════════════════════
  {
    id: "medical",
    dossier: null,
    label: { fr: "Recherche · responsabilité médicale QC", en: "Search · medical liability QC" },
    icon: "search",
    summary: {
      fr: "Vue d'ensemble des arrêts récents en responsabilité médicale au Québec.",
      en: "Recent Quebec medical-liability rulings — at a glance.",
    },
    messages: [
      {
        role: "user",
        text: {
          fr: "Quels sont les arrêts récents sur la responsabilité médicale au Québec ?",
          en: "What are the recent Quebec rulings on medical liability?",
        },
      },
      {
        role: "ai",
        prelude: {
          fr: "J'ai trouvé **127 arrêts** rendus depuis 2023, dont 14 par la Cour d'appel. Voici les trois qui ressortent — tous indexés avec leur score 3D.",
          en: "I found **127 rulings** since 2023, including 14 from the Court of Appeal. Here are the three that stand out — all scored on the 3D triplet.",
        },
        blocks: [
          {
            kind: "cite-list",
            title: { fr: "Trois arrêts incontournables", en: "Three you should know" },
            items: [
              { case: "Therrien", note: { fr: "Norme du médecin prudent réaffirmée — standard élevé en chirurgie élective.", en: "Reasonable-physician standard reaffirmed — elective surgery." } },
              { case: "Lapointe", note: { fr: "Devoir d'information du patient — l'oubli d'un risque rare est fautif.", en: "Duty of disclosure — failing to mention rare risks is faulty." } },
              { case: "Marcoux",  note: { fr: "Faute de service — pénurie de ressources, l'établissement reste responsable.", en: "Service fault — staff shortage, the facility remains liable." } },
            ],
          },
          {
            kind: "concept",
            title: { fr: "Ce que la jurisprudence dit aujourd'hui", en: "Where the case law stands today" },
            body: {
              fr: "Trois tendances claires depuis 2023 : **(1)** le devoir d'information s'élargit aux risques rares mais sérieux, **(2)** la pénurie de personnel n'exonère pas l'établissement, **(3)** la Cour d'appel a confirmé deux fois que le standard est celui du *médecin prudent et diligent placé dans les mêmes circonstances*.",
              en: "Three clear trends since 2023: **(1)** the duty to inform now extends to rare-but-serious risks, **(2)** staff shortages do not exonerate the facility, **(3)** the Court of Appeal twice confirmed the standard is the *reasonably prudent physician under the same circumstances*.",
            },
          },
          {
            kind: "actions",
            items: [
              { label: { fr: "Ouvrir la recherche complète", en: "Open full search" }, icon: "search", screen: "search" },
              { label: { fr: "Voir la cartographie", en: "View cartography" }, icon: "network", screen: "cartography" },
            ],
          },
        ],
      },
    ],
  },

  // ════════════════════════════════════════════════════════════════════
  // 4 · OUVERTURE — Plaidoirie générée
  // ════════════════════════════════════════════════════════════════════
  {
    id: "opening",
    dossier: "Dupont c. Industries XYZ",
    label: { fr: "Rédaction · ouverture de plaidoirie", en: "Drafting · opening statement" },
    icon: "quote",
    summary: {
      fr: "Génération d'une ouverture calibrée pour le juge et le dossier.",
      en: "Drafting an opening calibrated to judge and matter.",
    },
    messages: [
      {
        role: "user",
        text: {
          fr: "Rédige-moi une ouverture de plaidoirie pour le dossier Dupont — ton ferme mais respectueux.",
          en: "Draft me an opening statement for the Dupont matter — firm but respectful tone.",
        },
      },
      {
        role: "ai",
        prelude: {
          fr: "Voici une ébauche — *calibrée pour le juge Côté*, qui valorise les arguments procéduraux.",
          en: "Here's a draft — *calibrated for Justice Côté*, who values procedural arguments.",
        },
        blocks: [
          {
            kind: "draft",
            body: {
              fr: [
                "Monsieur le juge,",
                "Mon client, M. Dupont, a consacré **douze ans** de sa carrière à cette entreprise. Douze ans pendant lesquels son rendement n'a jamais été remis en question — la preuve documentaire en fait foi.",
                "Le 14 mars 2025, sans avertissement préalable, sans audition disciplinaire, sans le respect élémentaire de la procédure prévue par la *Loi sur les normes du travail*, il a été convoqué pour être congédié.",
                "La Cour d'appel a tranché cette question dans [[Bombardier]] : un tel congédiement, dénué de tout substrat procédural, ouvre droit à l'indemnité maximale.",
                "Nous démontrerons que les faits du présent dossier sont en tous points analogues — et plus encore, que la décision de l'employeur a été prise sans qu'aucun cadre supérieur ne soit même consulté.",
              ],
              en: [
                "Your Honour,",
                "My client, Mr. Dupont, devoted **twelve years** of his career to this company. Twelve years during which his performance was never in question — the documentary evidence speaks for itself.",
                "On March 14, 2025, without prior warning, without disciplinary hearing, without elementary respect for the procedure under the *Act respecting labour standards*, he was summoned to be dismissed.",
                "The Court of Appeal settled this question in [[Bombardier]]: such a dismissal, devoid of procedural substance, triggers the maximum statutory indemnity.",
                "We will show that the facts of this matter are analogous in every respect — and more, that the employer's decision was taken without a single senior manager even being consulted.",
              ],
            },
          },
          {
            kind: "actions",
            items: [
              { label: { fr: "Adoucir le ton", en: "Soften tone" }, icon: "refresh" },
              { label: { fr: "Plus court (200 mots)", en: "Shorter (200 words)" }, icon: "minus" },
              { label: { fr: "Copier", en: "Copy" }, icon: "copy" },
              { label: { fr: "Ajouter au mémoire", en: "Add to brief" }, icon: "fileText", screen: "dossier-dupont" },
            ],
          },
        ],
      },
    ],
  },

  // ════════════════════════════════════════════════════════════════════
  // 5 · COMPARAISON
  // ════════════════════════════════════════════════════════════════════
  {
    id: "compare",
    dossier: null,
    label: { fr: "Comparaison · droit civil vs common law", en: "Compare · civil law vs common law" },
    icon: "columns",
    summary: {
      fr: "Mettre en regard deux arrêts qui traitent la même question.",
      en: "Two rulings on the same question — side by side.",
    },
    messages: [
      {
        role: "user",
        text: {
          fr: "Compare [[Bombardier]] et [[McLeod]] sur la cause juste.",
          en: "Compare [[Bombardier]] and [[McLeod]] on just cause.",
        },
      },
      {
        role: "ai",
        prelude: {
          fr: "Bonne question — les deux convergent sur le résultat mais leur fondement diffère. Voici la comparaison.",
          en: "Good question — both converge on the outcome but their footing differs. Here's the comparison.",
        },
        blocks: [
          {
            kind: "compare",
            left: "Bombardier",
            right: "McLeod",
            rows: [
              { label: { fr: "Tradition", en: "Tradition" },
                left: { fr: "Droit civil québécois", en: "Quebec civil law" },
                right:{ fr: "Common law canadienne", en: "Canadian common law" } },
              { label: { fr: "Source du standard", en: "Source of standard" },
                left: { fr: "*Loi sur les normes du travail*, art. 124", en: "*Act respecting labour standards*, s. 124" },
                right:{ fr: "*Wallace v. United Grain Growers* (1997)", en: "*Wallace v. United Grain Growers* (1997)" } },
              { label: { fr: "Test du \"motif sérieux\"", en: "\"Just cause\" test" },
                left: { fr: "Objectif — fait extérieur démontrable", en: "Objective — demonstrable external fact" },
                right:{ fr: "Mixte — fait + bonne foi de l'employeur", en: "Hybrid — fact + employer good faith" } },
              { label: { fr: "Réparation typique", en: "Typical remedy" },
                left: { fr: "Réintégration ou indemnité plafonnée", en: "Reinstatement or capped indemnity" },
                right:{ fr: "Dommages-intérêts (Bardal factors)", en: "Damages (Bardal factors)" } },
            ],
          },
          {
            kind: "concept",
            title: { fr: "Ce qu'il faut retenir", en: "The takeaway" },
            body: {
              fr: "Les deux arrêts arrivent à un résultat similaire — le congédiement sans cause est sanctionné — mais **la voie civiliste passe par la procédure**, alors que **la voie common law passe par la bonne foi**. Si vous plaidez au Québec, restez sur le terrain procédural de [[Bombardier]] ; ne traduisez pas l'argument *Wallace*.",
              en: "Both arrive at a similar result — dismissal without cause is sanctioned — but **the civil-law route runs through procedure**, while **the common-law route runs through good faith**. If pleading in Quebec, stay on the procedural footing of [[Bombardier]]; do not translate the *Wallace* argument.",
            },
          },
        ],
      },
    ],
  },

  // ════════════════════════════════════════════════════════════════════
  // 6 · CONCEPT — Honneur de la Couronne
  // ════════════════════════════════════════════════════════════════════
  {
    id: "honneur",
    dossier: null,
    label: { fr: "Explication · honneur de la Couronne", en: "Explainer · Honour of the Crown" },
    icon: "book",
    summary: {
      fr: "Le principe expliqué clairement, avec la trilogie qui le fonde.",
      en: "The principle explained clearly, with its founding trilogy.",
    },
    messages: [
      {
        role: "user",
        text: {
          fr: "Explique-moi le principe de l'honneur de la Couronne en droit autochtone.",
          en: "Explain the Honour of the Crown principle in Aboriginal law.",
        },
      },
      {
        role: "ai",
        prelude: {
          fr: "Volontiers. **L'honneur de la Couronne** est le principe constitutionnel selon lequel l'État, dans toutes ses interactions avec les peuples autochtones, doit agir avec **honneur, intégrité et bonne foi**.",
          en: "Gladly. **The Honour of the Crown** is the constitutional principle that the State, in all its dealings with Aboriginal peoples, must act with **honour, integrity and good faith**.",
        },
        blocks: [
          {
            kind: "concept",
            title: { fr: "En une phrase", en: "In one sentence" },
            body: {
              fr: "*Ce n'est pas un simple devoir moral* : c'est une **obligation juridique** dont découlent des devoirs concrets — consultation, accommodement, négociation honnête — que les tribunaux peuvent sanctionner.",
              en: "*This is not a mere moral duty*: it is a **legal obligation** from which concrete duties flow — consultation, accommodation, honest negotiation — enforceable by the courts.",
            },
          },
          {
            kind: "cite-list",
            title: { fr: "La trilogie fondatrice", en: "The founding trilogy" },
            items: [
              { case: "Haida",      note: { fr: "L'arrêt fondateur — obligation de consultation issue de la simple revendication.", en: "The founding ruling — duty to consult flows from the bare assertion of right." } },
              { case: "Tsilhqotin", note: { fr: "Titre ancestral reconnu — précise l'obligation fiduciaire.", en: "Aboriginal title recognized — defines the fiduciary duty." } },
              { case: "Mikisew",    note: { fr: "Limite : l'honneur ne s'applique pas au processus législatif lui-même.", en: "Limit: the principle does not reach the legislative process itself." } },
            ],
          },
          {
            kind: "concept",
            title: { fr: "Trois choses à retenir en plaidoirie", en: "Three takeaways for argument" },
            body: {
              fr: "**(1)** L'obligation de consultation s'enclenche dès qu'une mesure peut affecter un droit revendiqué — pas besoin que le titre soit prouvé. **(2)** L'intensité varie selon la solidité de la revendication et l'impact de la mesure. **(3)** L'absence de consultation peut suffire à invalider une décision administrative.",
              en: "**(1)** The duty to consult is triggered the moment a measure can affect an asserted right — title need not be proven. **(2)** Its intensity varies with the strength of the claim and the impact of the measure. **(3)** Absence of consultation alone can void an administrative decision.",
            },
          },
          {
            kind: "actions",
            items: [
              { label: { fr: "Lire plus loin", en: "Read further" }, icon: "book" },
              { label: { fr: "Voir la cartographie", en: "View cartography" }, icon: "network", screen: "cartography" },
            ],
          },
        ],
      },
    ],
  },

  // ════════════════════════════════════════════════════════════════════
  // 7 · BEAULIEU — Requête 24(2) Charte
  // ════════════════════════════════════════════════════════════════════
  {
    id: "beaulieu",
    dossier: "R. c. Beaulieu",
    label: { fr: "Criminel · requête 24(2) Charte", en: "Criminal · s. 24(2) Charter motion" },
    icon: "scales",
    summary: {
      fr: "Préparer la requête en exclusion de preuve — fouille sans mandat.",
      en: "Prepare the motion to exclude evidence — warrantless search.",
    },
    messages: [
      {
        role: "user",
        text: {
          fr: "J'ai la requête 24(2) lundi matin sur Beaulieu. La fouille est-elle vraiment illégale ?",
          en: "I have the s. 24(2) motion Monday morning on Beaulieu. Was the search truly unlawful?",
        },
      },
      {
        role: "ai",
        prelude: {
          fr: "Oui — et votre position est **exceptionnellement solide**. J'ai passé les faits au test [[Grant]]. Voici ce que j'ai trouvé.",
          en: "Yes — and your position is **exceptionally solid**. I ran the facts through the [[Grant]] test. Here's what I found.",
        },
        blocks: [
          {
            kind: "chart",
            title: { fr: "Test Grant · trois étapes", en: "Grant test · three steps" },
            bars: [
              { label: { fr: "Gravité de la conduite étatique", en: "Seriousness of state conduct" }, value: 84, axis: "sol" },
              { label: { fr: "Incidence sur les droits de Beaulieu", en: "Impact on Beaulieu's rights" }, value: 79, axis: "sol" },
              { label: { fr: "Intérêt de la société (admission)", en: "Society's interest (inclusion)" }, value: 32, axis: "sol" },
            ],
          },
          {
            kind: "concept",
            title: { fr: "Pourquoi la fouille tombe", en: "Why the search fails" },
            body: {
              fr: "Les policiers ont fouillé le coffre **sans motifs raisonnables**, en s'appuyant sur une **odeur diffuse de cannabis** — insuffisant depuis la légalisation. Pas de mandat, pas de consentement valide, pas d'urgence. La Cour d'appel a tranché un cas presque identique dans [[CollinsQC]] : exclusion ordonnée.",
              en: "The officers searched the trunk **without reasonable grounds**, relying on a **diffuse smell of cannabis** — insufficient since legalization. No warrant, no valid consent, no exigency. The Court of Appeal settled an almost identical case in [[CollinsQC]]: exclusion ordered.",
            },
          },
          {
            kind: "cite-list",
            title: { fr: "Arrêts clés à citer", en: "Key cases to cite" },
            items: [
              { case: "Grant",     note: { fr: "Le test — cite-le en ouverture et en conclusion.", en: "The test — cite in opening and closing." } },
              { case: "CollinsQC", note: { fr: "Application québécoise récente — faits analogues.", en: "Recent Quebec application — analogous facts." } },
            ],
          },
          {
            kind: "warn",
            title: { fr: "Anticipez ce que dira la Couronne", en: "Anticipate the Crown's argument" },
            body: {
              fr: "La Couronne plaidera la **bonne foi** des policiers pour atténuer l'étape 1 du test. Préparez la réplique : la *bonne foi* exige plus qu'une erreur honnête — elle exige des motifs objectivement raisonnables, absents ici.",
              en: "The Crown will argue **good faith** to soften step 1. Prepare your reply: *good faith* requires more than honest mistake — it requires objectively reasonable grounds, absent here.",
            },
          },
          {
            kind: "list",
            title: { fr: "Documents à déposer lundi", en: "Documents to file Monday" },
            items: [
              { state: "ok",   label: { fr: "Requête en exclusion (art. 24(2))", en: "Motion to exclude (s. 24(2))" }, meta: { fr: "Générée · 11 sources", en: "Generated · 11 sources" } },
              { state: "ok",   label: { fr: "Mémoire d'autorités", en: "Authorities brief" }, meta: { fr: "Prêt", en: "Ready" } },
              { state: "todo", label: { fr: "Interrogatoire du policier", en: "Officer cross-examination" }, meta: { fr: "Plan à finaliser", en: "Plan to finalize" } },
            ],
          },
          {
            kind: "judge",
            title: { fr: "Profil du juge Lacasse", en: "Justice Lacasse — profile" },
            body: {
              fr: "Exclut la preuve dans **62 %** des requêtes 24(2) similaires. Sensible à la qualité des motifs des policiers — insistez sur ce point.",
              en: "Excludes evidence in **62%** of similar s. 24(2) motions. Sensitive to the quality of officer reasoning — hammer that point.",
            },
            stats: [
              { label: { fr: "Taux d'exclusion (24(2))", en: "Exclusion rate (24(2))" }, value: 62, axis: "sol" },
              { label: { fr: "Confirmation en appel", en: "Affirmed on appeal" }, value: 91, axis: "per" },
            ],
          },
          {
            kind: "actions",
            items: [
              { label: { fr: "Rédiger l'interrogatoire", en: "Draft cross-examination" }, icon: "quote", next: "crossExam" },
              { label: { fr: "Ouvrir la requête", en: "Open the motion" }, icon: "fileText", screen: "argumentaires" },
              { label: { fr: "Profil du juge Lacasse", en: "Justice Lacasse profile" }, icon: "judge", screen: "judge-detail" },
            ],
          },
        ],
      },
      {
        role: "user",
        triggeredBy: "crossExam",
        text: {
          fr: "Rédige-moi un plan d'interrogatoire du policier.",
          en: "Draft me a cross-examination outline for the officer.",
        },
      },
      {
        role: "ai",
        prelude: {
          fr: "Voici quatre séquences — *chacune isole un point du test Grant*. Le but : amener le policier à admettre l'absence de motifs raisonnables sans le confronter.",
          en: "Four sequences — *each isolates one point in the Grant test*. The goal: lead the officer to admit absence of reasonable grounds without confrontation.",
        },
        blocks: [
          {
            kind: "draft",
            body: {
              fr: [
                "**Séquence 1 · La scène avant l'interception**",
                "• Confirmez l'heure, le lieu, l'absence d'appel préalable au 911.",
                "• « Avant d'arrêter le véhicule, aviez-vous des informations spécifiques sur M. Beaulieu ? » — forcez la réponse non.",
                "**Séquence 2 · L'odeur**",
                "• « La possession personnelle de cannabis est légale depuis 2018 ? »",
                "• « Sentir du cannabis dans un véhicule n'est plus, en soi, un motif raisonnable ? » — demandez-lui de citer sa source de formation.",
                "**Séquence 3 · La fouille du coffre**",
                "• « Avez-vous demandé le consentement écrit ? » — non.",
                "• « Avez-vous communiqué à M. Beaulieu son droit de refus ? » — documentez la réponse.",
                "**Séquence 4 · La proportionnalité**",
                "• « Aviez-vous tenté d'obtenir un mandat avant ou après l'interception ? »",
                "• Clôturez : « Donc votre seule justification était l'odeur diffuse ? »",
              ],
              en: [
                "**Sequence 1 · The scene before the stop**",
                "• Confirm time, place, absence of prior 911 call.",
                "• \"Before stopping the vehicle, did you have any specific information about Mr. Beaulieu?\" — push for *no*.",
                "**Sequence 2 · The smell**",
                "• \"Personal possession of cannabis has been legal since 2018?\"",
                "• \"Smelling cannabis in a vehicle is no longer, in itself, reasonable grounds?\" — ask him to cite his training source.",
                "**Sequence 3 · The trunk search**",
                "• \"Did you ask for written consent?\" — no.",
                "• \"Did you inform Mr. Beaulieu of his right to refuse?\" — record the answer.",
                "**Sequence 4 · Proportionality**",
                "• \"Did you try to get a warrant before or after the stop?\"",
                "• Close: \"So your only justification was the diffuse smell?\"",
              ],
            },
          },
          {
            kind: "actions",
            items: [
              { label: { fr: "Copier le plan", en: "Copy outline" }, icon: "copy" },
              { label: { fr: "Ajouter à la requête", en: "Add to motion" }, icon: "fileText", screen: "argumentaires" },
            ],
          },
        ],
      },
    ],
  },

  // ════════════════════════════════════════════════════════════════════
  // 8 · LEMIEUX — Légitime défense + délai Jordan
  // ════════════════════════════════════════════════════════════════════
  {
    id: "lemieux",
    dossier: "R. c. Lemieux",
    label: { fr: "Criminel · stratégie légitime défense", en: "Criminal · self-defence strategy" },
    icon: "judge",
    summary: {
      fr: "Construire la défense — et surveiller le plafond Jordan.",
      en: "Build the defence — and watch the Jordan ceiling.",
    },
    messages: [
      {
        role: "user",
        text: {
          fr: "Sur Lemieux, ma cliente plaide légitime défense. Comment je construis l'argument ?",
          en: "On Lemieux, my client pleads self-defence. How do I build the argument?",
        },
      },
      {
        role: "ai",
        prelude: {
          fr: "Bien. **Deux chantiers parallèles** — le fond (légitime défense, art. 34 C.cr.) et la **bombe à retardement** : votre délai Jordan tourne à 14 mois, plafond à 18.",
          en: "Good. **Two parallel tracks** — the substance (self-defence, s. 34 Criminal Code) and the **ticking clock**: your Jordan delay sits at 14 months, ceiling at 18.",
        },
        blocks: [
          {
            kind: "warn",
            title: { fr: "Délai Jordan · fenêtre de manœuvre", en: "Jordan delay · window of action" },
            body: {
              fr: "Vous êtes à **14 mois sur 18** depuis le dépôt des accusations (cour provinciale). Si la Couronne demande un report, votre cliente peut bientôt demander un arrêt des procédures sous [[Jordan]]. **Documentez chaque retard imputable à la Couronne dès maintenant.**",
              en: "You're at **14 of 18 months** since charges (provincial court). If the Crown seeks an adjournment, your client can soon move for a stay under [[Jordan]]. **Document every Crown-attributable delay starting now.**",
            },
          },
          {
            kind: "concept",
            title: { fr: "Légitime défense · trois conditions de l'art. 34", en: "Self-defence · three conditions of s. 34" },
            body: {
              fr: "**(1)** Votre cliente croyait, pour des motifs raisonnables, qu'on employait ou menaçait d'employer la force. **(2)** Son geste avait pour but de se protéger. **(3)** Le geste était raisonnable dans les circonstances. *L'arrêt* [[Khill]] *insiste sur le facteur (3) — le « rôle de l'accusé dans l'incident » peut neutraliser la défense.*",
              en: "**(1)** Your client reasonably believed force was used or threatened. **(2)** Her act was aimed at protection. **(3)** The act was reasonable in the circumstances. *[[Khill]] emphasizes factor (3) — the accused's \"role in the incident\" can defeat the defence.*",
            },
          },
          {
            kind: "cite-list",
            title: { fr: "Arrêts fondateurs à citer", en: "Founding cases to cite" },
            items: [
              { case: "Lavallee", note: { fr: "L'étalon — le caractère raisonnable se mesure depuis la perspective de l'accusé.", en: "The standard — reasonableness from the accused's perspective." } },
              { case: "Khill",    note: { fr: "Modernise le test — à maîtriser absolument.", en: "Modernizes the test — must master." } },
              { case: "Jordan",   note: { fr: "Couteau à double tranchant : votre meilleur levier stratégique.", en: "Double-edged: your strongest strategic lever." } },
            ],
          },
          {
            kind: "list",
            title: { fr: "Préparation du procès (27 mai)", en: "Trial prep (May 27)" },
            items: [
              { state: "ok",   label: { fr: "Divulgation Stinchcombe validée", en: "Stinchcombe disclosure verified" }, meta: { fr: "Complète", en: "Complete" } },
              { state: "todo", label: { fr: "Témoignage d'expert (psychologie victimologie)", en: "Expert witness (victimology)" }, meta: { fr: "Suggéré par l'IA", en: "AI suggested" } },
              { state: "todo", label: { fr: "Tableau des retards imputables à la Couronne", en: "Crown-attributable delay log" }, meta: { fr: "Pour requête Jordan", en: "For Jordan motion" } },
            ],
          },
          {
            kind: "judge",
            title: { fr: "Profil de la juge Audet", en: "Justice Audet — profile" },
            body: {
              fr: "Acquitte sur légitime défense dans **51 %** des cas — attentive au contexte de vulnérabilité de l'accusée. Préparez le témoignage en conséquence.",
              en: "Acquits on self-defence in **51%** of cases — attentive to the accused's vulnerability context. Prep her testimony accordingly.",
            },
            stats: [
              { label: { fr: "Acquittement (art. 34)", en: "Acquittal (s. 34)" }, value: 51, axis: "sol" },
              { label: { fr: "Sensibilité au contexte", en: "Sensitivity to context" }, value: 78, axis: "per" },
            ],
          },
          {
            kind: "actions",
            items: [
              { label: { fr: "Plan d'argumentation · art. 34", en: "Argument plan · s. 34" }, icon: "quote", screen: "argumentaires" },
              { label: { fr: "Lancer le compteur Jordan", en: "Start the Jordan clock" }, icon: "clock", next: "jordan" },
              { label: { fr: "Profil de la juge Audet", en: "Justice Audet profile" }, icon: "judge", screen: "judge-detail" },
            ],
          },
        ],
      },
      {
        role: "user",
        triggeredBy: "jordan",
        text: {
          fr: "Prépare-moi le tableau des retards Jordan, en l'état.",
          en: "Prep me the Jordan delay table as it stands.",
        },
      },
      {
        role: "ai",
        prelude: {
          fr: "Voici le compteur à jour — **141 jours imputables à la Couronne sur 426**. Vous avez encore une marge, mais elle rétrécit.",
          en: "Here's the live counter — **141 days attributable to the Crown out of 426**. You still have margin, but it's narrowing.",
        },
        blocks: [
          {
            kind: "chart",
            title: { fr: "Délai Jordan · répartition", en: "Jordan delay · breakdown" },
            bars: [
              { label: { fr: "Délai écoulé / plafond 18 mois", en: "Elapsed / 18-month ceiling" }, value: 78, axis: "per" },
              { label: { fr: "Imputable à la Couronne", en: "Attributable to the Crown" }, value: 33, axis: "sol" },
              { label: { fr: "Imputable à la défense", en: "Attributable to the defence" }, value: 11, axis: "aut" },
              { label: { fr: "Délai institutionnel", en: "Institutional delay" }, value: 56, axis: "sol" },
            ],
          },
          {
            kind: "concept",
            title: { fr: "Ce que cela signifie", en: "What this means" },
            body: {
              fr: "Si la Couronne demande un report supérieur à 90 jours, vous **passez le plafond présomptif**. Préparez dès maintenant une lettre formelle de mise en demeure — elle solidifie votre dossier Jordan à venir.",
              en: "If the Crown seeks an adjournment over 90 days, you **cross the presumptive ceiling**. Prepare a formal demand letter now — it solidifies any future Jordan motion.",
            },
          },
          {
            kind: "actions",
            items: [
              { label: { fr: "Rédiger la mise en demeure", en: "Draft the demand letter" }, icon: "quote", screen: "argumentaires" },
              { label: { fr: "Ouvrir le dossier Lemieux", en: "Open Lemieux matter" }, icon: "folder", screen: "dossiers" },
            ],
          },
        ],
      },
    ],
  },

  // ════════════════════════════════════════════════════════════════════
  // 9 · CROSS-DOSSIER — impact transverse d'un revirement
  // ════════════════════════════════════════════════════════════════════
  {
    id: "cross",
    dossier: null,
    crossDossier: true,
    label: { fr: "Transverse · impact d'un revirement", en: "Cross-matter · reversal impact" },
    icon: "network",
    summary: {
      fr: "L'assistant croise tous vos dossiers et signale où le revirement Gagnon mord.",
      en: "The assistant scans all your matters and flags where the Gagnon reversal bites.",
    },
    messages: [
      {
        role: "user",
        text: {
          fr: "Quel est l'impact du revirement Gagnon sur mes dossiers actifs ?",
          en: "What's the impact of the Gagnon reversal on my active matters?",
        },
      },
      {
        role: "ai",
        prelude: {
          fr: "J'ai scanné vos **4 dossiers actifs**. Le revirement de [[Gagnon]] touche **2 d'entre eux** — directement le dossier *Dupont*, indirectement une note de recherche *Lavoie* en suspens.",
          en: "I scanned your **4 active matters**. The [[Gagnon]] reversal affects **2 of them** — directly the *Dupont* matter, indirectly a parked *Lavoie* research note.",
        },
        blocks: [
          {
            kind: "matter-impact",
            title: { fr: "Vos dossiers, en regard du revirement", en: "Your matters, against the reversal" },
            items: [
              {
                matter: "dupont",
                tone: "hot",
                hit: { fr: "Cité au § 3 du mémoire", en: "Cited at § 3 of the brief" },
                rec: { fr: "Réplique prê ; remplacez la citation par [[Bombardier]].", en: "Reply ready; swap citation for [[Bombardier]]." },
                next: { fr: "Audience demain 9 h 30", en: "Hearing tomorrow 9:30" },
              },
              {
                matter: "lavoie",
                tone: "warn",
                hit: { fr: "Cité dans une note de recherche en suspens", en: "Cited in a parked research note" },
                rec: { fr: "À réviser — pas urgent, pas d'audience programmée.", en: "To revise — not urgent, no hearing scheduled." },
                next: { fr: "Pas de délai", en: "No deadline" },
              },
              {
                matter: "tremblay",
                tone: "ok",
                hit: { fr: "Aucune citation — dossier non affecté", en: "No citation — matter unaffected" },
                rec: { fr: "Continuez avec [[DroitFamille2023]].", en: "Continue with [[DroitFamille2023]]." },
                next: { fr: "Jeudi 14 h", en: "Thursday 2 PM" },
              },
              {
                matter: "lapointe",
                tone: "ok",
                hit: { fr: "Aucune citation — dossier non affecté", en: "No citation — matter unaffected" },
                rec: { fr: "Surveillez plutôt [[Therrien]] qui se solidifie.", en: "Watch [[Therrien]] instead — it's solidifying." },
                next: { fr: "Mémoire dû 18 mai", en: "Brief due May 18" },
              },
            ],
          },
          {
            kind: "concept",
            title: { fr: "Ce que je vous recommande, dans l'ordre", en: "What I recommend, in order" },
            body: {
              fr: "**(1)** Régler le dossier *Dupont* ce soir — audience demain. **(2)** Mettre une note dans le carnet *Lavoie* pour la prochaine fois que vous l'ouvrez. **(3)** Aucune action requise sur *Tremblay* ou *Lapointe*.",
              en: "**(1)** Fix the *Dupont* matter tonight — hearing tomorrow. **(2)** Drop a note in the *Lavoie* file for next time you open it. **(3)** No action needed on *Tremblay* or *Lapointe*.",
            },
          },
          {
            kind: "actions",
            items: [
              { label: { fr: "Ouvrir Dupont", en: "Open Dupont" }, icon: "folder", screen: "dossier-dupont" },
              { label: { fr: "Voir tous les dossiers", en: "View all matters" }, icon: "layout", screen: "dossiers" },
              { label: { fr: "Voir le revirement", en: "View the reversal" }, icon: "alert", screen: "revirements" },
            ],
          },
        ],
      },
    ],
  },
];

// ─── Suggested prompts (the chips above the composer) ───────────────────
const SUGGESTED_PROMPTS = {
  fr: [
    { text: "J'ai une audience demain matin en droit du travail. Qu'est-ce que je dois absolument avoir avec moi ?", scenario: "dupont", icon: "scales" },
    { text: "Sur Beaulieu, ma fouille est-elle vraiment illégale ?", scenario: "beaulieu", icon: "scales" },
    { text: "Construis l'argument de légitime défense pour Lemieux.", scenario: "lemieux", icon: "judge" },
    { text: "Dans le dossier Tremblay, ai-je un bon argument sur la garde ?", scenario: "tremblay", icon: "judge" },
    { text: "Quel impact a le revirement Gagnon sur mes dossiers ?", scenario: "cross", icon: "network" },
    { text: "Quels sont les arrêts récents sur la responsabilité médicale au Québec ?", scenario: "medical", icon: "search" },
    { text: "Rédige-moi une ouverture de plaidoirie pour le dossier Dupont.", scenario: "opening", icon: "quote" },
    { text: "Compare Bombardier et McLeod sur la cause juste.", scenario: "compare", icon: "columns" },
    { text: "Explique-moi l'honneur de la Couronne en droit autochtone.", scenario: "honneur", icon: "book" },
  ],
  en: [
    { text: "I have a labour-law hearing tomorrow. What do I absolutely need with me?", scenario: "dupont", icon: "scales" },
    { text: "On Beaulieu, was the search really unlawful?", scenario: "beaulieu", icon: "scales" },
    { text: "Build the self-defence argument for Lemieux.", scenario: "lemieux", icon: "judge" },
    { text: "On the Tremblay matter — do I have a good custody argument?", scenario: "tremblay", icon: "judge" },
    { text: "What's the impact of the Gagnon reversal on my matters?", scenario: "cross", icon: "network" },
    { text: "What are the recent Quebec rulings on medical liability?", scenario: "medical", icon: "search" },
    { text: "Draft me an opening statement for the Dupont matter.", scenario: "opening", icon: "quote" },
    { text: "Compare Bombardier and McLeod on just cause.", scenario: "compare", icon: "columns" },
    { text: "Explain the Honour of the Crown in Aboriginal law.", scenario: "honneur", icon: "book" },
  ],
};

Object.assign(window, { CASES, SCENARIOS, SUGGESTED_PROMPTS });
