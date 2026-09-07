import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Cellule, Chronologie, DocumentsLies, EnTeteDetail, Infos, Ligne, Panneau, Statut, Tableau, VideEtat } from "@/components/app/ui-kit";
import { Lien, useAller } from "@/components/app/nav";
import { useSinmat } from "@/data/store";
import { formatDH, formatDate, nomUtilisateur, produits } from "@/data/sinmat";

export const Route = createFileRoute("/commandes/$id")({
  head: ({ params }) => ({
    meta: [
      { title: `Commande ${params.id} — Gestion SINMAT` },
      { name: "description", content: "Fiche commande SINMAT : lignes, statut, paiement, livraison et facturation." },
      { property: "og:title", content: `Commande ${params.id} — Gestion SINMAT` },
      { property: "og:description", content: "Suivi d'une commande client." },
    ],
  }),
  component: FicheCommande,
});

function FicheCommande() {
  const { id } = Route.useParams();
  const s = useSinmat();
  const aller = useAller();

  const commande = s.commandes.find((c) => c.id === id);
  if (!commande) {
    return (
      <div className="p-6">
        <VideEtat titre="Commande introuvable" description="Cet enregistrement n'existe pas." />
      </div>
    );
  }

  const client = s.clients.find((c) => c.id === commande.clientId);
  const devis = s.devis.find((d) => d.id === commande.devisId);
  const facture = s.factures.find((f) => f.id === commande.factureId);
  const livraison = s.livraisons.find((l) => l.id === commande.livraisonId);

  const genererFacture = () => {
    const f = s.genererFacture(commande.id);
    if (f) {
      toast.success("Facture générée", { description: f.id });
      aller(`/factures/${f.id}`);
    }
  };

  const creerLivraison = () => {
    const l = s.creerLivraison({ commandeId: commande.id, clientId: commande.clientId, statut: "À préparer" });
    toast.success("Livraison créée", { description: l.id });
    aller(`/livraisons/${l.id}`);
  };

  return (
    <div>
      <EnTeteDetail
        retour={{ to: "/commandes", libelle: "Commandes" }}
        titre={commande.id}
        badges={
          <>
            <Statut valeur={commande.statut} />
            <Statut valeur={commande.type} ton={commande.type === "Location" ? "info" : "accent"} />
          </>
        }
        sousTitre={`${client?.nom ?? "—"} · ${client?.ville ?? "—"} · Responsable : ${nomUtilisateur(commande.responsableId)}`}
        actions={
          <>
            {!commande.factureId && (
              <Button variant="outline" size="sm" onClick={genererFacture}>
                Générer la facture
              </Button>
            )}
            {!commande.livraisonId && commande.type === "Vente" && (
              <Button variant="outline" size="sm" onClick={creerLivraison}>
                Créer la livraison
              </Button>
            )}
            {commande.livraisonId && (
              <Lien to={`/livraisons/${commande.livraisonId}`}>
                <Button variant="outline" size="sm">Voir la livraison</Button>
              </Lien>
            )}
            {commande.factureId && (
              <Lien to={`/factures/${commande.factureId}`}>
                <Button variant="outline" size="sm">Voir la facture</Button>
              </Lien>
            )}
          </>
        }
      />

      <div className="grid gap-5 p-6 lg:grid-cols-3">
        <div className="space-y-5 lg:col-span-2">
          <Panneau titre="Lignes de commande" bodyClassName="p-0">
            <Tableau colonnes={["Produit", "Quantité", "Durée", "Prix unitaire", "Total TTC"]}>
              {commande.lignes.map((l) => {
                const produit = produits.find((p) => p.id === l.produitId);
                const total = l.quantite * l.prixUnitaire * (l.duree ?? 1) * (1 - l.remise / 100) * (1 + l.tva / 100);
                return (
                  <Ligne key={`${l.produitId}-${l.duree}`}>
                    <Cellule className="max-w-[320px]">
                      <span className="block truncate font-semibold text-foreground">{l.designation}</span>
                      <span className="block text-[11.5px] text-muted-foreground">{produit?.reference ?? l.produitId}</span>
                    </Cellule>
                    <Cellule num>{l.quantite}</Cellule>
                    <Cellule>{l.duree ? `${l.duree} ${l.uniteDuree?.toLowerCase() ?? ""}` : "—"}</Cellule>
                    <Cellule num>{formatDH(l.prixUnitaire)}</Cellule>
                    <Cellule num className="font-semibold">{formatDH(total)}</Cellule>
                  </Ligne>
                );
              })}
            </Tableau>
          </Panneau>

          <Panneau titre="Notes">
            <p className="text-[13.5px] leading-relaxed text-foreground/85">{commande.notes || "Aucune note."}</p>
          </Panneau>
        </div>

        <div className="space-y-5">
          <Panneau titre="Informations">
            <Infos
              donnees={[
                { label: "Client", valeur: client?.nom ?? "—" },
                { label: "Type", valeur: commande.type },
                { label: "Date", valeur: formatDate(commande.date) },
                { label: "Montant TTC", valeur: formatDH(commande.montant) },
                { label: "Paiement", valeur: <Statut valeur={commande.paiement} /> },
                { label: "Responsable", valeur: nomUtilisateur(commande.responsableId) },
              ]}
            />
          </Panneau>

          <Panneau titre="Documents liés">
            <DocumentsLies
              elements={[
                ...(devis ? [{ label: "Devis", ref: devis.id, to: `/devis/${devis.id}` }] : []),
                ...(facture ? [{ label: "Facture", ref: facture.id, to: `/factures/${facture.id}` }] : []),
                ...(livraison ? [{ label: "Livraison", ref: livraison.id, to: `/livraisons/${livraison.id}` }] : []),
              ]}
            />
          </Panneau>

          <Panneau titre="Historique">
            <Chronologie
              evenements={[
                { date: formatDate(commande.date), libelle: "Commande créée", detail: commande.devisId ? `Issue du devis ${commande.devisId}` : "Saisie manuelle" },
                ...(facture ? [{ date: formatDate(facture.date), libelle: `Facture ${facture.id} générée`, detail: formatDH(facture.ttc) }] : []),
                ...(livraison ? [{ date: formatDate(livraison.date), libelle: `Livraison planifiée`, detail: livraison.creneau }] : []),
              ]}
            />
          </Panneau>
        </div>
      </div>
    </div>
  );
}
