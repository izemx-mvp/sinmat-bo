import { createFileRoute } from "@tanstack/react-router";
import { DocumentsLies, EnTeteDetail, Infos, Panneau, Statut, VideEtat } from "@/components/app/ui-kit";
import { Lien } from "@/components/app/nav";
import { useSinmat } from "@/data/store";
import { formatDH, formatDate } from "@/data/sinmat";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/ventes/$id")({
  head: ({ params }) => ({
    meta: [
      { title: `Vente ${params.id} — Gestion SINMAT` },
      { name: "description", content: "Fiche vente SINMAT : commande liée, client et statut." },
      { property: "og:title", content: `Vente ${params.id} — Gestion SINMAT` },
      { property: "og:description", content: "Détail d'une vente." },
    ],
  }),
  component: FicheVente,
});

function FicheVente() {
  const { id } = Route.useParams();
  const { ventes, clients, commandes, factures, livraisons } = useSinmat();

  const vente = ventes.find((v) => v.id === id);
  if (!vente) {
    return (
      <div className="p-6">
        <VideEtat titre="Vente introuvable" description="Cet enregistrement n'existe pas." />
      </div>
    );
  }

  const client = clients.find((c) => c.id === vente.clientId);
  const commande = commandes.find((c) => c.id === vente.commandeId);
  const facture = factures.find((f) => f.id === commande?.factureId);
  const livraison = livraisons.find((l) => l.id === commande?.livraisonId);

  return (
    <div>
      <EnTeteDetail
        retour={{ to: "/ventes", libelle: "Ventes" }}
        titre={vente.id}
        badges={<Statut valeur={vente.statut} />}
        sousTitre={`${client?.nom ?? "—"} · ${formatDate(vente.date)}`}
        actions={
          <>
            {commande && (
              <Lien to={`/commandes/${commande.id}`}>
                <Button variant="outline" size="sm">Voir la commande</Button>
              </Lien>
            )}
          </>
        }
      />

      <div className="grid gap-5 p-6 lg:grid-cols-3">
        <div className="space-y-5 lg:col-span-2">
          <Panneau titre="Récapitulatif">
            <div className="grid gap-6 sm:grid-cols-3">
              <div className="rounded-lg border border-border bg-surface-muted/50 p-4">
                <p className="section-label">Montant</p>
                <p className="num mt-1 font-display text-[26px] font-bold text-foreground">{formatDH(vente.montant)}</p>
              </div>
              <div className="rounded-lg border border-border bg-surface-muted/50 p-4">
                <p className="section-label">Date</p>
                <p className="mt-1 text-[18px] font-semibold text-foreground">{formatDate(vente.date)}</p>
              </div>
              <div className="rounded-lg border border-border bg-surface-muted/50 p-4">
                <p className="section-label">Statut</p>
                <p className="mt-2">
                  <Statut valeur={vente.statut} />
                </p>
              </div>
            </div>
          </Panneau>
        </div>

        <div className="space-y-5">
          <Panneau titre="Informations">
            <Infos
              donnees={[
                { label: "Client", valeur: client?.nom ?? "—" },
                { label: "Commande", valeur: commande?.id ?? "—" },
                { label: "Date", valeur: formatDate(vente.date) },
                { label: "Montant", valeur: formatDH(vente.montant) },
                { label: "Statut", valeur: <Statut valeur={vente.statut} /> },
              ]}
            />
          </Panneau>

          <Panneau titre="Documents liés">
            <DocumentsLies
              elements={[
                ...(commande ? [{ label: "Commande", ref: commande.id, to: `/commandes/${commande.id}` }] : []),
                ...(facture ? [{ label: "Facture", ref: facture.id, to: `/factures/${facture.id}` }] : []),
                ...(livraison ? [{ label: "Livraison", ref: livraison.id, to: `/livraisons/${livraison.id}` }] : []),
              ]}
            />
          </Panneau>
        </div>
      </div>
    </div>
  );
}
