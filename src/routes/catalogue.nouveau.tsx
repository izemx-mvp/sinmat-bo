import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { FormulaireProduit } from "@/components/app/FormulaireProduit";
import { useAller } from "@/components/app/nav";
import { useSinmat } from "@/data/store";

export const Route = createFileRoute("/catalogue/nouveau")({
  head: () => ({
    meta: [
      { title: "Nouveau matériel — Gestion SINMAT" },
      { name: "description", content: "Créer une nouvelle référence matériel au catalogue SINMAT." },
      { property: "og:title", content: "Nouveau matériel — Gestion SINMAT" },
      { property: "og:description", content: "Formulaire de création produit." },
    ],
  }),
  component: NouveauProduit,
});

function NouveauProduit() {
  const { ajouterProduit } = useSinmat();
  const aller = useAller();

  return (
    <FormulaireProduit
      onAnnuler={() => aller("/catalogue")}
      onEnregistrer={(valeurs) => {
        const p = ajouterProduit(valeurs);
        toast.success("Produit créé", { description: `${p.nom} — ${p.reference}` });
        aller(`/catalogue/${p.id}`);
      }}
    />
  );
}
