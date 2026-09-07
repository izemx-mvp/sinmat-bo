import { createFileRoute } from "@tanstack/react-router";
import { DocumentsLies, EnTeteDetail, Infos, Panneau, Statut, VideEtat } from "@/components/app/ui-kit";
import { Lien } from "@/components/app/nav";
import { useSinmat } from "@/data/store";
import { formatDH, formatDate, produits } from "@/data/sinmat";

export const Route = createFileRoute("/retours/$id")({
  head: ({ params }) => ({
    meta: [
      { title: `Retour ${params.id} — Gestion SINMAT` },
      { name: "description", content: "Fiche retour SINMAT : matériel, inspection et frais." },
      { property: "og:title", content: `Retour ${params.id} — Gestion SINMAT` },
      { property: "og:description", content: "Détail d'un retour de location." },
    ],
  }),
  component: FicheRetour,
});

function FicheRetour() {
  const { id } = Route.useParams();
  const { retours, clients, locations } = useSinmat();

  const retour = retours.find((r) => r.id === id);
  if (!retour) {
    return (
      <div className="p-6">
        <VideEtat titre="Retour introuvable" description="Cet enregistrement n'existe pas." />
      </div>
    );
  }

  const client = clients.find((c) => c.id === retour.clientId);
  const produit = produits.find((p) => p.id === retour.produitId);
  const location = locations.find((l) => l.id === retour.locationId);

  return (
    <div>
      <EnTeteDetail
        retour={{ to: "/retours", libelle: "Retours" }}
        titre={retour.id}
        badges={<Statut valeur={retour.statut} />}
        sousTitre={`${client?.nom ?? "—"} · ${produit?.nom ?? "—"}`}
      />

      <div className="grid gap-5 p-6 lg:grid-cols-3">
        <div className="space-y-5 lg:col-span-2">
          <Panneau titre="Planning retour">
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-lg border border-border bg-surface-muted/50 p-4">
                <p className="section-label">Retour prévu</p>
                <p className="num mt-1 text-[18px] font-semibold text-foreground">{formatDate(retour.retourPrevu)}</p>
              </div>
              <div className="rounded-lg border border-border bg-surface-muted/50 p-4">
                <p className="section-label">Retour réel</p>
                <p className="num mt-1 text-[18px] font-semibold text-foreground">{retour.retourReel ? formatDate(retour.retourReel) : "—"}</p>
              </div>
              <div className="rounded-lg border border-border bg-surface-muted/50 p-4">
                <p className="section-label">Retard</p>
                <p className="num mt-1 text-[18px] font-semibold text-foreground">{retour.retardJours} jours</p>
              </div>
            </div>
          </Panneau>

          <Panneau titre="Inspection">
            <Infos
              donnees={[
                { label: "État constaté", valeur: retour.etat },
                { label: "Notes", valeur: retour.notes || "—" },
                { label: "Frais supplémentaires", valeur: formatDH(retour.fraisSupplementaires) },
              ]}
            />
          </Panneau>
        </div>

        <div className="space-y-5">
          <Panneau titre="Informations">
            <Infos
              donnees={[
                { label: "Client", valeur: client?.nom ?? "—" },
                { label: "Matériel", valeur: produit?.nom ?? "—" },
                { label: "Quantité", valeur: String(retour.quantite) },
                { label: "Statut", valeur: <Statut valeur={retour.statut} /> },
              ]}
            />
          </Panneau>

          <Panneau titre="Documents liés">
            <DocumentsLies
              elements={[
                ...(location ? [{ label: "Location", ref: location.id, to: `/locations/${location.id}` }] : []),
              ]}
            />
          </Panneau>
        </div>
      </div>
    </div>
  );
}
