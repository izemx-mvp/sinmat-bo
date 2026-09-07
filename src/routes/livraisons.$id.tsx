import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { DocumentsLies, EnTeteDetail, Infos, Panneau, RailStatut, Statut, VideEtat } from "@/components/app/ui-kit";
import { Lien } from "@/components/app/nav";
import { useSinmat } from "@/data/store";
import { formatDate } from "@/data/sinmat";

const ETAPES: Array<{ label: string; value: string }> = [
  { label: "À préparer", value: "À préparer" },
  { label: "Prête", value: "Prête" },
  { label: "En route", value: "En route" },
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
  const commande = s.commandes.find((c) => c.id === livraison.commandeId);

  const avancer = () => {
    const idx = ETAPES.findIndex((e) => e.value === livraison.statut);
    const next = ETAPES[idx + 1];
    if (next) {
      s.majStatutLivraison(livraison.id, next.value as typeof livraison.statut);
      toast.success(`Livraison ${next.value.toLowerCase()}`, { description: `Statut mis à jour : ${next.label}` });
    }
  };

  const annuler = () => {
    s.majStatutLivraison(livraison.id, "Annulée");
    toast.info("Livraison annulée");
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
            {commande && (
              <Lien to={`/commandes/${commande.id}`}>
                <Button variant="outline" size="sm">Voir la commande</Button>
              </Lien>
            )}
            {livraison.statut !== "Livrée" && livraison.statut !== "Annulée" && (
              <Button size="sm" onClick={avancer}>Avancer</Button>
            )}
            {livraison.statut !== "Livrée" && livraison.statut !== "Annulée" && (
              <Button variant="outline" size="sm" className="text-destructive hover:bg-destructive/10" onClick={annuler}>Annuler</Button>
            )}
          </>
        }
      />

      <div className="grid gap-5 p-6 lg:grid-cols-3">
        <div className="space-y-5 lg:col-span-2">
          <Panneau titre="Suivi">
            <RailStatut
              etapes={ETAPES.map((e) => e.label)}
              actif={ETAPES.findIndex((e) => e.value === livraison.statut)}
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
                ...(commande ? [{ label: "Commande", ref: commande.id, to: `/commandes/${commande.id}` }] : []),
              ]}
            />
          </Panneau>
        </div>
      </div>
    </div>
  );
}
