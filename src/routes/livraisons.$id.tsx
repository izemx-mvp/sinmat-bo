import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { DocumentsLies, EnTeteDetail, Infos, Panneau, RailStatut, Statut, VideEtat } from "@/components/app/ui-kit";
import { Lien } from "@/components/app/nav";
import { useSinmat } from "@/data/store";
import { formatDate, type Livraison } from "@/data/sinmat";

const ETAPES: Array<{ label: string; value: Livraison["statut"] }> = [
  { label: "À préparer", value: "À préparer" },
  { label: "Préparation en cours", value: "Préparation en cours" },
  { label: "Prête", value: "Prête" },
  { label: "Planifiée", value: "Planifiée" },
  { label: "En livraison", value: "En livraison" },
  { label: "Livrée", value: "Livrée" },
];

export const Route = createFileRoute("/livraisons/$id")({
  head: ({ params }) => ({
    meta: [
      { title: `Livraison ${params.id} — Gestion SINMAT` },
      { name: "description", content: "Fiche livraison SINMAT : tournée, créneau et statut." },
      { property: "og:title", content: `Livraison ${params.id} — Gestion SINMAT` },
      { property: "og:description", content: "Détail d'une livraison." },
    ],
  }),
  component: FicheLivraison,
});

function FicheLivraison() {
  const { id } = Route.useParams();
  const s = useSinmat();

  const livraison = s.livraisons.find((l) => l.id === id);
  if (!livraison) {
    return (
      <div className="p-6">
        <VideEtat titre="Livraison introuvable" description="Cette livraison n'existe pas." />
      </div>
    );
  }

  const client = s.clients.find((c) => c.id === livraison.clientId);

  const avancer = () => {
    const idx = ETAPES.findIndex((e) => e.value === livraison.statut);
    const next = ETAPES[idx + 1];
    if (next) {
      s.majStatutLivraison(livraison.id, next.value as typeof livraison.statut);
      toast.success(`Livraison ${next.value.toLowerCase()}`, { description: `Statut mis à jour : ${next.label}` });
    }
  };

  return (
    <div>
      <EnTeteDetail
        retour={{ to: "/livraisons", libelle: "Livraisons" }}
        titre={livraison.id}
        badges={<Statut valeur={livraison.statut} />}
        sousTitre={`${client?.nom ?? "—"} · ${livraison.ville}`}
        actions={
          <>
            <Lien to={livraison.origineType === "Vente" ? `/ventes/${livraison.origineId}` : `/locations/${livraison.origineId}`}>
              <Button variant="outline" size="sm">Voir la {livraison.origineType.toLowerCase()}</Button>
            </Lien>
            {livraison.statut !== "Livrée" && (
              <Button size="sm" onClick={avancer}>Avancer</Button>
            )}
          </>
        }
      />

      <div className="grid gap-5 p-6 lg:grid-cols-3">
        <div className="space-y-5 lg:col-span-2">
          <Panneau titre="Suivi">
            <RailStatut
              etapes={ETAPES.map((e) => e.label)}
              courante={ETAPES.findIndex((e) => e.value === livraison.statut)}
            />
          </Panneau>

          <Panneau titre="Détails">
            <Infos
              donnees={[
                { label: "Chantier", valeur: livraison.chantier },
                { label: "Adresse", valeur: livraison.adresse || "—" },
                { label: "Ville", valeur: livraison.ville },
                { label: "Date", valeur: formatDate(livraison.date) },
                { label: "Créneau", valeur: livraison.creneau },
                { label: "Chauffeur", valeur: livraison.chauffeur },
                { label: "Véhicule", valeur: livraison.vehicule },
                { label: "Notes", valeur: livraison.notes || "—" },
              ]}
            />
          </Panneau>
        </div>

        <div className="space-y-5">
          <Panneau titre="Client">
            <Infos
              donnees={[
                { label: "Nom", valeur: client?.nom ?? "—" },
                { label: "Ville", valeur: client?.ville ?? "—" },
                { label: "Téléphone", valeur: client?.telephone ?? "—" },
              ]}
            />
          </Panneau>

          <Panneau titre="Documents liés">
            <DocumentsLies
              elements={[
                { label: livraison.origineType, ref: livraison.origineId, to: livraison.origineType === "Vente" ? `/ventes/${livraison.origineId}` : `/locations/${livraison.origineId}` },
              ]}
            />
          </Panneau>
        </div>
      </div>
    </div>
  );
}
