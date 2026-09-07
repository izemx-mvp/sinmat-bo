import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { FileText, Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Cellule, Kpi, Ligne, Onglets, Panneau, Statut, Tableau, VideEtat } from "@/components/app/ui-kit";
import { Lien } from "@/components/app/nav";
import { useSinmat } from "@/data/store";
import { formatDH, formatDate } from "@/data/sinmat";

export const Route = createFileRoute("/devis/")({
  head: () => ({
    meta: [
      { title: "Devis — Gestion SINMAT" },
      {
        name: "description",
        content:
          "Suivi des propositions commerciales SINMAT : statut, montants, validité et conversion en commande.",
      },
      { property: "og:title", content: "Devis — Gestion SINMAT" },
      { property: "og:description", content: "Propositions commerciales et acceptation client." },
    ],
  }),
  component: PageDevis,
});

const TABS = ["Tous", "Brouillons", "Envoyés", "En attente", "Acceptés", "Refusés", "Expirés"];

function PageDevis() {
  const { devis, clients } = useSinmat();
  const [tab, setTab] = useState("Tous");
  const [q, setQ] = useState("");

  const filtres = useMemo(() => {
    const t = q.trim().toLowerCase();
    return devis.filter((d) => {
      const client = clients.find((c) => c.id === d.clientId)?.nom ?? "";
      if (t && !`${d.id} ${client} ${d.type}`.toLowerCase().includes(t)) return false;
      if (tab === "Tous") return true;
      if (tab === "Brouillons") return d.statut === "Brouillon";
      if (tab === "Envoyés") return d.statut === "Envoyé";
      if (tab === "En attente") return d.statut === "En attente";
      if (tab === "Acceptés") return d.statut === "Accepté";
      if (tab === "Refusés") return d.statut === "Refusé";
      return d.statut === "Expiré";
    });
  }, [devis, clients, tab, q]);

  const total = devis.reduce((s, d) => s + d.montant, 0);
  const enAttente = devis.filter((d) => d.statut === "En attente" || d.statut === "Envoyé");
  const acceptes = devis.filter((d) => d.statut === "Accepté");

  const compteurs = {
    Tous: devis.length,
    Brouillons: devis.filter((d) => d.statut === "Brouillon").length,
    Envoyés: devis.filter((d) => d.statut === "Envoyé").length,
    "En attente": devis.filter((d) => d.statut === "En attente").length,
    Acceptés: devis.filter((d) => d.statut === "Accepté").length,
    Refusés: devis.filter((d) => d.statut === "Refusé").length,
    Expirés: devis.filter((d) => d.statut === "Expiré").length,
  };

  return (
    <div className="space-y-5 p-6">
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <Kpi libelle="Total devis" valeur={String(devis.length)} ton="info" icone={FileText} />
        <Kpi libelle="Montant total" valeur={formatDH(total)} ton="accent" />
        <Kpi libelle="En attente" valeur={formatDH(enAttente.reduce((s, d) => s + d.montant, 0))} detail={`${enAttente.length} devis`} ton="attention" />
        <Kpi libelle="Acceptés" valeur={formatDH(acceptes.reduce((s, d) => s + d.montant, 0))} detail={`${acceptes.length} devis`} ton="succes" />
      </div>

      <Panneau bodyClassName="p-0">
        <div className="flex flex-wrap items-center justify-between gap-3 px-4 pt-3">
          <Onglets valeurs={TABS} actif={tab} onChange={setTab} compteurs={compteurs} />
          <div className="flex items-center gap-2 pb-2">
            <div className="relative">
              <Search className="pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Rechercher un devis..."
                className="h-9 w-[240px] pl-8 text-[13px]"
              />
            </div>
            <Lien to="/devis/nouveau">
              <Button size="sm" className="h-9 gap-1.5 font-semibold">
                <Plus className="size-4" /> Nouveau devis
              </Button>
            </Lien>
          </div>
        </div>

        {filtres.length === 0 ? (
          <div className="p-6">
            <VideEtat titre="Aucun devis" description="Aucun devis ne correspond à votre recherche." />
          </div>
        ) : (
          <Tableau
            colonnes={[
              "Référence",
              "Client",
              "Type",
              "Montant TTC",
              "Statut",
              "Date",
              "Expiration",
              "Commande",
            ]}
          >
            {filtres.map((d) => {
              const client = clients.find((c) => c.id === d.clientId);
              return (
                <Ligne key={d.id} to={`/devis/${d.id}`}>
                  <Cellule num className="font-semibold">{d.id}</Cellule>
                  <Cellule className="max-w-[260px]">
                    <span className="block truncate font-semibold text-foreground">{client?.nom ?? "—"}</span>
                    <span className="block text-[11.5px] text-muted-foreground">{client?.ville ?? "—"}</span>
                  </Cellule>
                  <Cellule>
                    <Statut valeur={d.type} ton={d.type === "Location" ? "info" : "accent"} />
                  </Cellule>
                  <Cellule num>{formatDH(d.montant)}</Cellule>
                  <Cellule>
                    <Statut valeur={d.statut} />
                  </Cellule>
                  <Cellule className="text-muted-foreground">{formatDate(d.date)}</Cellule>
                  <Cellule className="text-muted-foreground">{formatDate(d.expiration)}</Cellule>
                  <Cellule num>{d.commandeId ?? "—"}</Cellule>
                </Ligne>
              );
            })}
          </Tableau>
        )}
      </Panneau>
    </div>
  );
}
