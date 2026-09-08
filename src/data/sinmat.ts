/**
 * SINMAT — Jeu de données relationnel (MVP mock).
 * Structuré pour être remplacé par une API / Lovable Cloud sans changer l'UI.
 */

export type Ville =
  | "Casablanca"
  | "Tanger"
  | "Rabat"
  | "Tétouan"
  | "Kénitra"
  | "Marrakech";

export const VILLES: readonly Ville[] = [
  "Casablanca",
  "Tanger",
  "Rabat",
  "Tétouan",
  "Kénitra",
  "Marrakech",
];

export type TypeActivite = "Vente" | "Location";

export interface Utilisateur {
  id: string;
  nom: string;
  email: string;
  role: "Administrateur" | "Direction" | "Commercial" | "Comptabilité" | "Logistique";
  statut: "Actif" | "Suspendu";
  derniereConnexion: string;
  initiales: string;
}

export interface Prospect {
  id: string;
  entreprise: string;
  contact: string;
  telephone: string;
  email: string;
  ville: Ville;
  secteur: string;
  source: string;
  statut:
    | "Nouveau"
    | "À contacter"
    | "Contacté"
    | "Intéressé"
    | "À relancer"
    | "Non intéressé";
  qualification: "Non qualifié" | "En cours" | "Qualifié" | "Disqualifié";
  interet: "Faible" | "Moyen" | "Élevé";
  derniereActivite: string;
  creeLe: string;
  responsableId: string;
  campagneId?: string | undefined;
  opportuniteId?: string | undefined;
  clientId?: string | undefined;
  ia?: {
    besoin: TypeActivite;
    produit: string;
    quantite: number;
    duree: string;
    dateSouhaitee: string;
    chantier: string;
    urgence: "Faible" | "Moyenne" | "Élevée";
    resume: string;
    probabilite: number;
    recommandation: string;
    qualifieLe: string;
  };
  timeline: { date: string; libelle: string }[];
}

export interface Campagne {
  id: string;
  nom: string;
  objectif: string;
  audience: number;
  envoyes: number;
  reponses: number;
  qualifies: number;
  opportunites: number;
  conversion: number;
  statut: "Brouillon" | "Planifiée" | "En cours" | "Terminée";
  date: string;
  criteres: string[];
}

export interface Client {
  id: string;
  nom: string;
  contact: string;
  telephone: string;
  email: string;
  ville: Ville;
  adresse: string;
  ice: string;
  rc: string;
  type: "Vente" | "Location" | "Vente & Location";
  statut: "Actif" | "Inactif";
  operations: number;
  ca: number;
  encours: number;
  derniereActivite: string;
  responsableId: string;
  depuis: string;
}

export type EtapePipeline =
  | "À qualifier"
  | "Qualifié"
  | "Devis à préparer"
  | "Devis envoyé"
  | "Confirmé"
  | "Gagné";

export const ETAPES_PIPELINE: EtapePipeline[] = [
  "À qualifier",
  "Qualifié",
  "Devis à préparer",
  "Devis envoyé",
  "Confirmé",
  "Gagné",
];

export interface Opportunite {
  id: string;
  titre: string;
  clientId?: string | undefined;
  prospectId?: string | undefined;
  entreprise: string;
  type: TypeActivite;
  montant: number;
  etape: EtapePipeline;
  produit: string;
  quantite: number;
  duree?: string | undefined;
  dateSouhaitee: string;
  chantier: Ville;
  urgence: "Faible" | "Moyenne" | "Élevée";
  responsableId: string;
  prochaineAction: string;
  derniereActivite: string;
  source: string;
  resumeIA: string;
  probabilite: number;
  devisId?: string | undefined;
  venteId?: string | undefined;
  locationId?: string | undefined;
  modeCreation?: ("IA" | "Manuel") | undefined;
  conversationId?: string | undefined;
  confianceIA?: number | undefined;
  criteresIA?: string[] | undefined;
  historiqueEtapes?:
    | { etape: EtapePipeline; date: string; acteur: string; mode: "IA" | "Manuel" }[]
    | undefined;
}

/** Origine d'une opportunité : générée par l'agent IA ou saisie manuellement. */
export const origineOpportunite = (o: Opportunite): "IA" | "Manuel" =>
  o.modeCreation ?? (o.source.toLowerCase().includes("ia") ? "IA" : "Manuel");

export interface Produit {
  id: string;
  nom: string;
  reference: string;
  categorie: string;
  description: string;
  image: string;
  prixVente: number;
  prixJour: number;
  prixSemaine: number;
  prixMois: number;
  stock: number;
  reserve: number;
  enLocation: number;
  maintenance: number;
  fournisseur: string;
  disponibilite: "Disponible" | "Stock faible" | "Indisponible";
  specs: { label: string; valeur: string; unite?: string | undefined }[];
  /* Champs étendus (création / fiche produit) */
  sousCategorie?: string | undefined;
  marque?: string | undefined;
  images?: string[] | undefined;
  venteActive?: boolean | undefined;
  locationActive?: boolean | undefined;
  uniteLocation?: ("Jour" | "Semaine" | "Mois") | undefined;
  tva?: number | undefined;
  prixMinimum?: number | undefined;
  remiseMax?: number | undefined;
  poids?: number | undefined;
  longueur?: number | undefined;
  largeur?: number | undefined;
  hauteur?: number | undefined;
  livrable?: boolean | undefined;
  infosLogistiques?: string | undefined;
  qualificationIA?: boolean | undefined;
  archive?: boolean | undefined;
  creeLe?: string | undefined;
  modifieLe?: string | undefined;
}


export interface LigneDocument {
  produitId: string;
  designation: string;
  quantite: number;
  prixUnitaire: number;
  duree?: number | undefined;
  uniteDuree?: ("Jour" | "Semaine" | "Mois") | undefined;
  remise: number;
  tva: number;
}

export interface Devis {
  id: string;
  clientId: string;
  opportuniteId?: string | undefined;
  type: TypeActivite;
  date: string;
  expiration: string;
  montant: number;
  responsableId: string;
  statut: "Brouillon" | "Généré" | "Envoyé" | "En attente" | "Accepté" | "Refusé" | "Expiré";
  lignes: LigneDocument[];
  conditions: string;
  venteId?: string | undefined;
  locationId?: string | undefined;
}

export interface Vente {
  id: string;
  devisId?: string | undefined;
  opportuniteId?: string | undefined;
  clientId: string;
  date: string;
  montant: number;
  statut: "Brouillon" | "Confirmée" | "En préparation" | "Payée" | "Livrée" | "Annulée";
  paiement: "Non payé" | "Acompte" | "Partiellement payé" | "Payé";
  lignes: LigneDocument[];
  factureId?: string | undefined;
  livraisonId?: string | undefined;
  notes: string;
  responsableId: string;
}

export interface Location {
  id: string;
  devisId?: string | undefined;
  opportuniteId?: string | undefined;
  clientId: string;
  produitId: string;
  quantite: number;
  debut: string;
  finPrevue: string;
  dureeJours: number;
  montant: number;
  statut:
    | "Réservée"
    | "À préparer"
    | "En cours"
    | "Retour proche"
    | "En retard"
    | "Terminée";
  chantier: string;
  ville: Ville;
  responsableChantier: string;
  telephoneChantier: string;
  retourId?: string | undefined;
  paiement: "Non payé" | "Acompte" | "Partiellement payé" | "Payé";
  factureId?: string | undefined;
  livraisonId?: string | undefined;
  notes: string;
  responsableId: string;
}

export type OrigineType = "Vente" | "Location";

export interface Facture {
  id: string;
  clientId: string;
  origineType: OrigineType;
  origineId: string;
  devisId?: string | undefined;
  date: string;
  echeance: string;
  ht: number;
  ttc: number;
  paye: number;
  statut: "Brouillon" | "Émise" | "Partiellement payée" | "Payée" | "En retard";
}

export interface Paiement {
  id: string;
  clientId: string;
  factureId: string;
  montant: number;
  date: string;
  mode: "Virement" | "Chèque" | "Espèces" | "Carte" | "Autre";
  reference: string;
  commentaire: string;
}

export interface Livraison {
  id: string;
  origineType: OrigineType;
  origineId: string;
  clientId: string;
  chantier: string;
  ville: Ville;
  adresse: string;
  date: string;
  creneau: string;
  responsableId: string;
  chauffeur: string;
  vehicule: string;
  statut:
    | "À préparer"
    | "Préparation en cours"
    | "Prête"
    | "Planifiée"
    | "En livraison"
    | "Livrée";
  notes: string;
}

export interface Retour {
  id: string;
  locationId: string;
  clientId: string;
  produitId: string;
  quantite: number;
  retourPrevu: string;
  retourReel?: string | undefined;
  retardJours: number;
  etat: "Excellent" | "Bon" | "À contrôler" | "Endommagé" | "—";
  statut: "Planifié" | "À récupérer" | "En transit" | "Reçu" | "À inspecter" | "Clôturé";
  fraisSupplementaires: number;
  notes: string;
}

/* ------------------------------------------------------------------ */
/* Formatage                                                           */
/* ------------------------------------------------------------------ */

export const formatDH = (n: number) =>
  `${new Intl.NumberFormat("fr-FR").format(Math.round(n))} DH`;

export const formatNombre = (n: number) => new Intl.NumberFormat("fr-FR").format(n);

const MOIS = [
  "janv.",
  "févr.",
  "mars",
  "avr.",
  "mai",
  "juin",
  "juil.",
  "août",
  "sept.",
  "oct.",
  "nov.",
  "déc.",
];

export const formatDate = (iso: string) => {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return `${String(d.getDate()).padStart(2, "0")} ${MOIS[d.getMonth()]} ${d.getFullYear()}`;
};

export const formatDateCourte = (iso: string) => {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return `${String(d.getDate()).padStart(2, "0")} ${MOIS[d.getMonth()]}`;
};

export const AUJOURDHUI = new Date("2026-09-07T09:00:00");

export const joursDepuis = (iso: string) =>
  Math.round((AUJOURDHUI.getTime() - new Date(iso).getTime()) / 86400000);

/* ------------------------------------------------------------------ */
/* Données                                                             */
/* ------------------------------------------------------------------ */

export const utilisateurs: Utilisateur[] = [
  {
    id: "U1",
    nom: "FatimaEzzahra Seffari",
    email: "f.seffari@sinmat.ma",
    role: "Commercial",
    statut: "Actif",
    derniereConnexion: "2026-09-07",
    initiales: "FS",
  },
  {
    id: "U2",
    nom: "Salma Bennani",
    email: "s.bennani@sinmat.ma",
    role: "Comptabilité",
    statut: "Actif",
    derniereConnexion: "2026-09-07",
    initiales: "SB",
  },
  {
    id: "U3",
    nom: "Karim Ouazzani",
    email: "k.ouazzani@sinmat.ma",
    role: "Logistique",
    statut: "Actif",
    derniereConnexion: "2026-09-06",
    initiales: "KO",
  },
  {
    id: "U4",
    nom: "Nadia Berrada",
    email: "n.berrada@sinmat.ma",
    role: "Direction",
    statut: "Actif",
    derniereConnexion: "2026-09-05",
    initiales: "NB",
  },
  {
    id: "U5",
    nom: "Omar Chraibi",
    email: "o.chraibi@sinmat.ma",
    role: "Administrateur",
    statut: "Actif",
    derniereConnexion: "2026-09-07",
    initiales: "OC",
  },
  {
    id: "U6",
    nom: "Hicham Idrissi",
    email: "h.idrissi@sinmat.ma",
    role: "Commercial",
    statut: "Suspendu",
    derniereConnexion: "2026-08-21",
    initiales: "HI",
  },
];

export const utilisateurCourant = utilisateurs[0]!;

export const nomUtilisateur = (id: string) =>
  utilisateurs.find((u) => u.id === id)?.nom ?? "—";
export const prenomUtilisateur = (id: string) =>
  (utilisateurs.find((u) => u.id === id)?.nom ?? "—").split(" ")[0];

export const produits: Produit[] = [
  {
    id: "P1",
    nom: "Mini-pelle 3.5T",
    reference: "SIN-PEL-035",
    categorie: "Terrassement",
    description:
      "Mini-pelle compacte 3.5 tonnes, idéale pour les travaux de terrassement en zone urbaine et les chantiers à accès restreint.",
    image: "/produits/mini-pelle.jpg",
    prixVente: 325000,
    prixJour: 1600,
    prixSemaine: 9200,
    prixMois: 32000,
    stock: 4,
    reserve: 1,
    enLocation: 6,
    maintenance: 1,
    fournisseur: "Kubota Maroc",
    disponibilite: "Disponible",
    specs: [
      { label: "Poids opérationnel", valeur: "3 500 kg" },
      { label: "Puissance moteur", valeur: "24,8 kW" },
      { label: "Profondeur de fouille", valeur: "3,18 m" },
      { label: "Largeur", valeur: "1,74 m" },
    ],
  },
  {
    id: "P2",
    nom: "Marteau-piqueur professionnel",
    reference: "SIN-MRT-018",
    categorie: "Démolition",
    description:
      "Marteau-piqueur électro-pneumatique haute performance pour démolition de béton armé.",
    image: "/produits/marteau-piqueur.jpg",
    prixVente: 18500,
    prixJour: 240,
    prixSemaine: 1300,
    prixMois: 4200,
    stock: 14,
    reserve: 2,
    enLocation: 9,
    maintenance: 0,
    fournisseur: "Bosch Professional",
    disponibilite: "Disponible",
    specs: [
      { label: "Énergie de frappe", valeur: "25 J" },
      { label: "Puissance", valeur: "1 700 W" },
      { label: "Poids", valeur: "16,5 kg" },
    ],
  },
  {
    id: "P3",
    nom: "Bétonnière 350 L",
    reference: "SIN-BET-350",
    categorie: "Béton",
    description: "Bétonnière tractable 350 litres à châssis renforcé, moteur thermique.",
    image: "/produits/betonniere.jpg",
    prixVente: 24800,
    prixJour: 320,
    prixSemaine: 1750,
    prixMois: 5600,
    stock: 8,
    reserve: 1,
    enLocation: 5,
    maintenance: 1,
    fournisseur: "Altrad Maroc",
    disponibilite: "Disponible",
    specs: [
      { label: "Capacité cuve", valeur: "350 L" },
      { label: "Rendement", valeur: "260 L/gâchée" },
      { label: "Moteur", valeur: "Thermique 5,5 CV" },
    ],
  },
  {
    id: "P4",
    nom: "Groupe électrogène 60 kVA",
    reference: "SIN-GEN-060",
    categorie: "Énergie",
    description: "Groupe électrogène diesel insonorisé 60 kVA avec réservoir grande autonomie.",
    image: "/produits/groupe-electrogene.jpg",
    prixVente: 142000,
    prixJour: 950,
    prixSemaine: 5400,
    prixMois: 18500,
    stock: 3,
    reserve: 1,
    enLocation: 4,
    maintenance: 0,
    fournisseur: "SDMO Industries",
    disponibilite: "Stock faible",
    specs: [
      { label: "Puissance", valeur: "60 kVA" },
      { label: "Autonomie", valeur: "12 h à 75 %" },
      { label: "Niveau sonore", valeur: "68 dB(A) à 7 m" },
    ],
  },
  {
    id: "P5",
    nom: "Compacteur à plaque réversible",
    reference: "SIN-CMP-120",
    categorie: "Compactage",
    description: "Compacteur réversible 120 kg pour compactage de remblais et enrobés.",
    image: "/produits/compacteur.jpg",
    prixVente: 46500,
    prixJour: 420,
    prixSemaine: 2300,
    prixMois: 7800,
    stock: 6,
    reserve: 0,
    enLocation: 3,
    maintenance: 1,
    fournisseur: "Wacker Neuson",
    disponibilite: "Disponible",
    specs: [
      { label: "Force centrifuge", valeur: "30 kN" },
      { label: "Poids", valeur: "120 kg" },
      { label: "Largeur de travail", valeur: "500 mm" },
    ],
  },
  {
    id: "P6",
    nom: "Échafaudage multidirectionnel",
    reference: "SIN-ECH-100",
    categorie: "Accès",
    description: "Lot d'échafaudage multidirectionnel galvanisé, montage rapide, 100 m².",
    image: "/produits/echafaudage.jpg",
    prixVente: 88000,
    prixJour: 380,
    prixSemaine: 2100,
    prixMois: 7200,
    stock: 12,
    reserve: 3,
    enLocation: 7,
    maintenance: 0,
    fournisseur: "Layher Maghreb",
    disponibilite: "Disponible",
    specs: [
      { label: "Surface", valeur: "100 m²" },
      { label: "Charge admissible", valeur: "300 kg/m²" },
      { label: "Finition", valeur: "Acier galvanisé" },
    ],
  },
  {
    id: "P7",
    nom: "Nacelle élévatrice 12 m",
    reference: "SIN-NAC-120",
    categorie: "Accès",
    description: "Nacelle articulée automotrice 12 mètres, motorisation électrique.",
    image: "/produits/nacelle.jpg",
    prixVente: 268000,
    prixJour: 1350,
    prixSemaine: 7600,
    prixMois: 26500,
    stock: 2,
    reserve: 1,
    enLocation: 3,
    maintenance: 1,
    fournisseur: "Haulotte Group",
    disponibilite: "Stock faible",
    specs: [
      { label: "Hauteur de travail", valeur: "12 m" },
      { label: "Capacité nacelle", valeur: "230 kg" },
      { label: "Motorisation", valeur: "Électrique" },
    ],
  },
  {
    id: "P8",
    nom: "Scie circulaire professionnelle",
    reference: "SIN-SCI-230",
    categorie: "Découpe",
    description: "Scie circulaire 230 mm pour découpe de matériaux de construction.",
    image: "/produits/scie-circulaire.jpg",
    prixVente: 7900,
    prixJour: 140,
    prixSemaine: 780,
    prixMois: 2500,
    stock: 18,
    reserve: 0,
    enLocation: 4,
    maintenance: 0,
    fournisseur: "Makita Maroc",
    disponibilite: "Disponible",
    specs: [
      { label: "Diamètre lame", valeur: "230 mm" },
      { label: "Puissance", valeur: "2 000 W" },
      { label: "Profondeur de coupe", valeur: "85 mm" },
    ],
  },
  {
    id: "P9",
    nom: "Plaque vibrante 90 kg",
    reference: "SIN-PLQ-090",
    categorie: "Compactage",
    description: "Plaque vibrante unidirectionnelle 90 kg, moteur essence.",
    image: "/produits/plaque-vibrante.jpg",
    prixVente: 21500,
    prixJour: 260,
    prixSemaine: 1450,
    prixMois: 4900,
    stock: 9,
    reserve: 1,
    enLocation: 2,
    maintenance: 0,
    fournisseur: "Wacker Neuson",
    disponibilite: "Disponible",
    specs: [
      { label: "Force centrifuge", valeur: "18 kN" },
      { label: "Poids", valeur: "90 kg" },
      { label: "Vitesse d'avance", valeur: "25 m/min" },
    ],
  },
  {
    id: "P10",
    nom: "Compresseur professionnel 500 L",
    reference: "SIN-CPR-500",
    categorie: "Énergie",
    description: "Compresseur à vis mobile 500 litres pour alimentation d'outils pneumatiques.",
    image: "/produits/compresseur.jpg",
    prixVente: 64000,
    prixJour: 520,
    prixSemaine: 2900,
    prixMois: 9800,
    stock: 0,
    reserve: 0,
    enLocation: 5,
    maintenance: 2,
    fournisseur: "Atlas Copco",
    disponibilite: "Indisponible",
    specs: [
      { label: "Débit", valeur: "5 000 L/min" },
      { label: "Pression", valeur: "7 bar" },
      { label: "Cuve", valeur: "500 L" },
    ],
  },
];

export const clients: Client[] = [
  {
    id: "CLI-001",
    nom: "Atlas Construction",
    contact: "Rachid Alaoui",
    telephone: "+212 661 24 87 10",
    email: "contact@atlas-construction.ma",
    ville: "Tanger",
    adresse: "Zone Industrielle Gzenaya, Lot 42",
    ice: "001784523000078",
    rc: "48219",
    type: "Vente & Location",
    statut: "Actif",
    operations: 8,
    ca: 426800,
    encours: 32400,
    derniereActivite: "2026-09-07",
    responsableId: "U1",
    depuis: "2023-04-12",
  },
  {
    id: "CLI-002",
    nom: "BTP Horizon",
    contact: "Meriem Fassi",
    telephone: "+212 662 55 41 09",
    email: "m.fassi@btphorizon.ma",
    ville: "Casablanca",
    adresse: "Bd Chefchaouni, Aïn Sebaâ",
    ice: "002145879000041",
    rc: "112904",
    type: "Location",
    statut: "Actif",
    operations: 5,
    ca: 187500,
    encours: 0,
    derniereActivite: "2026-09-06",
    responsableId: "U1",
    depuis: "2024-01-08",
  },
  {
    id: "CLI-003",
    nom: "Tanger Travaux",
    contact: "Youssef Benjelloun",
    telephone: "+212 663 78 22 45",
    email: "y.benjelloun@tangertravaux.ma",
    ville: "Tanger",
    adresse: "Route de Rabat, Km 8",
    ice: "003654127000012",
    rc: "50122",
    type: "Vente",
    statut: "Actif",
    operations: 6,
    ca: 312400,
    encours: 18600,
    derniereActivite: "2026-09-04",
    responsableId: "U6",
    depuis: "2022-11-25",
  },
  {
    id: "CLI-004",
    nom: "Nord Bâtiment",
    contact: "Hamza Tazi",
    telephone: "+212 664 11 90 33",
    email: "h.tazi@nordbatiment.ma",
    ville: "Tétouan",
    adresse: "Av. Mohammed V, Résidence Al Wafa",
    ice: "004987321000055",
    rc: "20874",
    type: "Vente & Location",
    statut: "Actif",
    operations: 4,
    ca: 149200,
    encours: 12800,
    derniereActivite: "2026-09-02",
    responsableId: "U1",
    depuis: "2024-06-19",
  },
  {
    id: "CLI-005",
    nom: "BatiPro Maroc",
    contact: "Sanaa El Khattabi",
    telephone: "+212 665 32 76 18",
    email: "s.elkhattabi@batipro.ma",
    ville: "Rabat",
    adresse: "Quartier Industriel Takadoum, Lot 17",
    ice: "005321478000090",
    rc: "88431",
    type: "Location",
    statut: "Actif",
    operations: 7,
    ca: 268900,
    encours: 0,
    derniereActivite: "2026-09-05",
    responsableId: "U6",
    depuis: "2023-09-01",
  },
  {
    id: "CLI-006",
    nom: "Constructa SARL",
    contact: "Mehdi Sbaï",
    telephone: "+212 666 47 03 92",
    email: "m.sbai@constructa.ma",
    ville: "Marrakech",
    adresse: "Sidi Ghanem, Rue 12",
    ice: "006852147000033",
    rc: "34561",
    type: "Vente",
    statut: "Actif",
    operations: 3,
    ca: 98400,
    encours: 0,
    derniereActivite: "2026-08-28",
    responsableId: "U1",
    depuis: "2025-02-14",
  },
  {
    id: "CLI-007",
    nom: "ProChantier Maroc",
    contact: "Imane Lahlou",
    telephone: "+212 667 85 60 27",
    email: "i.lahlou@prochantier.ma",
    ville: "Kénitra",
    adresse: "Zone Franche, Bloc C",
    ice: "007412589000067",
    rc: "60193",
    type: "Vente & Location",
    statut: "Actif",
    operations: 6,
    ca: 214700,
    encours: 24500,
    derniereActivite: "2026-09-03",
    responsableId: "U6",
    depuis: "2023-07-30",
  },
];

export const campagnes: Campagne[] = [
  {
    id: "CMP-2026-004",
    nom: "Relance entreprises BTP — Tanger",
    objectif: "Identifier un besoin de location de matériel de terrassement",
    audience: 218,
    envoyes: 184,
    reponses: 79,
    qualifies: 27,
    opportunites: 14,
    conversion: 6.4,
    statut: "En cours",
    date: "2026-09-04",
    criteres: ["Ville = Tanger", "Secteur = BTP", "Dernier contact > 30 jours"],
  },
  {
    id: "CMP-2026-003",
    nom: "Location matériel — Septembre",
    objectif: "Relancer la base location avant la haute saison",
    audience: 342,
    envoyes: 342,
    reponses: 121,
    qualifies: 39,
    opportunites: 17,
    conversion: 5,
    statut: "Terminée",
    date: "2026-08-24",
    criteres: ["Type = Prospect & Client", "Historique location = Oui"],
  },
  {
    id: "CMP-2026-005",
    nom: "Prospection nacelles — Casablanca",
    objectif: "Détecter les besoins en travaux en hauteur",
    audience: 264,
    envoyes: 210,
    reponses: 96,
    qualifies: 31,
    opportunites: 12,
    conversion: 4.5,
    statut: "En cours",
    date: "2026-09-05",
    criteres: ["Ville = Casablanca", "Secteur = Second œuvre"],
  },
  {
    id: "CMP-2026-006",
    nom: "Vente compacteurs — Nord",
    objectif: "Promouvoir la gamme compactage à l'achat",
    audience: 148,
    envoyes: 0,
    reponses: 0,
    qualifies: 0,
    opportunites: 0,
    conversion: 0,
    statut: "Planifiée",
    date: "2026-09-12",
    criteres: ["Ville = Tétouan, Tanger", "Type de besoin = Achat"],
  },
  {
    id: "CMP-2026-007",
    nom: "Réactivation clients dormants",
    objectif: "Réengager les clients inactifs depuis 6 mois",
    audience: 96,
    envoyes: 0,
    reponses: 0,
    qualifies: 0,
    opportunites: 0,
    conversion: 0,
    statut: "Brouillon",
    date: "2026-09-07",
    criteres: ["Dernier contact > 180 jours"],
  },
  {
    id: "CMP-2026-002",
    nom: "Groupes électrogènes — Été",
    objectif: "Vendre et louer des groupes électrogènes",
    audience: 187,
    envoyes: 187,
    reponses: 64,
    qualifies: 21,
    opportunites: 9,
    conversion: 4.8,
    statut: "Terminée",
    date: "2026-07-15",
    criteres: ["Secteur = BTP, Industrie"],
  },
];

export const prospects: Prospect[] = [
  {
    id: "PRO-2026-0118",
    entreprise: "Atlas Construction",
    contact: "Rachid Alaoui",
    telephone: "+212 661 24 87 10",
    email: "contact@atlas-construction.ma",
    ville: "Tanger",
    secteur: "BTP",
    source: "Campagne WhatsApp",
    statut: "Intéressé",
    qualification: "Qualifié",
    interet: "Élevé",
    derniereActivite: "2026-09-07",
    creeLe: "2026-09-05",
    responsableId: "U1",
    campagneId: "CMP-2026-004",
    opportuniteId: "OPP-2026-0042",
    clientId: "CLI-001",
    ia: {
      besoin: "Location",
      produit: "Mini-pelle 3.5T",
      quantite: 2,
      duree: "3 semaines",
      dateSouhaitee: "2026-09-15",
      chantier: "Tanger",
      urgence: "Élevée",
      resume:
        "Le prospect recherche deux mini-pelles pour un chantier à Tanger à partir du 15 septembre pour environ trois semaines. Il souhaite recevoir une proposition incluant la livraison.",
      probabilite: 82,
      recommandation: "Préparer un devis de location aujourd'hui.",
      qualifieLe: "2026-09-07T14:32:00",
    },
    timeline: [
      { date: "2026-09-05", libelle: "Prospect ajouté" },
      { date: "2026-09-06", libelle: "Campagne WhatsApp lancée" },
      { date: "2026-09-06", libelle: "Prospect qualifié automatiquement" },
      { date: "2026-09-07", libelle: "Opportunité créée" },
    ],
  },
  {
    id: "PRO-2026-0119",
    entreprise: "BTP Horizon",
    contact: "Meriem Fassi",
    telephone: "+212 662 55 41 09",
    email: "m.fassi@btphorizon.ma",
    ville: "Casablanca",
    secteur: "BTP",
    source: "Campagne WhatsApp",
    statut: "Intéressé",
    qualification: "Qualifié",
    interet: "Élevé",
    derniereActivite: "2026-09-06",
    creeLe: "2026-09-03",
    responsableId: "U1",
    campagneId: "CMP-2026-005",
    opportuniteId: "OPP-2026-0043",
    clientId: "CLI-002",
    ia: {
      besoin: "Location",
      produit: "Compacteur à plaque réversible",
      quantite: 1,
      duree: "10 jours",
      dateSouhaitee: "2026-09-18",
      chantier: "Casablanca",
      urgence: "Moyenne",
      resume:
        "Besoin d'un compacteur réversible pour la finition d'une voirie à Aïn Sebaâ, démarrage prévu mi-septembre pour dix jours.",
      probabilite: 68,
      recommandation: "Proposer un tarif semaine + livraison sur site.",
      qualifieLe: "2026-09-06T10:12:00",
    },
    timeline: [
      { date: "2026-09-03", libelle: "Prospect ajouté" },
      { date: "2026-09-05", libelle: "Campagne WhatsApp lancée" },
      { date: "2026-09-06", libelle: "Prospect qualifié automatiquement" },
    ],
  },
  {
    id: "PRO-2026-0120",
    entreprise: "Build Maroc",
    contact: "Anas Rifai",
    telephone: "+212 668 12 45 78",
    email: "a.rifai@buildmaroc.ma",
    ville: "Casablanca",
    secteur: "Promotion immobilière",
    source: "Salon BTP Expo",
    statut: "À contacter",
    qualification: "Non qualifié",
    interet: "Moyen",
    derniereActivite: "2026-09-01",
    creeLe: "2026-08-30",
    responsableId: "U6",
    timeline: [{ date: "2026-08-30", libelle: "Prospect ajouté" }],
  },
  {
    id: "PRO-2026-0121",
    entreprise: "Tanger Travaux",
    contact: "Youssef Benjelloun",
    telephone: "+212 663 78 22 45",
    email: "y.benjelloun@tangertravaux.ma",
    ville: "Tanger",
    secteur: "Travaux publics",
    source: "Campagne WhatsApp",
    statut: "Contacté",
    qualification: "En cours",
    interet: "Moyen",
    derniereActivite: "2026-09-05",
    creeLe: "2026-08-28",
    responsableId: "U1",
    campagneId: "CMP-2026-004",
    clientId: "CLI-003",
    timeline: [
      { date: "2026-08-28", libelle: "Prospect ajouté" },
      { date: "2026-09-04", libelle: "Campagne WhatsApp lancée" },
      { date: "2026-09-05", libelle: "Réponse reçue — qualification en cours" },
    ],
  },
  {
    id: "PRO-2026-0122",
    entreprise: "Nord Bâtiment",
    contact: "Hamza Tazi",
    telephone: "+212 664 11 90 33",
    email: "h.tazi@nordbatiment.ma",
    ville: "Tétouan",
    secteur: "BTP",
    source: "Recommandation",
    statut: "À relancer",
    qualification: "En cours",
    interet: "Moyen",
    derniereActivite: "2026-08-29",
    creeLe: "2026-08-11",
    responsableId: "U1",
    clientId: "CLI-004",
    timeline: [
      { date: "2026-08-11", libelle: "Prospect ajouté" },
      { date: "2026-08-29", libelle: "Relance planifiée" },
    ],
  },
  {
    id: "PRO-2026-0123",
    entreprise: "ProChantier Maroc",
    contact: "Imane Lahlou",
    telephone: "+212 667 85 60 27",
    email: "i.lahlou@prochantier.ma",
    ville: "Kénitra",
    secteur: "BTP",
    source: "Campagne WhatsApp",
    statut: "Intéressé",
    qualification: "Qualifié",
    interet: "Élevé",
    derniereActivite: "2026-09-03",
    creeLe: "2026-08-20",
    responsableId: "U6",
    campagneId: "CMP-2026-003",
    opportuniteId: "OPP-2026-0044",
    clientId: "CLI-007",
    ia: {
      besoin: "Vente",
      produit: "Groupe électrogène 60 kVA",
      quantite: 1,
      duree: "—",
      dateSouhaitee: "2026-09-25",
      chantier: "Kénitra",
      urgence: "Moyenne",
      resume:
        "Le prospect souhaite acquérir un groupe électrogène 60 kVA pour alimenter une base vie permanente à Kénitra. Budget validé en interne.",
      probabilite: 74,
      recommandation: "Envoyer une offre d'achat avec option de maintenance.",
      qualifieLe: "2026-09-03T09:48:00",
    },
    timeline: [
      { date: "2026-08-20", libelle: "Prospect ajouté" },
      { date: "2026-08-24", libelle: "Campagne WhatsApp lancée" },
      { date: "2026-09-03", libelle: "Prospect qualifié automatiquement" },
    ],
  },
  {
    id: "PRO-2026-0124",
    entreprise: "Constructa SARL",
    contact: "Mehdi Sbaï",
    telephone: "+212 666 47 03 92",
    email: "m.sbai@constructa.ma",
    ville: "Marrakech",
    secteur: "Second œuvre",
    source: "Site web",
    statut: "Nouveau",
    qualification: "Non qualifié",
    interet: "Faible",
    derniereActivite: "2026-09-06",
    creeLe: "2026-09-06",
    responsableId: "U1",
    clientId: "CLI-006",
    timeline: [{ date: "2026-09-06", libelle: "Prospect ajouté" }],
  },
  {
    id: "PRO-2026-0125",
    entreprise: "Marrakech BTP Services",
    contact: "Khalid Amrani",
    telephone: "+212 669 74 51 20",
    email: "k.amrani@marrakechbtp.ma",
    ville: "Marrakech",
    secteur: "BTP",
    source: "Campagne WhatsApp",
    statut: "Non intéressé",
    qualification: "Disqualifié",
    interet: "Faible",
    derniereActivite: "2026-08-31",
    creeLe: "2026-08-18",
    responsableId: "U6",
    campagneId: "CMP-2026-003",
    timeline: [
      { date: "2026-08-18", libelle: "Prospect ajouté" },
      { date: "2026-08-31", libelle: "Prospect non intéressé (matériel déjà loué)" },
    ],
  },
  {
    id: "PRO-2026-0126",
    entreprise: "BatiPro Maroc",
    contact: "Sanaa El Khattabi",
    telephone: "+212 665 32 76 18",
    email: "s.elkhattabi@batipro.ma",
    ville: "Rabat",
    secteur: "BTP",
    source: "Campagne WhatsApp",
    statut: "Contacté",
    qualification: "En cours",
    interet: "Moyen",
    derniereActivite: "2026-09-05",
    creeLe: "2026-08-25",
    responsableId: "U6",
    campagneId: "CMP-2026-005",
    clientId: "CLI-005",
    timeline: [
      { date: "2026-08-25", libelle: "Prospect ajouté" },
      { date: "2026-09-05", libelle: "Réponse reçue — qualification en cours" },
    ],
  },
  {
    id: "PRO-2026-0127",
    entreprise: "Sahara Génie Civil",
    contact: "Othmane Bekkali",
    telephone: "+212 670 88 12 64",
    email: "o.bekkali@saharagc.ma",
    ville: "Rabat",
    secteur: "Génie civil",
    source: "Appel entrant",
    statut: "Nouveau",
    qualification: "Non qualifié",
    interet: "Moyen",
    derniereActivite: "2026-09-07",
    creeLe: "2026-09-07",
    responsableId: "U1",
    timeline: [{ date: "2026-09-07", libelle: "Prospect ajouté" }],
  },
  {
    id: "PRO-2026-0128",
    entreprise: "Kénitra Structures",
    contact: "Fatima Zahra Naji",
    telephone: "+212 671 40 27 55",
    email: "fz.naji@kenitrastructures.ma",
    ville: "Kénitra",
    secteur: "Charpente métallique",
    source: "Recommandation",
    statut: "À contacter",
    qualification: "Non qualifié",
    interet: "Moyen",
    derniereActivite: "2026-09-02",
    creeLe: "2026-09-02",
    responsableId: "U6",
    timeline: [{ date: "2026-09-02", libelle: "Prospect ajouté" }],
  },
  {
    id: "PRO-2026-0129",
    entreprise: "Détroit Infrastructures",
    contact: "Ayoub Zerouali",
    telephone: "+212 672 19 84 30",
    email: "a.zerouali@detroit-infra.ma",
    ville: "Tanger",
    secteur: "Infrastructures",
    source: "Campagne WhatsApp",
    statut: "Intéressé",
    qualification: "Qualifié",
    interet: "Élevé",
    derniereActivite: "2026-09-06",
    creeLe: "2026-08-29",
    responsableId: "U1",
    campagneId: "CMP-2026-004",
    opportuniteId: "OPP-2026-0045",
    ia: {
      besoin: "Location",
      produit: "Nacelle élévatrice 12 m",
      quantite: 1,
      duree: "1 mois",
      dateSouhaitee: "2026-09-20",
      chantier: "Tanger",
      urgence: "Élevée",
      resume:
        "Besoin d'une nacelle 12 m pendant un mois pour la maintenance d'une façade industrielle à Tanger. Livraison et formation opérateur demandées.",
      probabilite: 71,
      recommandation: "Proposer un tarif mensuel avec formation incluse.",
      qualifieLe: "2026-09-06T16:05:00",
    },
    timeline: [
      { date: "2026-08-29", libelle: "Prospect ajouté" },
      { date: "2026-09-04", libelle: "Campagne WhatsApp lancée" },
      { date: "2026-09-06", libelle: "Prospect qualifié automatiquement" },
      { date: "2026-09-06", libelle: "Opportunité créée" },
    ],
  },
];

export const opportunites: Opportunite[] = [
  {
    id: "OPP-2026-0042",
    titre: "Location — 2 mini-pelles",
    clientId: "CLI-001",
    prospectId: "PRO-2026-0118",
    entreprise: "Atlas Construction",
    type: "Location",
    montant: 48000,
    etape: "Devis à préparer",
    produit: "Mini-pelle 3.5T",
    quantite: 2,
    duree: "3 semaines",
    dateSouhaitee: "2026-09-15",
    chantier: "Tanger",
    urgence: "Élevée",
    responsableId: "U1",
    prochaineAction: "Devis à envoyer aujourd'hui",
    derniereActivite: "2026-09-07",
    source: "Agent IA WhatsApp",
    resumeIA:
      "Deux mini-pelles 3.5T pour un chantier à Tanger du 15 septembre, durée trois semaines, livraison incluse.",
    probabilite: 82,
  },
  {
    id: "OPP-2026-0043",
    titre: "Location — Compacteur réversible",
    clientId: "CLI-002",
    prospectId: "PRO-2026-0119",
    entreprise: "BTP Horizon",
    type: "Location",
    montant: 12600,
    etape: "Qualifié",
    produit: "Compacteur à plaque réversible",
    quantite: 1,
    duree: "10 jours",
    dateSouhaitee: "2026-09-18",
    chantier: "Casablanca",
    urgence: "Moyenne",
    responsableId: "U1",
    prochaineAction: "Confirmer la disponibilité du matériel",
    derniereActivite: "2026-09-06",
    source: "Agent IA WhatsApp",
    resumeIA: "Compacteur réversible pour finition voirie à Aïn Sebaâ, 10 jours.",
    probabilite: 68,
  },
  {
    id: "OPP-2026-0044",
    titre: "Vente — Groupe électrogène 60 kVA",
    clientId: "CLI-007",
    prospectId: "PRO-2026-0123",
    entreprise: "ProChantier Maroc",
    type: "Vente",
    montant: 142000,
    etape: "Devis envoyé",
    produit: "Groupe électrogène 60 kVA",
    quantite: 1,
    dateSouhaitee: "2026-09-25",
    chantier: "Kénitra",
    urgence: "Moyenne",
    responsableId: "U6",
    prochaineAction: "Relancer sous 48 h",
    derniereActivite: "2026-09-05",
    source: "Agent IA WhatsApp",
    resumeIA: "Achat d'un groupe 60 kVA pour base vie permanente, budget validé.",
    probabilite: 74,
    devisId: "DEV-2026-0179",
  },
  {
    id: "OPP-2026-0045",
    titre: "Location — Nacelle 12 m",
    prospectId: "PRO-2026-0129",
    entreprise: "Détroit Infrastructures",
    type: "Location",
    montant: 26500,
    etape: "À qualifier",
    produit: "Nacelle élévatrice 12 m",
    quantite: 1,
    duree: "1 mois",
    dateSouhaitee: "2026-09-20",
    chantier: "Tanger",
    urgence: "Élevée",
    responsableId: "U1",
    prochaineAction: "Valider le besoin avec le chargé de chantier",
    derniereActivite: "2026-09-06",
    source: "Agent IA WhatsApp",
    resumeIA: "Nacelle 12 m un mois, maintenance de façade industrielle, formation demandée.",
    probabilite: 71,
  },
  {
    id: "OPP-2026-0046",
    titre: "Vente — Lot outillage démolition",
    clientId: "CLI-003",
    entreprise: "Tanger Travaux",
    type: "Vente",
    montant: 87500,
    etape: "Devis envoyé",
    produit: "Marteau-piqueur professionnel",
    quantite: 4,
    dateSouhaitee: "2026-09-22",
    chantier: "Tanger",
    urgence: "Moyenne",
    responsableId: "U6",
    prochaineAction: "Négocier la remise volume",
    derniereActivite: "2026-09-04",
    source: "Commercial terrain",
    resumeIA: "Lot de 4 marteaux-piqueurs, discussion sur remise volume de 8 %.",
    probabilite: 61,
    devisId: "DEV-2026-0182",
  },
  {
    id: "OPP-2026-0047",
    titre: "Location — Échafaudage 100 m²",
    clientId: "CLI-005",
    entreprise: "BatiPro Maroc",
    type: "Location",
    montant: 21600,
    etape: "Confirmé",
    produit: "Échafaudage multidirectionnel",
    quantite: 1,
    duree: "3 mois",
    dateSouhaitee: "2026-09-10",
    chantier: "Rabat",
    urgence: "Faible",
    responsableId: "U6",
    prochaineAction: "Planifier la livraison",
    derniereActivite: "2026-09-05",
    source: "Client existant",
    resumeIA: "Échafaudage 100 m² pour ravalement, trois mois, site Takadoum.",
    probabilite: 90,
  },
  {
    id: "OPP-2026-0048",
    titre: "Vente — Bétonnière 350 L ×2",
    clientId: "CLI-006",
    entreprise: "Constructa SARL",
    type: "Vente",
    montant: 49600,
    etape: "Devis envoyé",
    produit: "Bétonnière 350 L",
    quantite: 2,
    dateSouhaitee: "2026-09-19",
    chantier: "Marrakech",
    urgence: "Faible",
    responsableId: "U1",
    prochaineAction: "Relance téléphonique lundi",
    derniereActivite: "2026-09-02",
    source: "Site web",
    resumeIA: "Deux bétonnières 350 L pour chantier résidentiel à Sidi Ghanem.",
    probabilite: 55,
  },
  {
    id: "OPP-2026-0049",
    titre: "Location — Groupe électrogène",
    clientId: "CLI-004",
    entreprise: "Nord Bâtiment",
    type: "Location",
    montant: 18500,
    etape: "Gagné",
    produit: "Groupe électrogène 60 kVA",
    quantite: 1,
    duree: "1 mois",
    dateSouhaitee: "2026-09-01",
    chantier: "Tétouan",
    urgence: "Moyenne",
    responsableId: "U1",
    prochaineAction: "Suivi de la location en cours",
    derniereActivite: "2026-09-01",
    source: "Client existant",
    resumeIA: "Groupe 60 kVA loué un mois pour alimentation de chantier à Tétouan.",
    probabilite: 100,
  },
  {
    id: "OPP-2026-0050",
    titre: "Vente — Plaques vibrantes ×3",
    clientId: "CLI-007",
    entreprise: "ProChantier Maroc",
    type: "Vente",
    montant: 64500,
    etape: "À qualifier",
    produit: "Plaque vibrante 90 kg",
    quantite: 3,
    dateSouhaitee: "2026-10-02",
    chantier: "Kénitra",
    urgence: "Faible",
    responsableId: "U6",
    prochaineAction: "Qualifier le budget",
    derniereActivite: "2026-09-01",
    source: "Agent IA WhatsApp",
    resumeIA: "Intérêt pour trois plaques vibrantes, budget à confirmer.",
    probabilite: 40,
  },
  {
    id: "OPP-2026-0051",
    titre: "Location — Mini-pelle Casablanca",
    clientId: "CLI-002",
    entreprise: "BTP Horizon",
    type: "Location",
    montant: 32000,
    etape: "Gagné",
    produit: "Mini-pelle 3.5T",
    quantite: 1,
    duree: "1 mois",
    dateSouhaitee: "2026-08-20",
    chantier: "Casablanca",
    urgence: "Moyenne",
    responsableId: "U1",
    prochaineAction: "Retour prévu le 20 septembre",
    derniereActivite: "2026-08-20",
    source: "Client existant",
    resumeIA: "Mini-pelle louée un mois, chantier Aïn Sebaâ.",
    probabilite: 100,
  },
  {
    id: "OPP-2026-0052",
    titre: "Vente — Scies circulaires ×6",
    clientId: "CLI-003",
    entreprise: "Tanger Travaux",
    type: "Vente",
    montant: 47400,
    etape: "Devis à préparer",
    produit: "Scie circulaire professionnelle",
    quantite: 6,
    dateSouhaitee: "2026-09-30",
    chantier: "Tanger",
    urgence: "Faible",
    responsableId: "U6",
    prochaineAction: "Préparer le devis avant vendredi",
    derniereActivite: "2026-09-03",
    source: "Commercial terrain",
    resumeIA: "Équipement de six équipes en scies circulaires professionnelles.",
    probabilite: 58,
  },
  {
    id: "OPP-2026-0053",
    titre: "Location — Compresseur chantier port",
    clientId: "CLI-001",
    entreprise: "Atlas Construction",
    type: "Location",
    montant: 15600,
    etape: "Devis envoyé",
    produit: "Compresseur professionnel 500 L",
    quantite: 1,
    duree: "1 mois",
    dateSouhaitee: "2026-10-05",
    chantier: "Tanger",
    urgence: "Moyenne",
    responsableId: "U1",
    prochaineAction: "Proposer une alternative disponible",
    derniereActivite: "2026-09-06",
    source: "Client existant",
    resumeIA: "Compresseur 500 L pour chantier portuaire, stock actuellement indisponible.",
    probabilite: 52,
  },
];

const L = (
  produitId: string,
  designation: string,
  quantite: number,
  prixUnitaire: number,
  remise = 0,
  duree?: number,
  uniteDuree?: "Jour" | "Semaine" | "Mois",
): LigneDocument => ({
  produitId,
  designation,
  quantite,
  prixUnitaire,
  remise,
  tva: 20,
  duree,
  uniteDuree,
});

export const devis: Devis[] = [
  {
    id: "DEV-2026-0182",
    clientId: "CLI-003",
    opportuniteId: "OPP-2026-0046",
    type: "Vente",
    date: "2026-08-31",
    expiration: "2026-09-07",
    montant: 87500,
    responsableId: "U6",
    statut: "En attente",
    lignes: [L("P2", "Marteau-piqueur professionnel", 4, 18500, 8)],
    conditions: "Paiement 30 % à la commande, solde à la livraison.",
  },
  {
    id: "DEV-2026-0179",
    clientId: "CLI-007",
    opportuniteId: "OPP-2026-0044",
    type: "Vente",
    date: "2026-09-04",
    expiration: "2026-09-25",
    montant: 142000,
    responsableId: "U6",
    statut: "Envoyé",
    lignes: [L("P4", "Groupe électrogène 60 kVA", 1, 142000, 0)],
    conditions: "Livraison sous 15 jours. Garantie 24 mois.",
  },
  {
    id: "DEV-2026-0175",
    clientId: "CLI-001",
    opportuniteId: "OPP-2026-0042",
    type: "Location",
    date: "2026-09-01",
    expiration: "2026-09-15",
    montant: 87500,
    responsableId: "U1",
    statut: "Accepté",
    lignes: [L("P1", "Mini-pelle 3.5T", 2, 9200, 0, 3, "Semaine")],
    conditions: "Caution 20 000 DH. Livraison et récupération incluses.",
    locationId: "LOC-2026-0041",
  },
  {
    id: "DEV-2026-0171",
    clientId: "CLI-005",
    opportuniteId: "OPP-2026-0047",
    type: "Location",
    date: "2026-08-29",
    expiration: "2026-09-12",
    montant: 21600,
    responsableId: "U6",
    statut: "Accepté",
    lignes: [L("P6", "Échafaudage multidirectionnel 100 m²", 1, 7200, 0, 3, "Mois")],
    conditions: "Montage à la charge du client.",
    locationId: "LOC-2026-0038",
  },
  {
    id: "DEV-2026-0184",
    clientId: "CLI-006",
    opportuniteId: "OPP-2026-0048",
    type: "Vente",
    date: "2026-09-02",
    expiration: "2026-09-19",
    montant: 49600,
    responsableId: "U1",
    statut: "Envoyé",
    lignes: [L("P3", "Bétonnière 350 L", 2, 24800, 0)],
    conditions: "Retrait entrepôt Casablanca ou livraison en option.",
  },
  {
    id: "DEV-2026-0186",
    clientId: "CLI-002",
    type: "Location",
    date: "2026-09-06",
    expiration: "2026-09-20",
    montant: 12600,
    responsableId: "U1",
    statut: "Brouillon",
    lignes: [L("P5", "Compacteur à plaque réversible", 1, 420, 0, 30, "Jour")],
    conditions: "",
  },
  {
    id: "DEV-2026-0168",
    clientId: "CLI-004",
    type: "Location",
    date: "2026-08-25",
    expiration: "2026-09-05",
    montant: 18500,
    responsableId: "U1",
    statut: "Accepté",
    lignes: [L("P4", "Groupe électrogène 60 kVA", 1, 18500, 0, 1, "Mois")],
    conditions: "Carburant à la charge du client.",
    locationId: "LOC-2026-0035",
  },
  {
    id: "DEV-2026-0161",
    clientId: "CLI-006",
    type: "Vente",
    date: "2026-08-12",
    expiration: "2026-08-26",
    montant: 15800,
    responsableId: "U1",
    statut: "Expiré",
    lignes: [L("P8", "Scie circulaire professionnelle", 2, 7900, 0)],
    conditions: "",
  },
  {
    id: "DEV-2026-0157",
    clientId: "CLI-002",
    type: "Location",
    date: "2026-08-05",
    expiration: "2026-08-19",
    montant: 32000,
    responsableId: "U1",
    statut: "Accepté",
    lignes: [L("P1", "Mini-pelle 3.5T", 1, 32000, 0, 1, "Mois")],
    conditions: "Caution 15 000 DH.",
    locationId: "LOC-2026-0031",
  },
  {
    id: "DEV-2026-0165",
    clientId: "CLI-003",
    type: "Vente",
    date: "2026-08-18",
    expiration: "2026-09-01",
    montant: 64000,
    responsableId: "U6",
    statut: "Refusé",
    lignes: [L("P10", "Compresseur professionnel 500 L", 1, 64000, 0)],
    conditions: "",
  },
];

export const ventes: Vente[] = [
  {
    id: "VTE-2026-0087",
    devisId: undefined,
    clientId: "CLI-007",
    date: "2026-09-02",
    montant: 87500,
    statut: "Confirmée",
    paiement: "Acompte",
    lignes: [L("P5", "Compacteur à plaque réversible", 2, 46500, 6)],
    factureId: "FAC-2026-0097",
    notes: "",
    responsableId: "U1",
  },
  {
    id: "VTE-2026-0089",
    clientId: "CLI-003",
    date: "2026-09-05",
    montant: 47400,
    statut: "En préparation",
    paiement: "Non payé",
    lignes: [L("P8", "Scie circulaire professionnelle", 6, 7900, 0)],
    factureId: "FAC-2026-0099",
    livraisonId: "LIV-2026-0064",
    notes: "Client souhaite un retrait entrepôt Tanger.",
    responsableId: "U6",
  },
  {
    id: "VTE-2026-0090",
    clientId: "CLI-006",
    date: "2026-09-06",
    montant: 24800,
    statut: "Brouillon",
    paiement: "Non payé",
    lignes: [L("P3", "Bétonnière 350 L", 1, 24800, 0)],
    factureId: "FAC-2026-0100",
    notes: "En attente de validation commerciale.",
    responsableId: "U1",
  },
  {
    id: "VTE-2026-0083",
    clientId: "CLI-001",
    date: "2026-08-28",
    montant: 39500,
    statut: "Livrée",
    paiement: "Payé",
    lignes: [L("P9", "Plaque vibrante 90 kg", 2, 21500, 8)],
    factureId: "FAC-2026-0092",
    livraisonId: "LIV-2026-0057",
    notes: "",
    responsableId: "U1",
  },
];

export const locations: Location[] = [
  {
    id: "LOC-2026-0041",
    devisId: "DEV-2026-0175",
    clientId: "CLI-001",
    produitId: "P1",
    quantite: 2,
    debut: "2026-09-15",
    finPrevue: "2026-10-05",
    dureeJours: 21,
    montant: 48000,
    statut: "Réservée",
    chantier: "Extension plateforme logistique Gzenaya",
    ville: "Tanger",
    responsableChantier: "Rachid Alaoui",
    telephoneChantier: "+212 661 24 87 10",
    paiement: "Acompte",
    factureId: "FAC-2026-0098",
    livraisonId: "LIV-2026-0063",
    notes: "Livraison sur chantier Gzenaya, contact sur place M. Alaoui.",
    responsableId: "U1",
  },
  {
    id: "LOC-2026-0038",
    devisId: "DEV-2026-0171",
    clientId: "CLI-005",
    produitId: "P6",
    quantite: 1,
    debut: "2026-09-01",
    finPrevue: "2026-12-01",
    dureeJours: 91,
    montant: 21600,
    statut: "En cours",
    chantier: "Ravalement immeuble Takadoum",
    ville: "Rabat",
    responsableChantier: "Sanaa El Khattabi",
    telephoneChantier: "+212 665 32 76 18",
    paiement: "Payé",
    factureId: "FAC-2026-0094",
    livraisonId: "LIV-2026-0059",
    notes: "",
    responsableId: "U6",
  },
  {
    id: "LOC-2026-0035",
    devisId: "DEV-2026-0168",
    clientId: "CLI-004",
    produitId: "P4",
    quantite: 1,
    debut: "2026-08-28",
    finPrevue: "2026-09-08",
    dureeJours: 11,
    montant: 18500,
    statut: "Retour proche",
    chantier: "Base vie chantier Martil",
    ville: "Tétouan",
    responsableChantier: "Hamza Tazi",
    telephoneChantier: "+212 664 11 90 33",
    retourId: "RET-2026-0022",
    paiement: "Partiellement payé",
    factureId: "FAC-2026-0090",
    livraisonId: "LIV-2026-0055",
    notes: "",
    responsableId: "U1",
  },
  {
    id: "LOC-2026-0031",
    devisId: "DEV-2026-0157",
    clientId: "CLI-002",
    produitId: "P1",
    quantite: 1,
    debut: "2026-08-20",
    finPrevue: "2026-09-05",
    dureeJours: 16,
    montant: 32000,
    statut: "En retard",
    chantier: "Voirie Aïn Sebaâ",
    ville: "Casablanca",
    responsableChantier: "Meriem Fassi",
    telephoneChantier: "+212 662 55 41 09",
    retourId: "RET-2026-0021",
    paiement: "Payé",
    factureId: "FAC-2026-0086",
    livraisonId: "LIV-2026-0051",
    notes: "",
    responsableId: "U1",
  },
  {
    id: "LOC-2026-0029",
    clientId: "CLI-007",
    produitId: "P2",
    quantite: 3,
    debut: "2026-08-15",
    finPrevue: "2026-09-14",
    dureeJours: 30,
    montant: 12600,
    statut: "En cours",
    chantier: "Démolition entrepôt Zone Franche",
    ville: "Kénitra",
    responsableChantier: "Imane Lahlou",
    telephoneChantier: "+212 667 85 60 27",
    paiement: "Payé",
    notes: "",
    responsableId: "U6",
  },
  {
    id: "LOC-2026-0026",
    clientId: "CLI-003",
    produitId: "P7",
    quantite: 1,
    debut: "2026-08-10",
    finPrevue: "2026-09-09",
    dureeJours: 30,
    montant: 26500,
    statut: "Retour proche",
    chantier: "Maintenance façade Port Tanger Med",
    ville: "Tanger",
    responsableChantier: "Youssef Benjelloun",
    telephoneChantier: "+212 663 78 22 45",
    retourId: "RET-2026-0023",
    paiement: "Acompte",
    notes: "",
    responsableId: "U1",
  },
  {
    id: "LOC-2026-0018",
    clientId: "CLI-006",
    produitId: "P3",
    quantite: 2,
    debut: "2026-07-20",
    finPrevue: "2026-08-20",
    dureeJours: 31,
    montant: 11200,
    statut: "Terminée",
    chantier: "Résidence Sidi Ghanem",
    ville: "Marrakech",
    responsableChantier: "Mehdi Sbaï",
    telephoneChantier: "+212 666 47 03 92",
    retourId: "RET-2026-0017",
    paiement: "Payé",
    notes: "",
    responsableId: "U1",
  },
];

export const factures: Facture[] = [
  {
    id: "FAC-2026-0098",
    clientId: "CLI-001",
    origineType: "Location",
    origineId: "LOC-2026-0041",
    devisId: "DEV-2026-0175",
    date: "2026-08-28",
    echeance: "2026-09-02",
    ht: 72917,
    ttc: 87500,
    paye: 55100,
    statut: "En retard",
  },
  {
    id: "FAC-2026-0097",
    clientId: "CLI-007",
    origineType: "Vente",
    origineId: "VTE-2026-0087",
    date: "2026-09-02",
    echeance: "2026-10-02",
    ht: 72917,
    ttc: 87500,
    paye: 63000,
    statut: "Partiellement payée",
  },
  {
    id: "FAC-2026-0099",
    clientId: "CLI-003",
    origineType: "Vente",
    origineId: "VTE-2026-0089",
    date: "2026-09-05",
    echeance: "2026-10-05",
    ht: 39500,
    ttc: 47400,
    paye: 0,
    statut: "Émise",
  },
  {
    id: "FAC-2026-0094",
    clientId: "CLI-005",
    origineType: "Location",
    origineId: "LOC-2026-0038",
    devisId: "DEV-2026-0171",
    date: "2026-08-30",
    echeance: "2026-09-29",
    ht: 18000,
    ttc: 21600,
    paye: 21600,
    statut: "Payée",
  },
  {
    id: "FAC-2026-0092",
    clientId: "CLI-001",
    origineType: "Vente",
    origineId: "VTE-2026-0083",
    date: "2026-08-28",
    echeance: "2026-09-27",
    ht: 32917,
    ttc: 39500,
    paye: 39500,
    statut: "Payée",
  },
  {
    id: "FAC-2026-0090",
    clientId: "CLI-004",
    origineType: "Location",
    origineId: "LOC-2026-0035",
    devisId: "DEV-2026-0168",
    date: "2026-08-27",
    echeance: "2026-09-26",
    ht: 15417,
    ttc: 18500,
    paye: 5700,
    statut: "Partiellement payée",
  },
  {
    id: "FAC-2026-0086",
    clientId: "CLI-002",
    origineType: "Location",
    origineId: "LOC-2026-0031",
    devisId: "DEV-2026-0157",
    date: "2026-08-18",
    echeance: "2026-09-17",
    ht: 26667,
    ttc: 32000,
    paye: 32000,
    statut: "Payée",
  },
  {
    id: "FAC-2026-0100",
    clientId: "CLI-006",
    origineType: "Vente",
    origineId: "VTE-2026-0090",
    date: "2026-09-06",
    echeance: "2026-10-06",
    ht: 20667,
    ttc: 24800,
    paye: 0,
    statut: "Brouillon",
  },
];

export const paiements: Paiement[] = [
  {
    id: "PAY-2026-0142",
    clientId: "CLI-001",
    factureId: "FAC-2026-0098",
    montant: 55100,
    date: "2026-08-29",
    mode: "Virement",
    reference: "VIR-88421",
    commentaire: "Acompte 63 %",
  },
  {
    id: "PAY-2026-0139",
    clientId: "CLI-007",
    factureId: "FAC-2026-0097",
    montant: 63000,
    date: "2026-09-03",
    mode: "Chèque",
    reference: "CHQ-004512",
    commentaire: "Acompte à la signature",
  },
  {
    id: "PAY-2026-0136",
    clientId: "CLI-005",
    factureId: "FAC-2026-0094",
    montant: 21600,
    date: "2026-08-31",
    mode: "Virement",
    reference: "VIR-87330",
    commentaire: "Règlement intégral",
  },
  {
    id: "PAY-2026-0133",
    clientId: "CLI-001",
    factureId: "FAC-2026-0092",
    montant: 39500,
    date: "2026-08-29",
    mode: "Virement",
    reference: "VIR-87102",
    commentaire: "",
  },
  {
    id: "PAY-2026-0130",
    clientId: "CLI-004",
    factureId: "FAC-2026-0090",
    montant: 5700,
    date: "2026-08-28",
    mode: "Espèces",
    reference: "ESP-0091",
    commentaire: "Acompte 30 %",
  },
  {
    id: "PAY-2026-0126",
    clientId: "CLI-002",
    factureId: "FAC-2026-0086",
    montant: 32000,
    date: "2026-08-20",
    mode: "Carte",
    reference: "CB-771204",
    commentaire: "",
  },
];

export const livraisons: Livraison[] = [
  {
    id: "LIV-2026-0063",
    origineType: "Location",
    origineId: "LOC-2026-0041",
    clientId: "CLI-001",
    chantier: "Plateforme logistique Gzenaya",
    ville: "Tanger",
    adresse: "Zone Industrielle Gzenaya, Lot 42",
    date: "2026-09-07",
    creneau: "08:00 – 11:00",
    responsableId: "U3",
    chauffeur: "Abdellah Moutaouakil",
    vehicule: "Porte-engins — 12345-A-6",
    statut: "En livraison",
    notes: "Accès chantier par la porte nord.",
  },
  {
    id: "LIV-2026-0064",
    origineType: "Vente",
    origineId: "VTE-2026-0089",
    clientId: "CLI-003",
    chantier: "Dépôt Tanger Travaux",
    ville: "Tanger",
    adresse: "Route de Rabat, Km 8",
    date: "2026-09-07",
    creneau: "14:00 – 16:00",
    responsableId: "U3",
    chauffeur: "Said Bouhali",
    vehicule: "Fourgon — 44210-B-1",
    statut: "Prête",
    notes: "",
  },
  {
    id: "LIV-2026-0065",
    origineType: "Vente",
    origineId: "VTE-2026-0087",
    clientId: "CLI-007",
    chantier: "Chantier Zone Franche Kénitra",
    ville: "Kénitra",
    adresse: "Zone Franche, Îlot 12",
    date: "2026-09-09",
    creneau: "09:00 – 12:00",
    responsableId: "U3",
    chauffeur: "—",
    vehicule: "—",
    statut: "À préparer",
    notes: "Prévoir sangles supplémentaires.",
  },
  {
    id: "LIV-2026-0059",
    origineType: "Location",
    origineId: "LOC-2026-0038",
    clientId: "CLI-005",
    chantier: "Immeuble Takadoum",
    ville: "Rabat",
    adresse: "Avenue Hassan II, Takadoum",
    date: "2026-09-01",
    creneau: "07:30 – 10:00",
    responsableId: "U3",
    chauffeur: "Mustapha Regragui",
    vehicule: "Plateau — 32118-C-5",
    statut: "Livrée",
    notes: "",
  },
  {
    id: "LIV-2026-0057",
    origineType: "Vente",
    origineId: "VTE-2026-0083",
    clientId: "CLI-001",
    chantier: "Entrepôt Gzenaya",
    ville: "Tanger",
    adresse: "Zone Industrielle Gzenaya, Lot 42",
    date: "2026-08-29",
    creneau: "10:00 – 12:00",
    responsableId: "U3",
    chauffeur: "Said Bouhali",
    vehicule: "Fourgon — 44210-B-1",
    statut: "Livrée",
    notes: "",
  },
  {
    id: "LIV-2026-0055",
    origineType: "Location",
    origineId: "LOC-2026-0035",
    clientId: "CLI-004",
    chantier: "Base vie Martil",
    ville: "Tétouan",
    adresse: "Route de Martil, Km 4",
    date: "2026-08-28",
    creneau: "08:00 – 11:00",
    responsableId: "U3",
    chauffeur: "Abdellah Moutaouakil",
    vehicule: "Porte-engins — 12345-A-6",
    statut: "Livrée",
    notes: "",
  },
  {
    id: "LIV-2026-0051",
    origineType: "Location",
    origineId: "LOC-2026-0031",
    clientId: "CLI-002",
    chantier: "Voirie Aïn Sebaâ",
    ville: "Casablanca",
    adresse: "Bd Chefchaouni, Aïn Sebaâ",
    date: "2026-08-20",
    creneau: "07:30 – 09:30",
    responsableId: "U3",
    chauffeur: "Abdellah Moutaouakil",
    vehicule: "Porte-engins — 12345-A-6",
    statut: "Livrée",
    notes: "",
  },
];

export const retours: Retour[] = [
  {
    id: "RET-2026-0021",
    locationId: "LOC-2026-0031",
    clientId: "CLI-002",
    produitId: "P1",
    quantite: 1,
    retourPrevu: "2026-09-05",
    retardJours: 2,
    etat: "—",
    statut: "À récupérer",
    fraisSupplementaires: 0,
    notes: "Client a demandé une prolongation non confirmée.",
  },
  {
    id: "RET-2026-0022",
    locationId: "LOC-2026-0035",
    clientId: "CLI-004",
    produitId: "P4",
    quantite: 1,
    retourPrevu: "2026-09-08",
    retardJours: 0,
    etat: "—",
    statut: "Planifié",
    fraisSupplementaires: 0,
    notes: "",
  },
  {
    id: "RET-2026-0023",
    locationId: "LOC-2026-0026",
    clientId: "CLI-003",
    produitId: "P7",
    quantite: 1,
    retourPrevu: "2026-09-09",
    retardJours: 0,
    etat: "—",
    statut: "Planifié",
    fraisSupplementaires: 0,
    notes: "",
  },
  {
    id: "RET-2026-0017",
    locationId: "LOC-2026-0018",
    clientId: "CLI-006",
    produitId: "P3",
    quantite: 2,
    retourPrevu: "2026-08-20",
    retourReel: "2026-08-20",
    retardJours: 0,
    etat: "Bon",
    statut: "Clôturé",
    fraisSupplementaires: 0,
    notes: "Nettoyage effectué au retour.",
  },
  {
    id: "RET-2026-0015",
    locationId: "LOC-2026-0018",
    clientId: "CLI-005",
    produitId: "P5",
    quantite: 1,
    retourPrevu: "2026-08-14",
    retourReel: "2026-08-16",
    retardJours: 2,
    etat: "À contrôler",
    statut: "À inspecter",
    fraisSupplementaires: 840,
    notes: "Retard de 2 jours facturé.",
  },
  {
    id: "RET-2026-0013",
    locationId: "LOC-2026-0018",
    clientId: "CLI-001",
    produitId: "P2",
    quantite: 2,
    retourPrevu: "2026-08-05",
    retourReel: "2026-08-05",
    retardJours: 0,
    etat: "Excellent",
    statut: "Clôturé",
    fraisSupplementaires: 0,
    notes: "",
  },
];

/* Séries pour les graphiques */
export const seriePerformance = [
  { periode: "01 sept.", opportunites: 6, ventes: 78000, locations: 42000 },
  { periode: "02 sept.", opportunites: 4, ventes: 52000, locations: 38000 },
  { periode: "03 sept.", opportunites: 8, ventes: 96000, locations: 61000 },
  { periode: "04 sept.", opportunites: 5, ventes: 44000, locations: 55000 },
  { periode: "05 sept.", opportunites: 9, ventes: 118000, locations: 72000 },
  { periode: "06 sept.", opportunites: 7, ventes: 87000, locations: 64000 },
  { periode: "07 sept.", opportunites: 11, ventes: 132000, locations: 88000 },
];

export const serieMensuelle = [
  { periode: "Avr.", ventes: 412000, locations: 168000, opportunites: 38 },
  { periode: "Mai", ventes: 468000, locations: 192000, opportunites: 44 },
  { periode: "Juin", ventes: 521000, locations: 205000, opportunites: 51 },
  { periode: "Juil.", ventes: 489000, locations: 226000, opportunites: 47 },
  { periode: "Août", ventes: 442000, locations: 241000, opportunites: 42 },
  { periode: "Sept.", ventes: 487500, locations: 218000, opportunites: 56 },
];

export const notificationsSeed = [
  {
    id: "N1",
    type: "alerte" as const,
    titre: "Paiement en retard",
    ref: "FAC-2026-0098",
    detail: "Atlas Construction · 32 400 DH",
    date: "Il y a 2 h",
    lien: "/factures/FAC-2026-0098",
  },
  {
    id: "N2",
    type: "logistique" as const,
    titre: "Retour prévu demain",
    ref: "LOC-2026-0035",
    detail: "Groupe électrogène 60 kVA · Tétouan",
    date: "Il y a 4 h",
    lien: "/locations/LOC-2026-0035",
  },
  {
    id: "N3",
    type: "commercial" as const,
    titre: "Nouveau prospect qualifié",
    ref: "BTP Horizon",
    detail: "Besoin : Location · Compacteur",
    date: "Hier",
    lien: "/prospects/PRO-2026-0119",
  },
  {
    id: "N4",
    type: "succes" as const,
    titre: "Devis accepté",
    ref: "DEV-2026-0175",
    detail: "Atlas Construction · 87 500 DH",
    date: "Hier",
    lien: "/devis/DEV-2026-0175",
  },
];

/* ------------------------------------------------------------------ */
/* Conversations client (Agent IA — Telegram / WhatsApp)               */
/* ------------------------------------------------------------------ */

export type Canal = "Telegram" | "WhatsApp";
export type Langue = "Français" | "Darija" | "العربية" | "English";

export interface Message {
  id: string;
  conversationId: string;
  emetteur: "Client" | "IA";
  contenu: string;
  traduction?: string | undefined;
  langue: Langue;
  horodatage: string;
}

export interface Conversation {
  id: string;
  prospectId: string;
  clientId?: string | undefined;
  canal: Canal;
  langue: Langue;
  debutLe: string;
  dernierMessageLe: string;
  statut: "Qualification en cours" | "Qualifié" | "En attente client" | "Clôturée";
  agent: string;
  confiance: number;
  resume: string;
  extraction: { label: string; valeur: string }[];
  regles: { label: string; valeur: string }[];
  opportuniteId?: string | undefined;
}

const M = (
  conversationId: string,
  n: number,
  emetteur: "Client" | "IA",
  contenu: string,
  horodatage: string,
  langue: Langue = "Français",
  traduction?: string,
): Message => ({
  id: `${conversationId}-M${n}`,
  conversationId,
  emetteur,
  contenu,
  langue,
  horodatage,
  traduction,
});

export const conversations: Conversation[] = [
  {
    id: "CONV-2026-0031",
    prospectId: "PRO-2026-0118",
    canal: "Telegram",
    langue: "Français",
    debutLe: "2026-09-07T14:22:00",
    dernierMessageLe: "2026-09-07T14:35:00",
    statut: "Qualifié",
    agent: "Agent Commercial IA SINMAT",
    confiance: 94,
    resume:
      "Le client souhaite louer un compacteur réversible pour un chantier à Casablanca à partir du 18 septembre pendant 10 jours.",
    extraction: [
      { label: "Type de besoin", valeur: "Location" },
      { label: "Produit détecté", valeur: "Compacteur à plaque réversible" },
      { label: "Quantité", valeur: "1" },
      { label: "Date souhaitée", valeur: "18 sept. 2026" },
      { label: "Durée", valeur: "10 jours" },
      { label: "Ville", valeur: "Casablanca" },
      { label: "Urgence", valeur: "Moyenne" },
      { label: "Statut", valeur: "Qualifié" },
    ],
    regles: [
      { label: "Produit", valeur: "Compacteur à plaque réversible" },
      { label: "Tarification", valeur: "Palier 8–15 jours" },
      { label: "Qualification", valeur: "Conforme" },
    ],
    opportuniteId: "OPP-2026-0042",
  },
  {
    id: "CONV-2026-0029",
    prospectId: "PRO-2026-0121",
    canal: "WhatsApp",
    langue: "Darija",
    debutLe: "2026-09-06T10:04:00",
    dernierMessageLe: "2026-09-06T10:19:00",
    statut: "Qualification en cours",
    agent: "Agent Commercial IA SINMAT",
    confiance: 82,
    resume:
      "Le client cherche à louer une nacelle élévatrice à Tanger pour environ un mois, livraison sur site à confirmer.",
    extraction: [
      { label: "Type de besoin", valeur: "Location" },
      { label: "Produit détecté", valeur: "Nacelle élévatrice 12 m" },
      { label: "Quantité", valeur: "1" },
      { label: "Date souhaitée", valeur: "20 sept. 2026" },
      { label: "Durée", valeur: "1 mois" },
      { label: "Ville", valeur: "Tanger" },
      { label: "Urgence", valeur: "Élevée" },
      { label: "Statut", valeur: "Qualification en cours" },
    ],
    regles: [
      { label: "Produit", valeur: "Nacelle élévatrice 12 m" },
      { label: "Tarification", valeur: "Palier mensuel" },
      { label: "Qualification", valeur: "Livraison à confirmer" },
    ],
  },
];

export const messages: Message[] = [
  M("CONV-2026-0031", 1, "Client", "Bonjour, je cherche un compacteur pour mon chantier.", "2026-09-07T14:22:00"),
  M("CONV-2026-0031", 2, "IA", "Bonjour 👋 Bien sûr. Vous souhaitez l'acheter ou le louer ?", "2026-09-07T14:23:00"),
  M("CONV-2026-0031", 3, "Client", "Location.", "2026-09-07T14:24:00"),
  M("CONV-2026-0031", 4, "IA", "Très bien. Pour combien de jours souhaitez-vous le louer ?", "2026-09-07T14:25:00"),
  M("CONV-2026-0031", 5, "Client", "10 jours à partir du 18 septembre.", "2026-09-07T14:27:00"),
  M("CONV-2026-0031", 6, "IA", "Parfait. Sur quelle ville se situe le chantier ?", "2026-09-07T14:28:00"),
  M("CONV-2026-0031", 7, "Client", "Casablanca, zone Aïn Sebaâ.", "2026-09-07T14:30:00"),
  M("CONV-2026-0031", 8, "IA", "Merci. Souhaitez-vous une livraison sur chantier ?", "2026-09-07T14:31:00"),
  M("CONV-2026-0031", 9, "Client", "Oui, livraison sur place.", "2026-09-07T14:33:00"),
  M(
    "CONV-2026-0031",
    10,
    "IA",
    "C'est noté. Un compacteur à plaque réversible est disponible du 18 au 28 septembre. Un commercial SINMAT vous transmet le devis aujourd'hui.",
    "2026-09-07T14:35:00",
  ),
  M("CONV-2026-0029", 1, "Client", "Salam, bghit nkri nacelle f Tanger.", "2026-09-06T10:04:00", "Darija", "Bonjour, je souhaite louer une nacelle à Tanger."),
  M("CONV-2026-0029", 2, "IA", "Salam 👋 Wakha. Ch'hal men youm bghitiha ?", "2026-09-06T10:06:00", "Darija", "Bonjour. D'accord. Pour combien de jours la souhaitez-vous ?"),
  M("CONV-2026-0029", 3, "Client", "Chi chher, mn 20 septembre.", "2026-09-06T10:09:00", "Darija", "Environ un mois, à partir du 20 septembre."),
  M("CONV-2026-0029", 4, "IA", "Mezyan. Ch'hal d'l'irtifa3 li khassek ? 12 m ola ktar ?", "2026-09-06T10:12:00", "Darija", "Très bien. Quelle hauteur vous faut-il ? 12 m ou plus ?"),
  M("CONV-2026-0029", 5, "Client", "12 m kafi.", "2026-09-06T10:15:00", "Darija", "12 m suffisent."),
  M("CONV-2026-0029", 6, "IA", "Wakha. Wach bghiti livraison f chantier ?", "2026-09-06T10:19:00", "Darija", "D'accord. Souhaitez-vous une livraison sur chantier ?"),
];

export const messagesDe = (conversationId: string) =>
  messages.filter((m) => m.conversationId === conversationId);

export const conversationDuProspect = (prospectId: string) =>
  conversations.find((c) => c.prospectId === prospectId);

/* ------------------------------------------------------------------ */
/* Règles de qualification / tarification par produit                  */
/* ------------------------------------------------------------------ */

export type UniteTarif = "Jour" | "Semaine" | "Mois" | "Forfait";

export interface PalierLocation {
  id: string;
  minJours: number;
  maxJours: number | null;
  prix: number;
  unite: UniteTarif;
}

export interface PalierVente {
  id: string;
  minQte: number;
  maxQte: number | null;
  prix: number;
}

export type NiveauCritere = "Requis" | "Optionnel" | "Non demandé";

export interface RegleProduit {
  produitId: string;
  actif: boolean;
  venteActive: boolean;
  locationActive: boolean;
  quantiteMin: number;
  quantiteMax: number;
  validationManuelle: boolean;
  infosClientRequises: string[];
  /* Location */
  dureeMin: number;
  dureeMax: number;
  caution: number;
  cautionObligatoire: boolean;
  livraison: "Optionnelle" | "Obligatoire" | "Indisponible";
  retardParJour: number;
  weekend: "Inclus" | "Exclu" | "Personnalisé";
  prolongation: boolean;
  approbationApresJours: number;
  montantAutoMax: number;
  paliersLocation: PalierLocation[];
  /* Vente */
  paliersVente: PalierVente[];
  devisAutoVente: boolean;
  approbationVenteAuDessus: number;
  /* Qualification IA */
  criteres: { cle: string; label: string; niveau: NiveauCritere }[];
  actionsAutomatiques: {
    qualifierProspect: boolean;
    creerOpportunite: boolean;
    calculerMontant: boolean;
    preparerDevis: boolean;
    affecterCommercial?: boolean | undefined;
  };
  commercialId?: string | undefined;
  /* Date du dernier enregistrement explicite par un utilisateur */
  configureLe?: string | undefined;
  modifieLe: string;
}


const CRITERES_DEFAUT = (): RegleProduit["criteres"] => [
  { cle: "produit", label: "Produit identifié", niveau: "Requis" },
  { cle: "quantite", label: "Quantité identifiée", niveau: "Requis" },
  { cle: "date", label: "Date de début", niveau: "Requis" },
  { cle: "duree", label: "Durée", niveau: "Requis" },
  { cle: "ville", label: "Ville", niveau: "Requis" },
  { cle: "chantier", label: "Chantier", niveau: "Optionnel" },
  { cle: "livraison", label: "Besoin de livraison", niveau: "Optionnel" },
  { cle: "identite", label: "Identité du client", niveau: "Requis" },
];

export const regleDefaut = (p: Produit, modifieLe: string): RegleProduit => ({
  produitId: p.id,
  actif: true,
  venteActive: true,
  locationActive: true,
  quantiteMin: 1,
  quantiteMax: Math.max(1, p.stock),
  validationManuelle: false,
  infosClientRequises: ["Raison sociale", "Téléphone", "Ville"],
  dureeMin: 1,
  dureeMax: 180,
  caution: 0,
  cautionObligatoire: false,
  livraison: "Optionnelle",
  retardParJour: Math.round(p.prixJour * 0.5),
  weekend: "Inclus",
  prolongation: true,
  approbationApresJours: 30,
  montantAutoMax: 150000,
  paliersLocation: [
    { id: `${p.id}-T1`, minJours: 1, maxJours: 3, prix: p.prixJour, unite: "Jour" },
    { id: `${p.id}-T2`, minJours: 4, maxJours: 7, prix: Math.round(p.prixJour * 0.92), unite: "Jour" },
    { id: `${p.id}-T3`, minJours: 8, maxJours: 15, prix: Math.round(p.prixJour * 0.85), unite: "Jour" },
    { id: `${p.id}-T4`, minJours: 16, maxJours: 30, prix: Math.round(p.prixJour * 0.78), unite: "Jour" },
    { id: `${p.id}-T5`, minJours: 31, maxJours: null, prix: Math.round(p.prixJour * 0.7), unite: "Jour" },
  ],
  paliersVente: [
    { id: `${p.id}-V1`, minQte: 1, maxQte: 2, prix: p.prixVente },
    { id: `${p.id}-V2`, minQte: 3, maxQte: 5, prix: Math.round(p.prixVente * 0.95) },
    { id: `${p.id}-V3`, minQte: 6, maxQte: null, prix: Math.round(p.prixVente * 0.9) },
  ],
  devisAutoVente: true,
  approbationVenteAuDessus: 200000,
  criteres: CRITERES_DEFAUT(),
  actionsAutomatiques: {
    qualifierProspect: true,
    creerOpportunite: true,
    calculerMontant: true,
    preparerDevis: false,
    affecterCommercial: false,
  },
  commercialId: "U1",

  modifieLe,
});

export const reglesProduits: RegleProduit[] = produits.map((p, i) =>
  regleDefaut(p, i % 3 === 0 ? "2026-09-07" : i % 3 === 1 ? "2026-09-02" : "2026-08-24"),
);

export const regleVide = (produitId: string): RegleProduit => {
  const p = produits.find((x) => x.id === produitId);
  return p
    ? regleDefaut(p, "2026-09-07")
    : { ...regleDefaut(produits[0]!, "2026-09-07"), produitId };
};

/** Palier de location applicable pour une durée en jours. */
export const palierPourDuree = (paliers: PalierLocation[], jours: number) =>
  paliers.find((t) => jours >= t.minJours && (t.maxJours === null || jours <= t.maxJours));

export const libellePalier = (t: PalierLocation) =>
  t.maxJours === null ? `+${t.minJours - 1} jours` : `${t.minJours} à ${t.maxJours} jours`;

export const palierVentePourQte = (paliers: PalierVente[], qte: number) =>
  paliers.find((t) => qte >= t.minQte && (t.maxQte === null || qte <= t.maxQte));

/** Calcule un montant de location HT selon les paliers configurés. */
export const calculerLocation = (
  paliers: PalierLocation[],
  jours: number,
  quantite: number,
) => {
  const palier = palierPourDuree(paliers, jours);
  if (!palier) return { palier: undefined, prixUnitaire: 0, total: 0 };
  const facteur =
    palier.unite === "Jour"
      ? jours
      : palier.unite === "Semaine"
        ? Math.ceil(jours / 7)
        : palier.unite === "Mois"
          ? Math.ceil(jours / 30)
          : 1;
  return {
    palier,
    prixUnitaire: palier.prix,
    total: Math.round(palier.prix * facteur * quantite),
  };
};

/* ------------------------------------------------------------------ */
/* Journal d'audit (IA / humain)                                       */
/* ------------------------------------------------------------------ */

export interface EvenementAudit {
  id: string;
  cible: string;
  date: string;
  action: string;
  acteur: string;
  mode: "IA" | "Manuel";
  detail?: string | undefined;
}

export const auditSeed: EvenementAudit[] = [
  { id: "A1", cible: "OPP-2026-0042", date: "2026-09-07T14:32:00", action: "Prospect qualifié", acteur: "Agent IA", mode: "IA" },
  { id: "A2", cible: "OPP-2026-0042", date: "2026-09-07T14:34:00", action: "Opportunité créée", acteur: "Agent IA", mode: "IA", detail: "À partir de la conversation Telegram" },
  { id: "A3", cible: "OPP-2026-0042", date: "2026-09-07T15:12:00", action: "Devis généré", acteur: "FatimaEzzahra Seffari", mode: "Manuel" },
  { id: "A4", cible: "OPP-2026-0042", date: "2026-09-07T15:15:00", action: "Devis envoyé", acteur: "Agent IA", mode: "IA" },
  { id: "A5", cible: "OPP-2026-0042", date: "2026-09-08T09:04:00", action: "Devis accepté", acteur: "Agent IA", mode: "IA", detail: "Détection dans la conversation" },
];
