import { useCallback, useEffect, useState } from "react";

/* -------------------------------------------------------------------------- */
/*                        Types de configuration Agent IA                      */
/* -------------------------------------------------------------------------- */

export type Langue = "Français" | "Darija" | "العربية" | "English";
export type TonAgent =
  | "Professionnel"
  | "Professionnel et chaleureux"
  | "Commercial"
  | "Concis"
  | "Personnalisé";

export type ModeValidation = "Toujours" | "Au-dessus d’un seuil" | "Jamais";

export interface RegleValidation {
  mode: ModeValidation;
  seuil: number;
}

export type TypeSource = "Document" | "Texte" | "FAQ" | "URL";
export type StatutSource = "Prêt" | "Traitement" | "Erreur";

export interface EntreeFaq {
  id: string;
  question: string;
  reponse: string;
  active: boolean;
}

export interface SourceConnaissance {
  id: string;
  type: TypeSource;
  nom: string;
  categorie: string;
  description: string;
  format: string;
  url?: string;
  contenu: string;
  faq: EntreeFaq[];
  statut: StatutSource;
  actif: boolean;
  ajouteLe: string;
  modifieLe: string;
  instructionsUtiliser: string;
  instructionsEviter: string;
}

export interface ProduitAgent {
  utilise: boolean;
  instructions: string;
}

export interface EvenementAgent {
  id: string;
  date: string;
  libelle: string;
  auteur: string;
}

export interface ConfigAgent {
  nom: string;
  description: string;
  entreprise: string;
  actif: boolean;
  langues: {
    repondreMemeLangue: boolean;
    detectionAuto: boolean;
    adapterChangement: boolean;
    defaut: Langue;
    supportees: Langue[];
  };
  ton: {
    style: TonAgent;
    instructions: string;
    utiliserPrenom: boolean;
    reponsesCourtes: boolean;
    langageSimple: boolean;
    reformulerBesoin: boolean;
  };
  garanties: {
    jamaisInventerPrix: boolean;
    jamaisInventerDisponibilite: boolean;
    jamaisInventerCaracteristique: boolean;
    jamaisInventerCondition: boolean;
    validationSiDoute: boolean;
  };
  priorites: string[];
  automatisations: Record<string, boolean>;
  approbations: {
    envoyerDevis: RegleValidation;
    emettreFacture: RegleValidation;
    appliquerRemise: RegleValidation;
    confirmerLocation: RegleValidation;
    confirmerVente: RegleValidation;
  };
  transfert: {
    declencheurs: Record<string, boolean>;
    commercialId: string;
    message: string;
    limites: Record<string, boolean>;
  };
}

export interface EtatAgent {
  config: ConfigAgent;
  sources: SourceConnaissance[];
  produits: Record<string, ProduitAgent>;
  audit: EvenementAgent[];
  enregistreLe: string;
}

/* -------------------------------------------------------------------------- */
/*                                  Libellés                                   */
/* -------------------------------------------------------------------------- */

export const CATEGORIES_CONNAISSANCE = [
  "Produits",
  "Location",
  "Vente",
  "Tarification",
  "Livraison",
  "Entreprise",
  "FAQ",
  "Conditions commerciales",
  "Procédures",
  "Autre",
];

export const LANGUES: Langue[] = ["Français", "Darija", "العربية", "English"];

export const GROUPES_AUTOMATISATION: {
  titre: string;
  items: { cle: string; label: string }[];
}[] = [
  {
    titre: "Prospection",
    items: [
      { cle: "creerProspect", label: "Créer un prospect automatiquement" },
      { cle: "majProspect", label: "Mettre à jour un prospect" },
    ],
  },
  {
    titre: "Qualification",
    items: [
      { cle: "qualifier", label: "Qualifier automatiquement" },
      { cle: "creerOpportunite", label: "Créer une opportunité automatiquement" },
    ],
  },
  {
    titre: "Devis",
    items: [
      { cle: "preparerDevis", label: "Préparer un devis automatiquement" },
      { cle: "envoyerDevis", label: "Envoyer le devis automatiquement" },
    ],
  },
  {
    titre: "Vente",
    items: [
      { cle: "preparerVente", label: "Préparer une vente" },
      { cle: "validerVente", label: "Valider une vente automatiquement" },
    ],
  },
  {
    titre: "Location",
    items: [
      { cle: "preparerLocation", label: "Préparer une location" },
      { cle: "validerLocation", label: "Valider automatiquement une location" },
    ],
  },
  {
    titre: "Facturation",
    items: [
      { cle: "preparerFacture", label: "Préparer une facture" },
      { cle: "envoyerFacture", label: "Envoyer automatiquement une facture" },
    ],
  },
  {
    titre: "Livraison",
    items: [
      { cle: "creerLivraison", label: "Créer une demande de livraison" },
      { cle: "confirmerLivraison", label: "Confirmer la livraison automatiquement" },
    ],
  },
];

export const DECLENCHEURS_TRANSFERT: { cle: string; label: string }[] = [
  { cle: "demandeHumain", label: "Client demande à parler à une personne" },
  { cle: "prixIndisponible", label: "Prix non disponible" },
  { cle: "produitIntrouvable", label: "Produit non trouvé" },
  { cle: "disponibiliteIncertaine", label: "Disponibilité incertaine" },
  { cle: "demandeTechnique", label: "Demande technique complexe" },
  { cle: "reclamation", label: "Réclamation" },
  { cle: "negociation", label: "Négociation spéciale" },
  { cle: "remise", label: "Remise demandée" },
  { cle: "paiement", label: "Problème de paiement" },
  { cle: "confianceFaible", label: "Confiance IA faible" },
];

export const LIMITES_AGENT: { cle: string; label: string }[] = [
  { cle: "prixSansRegle", label: "Ne pas modifier un prix sans règle" },
  { cle: "remiseNonAutorisee", label: "Ne pas accorder une remise non autorisée" },
  { cle: "disponibiliteInconnue", label: "Ne pas confirmer une disponibilité inconnue" },
  { cle: "delaiNonValide", label: "Ne pas promettre un délai non validé" },
  { cle: "factureDefinitive", label: "Ne pas émettre une facture définitive sans autorisation" },
  { cle: "transfertInfoCritique", label: "Transférer vers un humain lorsqu’une information critique manque" },
];

export const PRIORITES_DEFAUT = [
  "Catalogue et règles SINMAT",
  "Informations commerciales validées",
  "FAQ",
  "Documents",
  "Sources web autorisées",
];

/* -------------------------------------------------------------------------- */
/*                                  Défauts                                    */
/* -------------------------------------------------------------------------- */

const CLE_STOCKAGE = "sinmat.agent-ia.v1";

const vraiPour = (cles: { cle: string }[], faux: string[] = []) =>
  Object.fromEntries(cles.map((c) => [c.cle, !faux.includes(c.cle)]));

export function configDefaut(): ConfigAgent {
  return {
    nom: "Assistant Commercial SINMAT",
    description:
      "Agent commercial chargé de répondre aux prospects, identifier leurs besoins, qualifier les demandes et accompagner les parcours de vente et de location.",
    entreprise: "SINMAT",
    actif: true,
    langues: {
      repondreMemeLangue: true,
      detectionAuto: true,
      adapterChangement: true,
      defaut: "Français",
      supportees: ["Français", "Darija", "العربية", "English"],
    },
    ton: {
      style: "Professionnel et chaleureux",
      instructions:
        "Utiliser un ton professionnel, clair et chaleureux. Poser une ou deux questions à la fois et éviter les réponses trop longues.",
      utiliserPrenom: true,
      reponsesCourtes: true,
      langageSimple: true,
      reformulerBesoin: true,
    },
    garanties: {
      jamaisInventerPrix: true,
      jamaisInventerDisponibilite: true,
      jamaisInventerCaracteristique: true,
      jamaisInventerCondition: true,
      validationSiDoute: true,
    },
    priorites: [...PRIORITES_DEFAUT],
    automatisations: vraiPour(
      GROUPES_AUTOMATISATION.flatMap((g) => g.items),
      ["envoyerDevis", "validerVente", "validerLocation", "envoyerFacture", "confirmerLivraison"],
    ),
    approbations: {
      envoyerDevis: { mode: "Au-dessus d’un seuil", seuil: 50000 },
      emettreFacture: { mode: "Toujours", seuil: 0 },
      appliquerRemise: { mode: "Au-dessus d’un seuil", seuil: 10 },
      confirmerLocation: { mode: "Au-dessus d’un seuil", seuil: 30 },
      confirmerVente: { mode: "Au-dessus d’un seuil", seuil: 100000 },
    },
    transfert: {
      declencheurs: vraiPour(DECLENCHEURS_TRANSFERT),
      commercialId: "U1",
      message:
        "Je vais transmettre votre demande à un conseiller SINMAT afin qu’il puisse vous accompagner.",
      limites: vraiPour(LIMITES_AGENT),
    },
  };
}

const source = (s: Partial<SourceConnaissance> & { id: string; nom: string; type: TypeSource }): SourceConnaissance => ({
  categorie: "Autre",
  description: "",
  format: s.type === "Document" ? "PDF" : s.type === "URL" ? "Web" : s.type,
  contenu: "",
  faq: [],
  statut: "Prêt",
  actif: true,
  ajouteLe: "2026-09-15",
  modifieLe: "2026-09-15",
  instructionsUtiliser: "",
  instructionsEviter: "",
  ...s,
});

function sourcesDefaut(): SourceConnaissance[] {
  return [
    source({
      id: "KB-1",
      type: "Document",
      nom: "Catalogue_Location_2026.pdf",
      categorie: "Produits",
      format: "PDF",
      description: "Catalogue complet du matériel disponible à la location en 2026.",
      contenu:
        "Catalogue location SINMAT 2026 — familles de matériel : terrassement, compactage, démolition, béton, énergie, accès et découpe. Chaque famille précise les modèles disponibles, les capacités et les conditions générales de location.",
      instructionsUtiliser:
        "L’Agent peut utiliser ce document pour répondre aux questions sur les conditions de location.",
      ajouteLe: "2026-09-15",
    }),
    source({
      id: "KB-2",
      type: "Document",
      nom: "Conditions_commerciales_SINMAT.docx",
      categorie: "Conditions commerciales",
      format: "DOCX",
      description: "Conditions de paiement, caution et pénalités de retard.",
      contenu:
        "Conditions commerciales SINMAT : acompte de 30 % à la commande, caution restituée après inspection du matériel, pénalité de retard appliquée par jour calendaire selon la règle produit.",
      instructionsEviter: "Ne pas utiliser pour communiquer un prix précis.",
      ajouteLe: "2026-09-12",
    }),
    source({
      id: "KB-3",
      type: "Texte",
      nom: "Conditions de livraison",
      categorie: "Livraison",
      format: "Texte",
      contenu:
        "La livraison peut être proposée selon la ville, le matériel et les conditions commerciales définies par SINMAT.",
      ajouteLe: "2026-09-10",
    }),
    source({
      id: "KB-4",
      type: "FAQ",
      nom: "FAQ commerciale",
      categorie: "FAQ",
      format: "FAQ",
      faq: [
        {
          id: "F1",
          question: "Est-ce que SINMAT propose la location ?",
          reponse:
            "Oui, certains équipements sont disponibles à la location selon les disponibilités et les conditions commerciales.",
          active: true,
        },
        {
          id: "F2",
          question: "Quels sont les délais de mise à disposition ?",
          reponse:
            "Le délai dépend de la ville et de la disponibilité du matériel. Un conseiller confirme systématiquement la date.",
          active: true,
        },
      ],
      ajouteLe: "2026-09-08",
    }),
    source({
      id: "KB-5",
      type: "URL",
      nom: "Site officiel SINMAT",
      categorie: "Entreprise",
      format: "Web",
      url: "https://sinmat.ma/",
      contenu:
        "Présentation de SINMAT, activités de vente et de location de matériel de chantier, zones d’intervention et coordonnées de contact.",
      ajouteLe: "2026-09-05",
    }),
    source({
      id: "KB-6",
      type: "Document",
      nom: "Procedures_livraison_chantier.xlsx",
      categorie: "Procédures",
      format: "XLSX",
      description: "Procédure interne de préparation et de livraison sur chantier.",
      contenu:
        "Étapes de préparation : contrôle du matériel, chargement, bon de livraison, signature du client sur chantier, retour photo.",
      statut: "Traitement",
      ajouteLe: "2026-09-16",
    }),
  ];
}

function auditDefaut(): EvenementAgent[] {
  return [
    { id: "A1", date: "2026-09-16T11:24:00.000Z", libelle: "Règles de qualification modifiées", auteur: "FatimaEzzahra Seffari" },
    { id: "A2", date: "2026-09-16T10:48:00.000Z", libelle: "Catalogue PDF ajouté", auteur: "FatimaEzzahra Seffari" },
    { id: "A3", date: "2026-09-15T17:20:00.000Z", libelle: "Ton de l’Agent modifié", auteur: "FatimaEzzahra Seffari" },
  ];
}

export function etatDefaut(): EtatAgent {
  return {
    config: configDefaut(),
    sources: sourcesDefaut(),
    produits: {},
    audit: auditDefaut(),
    enregistreLe: "2026-09-16T11:24:00.000Z",
  };
}

/* -------------------------------------------------------------------------- */
/*                                   Hook                                      */
/* -------------------------------------------------------------------------- */

export function useAgentIA() {
  const [etat, setEtat] = useState<EtatAgent>(etatDefaut);
  const [charge, setCharge] = useState(false);

  useEffect(() => {
    try {
      const brut = window.localStorage.getItem(CLE_STOCKAGE);
      if (brut) {
        const lu = JSON.parse(brut) as Partial<EtatAgent>;
        const base = etatDefaut();
        setEtat({
          config: { ...base.config, ...(lu.config ?? {}) },
          sources: lu.sources ?? base.sources,
          produits: lu.produits ?? {},
          audit: lu.audit ?? base.audit,
          enregistreLe: lu.enregistreLe ?? base.enregistreLe,
        });
      }
    } catch {
      /* stockage indisponible */
    }
    setCharge(true);
  }, []);

  const persister = useCallback((suivant: EtatAgent) => {
    setEtat(suivant);
    try {
      window.localStorage.setItem(CLE_STOCKAGE, JSON.stringify(suivant));
    } catch {
      /* stockage indisponible */
    }
  }, []);

  const journaliser = useCallback(
    (precedent: EtatAgent, libelle: string): EvenementAgent[] =>
      [
        {
          id: `A${Date.now()}`,
          date: new Date().toISOString(),
          libelle,
          auteur: "FatimaEzzahra Seffari",
        },
        ...precedent.audit,
      ].slice(0, 20),
    [],
  );

  return { etat, charge, persister, journaliser, setEtat };
}

/* -------------------------------------------------------------------------- */
/*                                 Utilitaires                                 */
/* -------------------------------------------------------------------------- */

export function formaterDateHeure(iso: string) {
  const d = new Date(iso);
  const aujourdhui = d.toDateString() === new Date().toDateString();
  const heure = d.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
  if (aujourdhui) return `Aujourd’hui à ${heure}`;
  return `${d.toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" })} · ${heure}`;
}

export function formaterDateCourte(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit", year: "numeric" });
}

/** Détection simple de la langue d’un message client (MVP, sans appel externe). */
export function detecterLangue(texte: string): Langue {
  const t = texte.toLowerCase();
  if (/[\u0600-\u06FF]/.test(texte)) return "العربية";
  const darija = ["bghit", "chhal", "3andkom", "wach", "kanbghi", "nkri", "iyam", "smiti", "mzyan", "bzaf", "khdma"];
  if (darija.some((m) => t.includes(m))) return "Darija";
  const anglais = ["i need", "i want", "hello", "price", "rent", "available", "how much"];
  if (anglais.some((m) => t.includes(m))) return "English";
  return "Français";
}
