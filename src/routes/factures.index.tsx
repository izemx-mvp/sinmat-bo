import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Plus, Receipt, Search } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Cellule, Kpi, Ligne, Onglets, Panneau, Statut, Tableau, VideEtat } from "@/components/app/ui-kit";
import { Lien } from "@/components/app/nav";
import { useSinmat } from "@/data/store";
import { formatDH, formatDate } from "@/data/sinmat";

export const Route = createFileRoute("/factures/")({
  head: () => ({
    meta: [
      { title: "Factures — Gestion SINMAT" },
      { name: "description", content: "Suivi de facturation client SINMAT : émises, payées, partielles et retards." },
      { property: "og:title", content: "Factures — Gestion SINMAT" },
      { property: "og:description", content: "Facturation et règlements clients." },
    ],
  }),
  component: PageFactures,
});

const TABS = ["Toutes", "Brouillons", "Émises", "Partielles", "Payées", "En retard"];

function PageFactures() {
  const { factures, clients } = useSinmat();
  const [tab, setTab] = useState("Toutes");
  const [q, setQ] = useState("");

  const filtres = useMemo(() => {
    const t = q.trim().toLowerCase();
    return factures.filter((f) => {
      const client = clients.find((c) => c.id === f.clientId)?.nom ?? "";
      if (t && !`${f.id} ${client}`.toLowerCase().includes(t)) return false;
      if (tab === "Toutes") return true;
      if (tab === "Brouillons") return f.statut === "Brouillon";
      if (tab === "Émises") return f.statut === "Émise";
      if (tab === "Partielles") return f.statut === "Partiellement payée";
      if (tab === "Payées") return f.statut === "Payée";
      return f.statut === "En retard";
    });
  }, [factures, clients, tab, q]);

  const total = factures.reduce((s, f) => s + f.ttc, 0);
  const resteDu = factures.reduce((s, f) => s + Math.max(0, f.ttc - f.paye), 0);
  const enRetard = factures.filter((f) => f.statut === "En retard");

  const compteurs = {
    Toutes: factures.length,
    Brouillons: factures.filter((f) => f.statut === "Brouillon").length,
    Émises: factures.filter((f) => f.statut === "Émise").length,
    Partielles: factures.filter((f) => f.statut === "Partiellement payée").length,
    Payées: factures.filter((f) => f.statut === "Payée").length,
    "En retard": factures.filter((f) => f.statut === "En retard").length,
  };

  return (
    <div className="space-y-5 p-6">
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <Kpi libelle="Factures" valeur={String(factures.length)} ton="info" icone={Receipt} />
        <Kpi libelle="Montant total" valeur={formatDH(total)} ton="accent" />
        <Kpi libelle="Reste dû" valeur={formatDH(resteDu)} detail="Factures non soldées" ton="attention" />
        <Kpi libelle="En retard" valeur={String(enRetard.length)} detail={formatDH(enRetard.reduce((s, f) => s + Math.max(0, f.ttc - f.paye), 0))} ton="danger" />
      </div>

      <Panneau bodyClassName="p-0">
        <div className="flex flex-wrap items-center justify-between gap-3 px-4 pt-3">
          <Onglets valeurs={TABS} actif={tab} onChange={setTab} compteurs={compteurs} />
          <div className="flex items-center gap-2 pb-2">
            <div className="relative">
              <Search className="pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
              <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Rechercher une facture..." className="h-9 w-[240px] pl-8 text-[13px]" />
            </div>
            <Button size="sm" className="h-9 gap-1.5 font-semibold" onClick={() => toast.info("Créez une facture depuis une commande.")}>
              <Plus className="size-4" /> Nouvelle facture
            </Button>
          </div>
        </div>

        {filtres.length === 0 ? (
          <div className="p-6">
            <VideEtat titre="Aucune facture" description="Aucune facture ne correspond à votre recherche." />
          </div>
        ) : (
          <Tableau colonnes={["Référence", "Client", "Date", "Échéance", "Montant TTC", "Payé", "Reste dû", "Statut"]}>
            {filtres.map((f) => {
              const client = clients.find((c) => c.id === f.clientId);
              return (
                <Ligne key={f.id} to={`/factures/${f.id}`}>
                  <Cellule num className="font-semibold">{f.id}</Cellule>
                  <Cellule className="max-w-[260px]">
                    <span className="block truncate font-semibold text-foreground">{client?.nom ?? "—"}</span>
                    <span className="block text-[11.5px] text-muted-foreground">{client?.ville ?? "—"}</span>
                  </Cellule>
                  <Cellule className="text-muted-foreground">{formatDate(f.date)}</Cellule>
                  <Cellule className="text-muted-foreground">{formatDate(f.echeance)}</Cellule>
                  <Cellule num>{formatDH(f.ttc)}</Cellule>
                  <Cellule num>{formatDH(f.paye)}</Cellule>
                  <Cellule num className="font-semibold">{formatDH(Math.max(0, f.ttc - f.paye))}</Cellule>
                  <Cellule>
                    <Statut valeur={f.statut} />
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
