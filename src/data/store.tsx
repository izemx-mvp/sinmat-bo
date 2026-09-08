import { useMemo, useState, type ReactNode } from "react";
import * as seed from "./sinmat";
import { Ctx } from "./store-context";
import type { Actions, EtatSinmat } from "./store-types";
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

export type { EtatSinmat, Actions } from "./store-types";
export { useSinmat } from "./store-context";



const seq = (prefix: string, n: number) => `${prefix}-2026-${String(n).padStart(4, "0")}`;
const AUJ = "2026-09-08";

export function SinmatProvider({ children }: { children: ReactNode }) {
  const [etat, setEtat] = useState<EtatSinmat>(() => ({
    prospects: [...seed.prospects],
    campagnes: [...seed.campagnes],
    clients: [...seed.clients],
    opportunites: [...seed.opportunites],
    produits: [...seed.produits],
    devis: [...seed.devis],
    ventes: [...seed.ventes],
    locations: [...seed.locations],
    factures: [...seed.factures],
    paiements: [...seed.paiements],
    livraisons: [...seed.livraisons],
    retours: [...seed.retours],
    conversations: [...seed.conversations],
    messages: [...seed.messages],
    regles: [...seed.reglesProduits],
    audit: [...seed.auditSeed],
  }));

  const valeur = useMemo<EtatSinmat & Actions>(() => {
    const montantLignes = (lignes: LigneDocument[]) =>
      Math.round(
        lignes.reduce(
          (s, l) =>
            s +
            l.quantite * l.prixUnitaire * (l.duree ?? 1) * (1 - l.remise / 100) * (1 + l.tva / 100),
          0,
        ),
      );

    const nouveauProspect = (p: Partial<Prospect>, i = 0): Prospect => ({
      id: seq("PRO", 200 + i + Math.floor(Math.random() * 400)),
      entreprise: p.entreprise ?? "Nouveau prospect",
      contact: p.contact ?? "",
      telephone: p.telephone ?? "",
      email: p.email ?? "",
      ville: p.ville ?? "Casablanca",
      secteur: p.secteur ?? "BTP",
      source: p.source ?? "Saisie manuelle",
      statut: p.statut ?? "Nouveau",
      qualification: "Non qualifié",
      interet: p.interet ?? "Moyen",
      derniereActivite: AUJ,
      creeLe: AUJ,
      responsableId: p.responsableId ?? "U1",
      timeline: [{ date: AUJ, libelle: "Prospect ajouté" }],
    });

    const actions: Actions = {
      journaliser: (e) =>
        setEtat((s) => ({
          ...s,
          audit: [{ ...e, id: `A${s.audit.length + 1}-${Date.now()}` }, ...s.audit],
        })),

      ajouterProspect: (p) => {
        const n = nouveauProspect(p);
        setEtat((e) => ({ ...e, prospects: [n, ...e.prospects] }));
        return n;
      },

      importerProspects: (lignes, options) => {
        const nouveaux = lignes.map((l, i) =>
          nouveauProspect(
            {
              ...l,
              source: options.source,
              responsableId: options.responsableId,
              statut: options.statut,
            },
            i,
          ),
        );
        setEtat((e) => ({ ...e, prospects: [...nouveaux, ...e.prospects] }));
        return nouveaux.length;
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
                  timeline: [...p.timeline, { date: AUJ, libelle: "Prospect qualifié" }],
                }
              : p,
          ),
        })),

      creerOpportuniteDepuisProspect: (id, mode = "IA") => {
        const p = etat.prospects.find((x) => x.id === id);
        if (!p) return undefined;
        const conv = etat.conversations.find((c) => c.prospectId === p.id);
        const opp: Opportunite = {
          id: seq("OPP", 54 + etat.opportunites.length),
          titre: p.ia ? `${p.ia.besoin} — ${p.ia.quantite} × ${p.ia.produit}` : `Opportunité — ${p.entreprise}`,
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
          derniereActivite: AUJ,
          source: mode === "IA" ? "Agent IA" : "Saisie manuelle",
          resumeIA: conv?.resume ?? p.ia?.resume ?? "",
          probabilite: p.ia?.probabilite ?? 50,
          modeCreation: mode,
          conversationId: conv?.id,
          confianceIA: conv?.confiance ?? p.ia?.probabilite,
          historiqueEtapes: [
            { etape: "À qualifier", date: `${AUJ}T09:00:00`, acteur: "Agent IA", mode: "IA" },
            { etape: "Qualifié", date: `${AUJ}T09:02:00`, acteur: mode === "IA" ? "Agent IA" : "FatimaEzzahra Seffari", mode },
          ],
        };
        setEtat((e) => ({
          ...e,
          opportunites: [opp, ...e.opportunites],
          prospects: e.prospects.map((x) =>
            x.id === id
              ? { ...x, opportuniteId: opp.id, timeline: [...x.timeline, { date: AUJ, libelle: "Opportunité créée" }] }
              : x,
          ),
          audit: [
            { id: `A-${Date.now()}`, cible: opp.id, date: `${AUJ}T09:02:00`, action: "Opportunité créée", acteur: mode === "IA" ? "Agent IA" : "FatimaEzzahra Seffari", mode },
            ...e.audit,
          ],
        }));
        return opp;
      },

      deplacerOpportunite: (id, etape, mode = "Manuel") =>
        setEtat((e) => ({
          ...e,
          opportunites: e.opportunites.map((o) =>
            o.id === id
              ? {
                  ...o,
                  etape,
                  derniereActivite: AUJ,
                  historiqueEtapes: [
                    ...(o.historiqueEtapes ?? []),
                    {
                      etape,
                      date: `${AUJ}T10:00:00`,
                      acteur: mode === "IA" ? "Agent IA" : "FatimaEzzahra Seffari",
                      mode,
                    },
                  ],
                }
              : o,
          ),
          audit: [
            { id: `A-${Date.now()}`, cible: id, date: `${AUJ}T10:00:00`, action: `Étape « ${etape} »`, acteur: mode === "IA" ? "Agent IA" : "FatimaEzzahra Seffari", mode },
            ...e.audit,
          ],
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
          date: c.date ?? AUJ,
          criteres: c.criteres ?? [],
        };
        setEtat((e) => ({ ...e, campagnes: [nouvelle, ...e.campagnes] }));
        return nouvelle;
      },

      ajouterProduit: (p) => {
        const id = `P${etat.produits.length + 1}`;
        const nouveau: Produit = {
          id,
          nom: p.nom ?? "Nouveau matériel",
          reference: p.reference ?? `SIN-NEW-${String(etat.produits.length + 1).padStart(3, "0")}`,
          categorie: p.categorie ?? "Divers",
          description: p.description ?? "",
          image: p.image ?? "",
          prixVente: p.prixVente ?? 0,
          prixJour: p.prixJour ?? 0,
          prixSemaine: p.prixSemaine ?? 0,
          prixMois: p.prixMois ?? 0,
          stock: p.stock ?? 0,
          reserve: p.reserve ?? 0,
          enLocation: p.enLocation ?? 0,
          maintenance: p.maintenance ?? 0,
          fournisseur: p.fournisseur ?? "—",
          disponibilite: (p.stock ?? 0) > 2 ? "Disponible" : (p.stock ?? 0) > 0 ? "Stock faible" : "Indisponible",
          specs: p.specs ?? [],
        };
        setEtat((e) => ({
          ...e,
          produits: [nouveau, ...e.produits],
          regles: [seed.regleVide(id), ...e.regles],
        }));
        return nouveau;
      },

      majRegle: (produitId, patch) =>
        setEtat((e) => ({
          ...e,
          regles: e.regles.map((r) =>
            r.produitId === produitId ? { ...r, ...patch, modifieLe: AUJ } : r,
          ),
        })),

      creerDevis: (d) => {
        const nouveau: Devis = {
          id: seq("DEV", 187 + etat.devis.length),
          clientId: d.clientId,
          opportuniteId: d.opportuniteId,
          type: d.type,
          date: AUJ,
          expiration: d.expiration,
          montant: montantLignes(d.lignes),
          responsableId: "U1",
          statut: d.statut,
          lignes: d.lignes,
          conditions: d.conditions,
        };
        setEtat((e) => ({
          ...e,
          devis: [nouveau, ...e.devis],
          opportunites: e.opportunites.map((o) =>
            o.id === d.opportuniteId ? { ...o, devisId: nouveau.id, etape: "Devis à préparer" } : o,
          ),
          audit: [
            { id: `A-${Date.now()}`, cible: nouveau.id, date: `${AUJ}T11:00:00`, action: "Devis généré", acteur: "FatimaEzzahra Seffari", mode: "Manuel" as const },
            ...e.audit,
          ],
        }));
        return nouveau;
      },

      envoyerDevis: (id) =>
        setEtat((e) => {
          const d = e.devis.find((x) => x.id === id);
          return {
            ...e,
            devis: e.devis.map((x) => (x.id === id ? { ...x, statut: "Envoyé" } : x)),
            opportunites: e.opportunites.map((o) =>
              d && o.id === d.opportuniteId ? { ...o, etape: "Devis envoyé" } : o,
            ),
            audit: [
              { id: `A-${Date.now()}`, cible: id, date: `${AUJ}T11:05:00`, action: "Devis envoyé", acteur: "FatimaEzzahra Seffari", mode: "Manuel" as const },
              ...e.audit,
            ],
          };
        }),

      accepterDevis: (id) => {
        const d = etat.devis.find((x) => x.id === id);
        if (!d) return undefined;
        if (d.type === "Vente") {
          const vente: Vente = {
            id: seq("VTE", 91 + etat.ventes.length),
            devisId: d.id,
            opportuniteId: d.opportuniteId,
            clientId: d.clientId,
            date: AUJ,
            montant: d.montant,
            statut: "Confirmée",
            paiement: "Non payé",
            lignes: d.lignes,
            notes: "",
            responsableId: d.responsableId,
          };
          setEtat((e) => ({
            ...e,
            devis: e.devis.map((x) => (x.id === id ? { ...x, statut: "Accepté", venteId: vente.id } : x)),
            ventes: [vente, ...e.ventes],
            opportunites: e.opportunites.map((o) =>
              o.id === d.opportuniteId ? { ...o, etape: "Confirmé", venteId: vente.id } : o,
            ),
          }));
          return { type: "Vente" as const, id: vente.id };
        }
        const ligne = d.lignes[0];
        const jours = (ligne?.duree ?? 1) * (ligne?.uniteDuree === "Mois" ? 30 : ligne?.uniteDuree === "Semaine" ? 7 : 1);
        const client = etat.clients.find((c) => c.id === d.clientId);
        const debut = new Date("2026-09-10");
        const fin = new Date(debut.getTime() + jours * 86400000);
        const location: Location = {
          id: seq("LOC", 45 + etat.locations.length),
          devisId: d.id,
          opportuniteId: d.opportuniteId,
          clientId: d.clientId,
          produitId: ligne?.produitId ?? "P1",
          quantite: ligne?.quantite ?? 1,
          debut: debut.toISOString().slice(0, 10),
          finPrevue: fin.toISOString().slice(0, 10),
          dureeJours: jours,
          montant: d.montant,
          statut: "Réservée",
          chantier: client?.ville ? `Chantier ${client.ville}` : "Chantier",
          ville: client?.ville ?? "Casablanca",
          responsableChantier: client?.contact ?? "—",
          telephoneChantier: client?.telephone ?? "—",
          paiement: "Non payé",
          notes: "",
          responsableId: d.responsableId,
        };
        setEtat((e) => ({
          ...e,
          devis: e.devis.map((x) => (x.id === id ? { ...x, statut: "Accepté", locationId: location.id } : x)),
          locations: [location, ...e.locations],
          opportunites: e.opportunites.map((o) =>
            o.id === d.opportuniteId ? { ...o, etape: "Confirmé", locationId: location.id } : o,
          ),
        }));
        return { type: "Location" as const, id: location.id };
      },

      creerVente: (v) => {
        const vente: Vente = {
          id: seq("VTE", 91 + etat.ventes.length),
          devisId: v.devisId,
          clientId: v.clientId,
          date: v.date ?? AUJ,
          montant: v.montant ?? montantLignes(v.lignes),
          statut: v.statut ?? "Confirmée",
          paiement: v.paiement ?? "Non payé",
          lignes: v.lignes,
          notes: v.notes ?? "",
          responsableId: v.responsableId ?? "U1",
        };
        setEtat((e) => ({ ...e, ventes: [vente, ...e.ventes] }));
        return vente;
      },

      creerLocation: (l) => {
        const location: Location = {
          id: seq("LOC", 45 + etat.locations.length),
          devisId: l.devisId,
          clientId: l.clientId,
          produitId: l.produitId,
          quantite: l.quantite ?? 1,
          debut: l.debut ?? AUJ,
          finPrevue: l.finPrevue ?? AUJ,
          dureeJours: l.dureeJours ?? 1,
          montant: l.montant ?? 0,
          statut: l.statut ?? "Réservée",
          chantier: l.chantier ?? "",
          ville: l.ville ?? "Casablanca",
          responsableChantier: l.responsableChantier ?? "",
          telephoneChantier: l.telephoneChantier ?? "",
          paiement: "Non payé",
          notes: l.notes ?? "",
          responsableId: l.responsableId ?? "U1",
        };
        setEtat((e) => ({
          ...e,
          locations: [location, ...e.locations],
          produits: e.produits.map((p) =>
            p.id === location.produitId
              ? { ...p, reserve: p.reserve + location.quantite }
              : p,
          ),
        }));
        return location;
      },

      genererFacture: (origineType, origineId) => {
        const source =
          origineType === "Vente"
            ? etat.ventes.find((v) => v.id === origineId)
            : etat.locations.find((l) => l.id === origineId);
        if (!source) return undefined;
        const f: Facture = {
          id: seq("FAC", 101 + etat.factures.length),
          clientId: source.clientId,
          origineType,
          origineId,
          devisId: source.devisId,
          date: AUJ,
          echeance: "2026-10-08",
          ht: Math.round(source.montant / 1.2),
          ttc: source.montant,
          paye: 0,
          statut: "Émise",
        };
        setEtat((e) => ({
          ...e,
          factures: [f, ...e.factures],
          ventes: e.ventes.map((v) => (origineType === "Vente" && v.id === origineId ? { ...v, factureId: f.id } : v)),
          locations: e.locations.map((l) =>
            origineType === "Location" && l.id === origineId ? { ...l, factureId: f.id } : l,
          ),
        }));
        return f;
      },

      enregistrerPaiement: (p) =>
        setEtat((e) => {
          const paiement: Paiement = {
            id: seq("PAY", 143 + e.paiements.length),
            clientId: p.clientId,
            factureId: p.factureId,
            montant: p.montant,
            date: p.date,
            mode: p.mode,
            reference: p.reference,
            commentaire: p.commentaire,
          };
          const factures = e.factures.map((f) => {
            if (f.id !== p.factureId) return f;
            const paye = f.paye + p.montant;
            const statut: Facture["statut"] = paye >= f.ttc ? "Payée" : paye > 0 ? "Partiellement payée" : f.statut;
            return { ...f, paye, statut };
          });
          const facture = factures.find((f) => f.id === p.factureId);
          const solde = facture && facture.paye >= facture.ttc;
          const majPaiement = solde ? ("Payé" as const) : ("Partiellement payé" as const);
          return {
            ...e,
            paiements: [paiement, ...e.paiements],
            factures,
            ventes: e.ventes.map((v) =>
              facture && facture.origineType === "Vente" && v.id === facture.origineId
                ? { ...v, paiement: majPaiement }
                : v,
            ),
            locations: e.locations.map((l) =>
              facture && facture.origineType === "Location" && l.id === facture.origineId
                ? { ...l, paiement: majPaiement }
                : l,
            ),
            clients: e.clients.map((c) =>
              c.id === p.clientId ? { ...c, encours: Math.max(0, c.encours - p.montant) } : c,
            ),
          };
        }),

      creerLivraison: (l) => {
        const nouvelle: Livraison = {
          id: seq("LIV", 67 + etat.livraisons.length),
          origineType: l.origineType,
          origineId: l.origineId,
          clientId: l.clientId ?? "",
          chantier: l.chantier ?? "",
          ville: l.ville ?? "Casablanca",
          adresse: l.adresse ?? "",
          date: l.date ?? AUJ,
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
          ventes: e.ventes.map((v) =>
            l.origineType === "Vente" && v.id === l.origineId ? { ...v, livraisonId: nouvelle.id } : v,
          ),
          locations: e.locations.map((x) =>
            l.origineType === "Location" && x.id === l.origineId ? { ...x, livraisonId: nouvelle.id } : x,
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
          type: c.type ?? "Vente & Location",
          statut: "Actif",
          operations: 0,
          ca: 0,
          encours: 0,
          derniereActivite: AUJ,
          responsableId: c.responsableId ?? "U1",
          depuis: AUJ,
        };
        setEtat((e) => ({ ...e, clients: [nouveau, ...e.clients] }));
        return nouveau;
      },
    };

    return { ...etat, ...actions };
  }, [etat]);

  return <Ctx.Provider value={valeur}>{children}</Ctx.Provider>;
}
