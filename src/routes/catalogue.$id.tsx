import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Archive, CalendarRange, Package, Pencil, RotateCcw, ShoppingCart, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Cellule,
  DocumentsLies,
  EnTeteDetail,
  Infos,
  Kpi,
  Ligne,
  Onglets,
  Panneau,
  Statut,
  Tableau,
  VideEtat,
} from "@/components/app/ui-kit";
import { Lien } from "@/components/app/nav";
import { useSinmat } from "@/data/store";
import { formatDH, formatDate } from "@/data/sinmat";

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

const TABS = ["Aperçu", "Tarification", "Stock", "Règles Agent IA", "Ventes", "Locations", "Documents", "Historique"];

function FicheProduit() {
  const { id } = Route.useParams();
  const { produits, locations, ventes, devis, clients, regles, audit, archiverProduit } = useSinmat();
  const [tab, setTab] = useState("Aperçu");

  const produit = produits.find((p) => p.id === id);
  if (!produit) {
    return (
      <div className="p-6">
        <VideEtat titre="Produit introuvable" description="Cette référence n'existe pas." />
      </div>
    );
  }

  const regle = regles.find((r) => r.produitId === produit.id);
  const locationsProduit = locations.filter((l) => l.produitId === produit.id);
  const ventesProduit = ventes.filter((v) => v.lignes.some((l) => l.produitId === produit.id));
  const devisProduit = devis.filter((d) => d.lignes.some((l) => l.produitId === produit.id));
  const historique = audit.filter((a) => a.cible === produit.id);
  const images = produit.images && produit.images.length > 0 ? produit.images : produit.image ? [produit.image] : [];
  const disponible = Math.max(0, produit.stock - produit.reserve - produit.enLocation - produit.maintenance);
  const nomClient = (cid: string) => clients.find((c) => c.id === cid)?.nom ?? "—";

  return (
    <div>
      <EnTeteDetail
        retour={{ to: "/catalogue", libelle: "Catalogue" }}
        titre={produit.nom}
        badges={
          <>
            <Statut valeur={produit.disponibilite} />
            {produit.archive && <Statut valeur="Archivé" ton="neutre" />}
          </>
        }
        sousTitre={`${produit.reference} · ${produit.categorie} · ${produit.fournisseur}`}
        actions={
          <>
            <Lien to={`/catalogue/${produit.id}/modifier`}>
              <Button variant="outline" size="sm" className="gap-1.5">
                <Pencil className="size-3.5" /> Modifier
              </Button>
            </Lien>
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5"
              onClick={() => {
                archiverProduit(produit.id, !produit.archive);
                toast.success(produit.archive ? "Produit réactivé" : "Produit archivé", { description: produit.nom });
              }}
            >
              {produit.archive ? <RotateCcw className="size-3.5" /> : <Archive className="size-3.5" />}
              {produit.archive ? "Réactiver" : "Archiver"}
            </Button>
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

      <div className="px-6 pt-4">
        <Onglets valeurs={TABS} actif={tab} onChange={setTab} />
      </div>

      <div className="grid gap-5 p-6 lg:grid-cols-3">
        <div className="space-y-5 lg:col-span-2">
          {tab === "Aperçu" && (
            <>
              {images.length > 0 ? (
                <div className="grid gap-3 sm:grid-cols-2">
                  <img
                    src={images[0]}
                    alt={`Photo principale de ${produit.nom}`}
                    className="panel aspect-video w-full object-cover sm:col-span-2"
                  />
                  {images.slice(1).map((src, i) => (
                    <img
                      key={i}
                      src={src}
                      alt={`Photo ${i + 2} de ${produit.nom}`}
                      className="panel aspect-video w-full object-cover"
                    />
                  ))}
                </div>
              ) : (
                <div className="panel flex aspect-video items-center justify-center bg-surface-muted/50">
                  <Package className="size-16 text-muted-foreground/40" />
                </div>
              )}

              <Panneau titre="Description">
                <p className="text-[13.5px] leading-relaxed text-foreground/85">
                  {produit.description || "Aucune description renseignée."}
                </p>
              </Panneau>

              <Panneau titre="Caractéristiques techniques">
                {produit.specs.length === 0 ? (
                  <VideEtat titre="Aucune caractéristique" description="Ajoutez-les via Modifier." />
                ) : (
                  <Infos
                    donnees={produit.specs.map((s) => ({
                      label: s.label,
                      valeur: `${s.valeur}${s.unite ? ` ${s.unite}` : ""}`,
                    }))}
                  />
                )}
              </Panneau>

              <Panneau titre="Logistique">
                <Infos
                  donnees={[
                    { label: "Poids", valeur: produit.poids ? `${produit.poids} kg` : "—" },
                    {
                      label: "Dimensions",
                      valeur:
                        produit.longueur || produit.largeur || produit.hauteur
                          ? `${produit.longueur ?? 0} × ${produit.largeur ?? 0} × ${produit.hauteur ?? 0} mm`
                          : "—",
                    },
                    { label: "Livraison", valeur: produit.livrable === false ? "Non" : "Oui" },
                    { label: "Notes", valeur: produit.infosLogistiques || "—" },
                  ]}
                />
              </Panneau>
            </>
          )}

          {tab === "Tarification" && (
            <>
              <Panneau titre="Vente">
                <Infos
                  donnees={[
                    { label: "Vente activée", valeur: produit.venteActive === false ? "Non" : "Oui" },
                    { label: "Prix de vente HT", valeur: formatDH(produit.prixVente) },
                    { label: "TVA", valeur: `${produit.tva ?? 20} %` },
                    { label: "Prix minimum", valeur: produit.prixMinimum ? formatDH(produit.prixMinimum) : "—" },
                    { label: "Remise max", valeur: produit.remiseMax ? `${produit.remiseMax} %` : "—" },
                  ]}
                />
              </Panneau>
              <Panneau titre="Location">
                <Infos
                  donnees={[
                    { label: "Location activée", valeur: produit.locationActive === false ? "Non" : "Oui" },
                    { label: "Unité principale", valeur: produit.uniteLocation ?? "Jour" },
                    { label: "Prix / jour", valeur: formatDH(produit.prixJour) },
                    { label: "Prix / semaine", valeur: formatDH(produit.prixSemaine) },
                    { label: "Prix / mois", valeur: formatDH(produit.prixMois) },
                  ]}
                />
              </Panneau>
            </>
          )}

          {tab === "Stock" && (
            <Panneau titre="État du stock">
              <Infos
                donnees={[
                  { label: "Stock total", valeur: String(produit.stock) },
                  { label: "Réservé", valeur: String(produit.reserve) },
                  { label: "En location", valeur: String(produit.enLocation) },
                  { label: "En maintenance", valeur: String(produit.maintenance) },
                  { label: "Disponible", valeur: String(disponible) },
                  { label: "Disponibilité", valeur: produit.disponibilite },
                ]}
              />
            </Panneau>
          )}

          {tab === "Règles Agent IA" && (
            <Panneau
              titre="Paramètres de qualification"
              action={
                <Lien to={`/qualification/${produit.id}`}>
                  <Button variant="outline" size="sm" className="gap-1.5">
                    <Sparkles className="size-3.5" /> Configurer
                  </Button>
                </Lien>
              }
            >
              {!regle ? (
                <VideEtat titre="Aucune règle" description="Ce produit n'a pas encore de règle Agent IA." />
              ) : (
                <Infos
                  donnees={[
                    { label: "Statut", valeur: regle.configureLe ? "Configuré" : "À configurer" },
                    { label: "Agent actif", valeur: regle.actif ? "Oui" : "Non" },
                    { label: "Vente", valeur: regle.venteActive ? "Activée" : "Désactivée" },
                    { label: "Location", valeur: regle.locationActive ? "Activée" : "Désactivée" },
                    { label: "Paliers location", valeur: String(regle.paliersLocation.length) },
                    { label: "Paliers vente", valeur: String(regle.paliersVente.length) },
                    { label: "Dernier enregistrement", valeur: regle.configureLe ? formatDate(regle.configureLe) : "—" },
                  ]}
                />
              )}
            </Panneau>
          )}

          {tab === "Ventes" && (
            <Panneau titre="Ventes du produit" bodyClassName="p-0">
              {ventesProduit.length === 0 ? (
                <div className="p-6">
                  <VideEtat titre="Aucune vente" description="Ce matériel n'a pas encore été vendu." />
                </div>
              ) : (
                <Tableau colonnes={["Vente", "Client", "Date", "Montant", "Statut"]}>
                  {ventesProduit.map((v) => (
                    <Ligne key={v.id} to={`/ventes/${v.id}`}>
                      <Cellule num className="font-semibold">{v.id}</Cellule>
                      <Cellule>{nomClient(v.clientId)}</Cellule>
                      <Cellule className="text-muted-foreground">{formatDate(v.date)}</Cellule>
                      <Cellule num>{formatDH(v.montant)}</Cellule>
                      <Cellule>
                        <Statut valeur={v.statut} />
                      </Cellule>
                    </Ligne>
                  ))}
                </Tableau>
              )}
            </Panneau>
          )}

          {tab === "Locations" && (
            <Panneau titre="Historique des locations" bodyClassName="p-0">
              {locationsProduit.length === 0 ? (
                <div className="p-6">
                  <VideEtat titre="Aucune location" description="Ce matériel n'a pas encore été loué." />
                </div>
              ) : (
                <Tableau colonnes={["Location", "Client", "Début", "Fin prévue", "Montant", "Statut"]}>
                  {locationsProduit.map((l) => (
                    <Ligne key={l.id} to={`/locations/${l.id}`}>
                      <Cellule num className="font-semibold">{l.id}</Cellule>
                      <Cellule>{nomClient(l.clientId)}</Cellule>
                      <Cellule className="text-muted-foreground">{formatDate(l.debut)}</Cellule>
                      <Cellule className="text-muted-foreground">{formatDate(l.finPrevue)}</Cellule>
                      <Cellule num>{formatDH(l.montant)}</Cellule>
                      <Cellule>
                        <Statut valeur={l.statut} />
                      </Cellule>
                    </Ligne>
                  ))}
                </Tableau>
              )}
            </Panneau>
          )}

          {tab === "Documents" && (
            <Panneau titre="Devis contenant ce produit" bodyClassName="p-0">
              {devisProduit.length === 0 ? (
                <div className="p-6">
                  <VideEtat titre="Aucun document" description="Aucun devis ne référence ce matériel." />
                </div>
              ) : (
                <Tableau colonnes={["Devis", "Client", "Date", "Montant", "Statut"]}>
                  {devisProduit.map((d) => (
                    <Ligne key={d.id} to={`/devis/${d.id}`}>
                      <Cellule num className="font-semibold">{d.id}</Cellule>
                      <Cellule>{nomClient(d.clientId)}</Cellule>
                      <Cellule className="text-muted-foreground">{formatDate(d.date)}</Cellule>
                      <Cellule num>{formatDH(d.montant)}</Cellule>
                      <Cellule>
                        <Statut valeur={d.statut} />
                      </Cellule>
                    </Ligne>
                  ))}
                </Tableau>
              )}
            </Panneau>
          )}

          {tab === "Historique" && (
            <Panneau titre="Historique du produit" bodyClassName="p-0">
              {historique.length === 0 ? (
                <div className="p-6">
                  <VideEtat
                    titre="Aucun événement"
                    description={`Créé le ${produit.creeLe ? formatDate(produit.creeLe) : "—"}`}
                  />
                </div>
              ) : (
                <Tableau colonnes={["Date", "Action", "Acteur", "Mode"]}>
                  {historique.map((a) => (
                    <Ligne key={a.id}>
                      <Cellule className="text-muted-foreground">{a.date.slice(0, 10)}</Cellule>
                      <Cellule>{a.action}</Cellule>
                      <Cellule>{a.acteur}</Cellule>
                      <Cellule>
                        <Statut valeur={a.mode} />
                      </Cellule>
                    </Ligne>
                  ))}
                </Tableau>
              )}
            </Panneau>
          )}
        </div>

        <div className="space-y-5">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
            <Kpi libelle="Prix de vente" valeur={formatDH(produit.prixVente)} ton="accent" />
            <Kpi libelle="Prix / jour" valeur={formatDH(produit.prixJour)} ton="info" />
            <Kpi libelle="Stock disponible" valeur={String(disponible)} ton={disponible > 3 ? "succes" : "attention"} />
            <Kpi libelle="En location" valeur={String(produit.enLocation)} ton="info" />
          </div>

          <Panneau titre="Identité produit">
            <Infos
              donnees={[
                { label: "Référence", valeur: produit.reference },
                { label: "Catégorie", valeur: produit.categorie },
                { label: "Sous-catégorie", valeur: produit.sousCategorie || "—" },
                { label: "Marque", valeur: produit.marque || "—" },
                { label: "Fournisseur", valeur: produit.fournisseur },
                { label: "Créé le", valeur: produit.creeLe ? formatDate(produit.creeLe) : "—" },
                { label: "Modifié le", valeur: produit.modifieLe ? formatDate(produit.modifieLe) : "—" },
              ]}
            />
          </Panneau>

          <Panneau titre="Documents liés">
            <DocumentsLies
              elements={[
                ...(devisProduit.length > 0 ? [{ label: "Devis", ref: String(devisProduit.length), to: "/devis" }] : []),
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
