import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  Check,
  Eye,
  EyeOff,
  Facebook,
  Instagram,
  Loader2,
  MessageCircle,
  Sparkles,
  X,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Panneau } from "@/components/app/ui-kit";
import { cn } from "@/lib/utils";
import {
  DEFINITION,
  DEFINITIONS,
  formaterDate,
  formaterHeure,
  useIntegrations,
  type ChampIntegration,
  type Integration,
  type Plateforme,
  type StatutIntegration,
} from "@/lib/integrations";

export const Route = createFileRoute("/integrations")({
  head: () => ({
    meta: [
      { title: "Intégrations — SINMAT" },
      {
        name: "description",
        content:
          "Connectez WhatsApp, Instagram et Facebook pour permettre aux agents IA SINMAT d’échanger avec vos prospects et clients.",
      },
      { property: "og:title", content: "Intégrations — SINMAT" },
      {
        property: "og:description",
        content: "Centre d’intégrations des canaux de communication SINMAT.",
      },
    ],
  }),
  component: PageIntegrations,
});

const ICONES: Record<Plateforme, LucideIcon> = {
  WHATSAPP: MessageCircle,
  INSTAGRAM: Instagram,
  FACEBOOK: Facebook,
};

const TEINTE: Record<Plateforme, string> = {
  WHATSAPP: "bg-success/10 text-success ring-success/20",
  INSTAGRAM: "bg-primary/10 text-primary ring-primary/20",
  FACEBOOK: "bg-info/10 text-info ring-info/20",
};

const MASQUE = "••••••••••••••••";

/* ------------------------------ Pastille état ----------------------------- */

function Pastille({ statut }: { statut: StatutIntegration }) {
  const config = {
    CONNECTED: { texte: "Connecté", point: "bg-success", label: "text-success" },
    WARNING: { texte: "À vérifier", point: "bg-warning", label: "text-warning-foreground" },
    DISCONNECTED: {
      texte: "Non connecté",
      point: "bg-muted-foreground/50",
      label: "text-muted-foreground",
    },
  }[statut];

  return (
    <span className={cn("inline-flex items-center gap-1.5 text-[12.5px] font-semibold", config.label)}>
      <span className={cn("size-2 rounded-full", config.point)} />
      {config.texte}
    </span>
  );
}

/* ---------------------------------- Page ---------------------------------- */

function PageIntegrations() {
  const { integrations, majIntegration } = useIntegrations();
  const [modale, setModale] = useState<{ platform: Plateforme; mode: "creer" | "gerer" } | null>(null);
  const [aDeconnecter, setADeconnecter] = useState<Plateforme | null>(null);

  const connectes = integrations.filter((i) => i.status === "CONNECTED").length;
  const aConfigurer = integrations.length - connectes;

  const courante = modale ? integrations.find((i) => i.platform === modale.platform)! : null;
  const cible = aDeconnecter ? integrations.find((i) => i.platform === aDeconnecter)! : null;

  return (
    <div className="space-y-6 p-6">
      <header>
        <h1 className="font-display text-[26px] font-bold leading-tight text-foreground">
          Intégrations
        </h1>
        <p className="mt-1.5 max-w-3xl text-[13.5px] text-muted-foreground">
          Connectez vos canaux de communication pour permettre aux agents IA SINMAT d’interagir avec
          vos prospects et clients.
        </p>
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <span className="rounded-md bg-muted px-2.5 py-1 text-[12px] font-semibold text-muted-foreground">
            {integrations.length} canaux disponibles
          </span>
          <span className="rounded-md bg-success/10 px-2.5 py-1 text-[12px] font-semibold text-success ring-1 ring-inset ring-success/20">
            {connectes} connecté{connectes > 1 ? "s" : ""}
          </span>
          <span className="rounded-md bg-warning/15 px-2.5 py-1 text-[12px] font-semibold text-warning-foreground ring-1 ring-inset ring-warning/30">
            {aConfigurer} à configurer
          </span>
        </div>
      </header>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {integrations.map((integration) => (
          <CarteIntegration
            key={integration.id}
            integration={integration}
            onConnecter={() => setModale({ platform: integration.platform, mode: "creer" })}
            onGerer={() => setModale({ platform: integration.platform, mode: "gerer" })}
            onDeconnecter={() => setADeconnecter(integration.platform)}
          />
        ))}
      </div>

      {courante && modale && (
        <ModaleConnexion
          integration={courante}
          mode={modale.mode}
          onClose={() => setModale(null)}
          onEnregistrer={(patch) => {
            majIntegration(courante.platform, patch);
            setModale(null);
            toast.success(`${DEFINITION(courante.platform).nom} connecté avec succès.`);
          }}
          onDeconnecter={() => {
            setModale(null);
            setADeconnecter(courante.platform);
          }}
        />
      )}

      {cible && (
        <ModaleDeconnexion
          integration={cible}
          onClose={() => setADeconnecter(null)}
          onConfirmer={() => {
            majIntegration(cible.platform, {
              status: "DISCONNECTED",
              account_name: "",
              account_identifier: "",
              connected_at: null,
              last_sync_at: null,
              config: {},
            });
            setADeconnecter(null);
            toast.success(`${DEFINITION(cible.platform).nom} déconnecté.`);
          }}
        />
      )}
    </div>
  );
}

/* --------------------------------- Carte ---------------------------------- */

function CarteIntegration({
  integration,
  onConnecter,
  onGerer,
  onDeconnecter,
}: {
  integration: Integration;
  onConnecter: () => void;
  onGerer: () => void;
  onDeconnecter: () => void;
}) {
  const def = DEFINITION(integration.platform);
  const Icone = ICONES[integration.platform];
  const connecte = integration.status !== "DISCONNECTED";

  return (
    <article className="panel flex flex-col p-5 transition-shadow hover:shadow-raised">
      <div className="flex items-start justify-between gap-3">
        <span
          className={cn(
            "flex size-11 items-center justify-center rounded-lg ring-1 ring-inset",
            TEINTE[integration.platform],
          )}
        >
          <Icone className="size-5" strokeWidth={1.9} />
        </span>
        <Pastille statut={integration.status} />
      </div>

      <h2 className="mt-4 font-display text-[16.5px] font-bold text-foreground">
        {connecte ? integration.display_name : def.nom}
      </h2>
      <p className="mt-1.5 text-[13px] leading-relaxed text-muted-foreground">{def.description}</p>

      {integration.status === "WARNING" && (
        <div className="mt-3 flex items-center gap-2 rounded-md border border-warning/30 bg-warning/10 px-3 py-2 text-[12.5px] text-warning-foreground">
          <AlertTriangle className="size-3.5 shrink-0" /> Le token expire bientôt.
        </div>
      )}

      <dl className="mt-4 space-y-2 border-t border-border pt-4 text-[12.5px]">
        <div className="flex items-baseline justify-between gap-3">
          <dt className="text-muted-foreground">
            {integration.platform === "FACEBOOK" ? "Page" : "Compte"}
          </dt>
          <dd className="truncate font-semibold text-foreground">
            {integration.account_name ||
              (integration.platform === "FACEBOOK" ? "Non configurée" : "Non configuré")}
          </dd>
        </div>
        {connecte && integration.account_identifier && (
          <div className="flex items-baseline justify-between gap-3">
            <dt className="text-muted-foreground">
              {integration.platform === "WHATSAPP" ? "Numéro" : "Identifiant"}
            </dt>
            <dd className="num truncate font-semibold text-foreground">
              {integration.account_identifier}
            </dd>
          </div>
        )}
        {connecte && (
          <>
            <div className="flex items-baseline justify-between gap-3">
              <dt className="text-muted-foreground">Connecté depuis</dt>
              <dd className="font-medium text-foreground/85">
                {formaterDate(integration.connected_at)}
              </dd>
            </div>
            <div className="flex items-baseline justify-between gap-3">
              <dt className="text-muted-foreground">Dernière synchronisation</dt>
              <dd className="font-medium text-foreground/85">
                {formaterHeure(integration.last_sync_at)}
              </dd>
            </div>
          </>
        )}
      </dl>

      {connecte && (
        <div className="mt-4 rounded-lg border border-primary/20 bg-primary/[0.04] p-3">
          <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-primary">
            Utilisé par
          </p>
          <ul className="mt-2 space-y-1">
            {def.usages.map((u) => (
              <li key={u} className="flex items-center gap-1.5 text-[12.5px] text-foreground/85">
                <Sparkles className="size-3 shrink-0 text-primary" strokeWidth={2.2} />
                {u}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-5 flex items-center gap-2 pt-1">
        {connecte ? (
          <>
            <Button size="sm" className="flex-1" onClick={onGerer}>
              {integration.status === "WARNING" ? "Vérifier" : "Gérer"}
            </Button>
            <Button size="sm" variant="ghost" onClick={onDeconnecter}>
              Déconnecter
            </Button>
          </>
        ) : (
          <Button size="sm" className="flex-1" onClick={onConnecter}>
            Connecter
          </Button>
        )}
      </div>
    </article>
  );
}

/* ----------------------------- Modale connexion --------------------------- */

type ResultatTest = null | { ok: boolean; titre: string; detail: string };

function ModaleConnexion({
  integration,
  mode,
  onClose,
  onEnregistrer,
  onDeconnecter,
}: {
  integration: Integration;
  mode: "creer" | "gerer";
  onClose: () => void;
  onEnregistrer: (patch: Partial<Integration>) => void;
  onDeconnecter: () => void;
}) {
  const def = DEFINITION(integration.platform);
  const Icone = ICONES[integration.platform];

  const [valeurs, setValeurs] = useState<Record<string, string>>(() => {
    const base: Record<string, string> = {};
    for (const c of def.champs) base[c.cle] = integration.config[c.cle] ?? "";
    return base;
  });
  const [remplaces, setRemplaces] = useState<Record<string, boolean>>({});
  const [visibles, setVisibles] = useState<Record<string, boolean>>({});
  const [guide, setGuide] = useState(false);
  const [test, setTest] = useState<ResultatTest>(null);
  const [enCours, setEnCours] = useState(false);

  useEffect(() => setTest(null), [valeurs]);

  const secretExistant = (c: ChampIntegration) =>
    mode === "gerer" && c.secret && !!integration.config[c.cle] && !remplaces[c.cle];

  const valide = useMemo(
    () =>
      def.champs
        .filter((c) => c.requis)
        .every((c) => (secretExistant(c) ? true : (valeurs[c.cle] ?? "").trim().length > 0)),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [valeurs, remplaces, mode],
  );

  const lancerTest = () => {
    setEnCours(true);
    setTest(null);
    window.setTimeout(() => {
      setEnCours(false);
      const ok = valide;
      setTest(
        ok
          ? {
              ok: true,
              titre: "Connexion réussie.",
              detail: "Les identifiants sont valides et le compte est accessible.",
            }
          : {
              ok: false,
              titre: "Connexion impossible.",
              detail: "Le token fourni est invalide ou a expiré.",
            },
      );
    }, 1400);
  };

  const enregistrer = () => {
    const config: Record<string, string> = { ...integration.config };
    for (const c of def.champs) {
      if (secretExistant(c)) continue;
      config[c.cle] = c.secret && valeurs[c.cle] ? MASQUE : (valeurs[c.cle] ?? "");
    }
    const maintenant = new Date().toISOString();
    onEnregistrer({
      status: "CONNECTED",
      display_name: valeurs["nom_connexion"] || def.display_name,
      account_name: valeurs[def.champCompte] || def.display_name,
      account_identifier: valeurs[def.champIdentifiant] ?? "",
      connected_at: integration.connected_at ?? maintenant,
      last_sync_at: maintenant,
      config,
    });
  };

  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-h-[90vh] gap-0 overflow-y-auto p-0 sm:max-w-[740px]">
        <header className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-border bg-surface px-6 py-5">
          <div className="flex items-start gap-3">
            <span
              className={cn(
                "flex size-10 items-center justify-center rounded-lg ring-1 ring-inset",
                TEINTE[integration.platform],
              )}
            >
              <Icone className="size-5" strokeWidth={1.9} />
            </span>
            <div>
              <h2 className="font-display text-[18px] font-bold text-foreground">
                {mode === "gerer"
                  ? `Gérer l’intégration ${def.nom}`
                  : `Connecter ${def.nom}`}
              </h2>
              <p className="mt-0.5 text-[12.5px] text-muted-foreground">
                Suivez les étapes ci-dessous puis renseignez les informations demandées.
              </p>
              {mode === "gerer" && (
                <div className="mt-2 flex flex-wrap items-center gap-3">
                  <Pastille statut={integration.status} />
                  <span className="text-[12.5px] text-muted-foreground">
                    {integration.account_name}
                  </span>
                </div>
              )}
            </div>
          </div>
          <span className="w-6 shrink-0" />
        </header>

        <div className="space-y-5 px-6 py-5">
          <Panneau titre="Instructions de connexion">
            <ol className="space-y-2.5">
              {def.instructions.map((etape, i) => (
                <li key={etape} className="flex gap-3 text-[13px] text-foreground/85">
                  <span className="num flex size-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[11px] font-bold text-primary">
                    {i + 1}
                  </span>
                  {etape}
                </li>
              ))}
            </ol>
            <button
              onClick={() => setGuide((v) => !v)}
              className="mt-3 text-[12.5px] font-semibold text-primary underline-offset-2 hover:underline"
            >
              {guide ? "Masquer le guide" : "Voir le guide détaillé"}
            </button>
            {guide && (
              <div className="mt-3 rounded-md border border-border bg-surface-muted p-3 text-[12.5px] leading-relaxed text-muted-foreground">
                Le guide complet décrit la création de l’application Meta, la configuration du
                webhook SINMAT et la génération d’un token de longue durée. Documentation interne à
                venir — contactez l’administrateur SINMAT pour l’accès anticipé.
              </div>
            )}
          </Panneau>

          <Panneau titre="Identifiants et configuration">
            <div className="grid gap-4 sm:grid-cols-2">
              {def.champs.map((c) => {
                const masqueExistant = secretExistant(c);
                return (
                  <div key={c.cle} className={cn(c.cle === "nom_connexion" && "sm:col-span-2")}>
                    <Label className="mb-1.5 flex items-center gap-1 text-[12.5px]">
                      {c.label}
                      {c.requis && <span className="text-primary">*</span>}
                    </Label>
                    {masqueExistant ? (
                      <div className="flex items-center gap-2">
                        <Input value={MASQUE} readOnly className="h-9 text-[13px]" />
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setRemplaces((r) => ({ ...r, [c.cle]: true }));
                            setValeurs((v) => ({ ...v, [c.cle]: "" }));
                          }}
                        >
                          Remplacer
                        </Button>
                      </div>
                    ) : (
                      <div className="relative">
                        <Input
                          type={c.secret && !visibles[c.cle] ? "password" : "text"}
                          value={valeurs[c.cle] ?? ""}
                          placeholder={c.placeholder}
                          onChange={(e) =>
                            setValeurs((v) => ({ ...v, [c.cle]: e.target.value }))
                          }
                          className={cn("h-9 text-[13px]", c.secret && "pr-9")}
                        />
                        {c.secret && (
                          <button
                            type="button"
                            aria-label={visibles[c.cle] ? "Masquer" : "Afficher"}
                            onClick={() => setVisibles((v) => ({ ...v, [c.cle]: !v[c.cle] }))}
                            className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
                          >
                            {visibles[c.cle] ? (
                              <EyeOff className="size-4" />
                            ) : (
                              <Eye className="size-4" />
                            )}
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </Panneau>

          <Panneau titre="Test de connexion">
            <div className="flex flex-wrap items-center gap-3">
              <Button variant="outline" size="sm" onClick={lancerTest} disabled={enCours}>
                {enCours && <Loader2 className="mr-1.5 size-3.5 animate-spin" />}
                {enCours ? "Test de connexion en cours..." : "Tester la connexion"}
              </Button>
              {mode === "gerer" && integration.last_sync_at && (
                <span className="text-[12.5px] text-muted-foreground">
                  Dernière synchronisation : {formaterHeure(integration.last_sync_at)}
                </span>
              )}
            </div>
            {test && (
              <div
                className={cn(
                  "mt-3 flex items-start gap-2 rounded-md border p-3 text-[13px]",
                  test.ok
                    ? "border-success/25 bg-success/[0.06] text-success"
                    : "border-destructive/25 bg-destructive/[0.06] text-destructive",
                )}
              >
                {test.ok ? (
                  <Check className="mt-0.5 size-4 shrink-0" strokeWidth={2.5} />
                ) : (
                  <AlertTriangle className="mt-0.5 size-4 shrink-0" />
                )}
                <div>
                  <p className="font-semibold">{test.titre}</p>
                  <p className="mt-0.5 text-foreground/75">{test.detail}</p>
                </div>
              </div>
            )}
          </Panneau>
        </div>

        <footer className="sticky bottom-0 flex flex-wrap items-center justify-between gap-3 border-t border-border bg-surface px-6 py-4">
          {mode === "gerer" ? (
            <Button variant="ghost" size="sm" onClick={onDeconnecter}>
              Déconnecter
            </Button>
          ) : (
            <span />
          )}
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={onClose}>
              Annuler
            </Button>
            <Button size="sm" disabled={!valide} onClick={enregistrer}>
              {mode === "gerer" ? "Enregistrer les modifications" : "Enregistrer la connexion"}
            </Button>
          </div>
        </footer>
      </DialogContent>
    </Dialog>
  );
}

/* ---------------------------- Modale déconnexion --------------------------- */

function ModaleDeconnexion({
  integration,
  onClose,
  onConfirmer,
}: {
  integration: Integration;
  onClose: () => void;
  onConfirmer: () => void;
}) {
  const def = DEFINITION(integration.platform);
  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-[460px]">
        <h2 className="font-display text-[17px] font-bold text-foreground">
          Déconnecter {def.nom} ?
        </h2>
        <p className="text-[13px] leading-relaxed text-muted-foreground">
          Les automatisations utilisant cette intégration seront suspendues jusqu’à une nouvelle
          connexion.
        </p>
        <div className="mt-2 flex justify-end gap-2">
          <Button variant="outline" size="sm" onClick={onClose}>
            Annuler
          </Button>
          <Button variant="destructive" size="sm" onClick={onConfirmer}>
            Déconnecter
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
