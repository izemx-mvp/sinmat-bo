import { createFileRoute } from "@tanstack/react-router";
import { BarChart3, TrendingUp, Users, Package, Wallet, Truck } from "lucide-react";
import { Kpi, Panneau } from "@/components/app/ui-kit";
import { useSinmat } from "@/data/store";
import { formatDH } from "@/data/sinmat";

export const Route = createFileRoute("/rapports")({
  head: () => ({
    meta: [
      { title: "Rapports — Gestion SINMAT" },
      { name: "description", content: "Rapports commerciaux et opérationnels de SINMAT : ventes, locations, trésorerie et pipeline." },
      { property: "og:title", content: "Rapports — Gestion SINMAT" },
      { property: "og:description", content: "Tableau de bord analytique SINMAT." },
    ],
  }),
  component: PageRapports,
});

function PageRapports() {
  const { ventes, locations, factures, paiements, commandes, opportunites, clients, prospects } = useSinmat();

  const caVentes = ventes.filter((v) => v.statut !== "Annulée").reduce((s, v) => s + v.montant, 0);
  const caLocations = locations.filter((l) => l.statut !== "Terminée" || l.montant > 0).reduce((s, l) => s + l.montant, 0);
  const totalFactures = factures.reduce((s, f) => s + f.ttc, 0);
  const totalPaye = paiements.reduce((s, p) => s + p.montant, 0);
  const enCours = factures.reduce((s, f) => s + (f.ttc - f.paye), 0);
  const tauxConversion = prospects.length ? Math.round((clients.length / prospects.length) * 100) : 0;

  const pipeline = [
    { label: "À qualifier", value: opportunites.filter((o) => o.etape === "À qualifier").length },
    { label: "Qualifié", value: opportunites.filter((o) => o.etape === "Qualifié").length },
    { label: "Devis à préparer", value: opportunites.filter((o) => o.etape === "Devis à préparer").length },
    { label: "Devis envoyé", value: opportunites.filter((o) => o.etape === "Devis envoyé").length },
    { label: "Négociation", value: opportunites.filter((o) => o.etape === "Négociation").length },
    { label: "Confirmé", value: opportunites.filter((o) => o.etape === "Confirmé").length },
    { label: "Gagné", value: opportunites.filter((o) => o.etape === "Gagné").length },
  ];

  const maxPipeline = Math.max(...pipeline.map((p) => p.value), 1);

  return (
    <div className="space-y-5 p-6">
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <Kpi libelle="CA Ventes" valeur={formatDH(caVentes)} ton="accent" icone={TrendingUp} tendance={12} />
        <Kpi libelle="CA Locations" valeur={formatDH(caLocations)} ton="info" icone={Package} />
        <Kpi libelle="Facturé" valeur={formatDH(totalFactures)} ton="succes" icone={Wallet} />
        <Kpi libelle="Encours client" valeur={formatDH(enCours)} ton="attention" icone={Truck} />
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <Panneau titre="Pipeline commercial" description="Répartition des opportunités par étape">
          <div className="space-y-3 pt-2">
            {pipeline.map((p) => (
              <div key={p.label} className="flex items-center gap-3">
                <span className="w-28 shrink-0 text-[12.5px] text-muted-foreground">{p.label}</span>
                <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-primary"
                    style={{ width: `${(p.value / maxPipeline) * 100}%` }}
                  />
                </div>
                <span className="w-8 text-right text-[13px] font-semibold">{p.value}</span>
              </div>
            ))}
          </div>
        </Panneau>

        <Panneau titre="Indicateurs clés" description="Synthèse activité et conversion">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-lg border border-border bg-surface-muted/50 p-4">
              <p className="section-label">Prospects</p>
              <p className="num mt-1 font-display text-[22px] font-bold">{prospects.length}</p>
            </div>
            <div className="rounded-lg border border-border bg-surface-muted/50 p-4">
              <p className="section-label">Clients</p>
              <p className="num mt-1 font-display text-[22px] font-bold">{clients.length}</p>
            </div>
            <div className="rounded-lg border border-border bg-surface-muted/50 p-4">
              <p className="section-label">Commandes</p>
              <p className="num mt-1 font-display text-[22px] font-bold">{commandes.length}</p>
            </div>
            <div className="rounded-lg border border-border bg-surface-muted/50 p-4">
              <p className="section-label">Taux conversion</p>
              <p className="num mt-1 font-display text-[22px] font-bold">{tauxConversion}%</p>
            </div>
          </div>
        </Panneau>
      </div>

      <Panneau titre="Trésorerie" description="Factures émises vs paiements reçus">
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-lg border border-border bg-surface-muted/50 p-4">
            <p className="section-label">Total factures TTC</p>
            <p className="num mt-1 font-display text-[22px] font-bold text-foreground">{formatDH(totalFactures)}</p>
          </div>
          <div className="rounded-lg border border-border bg-surface-muted/50 p-4">
            <p className="section-label">Total payé</p>
            <p className="num mt-1 font-display text-[22px] font-bold text-foreground">{formatDH(totalPaye)}</p>
          </div>
          <div className="rounded-lg border border-border bg-surface-muted/50 p-4">
            <p className="section-label">Reste à encaisser</p>
            <p className="num mt-1 font-display text-[22px] font-bold text-foreground">{formatDH(enCours)}</p>
          </div>
        </div>
      </Panneau>
    </div>
  );
}
