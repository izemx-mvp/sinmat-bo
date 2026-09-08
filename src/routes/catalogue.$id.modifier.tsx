import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { FormulaireProduit } from "@/components/app/FormulaireProduit";
import { useAller } from "@/components/app/nav";
import { VideEtat } from "@/components/app/ui-kit";
import { useSinmat } from "@/data/store";

export const Route = createFileRoute("/catalogue/$id/modifier")({
  head: ({ params }) => ({
    meta: [
      { title: `Modifier ${params.id} — Gestion SINMAT` },
      { name: "description", content: "Modifier une référence matériel du catalogue SINMAT." },
      { property: "og:title", content: `Modifier ${params.id} — Gestion SINMAT` },
      { property: "og:description", content: "Édition de la fiche produit." },
    ],
  }),
  component: ModifierProduit,
});

function ModifierProduit() {
  const { id } = Route.useParams();
  const { produits, majProduit } = useSinmat();
  const aller = useAller();
  const produit = produits.find((p) => p.id === id);

  if (!produit) {
    return (
      <div className="p-6">
        <VideEtat titre="Produit introuvable" description="Cette référence n'existe pas." />
      </div>
    );
  }

  return (
    <FormulaireProduit
      produit={produit}
      onAnnuler={() => aller(`/catalogue/${produit.id}`)}
      onEnregistrer={(valeurs) => {
        majProduit(produit.id, valeurs);
        toast.success("Produit mis à jour", { description: produit.nom });
        aller(`/catalogue/${produit.id}`);
      }}
    />
  );
}
