import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Cellule, Kpi, Ligne, Onglets, Panneau, Statut, Tableau, VideEtat } from "@/components/app/ui-kit";
import { Lien } from "@/components/app/nav";
import { useSinmat } from "@/data/store";
import { formatDH, formatDate } from "@/data/sinmat";

export const Route = createFileRoute("/ventes/")({
  head: () => ({
    meta: [
      { title: "Ventes — Gestion SINMAT" },
      { name: "description", content: "Suivi des ventes de matériel SINMAT : commandes, clients et statuts." },
      { property: "og:title", content: "Ventes — Gestion SINMAT" },
      { property: "og:description", content: "Historique des ventes de matériel." },
    ],
  }),
  component: PageVentes,
});

const TABS = ["Toutes", "Confirmées", "En préparation", "Payées", "Livrées"];

function PageVentes() {
  const { ventes, clients, commandes } = useSinmat();
  const [tab, setTab] = useState("Toutes");
  const [q, setQ] = useState("");

  const filtres = useMemo(() => {
    const t = q.trim().toLowerCase();
    return ventes.filter((v) => {
      const client = clients.find((c) => c.id === v.clientId)?.nom ?? "";
      if (t && !`${v.id} ${client}`.toLowerCase().includes(t)) return false;
      if (tab === "Toutes") return true;
      if (tab === "Confirmées") return v.statut === "Confirmée";
      if (tab === "En préparation") return v.statut === "En préparation";
      if (tab === "Payées") return v.statut === "Payée";
      return v.statut === "Livrée";
    });
  }, [ventes, clients, tab, q]);

  const total = ventes.reduce((s, v) => s + v.montant, 0);
  const compteurs = {
    Toutes: ventes.length,
    Confirmées: ventes.filter((v) => v.statut === "Confirmée").length,
    "En préparation": ventes.filter((v) => v.statut === "En préparation").length,
    Payées: ventes.filter((v) => v.statut === "Payée").length,
    Livrées: ventes.filter((v) => v.statut === "Livrée").length,
  };

  return (
    <div className="space-y-5 p-6">
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <Kpi libelle="Ventes" valeur={String(ventes.length)} ton="info" icone={ShoppingCart} />
        <Kpi libelle="Montant total" valeur={formatDH(total)} ton="accent" />
        <Kpi libelle="Payées" valeur={formatDH(ventes.filter((v) => v.statut === "Payée").reduce((s, v) => s + v.montant, 0))} ton="succes" />
        <Kpi libelle="À livrer" valeur={String(ventes.filter((v) => v.statut === "En préparation").length)} ton="attention" />
      </div>

      <Panneau bodyClassName="p-0">
        <div className="flex flex-wrap items-center justify-between gap-3 px-4 pt-3">
          <Onglets valeurs={TABS} actif={tab} onChange={setTab} compteurs={compteurs} />
          <div className="flex items-center gap-2 pb-2">
            <div className="relative">
              <Search className="pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
              <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Rechercher une vente..." className="h-9 w-[240px] pl-8 text-[13px]" />
            </div>
            <Lien to="/devis/nouveau">
              <Button size="sm" className="h-9 gap-1.5 font-semibold">Nouvelle vente</Button>
            </Lien>
          </div>
        </div>

        {filtres.length === 0 ? (
          <div className="p-6">
            <VideEtat titre="Aucune vente" description="Aucune vente ne correspond à votre recherche." />
          </div>
        ) : (
          <Tableau colonnes={["Référence", "Client", "Commande", "Date", "Montant", "Statut"]}>
            {filtres.map((v) => {
              const client = clients.find((c) => c.id === v.clientId);
              const commande = commandes.find((c) => c.id === v.commandeId);
              return (
                <Ligne key={v.id} to={`/ventes/${v.id}`}>
                  <Cellule num className="font-semibold">{v.id}</Cellule>
                  <Cellule className="max-w-[260px]">
                    <span className="block truncate font-semibold text-foreground">{client?.nom ?? "—"}</span>
                    <span className="block text-[11.5px] text-muted-foreground">{client?.ville ?? "—"}</span>
                  </Cellule>
                  <Cellule num>{v.commandeId}</Cellule>
                  <Cellule className="text-muted-foreground">{formatDate(v.date)}</Cellule>
                  <Cellule num className="font-semibold">{formatDH(v.montant)}</Cellule>
                  <Cellule>
                    <Statut valeur={v.statut} />
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
