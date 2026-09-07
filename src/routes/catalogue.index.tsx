import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Package, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Cellule, Kpi, Ligne, Onglets, Panneau, Statut, Tableau, VideEtat } from "@/components/app/ui-kit";
import { Lien } from "@/components/app/nav";
import { useSinmat } from "@/data/store";
import { formatDH } from "@/data/sinmat";

export const Route = createFileRoute("/catalogue/")({
  head: () => ({
    meta: [
      { title: "Catalogue — Gestion SINMAT" },
      { name: "description", content: "Matériel disponible à la vente et à la location chez SINMAT." },
      { property: "og:title", content: "Catalogue — Gestion SINMAT" },
      { property: "og:description", content: "Parc matériel, stock et tarifs." },
    ],
  }),
  component: PageCatalogue,
});

const TABS = ["Tous", "Terrassement", "Démolition", "Béton", "Énergie", "Compactage", "Accès", "Découpe"];

function PageCatalogue() {
  const { produits } = useSinmat();
  const [tab, setTab] = useState("Tous");
  const [q, setQ] = useState("");

  const filtres = useMemo(() => {
    const t = q.trim().toLowerCase();
    return produits.filter((p) => {
      if (t && !`${p.nom} ${p.reference} ${p.categorie}`.toLowerCase().includes(t)) return false;
      if (tab === "Tous") return true;
      return p.categorie === tab;
    });
  }, [produits, tab, q]);

  const compteurs = Object.fromEntries(TABS.map((t) => [t, t === "Tous" ? produits.length : produits.filter((p) => p.categorie === t).length]));

  return (
    <div className="space-y-5 p-6">
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <Kpi libelle="Références" valeur={String(produits.length)} ton="info" icone={Package} />
        <Kpi libelle="Disponibles" valeur={String(produits.filter((p) => p.disponibilite === "Disponible").length)} ton="succes" />
        <Kpi libelle="Stock faible" valeur={String(produits.filter((p) => p.disponibilite === "Stock faible").length)} ton="attention" />
        <Kpi libelle="Indisponibles" valeur={String(produits.filter((p) => p.disponibilite === "Indisponible").length)} ton="danger" />
      </div>

      <Panneau bodyClassName="p-0">
        <div className="flex flex-wrap items-center justify-between gap-3 px-4 pt-3">
          <Onglets valeurs={TABS} actif={tab} onChange={setTab} compteurs={compteurs} />
          <div className="relative pb-2">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Rechercher un produit..." className="h-9 w-[260px] pl-8 text-[13px]" />
          </div>
        </div>

        {filtres.length === 0 ? (
          <div className="p-6">
            <VideEtat titre="Aucun produit" description="Aucun produit ne correspond à votre recherche." />
          </div>
        ) : (
          <Tableau colonnes={["Référence", "Produit", "Catégorie", "Prix vente", "Prix / jour", "Stock", "Location", "Dispo.", "Fournisseur"]}>
            {filtres.map((p) => (
              <Ligne key={p.id} to={`/catalogue/${p.id}`}>
                <Cellule num className="font-semibold">{p.reference}</Cellule>
                <Cellule className="max-w-[300px]">
                  <span className="block truncate font-semibold text-foreground">{p.nom}</span>
                  <span className="block text-[11.5px] text-muted-foreground">{p.id}</span>
                </Cellule>
                <Cellule className="text-muted-foreground">{p.categorie}</Cellule>
                <Cellule num>{formatDH(p.prixVente)}</Cellule>
                <Cellule num>{formatDH(p.prixJour)}</Cellule>
                <Cellule num>{p.stock}</Cellule>
                <Cellule num>{p.enLocation}</Cellule>
                <Cellule>
                  <Statut valeur={p.disponibilite} />
                </Cellule>
                <Cellule className="text-muted-foreground">{p.fournisseur}</Cellule>
              </Ligne>
            ))}
          </Tableau>
        )}
      </Panneau>
    </div>
  );
}
