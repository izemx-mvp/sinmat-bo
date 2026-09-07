import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { RotateCcw, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Cellule, Kpi, Ligne, Onglets, Panneau, Statut, Tableau, VideEtat } from "@/components/app/ui-kit";
import { Lien } from "@/components/app/nav";
import { useSinmat } from "@/data/store";
import { formatDH, formatDate, produits } from "@/data/sinmat";

export const Route = createFileRoute("/retours/")({
  head: () => ({
    meta: [
      { title: "Retours — Gestion SINMAT" },
      { name: "description", content: "Suivi des retours de matériel en location SINMAT : inspection, frais et clôture." },
      { property: "og:title", content: "Retours — Gestion SINMAT" },
      { property: "og:description", content: "Inspection des retours de location." },
    ],
  }),
  component: PageRetours,
});

const TABS = ["Tous", "Planifiés", "Reçus", "Clôturés"];

function PageRetours() {
  const { retours, clients } = useSinmat();
  const [tab, setTab] = useState("Tous");
  const [q, setQ] = useState("");

  const filtres = useMemo(() => {
    const t = q.trim().toLowerCase();
    return retours.filter((r) => {
      const client = clients.find((c) => c.id === r.clientId)?.nom ?? "";
      const produit = produits.find((p) => p.id === r.produitId)?.nom ?? "";
      if (t && !`${r.id} ${client} ${produit}`.toLowerCase().includes(t)) return false;
      if (tab === "Tous") return true;
      return r.statut === tab.slice(0, -1) || r.statut === tab;
    });
  }, [retours, clients, tab, q]);

  const totalFrais = retours.reduce((s, r) => s + r.fraisSupplementaires, 0);
  const compteurs = {
    Tous: retours.length,
    Planifiés: retours.filter((r) => r.statut === "Planifié").length,
    Reçus: retours.filter((r) => r.statut === "Reçu").length,
    Clôturés: retours.filter((r) => r.statut === "Clôturé").length,
  };

  return (
    <div className="space-y-5 p-6">
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <Kpi libelle="Retours" valeur={String(retours.length)} ton="info" icone={RotateCcw} />
        <Kpi libelle="Planifiés" valeur={String(compteurs.Planifiés)} ton="attention" />
        <Kpi libelle="Reçus" valeur={String(compteurs.Reçus)} ton="succes" />
        <Kpi libelle="Frais totaux" valeur={formatDH(totalFrais)} ton="danger" />
      </div>

      <Panneau bodyClassName="p-0">
        <div className="flex flex-wrap items-center justify-between gap-3 px-4 pt-3">
          <Onglets valeurs={TABS} actif={tab} onChange={setTab} compteurs={compteurs} />
          <div className="relative pb-2">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Rechercher un retour..." className="h-9 w-[260px] pl-8 text-[13px]" />
          </div>
        </div>

        {filtres.length === 0 ? (
          <div className="p-6">
            <VideEtat titre="Aucun retour" description="Aucun retour ne correspond à votre recherche." />
          </div>
        ) : (
          <Tableau colonnes={["Référence", "Client", "Matériel", "Retour prévu", "Retour réel", "État", "Frais", "Statut"]}>
            {filtres.map((r) => {
              const client = clients.find((c) => c.id === r.clientId);
              const produit = produits.find((p) => p.id === r.produitId);
              return (
                <Ligne key={r.id} to={`/retours/${r.id}`}>
                  <Cellule num className="font-semibold">{r.id}</Cellule>
                  <Cellule className="max-w-[220px]">
                    <span className="block truncate font-semibold text-foreground">{client?.nom ?? "—"}</span>
                    <span className="block text-[11.5px] text-muted-foreground">{client?.ville ?? "—"}</span>
                  </Cellule>
                  <Cellule className="max-w-[220px] truncate">{produit?.nom ?? "—"}</Cellule>
                  <Cellule className="text-muted-foreground">{formatDate(r.retourPrevu)}</Cellule>
                  <Cellule className="text-muted-foreground">{r.retourReel ? formatDate(r.retourReel) : "—"}</Cellule>
                  <Cellule>{r.etat}</Cellule>
                  <Cellule num>{formatDH(r.fraisSupplementaires)}</Cellule>
                  <Cellule>
                    <Statut valeur={r.statut} />
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
