import { createFileRoute } from "@tanstack/react-router";
import { DocumentsLies, EnTeteDetail, Infos, Panneau, Statut, VideEtat } from "@/components/app/ui-kit";
import { useSinmat } from "@/data/store";
import { formatDH, formatDate, nomUtilisateur } from "@/data/sinmat";

export const Route = createFileRoute("/paiements/$id")({
  head: ({ params }) => ({
    meta: [
      { title: `Paiement ${params.id} — Gestion SINMAT` },
      { name: "description", content: "Fiche détaillée d'un paiement client SINMAT." },
      { property: "og:title", content: `Paiement ${params.id} — Gestion SINMAT` },
      { property: "og:description", content: "Détail d'un encaissement." },
    ],
  }),
  component: FichePaiement,
});

function FichePaiement() {
  const { id } = Route.useParams();
  const { paiements, clients, factures, commandes } = useSinmat();

  const paiement = paiements.find((p) => p.id === id);
  if (!paiement) {
    return (
      <div className="p-6">
        <VideEtat titre="Paiement introuvable" description="Cet enregistrement n'existe pas." />
      </div>
    );
  }

  const client = clients.find((c) => c.id === paiement.clientId);
  const facture = factures.find((f) => f.id === paiement.factureId);
  const commande = commandes.find((c) => c.id === paiement.commandeId);

  return (
    <div>
      <EnTeteDetail
        retour={{ to: "/paiements", libelle: "Paiements" }}
        titre={paiement.id}
        badges={<Statut valeur={paiement.mode} ton="info" />}
        sousTitre={`${client?.nom ?? "—"} · ${formatDate(paiement.date)}`}
      />

      <div className="grid gap-5 p-6 lg:grid-cols-3">
        <div className="space-y-5 lg:col-span-2">
          <Panneau titre="Détail du paiement">
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="rounded-lg border border-border bg-surface-muted/50 p-4">
                <p className="section-label">Montant</p>
                <p className="num mt-1 font-display text-[28px] font-bold text-foreground">{formatDH(paiement.montant)}</p>
              </div>
              <div className="rounded-lg border border-border bg-surface-muted/50 p-4">
                <p className="section-label">Mode de règlement</p>
                <p className="mt-1 text-[18px] font-semibold text-foreground">{paiement.mode}</p>
              </div>
            </div>
            <div className="mt-5">
              <p className="section-label">Commentaire</p>
              <p className="mt-1 text-[13.5px] leading-relaxed text-foreground/85">{paiement.commentaire || "Aucun commentaire."}</p>
            </div>
          </Panneau>
        </div>

        <div className="space-y-5">
          <Panneau titre="Informations">
            <Infos
              donnees={[
                { label: "Client", valeur: client?.nom ?? "—" },
                { label: "Date", valeur: formatDate(paiement.date) },
                { label: "Mode", valeur: paiement.mode },
                { label: "Référence", valeur: paiement.reference },
                { label: "Montant", valeur: formatDH(paiement.montant) },
                { label: "Responsable", valeur: nomUtilisateur("U2") },
              ]}
            />
          </Panneau>

          <Panneau titre="Documents liés">
            <DocumentsLies
              elements={[
                ...(facture ? [{ label: "Facture", ref: facture.id, to: `/factures/${facture.id}` }] : []),
                ...(commande ? [{ label: "Commande", ref: commande.id, to: `/commandes/${commande.id}` }] : []),
              ]}
            />
          </Panneau>
        </div>
      </div>
    </div>
  );
}
