import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search, Wallet } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Cellule, Kpi, Ligne, Onglets, Panneau, Statut, Tableau, VideEtat } from "@/components/app/ui-kit";
import { Lien } from "@/components/app/nav";
import { useSinmat } from "@/data/store";
import { formatDH, formatDate } from "@/data/sinmat";

export const Route = createFileRoute("/paiements/")({
  head: () => ({
    meta: [
      { title: "Paiements — Gestion SINMAT" },
      { name: "description", content: "Suivi des encaissements SINMAT : virements, chèques, espèces et cartes." },
      { property: "og:title", content: "Paiements — Gestion SINMAT" },
      { property: "og:description", content: "Encaissements clients et modes de règlement." },
    ],
  }),
  component: PagePaiements,
});

const TABS = ["Tous", "Virements", "Chèques", "Espèces", "Cartes"];

function PagePaiements() {
  const { paiements, clients } = useSinmat();
  const [tab, setTab] = useState("Tous");
  const [q, setQ] = useState("");

  const filtres = useMemo(() => {
    const t = q.trim().toLowerCase();
    return paiements.filter((p) => {
      const client = clients.find((c) => c.id === p.clientId)?.nom ?? "";
      if (t && !`${p.id} ${client} ${p.reference}`.toLowerCase().includes(t)) return false;
      if (tab === "Tous") return true;
      return p.mode === tab.slice(0, -1);
    });
  }, [paiements, clients, tab, q]);

  const total = paiements.reduce((s, p) => s + p.montant, 0);
  const parMode = (mode: string) => paiements.filter((p) => p.mode === mode).reduce((s, p) => s + p.montant, 0);

  const compteurs = {
    Tous: paiements.length,
    Virements: paiements.filter((p) => p.mode === "Virement").length,
    Chèques: paiements.filter((p) => p.mode === "Chèque").length,
    Espèces: paiements.filter((p) => p.mode === "Espèces").length,
    Cartes: paiements.filter((p) => p.mode === "Carte").length,
  };

  return (
    <div className="space-y-5 p-6">
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <Kpi libelle="Paiements reçus" valeur={String(paiements.length)} ton="succes" icone={Wallet} />
        <Kpi libelle="Montant total" valeur={formatDH(total)} ton="accent" />
        <Kpi libelle="Virements" valeur={formatDH(parMode("Virement"))} ton="info" />
        <Kpi libelle="Chèques" valeur={formatDH(parMode("Chèque"))} ton="attention" />
      </div>

      <Panneau bodyClassName="p-0">
        <div className="flex flex-wrap items-center justify-between gap-3 px-4 pt-3">
          <Onglets valeurs={TABS} actif={tab} onChange={setTab} compteurs={compteurs} />
          <div className="flex items-center gap-2 pb-2">
            <div className="relative">
              <Search className="pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
              <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Rechercher un paiement..." className="h-9 w-[240px] pl-8 text-[13px]" />
            </div>
            <Button size="sm" className="h-9 gap-1.5 font-semibold" onClick={() => toast.info("Enregistrez un paiement depuis une facture.")}>
              Nouveau paiement
            </Button>
          </div>
        </div>

        {filtres.length === 0 ? (
          <div className="p-6">
            <VideEtat titre="Aucun paiement" description="Aucun paiement ne correspond à votre recherche." />
          </div>
        ) : (
          <Tableau colonnes={["Référence", "Client", "Facture", "Date", "Mode", "Montant", "Référence bancaire"]}>
            {filtres.map((p) => {
              const client = clients.find((c) => c.id === p.clientId);
              return (
                <Ligne key={p.id} to={`/paiements/${p.id}`}>
                  <Cellule num className="font-semibold">{p.id}</Cellule>
                  <Cellule className="max-w-[220px]">
                    <span className="block truncate font-semibold text-foreground">{client?.nom ?? "—"}</span>
                    <span className="block text-[11.5px] text-muted-foreground">{client?.ville ?? "—"}</span>
                  </Cellule>
                  <Cellule num>{p.factureId}</Cellule>
                  <Cellule className="text-muted-foreground">{formatDate(p.date)}</Cellule>
                  <Cellule>
                    <Statut valeur={p.mode} ton="info" />
                  </Cellule>
                  <Cellule num className="font-semibold">{formatDH(p.montant)}</Cellule>
                  <Cellule num>{p.reference}</Cellule>
                </Ligne>
              );
            })}
          </Tableau>
        )}
      </Panneau>
    </div>
  );
}
