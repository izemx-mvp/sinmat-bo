import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ClipboardList, Plus, Search } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Cellule, Kpi, Ligne, Onglets, Panneau, Statut, Tableau, VideEtat } from "@/components/app/ui-kit";
import { Lien } from "@/components/app/nav";
import { useSinmat } from "@/data/store";
import { formatDH, formatDate } from "@/data/sinmat";

export const Route = createFileRoute("/commandes/")({
  head: () => ({
    meta: [
      { title: "Commandes — Gestion SINMAT" },
      { name: "description", content: "Suivi des commandes clients SINMAT : confirmation, préparation, livraison et facturation." },
      { property: "og:title", content: "Commandes — Gestion SINMAT" },
      { property: "og:description", content: "De la confirmation à la clôture." },
    ],
  }),
  component: PageCommandes,
});

const TABS = ["Toutes", "À confirmer", "À préparer", "En livraison", "Livrées", "Terminées"];

function PageCommandes() {
  const { commandes, clients } = useSinmat();
  const [tab, setTab] = useState("Toutes");
  const [q, setQ] = useState("");

  const filtres = useMemo(() => {
    const t = q.trim().toLowerCase();
    return commandes.filter((c) => {
      const client = clients.find((cl) => cl.id === c.clientId)?.nom ?? "";
      if (t && !`${c.id} ${client} ${c.type}`.toLowerCase().includes(t)) return false;
      if (tab === "Toutes") return true;
      if (tab === "À confirmer") return c.statut === "À confirmer";
      if (tab === "À préparer") return c.statut === "À préparer" || c.statut === "Prête";
      if (tab === "En livraison") return c.statut === "En livraison";
      if (tab === "Livrées") return c.statut === "Livrée";
      return c.statut === "Terminée";
    });
  }, [commandes, clients, tab, q]);

  const total = commandes.reduce((s, c) => s + c.montant, 0);
  const aLivrer = commandes.filter((c) => c.statut === "À préparer" || c.statut === "En livraison");
  const nonPayees = commandes.filter((c) => c.paiement !== "Payé");

  const compteurs = {
    Toutes: commandes.length,
    "À confirmer": commandes.filter((c) => c.statut === "À confirmer").length,
    "À préparer": commandes.filter((c) => c.statut === "À préparer" || c.statut === "Prête").length,
    "En livraison": commandes.filter((c) => c.statut === "En livraison").length,
    Livrées: commandes.filter((c) => c.statut === "Livrée").length,
    Terminées: commandes.filter((c) => c.statut === "Terminée").length,
  };

  return (
    <div className="space-y-5 p-6">
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <Kpi libelle="Commandes" valeur={String(commandes.length)} ton="info" icone={ClipboardList} />
        <Kpi libelle="Montant total" valeur={formatDH(total)} ton="accent" />
        <Kpi libelle="À livrer" valeur={String(aLivrer.length)} detail={`${formatDH(aLivrer.reduce((s, c) => s + c.montant, 0))}`} ton="attention" />
        <Kpi libelle="Non payées" valeur={String(nonPayees.length)} detail={`${formatDH(nonPayees.reduce((s, c) => s + c.montant, 0))}`} ton="danger" />
      </div>

      <Panneau bodyClassName="p-0">
        <div className="flex flex-wrap items-center justify-between gap-3 px-4 pt-3">
          <Onglets valeurs={TABS} actif={tab} onChange={setTab} compteurs={compteurs} />
          <div className="flex items-center gap-2 pb-2">
            <div className="relative">
              <Search className="pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
              <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Rechercher une commande..." className="h-9 w-[240px] pl-8 text-[13px]" />
            </div>
            <Button size="sm" className="h-9 gap-1.5 font-semibold" onClick={() => toast.info("Création depuis un devis ou un prospect.")}>
              <Plus className="size-4" /> Nouvelle commande
            </Button>
          </div>
        </div>

        {filtres.length === 0 ? (
          <div className="p-6">
            <VideEtat titre="Aucune commande" description="Aucune commande ne correspond à votre recherche." />
          </div>
        ) : (
          <Tableau colonnes={["Référence", "Client", "Type", "Montant", "Paiement", "Statut", "Date", "Facture", "Livraison"]}>
            {filtres.map((c) => {
              const client = clients.find((cl) => cl.id === c.clientId);
              return (
                <Ligne key={c.id} to={`/commandes/${c.id}`}>
                  <Cellule num className="font-semibold">{c.id}</Cellule>
                  <Cellule className="max-w-[260px]">
                    <span className="block truncate font-semibold text-foreground">{client?.nom ?? "—"}</span>
                    <span className="block text-[11.5px] text-muted-foreground">{client?.ville ?? "—"}</span>
                  </Cellule>
                  <Cellule>
                    <Statut valeur={c.type} ton={c.type === "Location" ? "info" : "accent"} />
                  </Cellule>
                  <Cellule num>{formatDH(c.montant)}</Cellule>
                  <Cellule>
                    <Statut valeur={c.paiement} />
                  </Cellule>
                  <Cellule>
                    <Statut valeur={c.statut} />
                  </Cellule>
                  <Cellule className="text-muted-foreground">{formatDate(c.date)}</Cellule>
                  <Cellule num>{c.factureId ?? "—"}</Cellule>
                  <Cellule num>{c.livraisonId ?? "—"}</Cellule>
                </Ligne>
              );
            })}
          </Tableau>
        )}
      </Panneau>
    </div>
  );
}
