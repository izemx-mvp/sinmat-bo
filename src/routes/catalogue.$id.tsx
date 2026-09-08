import { createFileRoute } from "@tanstack/react-router";
import { Package, ShoppingCart, CalendarRange } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Cellule, DocumentsLies, EnTeteDetail, Infos, Kpi, Ligne, Panneau, Statut, Tableau, VideEtat } from "@/components/app/ui-kit";
import { Lien } from "@/components/app/nav";
import { useSinmat } from "@/data/store";
import { formatDH, formatDate, type Produit } from "@/data/sinmat";

export const Route = createFileRoute("/catalogue/$id")({
  head: ({ params }) => ({
    meta: [
      { title: `Produit ${params.id} — Gestion SINMAT` },
      { name: "description", content: "Fiche produit SINMAT : caractéristiques, tarifs, stock et historique." },
      { property: "og:title", content: `Produit ${params.id} — Gestion SINMAT` },
      { property: "og:description", content: "Détail d'une référence matériel." },
    ],
  }),
  component: FicheProduit,
});

function FicheProduit() {
  const { id } = Route.useParams();
  const { produits, locations, ventes, clients } = useSinmat();

  const produit = produits.find((p) => p.id === id);
  if (!produit) {
    return (
      <div className="p-6">
        <VideEtat titre="Produit introuvable" description="Cette référence n'existe pas." />
      </div>
    );
  }

  const locationsProduit = locations.filter((l) => l.produitId === produit.id);
  const ventesProduit = ventes.filter((v) => v.lignes.some((l) => l.produitId === produit.id));

  return (
    <div>
      <EnTeteDetail
        retour={{ to: "/catalogue", libelle: "Catalogue" }}
        titre={produit.nom}
        badges={<Statut valeur={produit.disponibilite} />}
        sousTitre={`${produit.reference} · ${produit.categorie} · ${produit.fournisseur}`}
        actions={
          <>
            <Lien to="/devis/nouveau">
              <Button variant="outline" size="sm" className="gap-1.5">
                <ShoppingCart className="size-3.5" /> Devis
              </Button>
            </Lien>
            <Lien to="/locations">
              <Button size="sm" className="gap-1.5">
                <CalendarRange className="size-3.5" /> Location
              </Button>
            </Lien>
          </>
        }
      />

      <div className="grid gap-5 p-6 lg:grid-cols-3">
        <div className="space-y-5 lg:col-span-2">
          <div className="panel flex aspect-video items-center justify-center bg-surface-muted/50">
            <Package className="size-16 text-muted-foreground/40" />
          </div>

          <Panneau titre="Description">
            <p className="text-[13.5px] leading-relaxed text-foreground/85">{produit.description}</p>
          </Panneau>

          <Panneau titre="Historique des locations" bodyClassName="p-0">
            {locationsProduit.length === 0 ? (
              <div className="p-6">
                <VideEtat titre="Aucune location" description="Ce matériel n'a pas encore été loué." />
              </div>
            ) : (
              <Tableau colonnes={["Location", "Client", "Début", "Fin prévue", "Montant", "Statut"]}>
                {locationsProduit.map((l) => {
                  const client = clients.find((c) => c.id === l.clientId);
                  return (
                    <Ligne key={l.id} to={`/locations/${l.id}`}>
                      <Cellule num className="font-semibold">{l.id}</Cellule>
                      <Cellule>{client?.nom ?? "—"}</Cellule>
                      <Cellule className="text-muted-foreground">{formatDate(l.debut)}</Cellule>
                      <Cellule className="text-muted-foreground">{formatDate(l.finPrevue)}</Cellule>
                      <Cellule num>{formatDH(l.montant)}</Cellule>
                      <Cellule>
                        <Statut valeur={l.statut} />
                      </Cellule>
                    </Ligne>
                  );
                })}
              </Tableau>
            )}
          </Panneau>
        </div>

        <div className="space-y-5">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
            <Kpi libelle="Prix de vente" valeur={formatDH(produit.prixVente)} ton="accent" />
            <Kpi libelle="Prix / jour" valeur={formatDH(produit.prixJour)} ton="info" />
            <Kpi libelle="Stock disponible" valeur={String(produit.stock)} ton={produit.stock > 3 ? "succes" : "attention"} />
            <Kpi libelle="En location" valeur={String(produit.enLocation)} ton="info" />
          </div>

          <Panneau titre="Caractéristiques">
            <Infos
              donnees={produit.specs.map((s) => ({ label: s.label, valeur: s.valeur }))}
            />
          </Panneau>

          <Panneau titre="Tarifs">
            <Infos
              donnees={[
                { label: "Vente", valeur: formatDH(produit.prixVente) },
                { label: "Location / jour", valeur: formatDH(produit.prixJour) },
                { label: "Location / semaine", valeur: formatDH(produit.prixSemaine) },
                { label: "Location / mois", valeur: formatDH(produit.prixMois) },
              ]}
            />
          </Panneau>

          <Panneau titre="Documents liés">
            <DocumentsLies
              elements={[
                ...(ventesProduit.length > 0 ? [{ label: "Ventes", ref: String(ventesProduit.length), to: "/ventes" }] : []),
                ...(locationsProduit.length > 0 ? [{ label: "Locations", ref: String(locationsProduit.length), to: "/locations" }] : []),
              ]}
            />
          </Panneau>
        </div>
      </div>
    </div>
  );
}
