import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { CalendarRange, Plus, Search } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Cellule, Kpi, Ligne, Onglets, Panneau, Statut, Tableau, VideEtat } from "@/components/app/ui-kit";
import { Lien } from "@/components/app/nav";
import { useSinmat } from "@/data/store";
import { formatDH, formatDate, produits } from "@/data/sinmat";

export const Route = createFileRoute("/locations/")({
  head: () => ({
    meta: [
      { title: "Locations — Gestion SINMAT" },
      { name: "description", content: "Suivi du parc de matériel en location SINMAT : retours, retards et disponibilités." },
      { property: "og:title", content: "Locations — Gestion SINMAT" },
      { property: "og:description", content: "Parc en location et planning de retours." },
    ],
  }),
  component: PageLocations,
});

const TABS = ["Toutes", "Réservées", "En cours", "Retour proche", "En retard", "Terminées"];

function PageLocations() {
  const { locations, clients } = useSinmat();
  const [tab, setTab] = useState("Toutes");
  const [q, setQ] = useState("");

  const filtres = useMemo(() => {
    const t = q.trim().toLowerCase();
    return locations.filter((l) => {
      const client = clients.find((c) => c.id === l.clientId)?.nom ?? "";
      const produit = produits.find((p) => p.id === l.produitId)?.nom ?? "";
      if (t && !`${l.id} ${client} ${produit} ${l.ville}`.toLowerCase().includes(t)) return false;
      if (tab === "Toutes") return true;
      return l.statut === tab.slice(0, -1) || l.statut === tab;
    });
  }, [locations, clients, tab, q]);

  const total = locations.reduce((s, l) => s + l.montant, 0);
  const enCours = locations.filter((l) => l.statut === "En cours" || l.statut === "Réservée");
  const retards = locations.filter((l) => l.statut === "En retard");

  const compteurs = {
    Toutes: locations.length,
    Réservées: locations.filter((l) => l.statut === "Réservée").length,
    "En cours": locations.filter((l) => l.statut === "En cours").length,
    "Retour proche": locations.filter((l) => l.statut === "Retour proche").length,
    "En retard": locations.filter((l) => l.statut === "En retard").length,
    Terminées: locations.filter((l) => l.statut === "Terminée").length,
  };

  return (
    <div className="space-y-5 p-6">
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <Kpi libelle="Locations" valeur={String(locations.length)} ton="info" icone={CalendarRange} />
        <Kpi libelle="Valeur totale" valeur={formatDH(total)} ton="accent" />
        <Kpi libelle="En cours / réservées" valeur={String(enCours.length)} ton="succes" />
        <Kpi libelle="Retards" valeur={String(retards.length)} detail={`${formatDH(retards.reduce((s, l) => s + l.montant, 0))}`} ton="danger" />
      </div>

      <Panneau bodyClassName="p-0">
        <div className="flex flex-wrap items-center justify-between gap-3 px-4 pt-3">
          <Onglets valeurs={TABS} actif={tab} onChange={setTab} compteurs={compteurs} />
          <div className="flex items-center gap-2 pb-2">
            <div className="relative">
              <Search className="pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
              <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Rechercher une location..." className="h-9 w-[240px] pl-8 text-[13px]" />
            </div>
            <Button size="sm" className="h-9 gap-1.5 font-semibold" onClick={() => toast.info("Créez une location depuis une commande.")}>
              <Plus className="size-4" /> Nouvelle location
            </Button>
          </div>
        </div>

        {filtres.length === 0 ? (
          <div className="p-6">
            <VideEtat titre="Aucune location" description="Aucune location ne correspond à votre recherche." />
          </div>
        ) : (
          <Tableau colonnes={["Référence", "Client", "Matériel", "Début", "Fin prévue", "Durée", "Montant", "Ville", "Statut"]}>
            {filtres.map((l) => {
              const client = clients.find((c) => c.id === l.clientId);
              const produit = produits.find((p) => p.id === l.produitId);
              return (
                <Ligne key={l.id} to={`/locations/${l.id}`}>
                  <Cellule num className="font-semibold">{l.id}</Cellule>
                  <Cellule className="max-w-[220px]">
                    <span className="block truncate font-semibold text-foreground">{client?.nom ?? "—"}</span>
                    <span className="block text-[11.5px] text-muted-foreground">{client?.ville ?? "—"}</span>
                  </Cellule>
                  <Cellule className="max-w-[220px] truncate">{produit?.nom ?? "—"}</Cellule>
                  <Cellule className="text-muted-foreground">{formatDate(l.debut)}</Cellule>
                  <Cellule className="text-muted-foreground">{formatDate(l.finPrevue)}</Cellule>
                  <Cellule num>{l.dureeJours} j</Cellule>
                  <Cellule num className="font-semibold">{formatDH(l.montant)}</Cellule>
                  <Cellule>{l.ville}</Cellule>
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
  );
}
