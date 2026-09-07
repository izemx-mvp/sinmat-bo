import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Cellule, Kpi, Ligne, Onglets, Panneau, Statut, Tableau, VideEtat } from "@/components/app/ui-kit";
import { Lien } from "@/components/app/nav";
import { useSinmat } from "@/data/store";
import { formatDate } from "@/data/sinmat";

export const Route = createFileRoute("/livraisons/")({
  head: () => ({
    meta: [
      { title: "Livraisons — Gestion SINMAT" },
      { name: "description", content: "Planification et suivi des livraisons SINMAT : tournées, chauffeurs et statuts." },
      { property: "og:title", content: "Livraisons — Gestion SINMAT" },
      { property: "og:description", content: "Planning des livraisons et retours." },
    ],
  }),
  component: PageLivraisons,
});

const TABS = ["Toutes", "À préparer", "Prête", "En route", "Livrée", "Annulée"];

function PageLivraisons() {
  const { livraisons, clients } = useSinmat();
  const [tab, setTab] = useState("Toutes");
  const [q, setQ] = useState("");

  const filtres = useMemo(() => {
    const t = q.trim().toLowerCase();
    return livraisons.filter((l) => {
      const client = clients.find((c) => c.id === l.clientId)?.nom ?? "";
      if (t && !`${l.id} ${client} ${l.chantier} ${l.ville}`.toLowerCase().includes(t)) return false;
      if (tab === "Toutes") return true;
      return l.statut === tab;
    });
  }, [livraisons, clients, tab, q]);

  const compteurs = {
    Toutes: livraisons.length,
    "À préparer": livraisons.filter((l) => l.statut === "À préparer").length,
    Prête: livraisons.filter((l) => l.statut === "Prête").length,
    "En route": livraisons.filter((l) => l.statut === "En route").length,
    Livrée: livraisons.filter((l) => l.statut === "Livrée").length,
    Annulée: livraisons.filter((l) => l.statut === "Annulée").length,
  };

  return (
    <div className="space-y-5 p-6">
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <Kpi libelle="Livraisons" valeur={String(livraisons.length)} ton="info" icone={Truck} />
        <Kpi libelle="À préparer" valeur={String(compteurs["À préparer"])} ton="attention" />
        <Kpi libelle="En route" valeur={String(compteurs["En route"])} ton="accent" />
        <Kpi libelle="Livrées" valeur={String(compteurs.Livrée)} ton="succes" />
      </div>

      <Panneau bodyClassName="p-0">
        <div className="flex flex-wrap items-center justify-between gap-3 px-4 pt-3">
          <Onglets valeurs={TABS} actif={tab} onChange={setTab} compteurs={compteurs} />
          <div className="relative pb-2">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Rechercher une livraison..." className="h-9 w-[260px] pl-8 text-[13px]" />
          </div>
        </div>

        {filtres.length === 0 ? (
          <div className="p-6">
            <VideEtat titre="Aucune livraison" description="Aucune livraison ne correspond à votre recherche." />
          </div>
        ) : (
          <Tableau colonnes={["Référence", "Client", "Chantier", "Ville", "Date", "Créneau", "Chauffeur", "Statut"]}>
            {filtres.map((l) => {
              const client = clients.find((c) => c.id === l.clientId);
              return (
                <Ligne key={l.id} to={`/livraisons/${l.id}`}>
                  <Cellule num className="font-semibold">{l.id}</Cellule>
                  <Cellule className="max-w-[220px]">
                    <span className="block truncate font-semibold text-foreground">{client?.nom ?? "—"}</span>
                    <span className="block text-[11.5px] text-muted-foreground">{client?.ville ?? "—"}</span>
                  </Cellule>
                  <Cellule className="max-w-[220px] truncate">{l.chantier}</Cellule>
                  <Cellule>{l.ville}</Cellule>
                  <Cellule className="text-muted-foreground">{formatDate(l.date)}</Cellule>
                  <Cellule>{l.creneau}</Cellule>
                  <Cellule className="text-muted-foreground">{l.chauffeur}</Cellule>
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
