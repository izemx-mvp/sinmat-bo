import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import * as seed from "./sinmat";
import type {
  Campagne,
  Client,
  Commande,
  Devis,
  EtapePipeline,
  Facture,
  LigneDocument,
  Livraison,
  Location,
  Opportunite,
  Paiement,
  Produit,
  Prospect,
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
  commandes: Commande[];
  ventes: Vente[];
  locations: Location[];
  factures: Facture[];
  paiements: Paiement[];
  livraisons: Livraison[];
  retours: Retour[];
}

interface Actions {
  ajouterProspect: (p: Partial<Prospect>) => Prospect;
  qualifierProspect: (id: string) => void;
  creerOpportuniteDepuisProspect: (id: string) => Opportunite | undefined;
  deplacerOpportunite: (id: string, etape: EtapePipeline) => void;
  ajouterCampagne: (c: Partial<Campagne>) => Campagne;
  creerDevis: (d: {
    clientId: string;
    type: "Vente" | "Location";
    lignes: LigneDocument[];
    opportuniteId?: string;
    conditions: string;
    expiration: string;
    statut: Devis["statut"];
  }) => Devis;
  accepterDevis: (id: string) => Commande | undefined;
  enregistrerPaiement: (p: {
    clientId: string;
    factureId: string;
    montant: number;
    date: string;
    mode: Paiement["mode"];
    reference: string;
    commentaire: string;
  }) => void;
  genererFacture: (commandeId: string) => Facture | undefined;
  creerLivraison: (l: Partial<Livraison> & { commandeId: string }) => Livraison;
  majStatutLivraison: (id: string, statut: Livraison["statut"]) => void;
  enregistrerRetour: (
    id: string,
    data: { retourReel: string; etat: Retour["etat"]; notes: string; frais: number },
  ) => void;
  ajouterClient: (c: Partial<Client>) => Client;
}

const Ctx = createContext<(EtatSinmat & Actions) | null>(null);

const seq = (prefix: string, n: number) => `${prefix}-2026-${String(n).padStart(4, "0")}`;

export function SinmatProvider({ children }: { children: ReactNode }) {
  const [etat, setEtat] = useState<EtatSinmat>(() => ({
    prospects: [...seed.prospects],
    campagnes: [...seed.campagnes],
    clients: [...seed.clients],
    opportunites: [...seed.opportunites],
    produits: [...seed.produits],
    devis: [...seed.devis],
    commandes: [...seed.commandes],
    ventes: [...seed.ventes],
    locations: [...seed.locations],
    factures: [...seed.factures],
    paiements: [...seed.paiements],
    livraisons: [...seed.livraisons],
    retours: [...seed.retours],
  }));

  const valeur = useMemo<EtatSinmat & Actions>(() => {
    const actions: Actions = {
      ajouterProspect: (p) => {
        const nouveau: Prospect = {
          id: seq("PRO", 130 + Math.floor(Math.random() * 500)),
          entreprise: p.entreprise ?? "Nouveau prospect",
          contact: p.contact ?? "",
          telephone: p.telephone ?? "",
          email: p.email ?? "",
          ville: p.ville ?? "Casablanca",
          secteur: p.secteur ?? "BTP",
          source: p.source ?? "Saisie manuelle",
          statut: "Nouveau",
          qualification: "Non qualifié",
          interet: p.interet ?? "Moyen",
          derniereActivite: "2026-09-07",
          creeLe: "2026-09-07",
          responsableId: p.responsableId ?? "U1",
          timeline: [{ date: "2026-09-07", libelle: "Prospect ajouté" }],
        };
        setEtat((e) => ({ ...e, prospects: [nouveau, ...e.prospects] }));
        return nouveau;
      },
      qualifierProspect: (id) =>
        setEtat((e) => ({
          ...e,
          prospects: e.prospects.map((p) =>
            p.id === id
              ? {
                  ...p,
                  qualification: "Qualifié",
                  statut: "Intéressé",
                  interet: "Élevé",
                  timeline: [
                    ...p.timeline,
                    { date: "2026-09-07", libelle: "Prospect qualifié" },
                  ],
                }
              : p,
          ),
        })),
      creerOpportuniteDepuisProspect: (id) => {
        const p = etat.prospects.find((x) => x.id === id);
        if (!p) return undefined;
        const opp: Opportunite = {
          id: seq("OPP", 54 + etat.opportunites.length),
          titre: p.ia
            ? `${p.ia.besoin} — ${p.ia.quantite} × ${p.ia.produit}`
            : `Opportunité — ${p.entreprise}`,
          prospectId: p.id,
          clientId: p.clientId,
          entreprise: p.entreprise,
          type: p.ia?.besoin ?? "Vente",
          montant: 0,
          etape: "Qualifié",
          produit: p.ia?.produit ?? "",
          quantite: p.ia?.quantite ?? 1,
          duree: p.ia?.duree,
          dateSouhaitee: p.ia?.dateSouhaitee ?? "2026-09-30",
          chantier: p.ville,
          urgence: p.ia?.urgence ?? "Moyenne",
          responsableId: p.responsableId,
          prochaineAction: "Préparer la proposition",
          derniereActivite: "2026-09-07",
          source: p.source,
          resumeIA: p.ia?.resume ?? "",
          probabilite: p.ia?.probabilite ?? 50,
        };
        setEtat((e) => ({
          ...e,
          opportunites: [opp, ...e.opportunites],
          prospects: e.prospects.map((x) =>
            x.id === id
              ? {
                  ...x,
                  opportuniteId: opp.id,
                  timeline: [...x.timeline, { date: "2026-09-07", libelle: "Opportunité créée" }],
                }
              : x,
          ),
        }));
        return opp;
      },
      deplacerOpportunite: (id, etape) =>
        setEtat((e) => ({
          ...e,
          opportunites: e.opportunites.map((o) =>
            o.id === id ? { ...o, etape, derniereActivite: "2026-09-07" } : o,
          ),
        })),
      ajouterCampagne: (c) => {
        const nouvelle: Campagne = {
          id: seq("CMP", 8 + etat.campagnes.length),
          nom: c.nom ?? "Nouvelle campagne",
          objectif: c.objectif ?? "",
          audience: c.audience ?? 0,
          envoyes: 0,
          reponses: 0,
          qualifies: 0,
          opportunites: 0,
          conversion: 0,
          statut: c.statut ?? "Planifiée",
          date: c.date ?? "2026-09-07",
          criteres: c.criteres ?? [],
        };
        setEtat((e) => ({ ...e, campagnes: [nouvelle, ...e.campagnes] }));
        return nouvelle;
      },
      creerDevis: (d) => {
        const montant = d.lignes.reduce(
          (s, l) =>
            s +
            l.quantite *
              l.prixUnitaire *
              (l.duree ?? 1) *
              (1 - l.remise / 100) *
              (1 + l.tva / 100),
          0,
        );
        const nouveau: Devis = {
          id: seq("DEV", 187 + etat.devis.length),
          clientId: d.clientId,
          opportuniteId: d.opportuniteId,
          type: d.type,
          date: "2026-09-07",
          expiration: d.expiration,
          montant: Math.round(montant),
          responsableId: "U1",
          statut: d.statut,
          lignes: d.lignes,
          conditions: d.conditions,
        };
        setEtat((e) => ({ ...e, devis: [nouveau, ...e.devis] }));
        return nouveau;
      },
      accepterDevis: (id) => {
        const d = etat.devis.find((x) => x.id === id);
        if (!d) return undefined;
        const cmd: Commande = {
          id: seq("CMD", 94 + etat.commandes.length),
          clientId: d.clientId,
          devisId: d.id,
          type: d.type,
          date: "2026-09-07",
          montant: d.montant,
          statut: "Confirmée",
          paiement: "Non payé",
          lignes: d.lignes,
          notes: "",
          responsableId: d.responsableId,
        };
        setEtat((e) => ({
          ...e,
          devis: e.devis.map((x) =>
            x.id === id ? { ...x, statut: "Accepté", commandeId: cmd.id } : x,
          ),
          commandes: [cmd, ...e.commandes],
        }));
        return cmd;
      },
      genererFacture: (commandeId) => {
        const c = etat.commandes.find((x) => x.id === commandeId);
        if (!c) return undefined;
        const f: Facture = {
          id: seq("FAC", 101 + etat.factures.length),
          clientId: c.clientId,
          commandeId: c.id,
          date: "2026-09-07",
          echeance: "2026-10-07",
          ht: Math.round(c.montant / 1.2),
          ttc: c.montant,
          paye: 0,
          statut: "Émise",
        };
        setEtat((e) => ({
          ...e,
          factures: [f, ...e.factures],
          commandes: e.commandes.map((x) => (x.id === c.id ? { ...x, factureId: f.id } : x)),
        }));
        return f;
      },
      enregistrerPaiement: (p) =>
        setEtat((e) => {
          const paiement: Paiement = {
            id: seq("PAY", 143 + e.paiements.length),
            clientId: p.clientId,
            factureId: p.factureId,
            commandeId:
              e.factures.find((f) => f.id === p.factureId)?.commandeId ?? "",
            montant: p.montant,
            date: p.date,
            mode: p.mode,
            reference: p.reference,
            commentaire: p.commentaire,
          };
          const factures = e.factures.map((f) => {
            if (f.id !== p.factureId) return f;
            const paye = f.paye + p.montant;
            const statut: Facture["statut"] =
              paye >= f.ttc ? "Payée" : paye > 0 ? "Partiellement payée" : f.statut;
            return { ...f, paye, statut };
          });
          const facture = factures.find((f) => f.id === p.factureId);
          const commandes = e.commandes.map((c) =>
            facture && c.id === facture.commandeId
              ? {
                  ...c,
                  paiement:
                    facture.paye >= facture.ttc
                      ? ("Payé" as const)
                      : ("Partiellement payé" as const),
                }
              : c,
          );
          const clients = e.clients.map((c) =>
            c.id === p.clientId ? { ...c, encours: Math.max(0, c.encours - p.montant) } : c,
          );
          return { ...e, paiements: [paiement, ...e.paiements], factures, commandes, clients };
        }),
      creerLivraison: (l) => {
        const cmd = etat.commandes.find((c) => c.id === l.commandeId);
        const nouvelle: Livraison = {
          id: seq("LIV", 67 + etat.livraisons.length),
          commandeId: l.commandeId,
          clientId: l.clientId ?? cmd?.clientId ?? "",
          chantier: l.chantier ?? "",
          ville: l.ville ?? "Casablanca",
          adresse: l.adresse ?? "",
          date: l.date ?? "2026-09-08",
          creneau: l.creneau ?? "08:00 – 12:00",
          responsableId: l.responsableId ?? "U3",
          chauffeur: l.chauffeur ?? "—",
          vehicule: l.vehicule ?? "—",
          statut: l.statut ?? "À préparer",
          notes: l.notes ?? "",
        };
        setEtat((e) => ({
          ...e,
          livraisons: [nouvelle, ...e.livraisons],
          commandes: e.commandes.map((c) =>
            c.id === l.commandeId ? { ...c, livraisonId: nouvelle.id } : c,
          ),
        }));
        return nouvelle;
      },
      majStatutLivraison: (id, statut) =>
        setEtat((e) => ({
          ...e,
          livraisons: e.livraisons.map((l) => (l.id === id ? { ...l, statut } : l)),
        })),
      enregistrerRetour: (id, data) =>
        setEtat((e) => {
          const retour = e.retours.find((r) => r.id === id);
          return {
            ...e,
            retours: e.retours.map((r) =>
              r.id === id
                ? {
                    ...r,
                    retourReel: data.retourReel,
                    etat: data.etat,
                    notes: data.notes,
                    fraisSupplementaires: data.frais,
                    statut: "Reçu",
                  }
                : r,
            ),
            locations: e.locations.map((l) =>
              retour && l.id === retour.locationId ? { ...l, statut: "Terminée" } : l,
            ),
            produits: e.produits.map((p) =>
              retour && p.id === retour.produitId
                ? {
                    ...p,
                    enLocation: Math.max(0, p.enLocation - retour.quantite),
                    stock: p.stock + retour.quantite,
                    disponibilite: "Disponible",
                  }
                : p,
            ),
          };
        }),
      ajouterClient: (c) => {
        const nouveau: Client = {
          id: `CLI-${String(8 + etat.clients.length).padStart(3, "0")}`,
          nom: c.nom ?? "Nouveau client",
          contact: c.contact ?? "",
          telephone: c.telephone ?? "",
          email: c.email ?? "",
          ville: c.ville ?? "Casablanca",
          adresse: c.adresse ?? "",
          ice: c.ice ?? "",
          rc: c.rc ?? "",
          type: c.type ?? "Vente",
          statut: "Actif",
          commandes: 0,
          ca: 0,
          encours: 0,
          derniereActivite: "2026-09-07",
          responsableId: c.responsableId ?? "U1",
          depuis: "2026-09-07",
        };
        setEtat((e) => ({ ...e, clients: [nouveau, ...e.clients] }));
        return nouveau;
      },
    };
    return { ...etat, ...actions };
  }, [etat]);

  return <Ctx.Provider value={valeur}>{children}</Ctx.Provider>;
}

export function useSinmat() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useSinmat doit être utilisé dans SinmatProvider");
  return ctx;
}
