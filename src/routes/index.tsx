import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Line,
  ResponsiveContainer,
  Tooltip as RTooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  AlertTriangle,
  ArrowRight,
  CalendarClock,
  FileText,
  Target,
  Truck,
  Wallet,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Cellule,
  Kpi,
  Ligne,
  Panneau,
  Statut,
  Tableau,
} from "@/components/app/ui-kit";
import { Lien } from "@/components/app/nav";
import { useSinmat } from "@/data/store";
import {
  ETAPES_PIPELINE,
  formatDH,
  formatNombre,
  prenomUtilisateur,
  seriePerformance,
  serieMensuelle,
} from "@/data/sinmat";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Vue d'ensemble — Gestion SINMAT" },
      {
        name: "description",
        content:
          "Centre de pilotage SINMAT : pipeline commercial, devis, paiements, locations et livraisons du jour.",
      },
      { property: "og:title", content: "Vue d'ensemble — Gestion SINMAT" },
      {
        property: "og:description",
        content: "Pilotez l'activité commerciale, financière et logistique de SINMAT.",
      },
    ],
  }),
  component: VueDEnsemble,
});

const PERIODES = ["Aujourd'hui", "Cette semaine", "Ce mois", "Ce trimestre"];
const PERIODES_GRAPHE = ["7 jours", "30 jours", "3 mois", "12 mois"];

function VueDEnsemble() {
  const { opportunites, devis, commandes, factures, locations, livraisons, clients } = useSinmat();
  const [periode, setPeriode] = useState(PERIODES[2]!);
  const [periodeGraphe, setPeriodeGraphe] = useState(PERIODES_GRAPHE[0]!);

  const donnees = periodeGraphe === "7 jours" ? seriePerformance : serieMensuelle;

  const montantDevisAttente = devis
    .filter((d) => d.statut === "En attente" || d.statut === "Envoyé")
    .reduce((s, d) => s + d.montant, 0);
  const aRecevoir = factures.reduce((s, f) => s + Math.max(0, f.ttc - f.paye), 0);
  const livraisonsDuJour = livraisons.filter((l) => l.date === "2026-09-07");

  const valeurEtape = (etape: string) =>
    opportunites.filter((o) => o.etape === etape).reduce((s, o) => s + o.montant, 0);

  const nomClient = (id: string) => clients.find((c) => c.id === id)?.nom ?? "—";

  const actions = [
    {
      ref: "DEV-2026-0182",
      titre: "Devis expire aujourd'hui",
      client: "Tanger Travaux",
      montant: "87 500 DH",
      cta: "Voir le devis",
      to: "/devis/DEV-2026-0182",
      ton: "attention" as const,
      icone: FileText,
    },
    {
      ref: "FAC-2026-0098",
      titre: "Paiement en retard · 5 jours",
      client: "Atlas Construction",
      montant: "32 400 DH",
      cta: "Voir la facture",
      to: "/factures/FAC-2026-0098",
      ton: "danger" as const,
      icone: AlertTriangle,
    },
    {
      ref: "LOC-2026-0035",
      titre: "Retour prévu demain",
      client: "Groupe électrogène 60 kVA",
      montant: "Tétouan",
      cta: "Voir la location",
      to: "/locations/LOC-2026-0035",
      ton: "info" as const,
      icone: CalendarClock,
    },
  ];

  const funnel = [
    { label: "Contactés", valeur: 1240 },
    { label: "Réponses", valeur: 486 },
    { label: "Qualifiés", valeur: 138 },
    { label: "Opportunités", valeur: 64 },
  ];

  return (
    <div className="space-y-5 p-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="font-display text-[22px] font-bold text-foreground">
            Bonjour {prenomUtilisateur("U1")},
          </h2>
          <p className="text-[13.5px] text-muted-foreground">
            Voici l'activité de SINMAT aujourd'hui.
          </p>
        </div>
        <div className="flex rounded-md border border-border bg-surface p-0.5">
          {PERIODES.map((p) => (
            <button
              key={p}
              onClick={() => setPeriode(p)}
              className={cn(
                "rounded px-3 py-1.5 text-[12.5px] font-medium transition-colors",
                periode === p
                  ? "bg-secondary text-secondary-foreground"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        <Kpi
          libelle="Opportunités actives"
          valeur={formatNombre(opportunites.filter((o) => o.etape !== "Gagné").length + 13)}
          detail="+6 cette semaine"
          tendance={12}
          ton="accent"
          icone={Target}
        />
        <Kpi
          libelle="Devis en attente"
          valeur="12"
          detail={formatDH(montantDevisAttente)}
          ton="info"
          icone={FileText}
        />
        <Kpi
          libelle="Commandes à livrer"
          valeur="8"
          detail="3 urgentes"
          ton="attention"
          icone={Truck}
        />
        <Kpi
          libelle="Paiements à recevoir"
          valeur={formatDH(aRecevoir)}
          detail="5 échéances dépassées"
          tendance={-4}
          ton="danger"
          icone={Wallet}
        />
        <Kpi
          libelle="Matériels en location"
          valeur="36"
          detail="7 retours cette semaine"
          ton="succes"
          icone={CalendarClock}
        />
      </div>

      <Panneau
        titre="Pipeline commercial"
        description="Répartition des opportunités et valeur estimée par étape"
        action={
          <Lien to="/opportunites">
            <Button variant="ghost" size="sm" className="gap-1 text-[12.5px]">
              Ouvrir le pipeline <ArrowRight className="size-3.5" />
            </Button>
          </Lien>
        }
        bodyClassName="p-0"
      >
        <div className="grid grid-cols-2 divide-x divide-border border-b border-border md:grid-cols-4 xl:grid-cols-7 xl:border-b-0">
          {ETAPES_PIPELINE.map((etape, i) => {
            const nb = [12, 18, 10, 9, 7, 5, 14][i]!;
            return (
              <div key={etape} className="p-4">
                <p className="truncate text-[12px] font-medium text-muted-foreground">{etape}</p>
                <p className="num mt-1.5 font-display text-[22px] font-bold text-foreground">
                  {nb}
                </p>
                <p className="num mt-1 text-[12px] font-medium text-primary">
                  {formatDH(valeurEtape(etape) || nb * 18400)}
                </p>
                <div className="mt-2.5 h-1 rounded-full bg-muted">
                  <div
                    className="h-1 rounded-full bg-primary/70"
                    style={{ width: `${Math.min(100, nb * 5.5)}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </Panneau>

      <div className="grid gap-5 xl:grid-cols-3">
        <Panneau
          className="xl:col-span-2"
          titre="Performance commerciale"
          description="Opportunités, ventes et locations"
          action={
            <div className="flex rounded-md border border-border p-0.5">
              {PERIODES_GRAPHE.map((p) => (
                <button
                  key={p}
                  onClick={() => setPeriodeGraphe(p)}
                  className={cn(
                    "rounded px-2.5 py-1 text-[11.5px] font-medium transition-colors",
                    periodeGraphe === p
                      ? "bg-secondary text-secondary-foreground"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {p}
                </button>
              ))}
            </div>
          }
        >
          <div className="h-[268px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={donnees} margin={{ left: -18, right: 8, top: 8 }}>
                <defs>
                  <linearGradient id="gVentes" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--color-chart-1)" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="var(--color-chart-1)" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gLoc" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--color-chart-2)" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="var(--color-chart-2)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                <XAxis
                  dataKey="periode"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 11.5, fill: "var(--color-muted-foreground)" }}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 11.5, fill: "var(--color-muted-foreground)" }}
                  tickFormatter={(v: number) => `${Math.round(v / 1000)}k`}
                />
                <RTooltip
                  contentStyle={{
                    borderRadius: 8,
                    border: "1px solid var(--color-border)",
                    fontSize: 12.5,
                    boxShadow: "var(--shadow-raised)",
                  }}
                  formatter={(v: number, n: string) =>
                    n === "opportunites" ? [v, "Opportunités"] : [formatDH(v), n === "ventes" ? "Ventes" : "Locations"]
                  }
                />
                <Area
                  type="monotone"
                  dataKey="ventes"
                  stroke="var(--color-chart-1)"
                  strokeWidth={2}
                  fill="url(#gVentes)"
                />
                <Area
                  type="monotone"
                  dataKey="locations"
                  stroke="var(--color-chart-2)"
                  strokeWidth={2}
                  fill="url(#gLoc)"
                />
                <Line
                  type="monotone"
                  dataKey="opportunites"
                  stroke="var(--color-chart-3)"
                  strokeWidth={2}
                  dot={false}
                  yAxisId={0}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-2 flex flex-wrap gap-4 text-[12px] text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <span className="size-2 rounded-full bg-chart-1" /> Ventes
            </span>
            <span className="flex items-center gap-1.5">
              <span className="size-2 rounded-full bg-chart-2" /> Locations
            </span>
            <span className="flex items-center gap-1.5">
              <span className="size-2 rounded-full bg-chart-3" /> Opportunités
            </span>
          </div>
        </Panneau>

        <Panneau titre="Actions prioritaires" description="À traiter aujourd'hui" bodyClassName="p-3">
          <ul className="space-y-2">
            {actions.map((a) => (
              <li
                key={a.ref}
                className="rounded-lg border border-border p-3 transition-colors hover:bg-surface-muted"
              >
                <div className="flex items-start gap-3">
                  <span
                    className={cn(
                      "mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-md",
                      a.ton === "danger" && "bg-destructive/10 text-destructive",
                      a.ton === "attention" && "bg-warning/15 text-warning-foreground",
                      a.ton === "info" && "bg-info/10 text-info",
                    )}
                  >
                    <a.icone className="size-4" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="num text-[12.5px] font-semibold text-foreground">{a.ref}</p>
                    <p className="text-[13px] text-foreground/85">{a.titre}</p>
                    <p className="text-[12.5px] text-muted-foreground">{a.client}</p>
                    <div className="mt-2 flex items-center justify-between gap-2">
                      <span className="num text-[13px] font-semibold text-foreground">
                        {a.montant}
                      </span>
                      <Lien to={a.to}>
                        <Button variant="outline" size="sm" className="h-7 text-[12px]">
                          {a.cta}
                        </Button>
                      </Lien>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </Panneau>
      </div>

      <div className="grid gap-5 xl:grid-cols-3">
        <Panneau
          titre="Performance des campagnes WhatsApp"
          description="Prospection automatisée — 30 derniers jours"
          className="xl:col-span-2"
        >
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {funnel.map((f) => (
              <div key={f.label} className="rounded-lg border border-border bg-surface-muted/60 p-3">
                <p className="text-[12px] text-muted-foreground">{f.label}</p>
                <p className="num mt-1 font-display text-[21px] font-bold text-foreground">
                  {formatNombre(f.valeur)}
                </p>
              </div>
            ))}
          </div>
          <div className="mt-4 space-y-2">
            {funnel.map((f, i) => (
              <div key={f.label} className="flex items-center gap-3">
                <span className="w-24 shrink-0 text-[12px] text-muted-foreground">{f.label}</span>
                <div className="h-6 flex-1 overflow-hidden rounded bg-muted">
                  <div
                    className="flex h-6 items-center justify-end rounded px-2 text-[11.5px] font-semibold text-primary-foreground transition-all duration-700"
                    style={{
                      width: `${(f.valeur / funnel[0]!.valeur) * 100}%`,
                      backgroundColor: `color-mix(in oklab, var(--color-primary) ${100 - i * 14}%, var(--color-secondary))`,
                    }}
                  >
                    {Math.round((f.valeur / funnel[0]!.valeur) * 100)}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Panneau>

        <Panneau titre="Livraisons du jour" description="07 sept. 2026" bodyClassName="p-0">
          <ul className="divide-y divide-border">
            {livraisonsDuJour.map((l) => (
              <li key={l.id}>
                <Lien
                  to={`/livraisons/${l.id}`}
                  className="flex items-start justify-between gap-3 px-5 py-3 transition-colors hover:bg-surface-muted"
                >
                  <span className="min-w-0">
                    <span className="num block text-[12.5px] font-semibold text-foreground">
                      {l.id}
                    </span>
                    <span className="block truncate text-[13px] text-foreground/85">
                      {nomClient(l.clientId)}
                    </span>
                    <span className="block text-[12px] text-muted-foreground">
                      {l.ville} · {l.creneau}
                    </span>
                  </span>
                  <Statut valeur={l.statut} />
                </Lien>
              </li>
            ))}
          </ul>
        </Panneau>
      </div>

      <Panneau titre="Dernières commandes" description="Suivi opérationnel" bodyClassName="p-0">
        <Tableau
          colonnes={["Commande", "Client", "Type", "Montant", "Paiement", "Statut", "Date"]}
        >
          {commandes.slice(0, 6).map((c) => (
            <Ligne key={c.id} to={`/commandes/${c.id}`}>
              <Cellule className="num font-semibold">{c.id}</Cellule>
              <Cellule>{nomClient(c.clientId)}</Cellule>
              <Cellule>
                <Statut valeur={c.type} />
              </Cellule>
              <Cellule num>{formatDH(c.montant)}</Cellule>
              <Cellule>
                <Statut valeur={c.paiement} />
              </Cellule>
              <Cellule>
                <Statut valeur={c.statut} />
              </Cellule>
              <Cellule className="text-muted-foreground">{c.date}</Cellule>
            </Ligne>
          ))}
        </Tableau>
      </Panneau>
    </div>
  );
}
