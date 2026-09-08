import type {
  Campagne,
  Client,
  Conversation,
  Devis,
  EtapePipeline,
  EvenementAudit,
  Facture,
  LigneDocument,
  Livraison,
  Location,
  Message,
  Opportunite,
  OrigineType,
  Paiement,
  Produit,
  Prospect,
  RegleProduit,
  Retour,
  Vente,
} from "./sinmat";

export interface EtatSinmat {
  prospects: Prospect[];
  campagnes: Campagne[];
  clients: Client[];
  opportunites: Opportunite[];
  produits: Produit[];
  devis: Devis[];
  ventes: Vente[];
  locations: Location[];
  factures: Facture[];
  paiements: Paiement[];
  livraisons: Livraison[];
  retours: Retour[];
  conversations: Conversation[];
  messages: Message[];
  regles: RegleProduit[];
  audit: EvenementAudit[];
}

export interface Actions {
  ajouterProspect: (p: Partial<Prospect>) => Prospect;
  importerProspects: (
    lignes: Partial<Prospect>[],
    options: { source: string; responsableId: string; statut: Prospect["statut"] },
  ) => number;
  qualifierProspect: (id: string) => void;
  creerOpportuniteDepuisProspect: (id: string, mode?: "IA" | "Manuel") => Opportunite | undefined;
  deplacerOpportunite: (id: string, etape: EtapePipeline, mode?: "IA" | "Manuel") => void;
  ajouterCampagne: (c: Partial<Campagne>) => Campagne;
  ajouterProduit: (p: Partial<Produit>) => Produit;
  majProduit: (id: string, patch: Partial<Produit>) => void;
  archiverProduit: (id: string, archive: boolean) => void;
  majRegle: (produitId: string, patch: Partial<RegleProduit>) => void;
  enregistrerRegle: (regle: RegleProduit) => void;
  majStatutDevis: (id: string, statut: Devis["statut"]) => void;

  creerDevis: (d: {
    clientId: string;
    type: "Vente" | "Location";
    lignes: LigneDocument[];
    opportuniteId?: string;
    conditions: string;
    expiration: string;
    statut: Devis["statut"];
  }) => Devis;
  envoyerDevis: (id: string) => void;
  accepterDevis: (id: string) => { type: OrigineType; id: string } | undefined;
  creerVente: (v: Partial<Vente> & { clientId: string; lignes: LigneDocument[] }) => Vente;
  creerLocation: (l: Partial<Location> & { clientId: string; produitId: string }) => Location;
  enregistrerPaiement: (p: {
    clientId: string;
    factureId: string;
    montant: number;
    date: string;
    mode: Paiement["mode"];
    reference: string;
    commentaire: string;
  }) => void;
  genererFacture: (origineType: OrigineType, origineId: string) => Facture | undefined;
  creerLivraison: (
    l: Partial<Livraison> & { origineType: OrigineType; origineId: string },
  ) => Livraison;
  majStatutLivraison: (id: string, statut: Livraison["statut"]) => void;
  enregistrerRetour: (
    id: string,
    data: { retourReel: string; etat: Retour["etat"]; notes: string; frais: number },
  ) => void;
  ajouterClient: (c: Partial<Client>) => Client;
  journaliser: (e: Omit<EvenementAudit, "id">) => void;
}
