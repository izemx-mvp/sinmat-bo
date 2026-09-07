import { Link } from "@tanstack/react-router";
import { ArrowLeft, ArrowUpRight, Check, Sparkles, TrendingDown, TrendingUp } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/* --------------------------------- Statuts -------------------------------- */

type Ton = "neutre" | "info" | "succes" | "attention" | "danger" | "accent";

const TONS: Record<Ton, string> = {
  neutre: "bg-muted text-muted-foreground ring-border",
  info: "bg-info/10 text-info ring-info/20",
  succes: "bg-success/10 text-success ring-success/20",
  attention: "bg-warning/15 text-warning-foreground ring-warning/30",
  danger: "bg-destructive/10 text-destructive ring-destructive/20",
  accent: "bg-primary/10 text-primary ring-primary/20",
};

const MAP_STATUT: Record<string, Ton> = {
  // génériques
  Brouillon: "neutre",
  Annulée: "neutre",
  Expiré: "neutre",
  Refusé: "danger",
  Envoyé: "info",
  "En attente": "attention",
  Accepté: "succes",
  Émise: "info",
  Payée: "succes",
  Payé: "succes",
  "Partiellement payée": "attention",
  "Partiellement payé": "attention",
  Acompte: "attention",
  "Non payé": "danger",
  "En retard": "danger",
  // commandes
  "À confirmer": "attention",
  Confirmée: "info",
  "À préparer": "attention",
  "Préparation en cours": "attention",
  Prête: "info",
  Planifiée: "info",
  "En livraison": "accent",
  Livrée: "succes",
  Terminée: "succes",
  "En préparation": "attention",
  // locations
  Réservée: "info",
  "En cours": "accent",
  "Retour proche": "attention",
  // prospects
  Nouveau: "info",
  "À contacter": "attention",
  Contacté: "info",
  Intéressé: "succes",
  "À relancer": "attention",
  "Non intéressé": "neutre",
  Qualifié: "succes",
  "Non qualifié": "neutre",
  Disqualifié: "danger",
  // campagnes
  "En cours ": "accent",
  // retours
  Planifié: "info",
  "À récupérer": "attention",
  "En transit": "accent",
  Reçu: "info",
  "À inspecter": "attention",
  Clôturé: "succes",
  // divers
  Actif: "succes",
  "Client actif": "succes",
  Inactif: "neutre",
  Suspendu: "danger",
  Disponible: "succes",
  "Stock faible": "attention",
  Indisponible: "danger",
  Élevée: "danger",
  Élevé: "succes",
  Moyenne: "attention",
  Moyen: "attention",
  Faible: "neutre",
  Excellent: "succes",
  Bon: "succes",
  "À contrôler": "attention",
  Endommagé: "danger",
  Vente: "info",
  Location: "accent",
  "Vente & Location": "accent",
};

export function Statut({ valeur, ton }: { valeur: string; ton?: Ton }) {
  const t = ton ?? MAP_STATUT[valeur] ?? "neutre";
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 whitespace-nowrap rounded-md px-2 py-0.5 text-[11.5px] font-semibold ring-1 ring-inset",
        TONS[t],
      )}
    >
      <span
        className={cn(
          "size-1.5 rounded-full",
          t === "succes" && "bg-success",
          t === "danger" && "bg-destructive",
          t === "attention" && "bg-warning",
          t === "info" && "bg-info",
          t === "accent" && "bg-primary",
          t === "neutre" && "bg-muted-foreground/50",
        )}
      />
      {valeur}
    </span>
  );
}

/* --------------------------------- Panneau -------------------------------- */

export function Panneau({
  titre,
  description,
  action,
  children,
  className,
  bodyClassName,
}: {
  titre?: string;
  description?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
  bodyClassName?: string;
}) {
  return (
    <section className={cn("panel overflow-hidden", className)}>
      {(titre || action) && (
        <header className="flex items-center justify-between gap-4 border-b border-border px-5 py-3.5">
          <div className="min-w-0">
            {titre && <h3 className="text-[14px] font-semibold text-foreground">{titre}</h3>}
            {description && (
              <p className="mt-0.5 truncate text-[12.5px] text-muted-foreground">{description}</p>
            )}
          </div>
          {action}
        </header>
      )}
      <div className={cn(bodyClassName ?? "p-5")}>{children}</div>
    </section>
  );
}

/* ----------------------------------- KPI ---------------------------------- */

export function Kpi({
  libelle,
  valeur,
  detail,
  tendance,
  ton = "neutre",
  icone: Icone,
}: {
  libelle: string;
  valeur: string;
  detail?: string;
  tendance?: number;
  ton?: Ton;
  icone?: LucideIcon;
}) {
  return (
    <div className="panel group relative p-4 transition-shadow hover:shadow-raised">
      <div className="flex items-start justify-between gap-3">
        <p className="text-[12.5px] font-medium text-muted-foreground">{libelle}</p>
        {Icone && (
          <span
            className={cn(
              "flex size-7 items-center justify-center rounded-md ring-1 ring-inset",
              TONS[ton],
            )}
          >
            <Icone className="size-3.5" strokeWidth={2} />
          </span>
        )}
      </div>
      <p className="num mt-2.5 font-display text-[26px] font-bold leading-none text-foreground">
        {valeur}
      </p>
      <div className="mt-2 flex items-center gap-1.5 text-[12px]">
        {tendance !== undefined &&
          (tendance >= 0 ? (
            <span className="inline-flex items-center gap-1 font-semibold text-success">
              <TrendingUp className="size-3.5" /> +{tendance}%
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 font-semibold text-destructive">
              <TrendingDown className="size-3.5" /> {tendance}%
            </span>
          ))}
        {detail && <span className="truncate text-muted-foreground">{detail}</span>}
      </div>
    </div>
  );
}

/* -------------------------------- Tableau --------------------------------- */

export function Tableau({
  colonnes,
  children,
  className,
}: {
  colonnes: string[];
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("scroll-slim w-full overflow-x-auto", className)}>
      <table className="w-full min-w-[880px] border-collapse text-[13px]">
        <thead>
          <tr className="border-b border-border bg-surface-muted/70">
            {colonnes.map((c) => (
              <th
                key={c}
                className="whitespace-nowrap px-4 py-2.5 text-left text-[11px] font-semibold uppercase tracking-[0.07em] text-muted-foreground"
              >
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-border">{children}</tbody>
      </table>
    </div>
  );
}

export function Ligne({
  to,
  children,
  className,
}: {
  to?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <tr
      className={cn(
        "group transition-colors hover:bg-surface-muted/60",
        to && "cursor-pointer",
        className,
      )}
      onClick={
        to
          ? (e) => {
              const cible = e.target as HTMLElement;
              if (cible.closest("a,button,input")) return;
              window.history.pushState({}, "", to);
              window.dispatchEvent(new PopStateEvent("popstate"));
            }
          : undefined
      }
    >
      {children}
    </tr>
  );
}

export function Cellule({
  children,
  className,
  num,
}: {
  children: ReactNode;
  className?: string;
  num?: boolean;
}) {
  return (
    <td
      className={cn(
        "whitespace-nowrap px-4 py-2.5 text-foreground/85",
        num && "num text-right font-medium",
        className,
      )}
    >
      {children}
    </td>
  );
}

/* ------------------------------- Onglets ---------------------------------- */

export function Onglets({
  valeurs,
  actif,
  onChange,
  compteurs,
}: {
  valeurs: string[];
  actif: string;
  onChange: (v: string) => void;
  compteurs?: Record<string, number>;
}) {
  return (
    <div className="scroll-slim flex items-center gap-1 overflow-x-auto border-b border-border">
      {valeurs.map((v) => (
        <button
          key={v}
          onClick={() => onChange(v)}
          className={cn(
            "relative whitespace-nowrap px-3 py-2.5 text-[13px] font-medium transition-colors",
            actif === v
              ? "text-foreground"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          {v}
          {compteurs?.[v] !== undefined && (
            <span className="num ml-1.5 rounded bg-muted px-1.5 py-0.5 text-[11px] font-semibold text-muted-foreground">
              {compteurs[v]}
            </span>
          )}
          {actif === v && (
            <span className="absolute inset-x-2 -bottom-px h-0.5 rounded-full bg-primary" />
          )}
        </button>
      ))}
    </div>
  );
}

/* ------------------------------- En-tête page ----------------------------- */

export function EnTeteDetail({
  retour,
  titre,
  sousTitre,
  badges,
  actions,
}: {
  retour: { to: string; libelle: string };
  titre: string;
  sousTitre?: ReactNode;
  badges?: ReactNode;
  actions?: ReactNode;
}) {
  return (
    <div className="border-b border-border bg-surface px-6 py-5">
      <Link
        to={retour.to}
        className="inline-flex items-center gap-1.5 text-[12.5px] font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-3.5" /> {retour.libelle}
      </Link>
      <div className="mt-3 flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="font-display text-[24px] font-bold leading-tight text-foreground">
              {titre}
            </h1>
            {badges}
          </div>
          {sousTitre && (
            <div className="mt-1.5 text-[13px] text-muted-foreground">{sousTitre}</div>
          )}
        </div>
        {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
      </div>
    </div>
  );
}

/* --------------------------- Rail de statut -------------------------------- */

export function RailStatut({
  etapes,
  courante,
}: {
  etapes: string[];
  courante: number;
}) {
  return (
    <div className="scroll-slim flex items-center gap-0 overflow-x-auto py-1">
      {etapes.map((e, i) => {
        const fait = i < courante;
        const active = i === courante;
        return (
          <div key={e} className="flex min-w-0 flex-1 items-center">
            <div className="flex min-w-0 flex-col items-center gap-2 px-1">
              <span
                className={cn(
                  "flex size-7 shrink-0 items-center justify-center rounded-full border text-[11px] font-bold transition-colors",
                  fait && "border-success bg-success text-success-foreground",
                  active &&
                    "border-primary bg-primary text-primary-foreground shadow-[0_0_0_4px_var(--color-accent)]",
                  !fait && !active && "border-border bg-surface text-muted-foreground",
                )}
              >
                {fait ? <Check className="size-3.5" strokeWidth={3} /> : i + 1}
              </span>
              <span
                className={cn(
                  "whitespace-nowrap text-[11.5px] font-medium",
                  active ? "text-foreground" : "text-muted-foreground",
                )}
              >
                {e}
              </span>
            </div>
            {i < etapes.length - 1 && (
              <span className="relative -mt-6 h-0.5 flex-1 overflow-hidden rounded-full bg-border">
                <span
                  className={cn(
                    "absolute inset-y-0 left-0 rounded-full bg-success transition-[width] duration-700",
                    i < courante ? "w-full" : "w-0",
                  )}
                />
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
}

/* --------------------------- Documents liés -------------------------------- */

export function DocumentsLies({
  elements,
}: {
  elements: { label: string; ref: string; to: string }[];
}) {
  return (
    <ol className="space-y-1">
      {elements.map((el, i) => (
        <li key={el.ref} className="relative">
          <Link
            to={el.to}
            className="flex items-center justify-between gap-3 rounded-md border border-transparent px-3 py-2 transition-colors hover:border-border hover:bg-surface-muted"
          >
            <span className="flex flex-col">
              <span className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                {el.label}
              </span>
              <span className="num text-[13px] font-semibold text-foreground">{el.ref}</span>
            </span>
            <ArrowUpRight className="size-4 text-muted-foreground" />
          </Link>
          {i < elements.length - 1 && <span className="ml-6 block h-2 w-px bg-border" />}
        </li>
      ))}
    </ol>
  );
}

/* ------------------------------ Analyse IA --------------------------------- */

export function AnalyseIA({
  titre = "Analyse IA",
  lignes,
  recommandation,
  action,
  variante = "info",
}: {
  titre?: string;
  lignes?: { label: string; valeur: string }[];
  recommandation: string;
  action?: ReactNode;
  variante?: "info" | "alerte";
}) {
  return (
    <div
      className={cn(
        "rounded-lg border p-4",
        variante === "alerte"
          ? "border-destructive/25 bg-destructive/[0.04]"
          : "border-primary/25 bg-primary/[0.04]",
      )}
    >
      <p className="flex items-center gap-1.5 text-[12px] font-semibold uppercase tracking-[0.08em] text-primary">
        <Sparkles className="size-3.5" strokeWidth={2.2} /> {titre}
      </p>
      {lignes && (
        <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2.5">
          {lignes.map((l) => (
            <div key={l.label}>
              <dt className="text-[11.5px] text-muted-foreground">{l.label}</dt>
              <dd className="num text-[14px] font-semibold text-foreground">{l.valeur}</dd>
            </div>
          ))}
        </dl>
      )}
      <p className="mt-3 text-[13px] leading-relaxed text-foreground/85">{recommandation}</p>
      {action && <div className="mt-3">{action}</div>}
    </div>
  );
}

/* -------------------------------- Timeline --------------------------------- */

export function Chronologie({
  evenements,
}: {
  evenements: { date: string; libelle: string; detail?: string }[];
}) {
  return (
    <ol className="relative space-y-4 pl-5">
      <span className="absolute left-[5px] top-2 bottom-2 w-px bg-border" />
      {evenements.map((e, i) => (
        <li key={i} className="relative">
          <span
            className={cn(
              "absolute -left-5 top-1 size-[11px] rounded-full border-2 border-surface",
              i === evenements.length - 1 ? "bg-primary" : "bg-border-strong",
            )}
          />
          <p className="text-[12px] font-medium text-muted-foreground">{e.date}</p>
          <p className="text-[13.5px] font-medium text-foreground">{e.libelle}</p>
          {e.detail && <p className="text-[12.5px] text-muted-foreground">{e.detail}</p>}
        </li>
      ))}
    </ol>
  );
}

/* ------------------------------ Champ / infos ------------------------------ */

export function Infos({ donnees }: { donnees: { label: string; valeur: ReactNode }[] }) {
  return (
    <dl className="grid gap-x-6 gap-y-3.5 sm:grid-cols-2">
      {donnees.map((d) => (
        <div key={d.label} className="min-w-0">
          <dt className="text-[11.5px] font-medium text-muted-foreground">{d.label}</dt>
          <dd className="truncate text-[13.5px] font-medium text-foreground">{d.valeur}</dd>
        </div>
      ))}
    </dl>
  );
}

export function VideEtat({
  titre,
  description,
  action,
}: {
  titre: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border px-6 py-14 text-center">
      <p className="text-[14px] font-semibold text-foreground">{titre}</p>
      <p className="mt-1 max-w-sm text-[13px] text-muted-foreground">{description}</p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
