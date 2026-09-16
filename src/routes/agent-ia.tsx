import { createFileRoute, useBlocker } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Bot, History, Plug, Save, Settings2, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Cellule, Ligne, Onglets, Panneau, Statut, Tableau, VideEtat } from "@/components/app/ui-kit";
import { Lien } from "@/components/app/nav";
import { OngletGeneral } from "@/components/app/agent/OngletGeneral";
import { OngletConnaissance } from "@/components/app/agent/OngletConnaissance";
import { OngletAutomatisations } from "@/components/app/agent/OngletAutomatisations";
import { OngletTransfert } from "@/components/app/agent/OngletTransfert";
import { OngletTest } from "@/components/app/agent/OngletTest";
import { useSinmat } from "@/data/store";
import { useIntegrations, DEFINITION, type Plateforme } from "@/lib/integrations";
import {
  formaterDateHeure,
  useAgentIA,
  type ConfigAgent,
  type EtatAgent,
  type SourceConnaissance,
} from "@/lib/agent-ia";
import { Search } from "lucide-react";

export const Route = createFileRoute("/agent-ia")({
  head: () => ({
    meta: [
      { title: "Agent IA — Gestion SINMAT" },
      {
        name: "description",
        content:
          "Centre de configuration de l’Agent IA SINMAT : connaissances, comportement, automatisations et règles de transfert.",
      },
      { property: "og:title", content: "Agent IA — Gestion SINMAT" },
      { property: "og:description", content: "Configurez l’Agent commercial SINMAT." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: PageAgentIA,
});

const TABS = [
  "Configuration générale",
  "Base de connaissance",
  "Qualification & règles métier",
  "Automatisations",
  "Transfert humain",
  "Test de l’Agent",
];

const CANAUX: Plateforme[] = ["WHATSAPP", "INSTAGRAM", "FACEBOOK"];

function PageAgentIA() {
  const { produits, regles } = useSinmat();
  const { integrations } = useIntegrations();
  const { etat, charge, persister, journaliser } = useAgentIA();

  const [tab, setTab] = useState(TABS[0]!);
  const [brouillon, setBrouillon] = useState<ConfigAgent>(etat.config);
  const [dialogueQuitter, setDialogueQuitter] = useState(false);
  const [q, setQ] = useState("");

  useEffect(() => {
    if (charge) setBrouillon(etat.config);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [charge]);

  const modifie = useMemo(
    () => JSON.stringify(brouillon) !== JSON.stringify(etat.config),
    [brouillon, etat.config],
  );

  useEffect(() => {
    if (!modifie) return;
    const h = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", h);
    return () => window.removeEventListener("beforeunload", h);
  }, [modifie]);

  const blocage = useBlocker({ shouldBlockFn: () => modifie, withResolver: true, enableBeforeUnload: false });

  const maj = (patch: Partial<ConfigAgent>) => setBrouillon((b) => ({ ...b, ...patch }));

  const enregistrer = (libelle = "Configuration de l’Agent modifiée") => {
    const suivant: EtatAgent = {
      ...etat,
      config: brouillon,
      audit: journaliser(etat, libelle),
      enregistreLe: new Date().toISOString(),
    };
    persister(suivant);
    toast.success("Configuration de l’Agent IA enregistrée.");
  };

  const majSources = (sources: SourceConnaissance[], libelle: string) =>
    persister({ ...etat, sources, audit: journaliser(etat, libelle), enregistreLe: new Date().toISOString() });

  const canauxConnectes = integrations.filter((i) => i.status === "CONNECTED");
  const produitsConfigures = regles.filter((r) => r.configureLe).length;

  const reglesFiltrees = useMemo(() => {
    const t = q.trim().toLowerCase();
    return regles.filter((r) => {
      const p = produits.find((x) => x.id === r.produitId);
      if (!p) return false;
      return !t || `${p.nom} ${p.reference}`.toLowerCase().includes(t);
    });
  }, [regles, produits, q]);

  return (
    <div className="space-y-5 p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <span className="flex size-10 items-center justify-center rounded-lg bg-primary/10 ring-1 ring-inset ring-primary/20">
            <Bot className="size-5 text-primary" />
          </span>
          <div>
            <h1 className="font-display text-[19px] font-bold text-foreground">Agent IA</h1>
            <p className="text-[13px] text-muted-foreground">
              Configurez les connaissances, le comportement et les règles utilisées par l’Agent IA SINMAT.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Lien to="/integrations">
            <Button variant="outline" size="sm" className="gap-1.5">
              <Plug className="size-3.5" /> Gérer les intégrations
            </Button>
          </Lien>
          <Button size="sm" className="gap-1.5" disabled={!modifie} onClick={() => enregistrer()}>
            <Save className="size-3.5" /> Enregistrer les paramètres
          </Button>
        </div>
      </div>

      <Panneau bodyClassName="p-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <div>
              <p className="text-[14px] font-semibold text-foreground">{brouillon.nom}</p>
              <p className="text-[12px] text-muted-foreground">{brouillon.entreprise}</p>
            </div>
            <Statut valeur={brouillon.actif ? "Actif" : "Inactif"} ton={brouillon.actif ? "succes" : "neutre"} />
            {modifie && <Statut valeur="Modifications non enregistrées" ton="attention" />}
          </div>

          <div className="grid grid-cols-2 gap-x-8 gap-y-2 sm:grid-cols-4">
            <Metrique libelle="Connaissances" valeur={`${etat.sources.length} sources`} />
            <Metrique libelle="Produits configurés" valeur={`${produitsConfigures} / ${regles.length}`} />
            <Metrique libelle="Canaux connectés" valeur={`${canauxConnectes.length} / ${CANAUX.length}`} />
            <Metrique libelle="Dernière configuration" valeur={formaterDateHeure(etat.enregistreLe)} />
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2 border-t border-border pt-3">
          {CANAUX.map((c) => {
            const integration = integrations.find((i) => i.platform === c);
            const connecte = integration?.status === "CONNECTED";
            return (
              <Statut
                key={c}
                valeur={`${DEFINITION(c).nom} · ${connecte ? "Connecté" : "Non connecté"}`}
                ton={connecte ? "succes" : "neutre"}
              />
            );
          })}
        </div>
      </Panneau>

      <Onglets valeurs={TABS} actif={tab} onChange={setTab} />

      {tab === "Configuration générale" && (
        <div className="space-y-5">
          <OngletGeneral config={brouillon} maj={maj} />
          <HistoriqueAgent etat={etat} />
        </div>
      )}

      {tab === "Base de connaissance" && (
        <OngletConnaissance
          sources={etat.sources}
          majSources={majSources}
          produits={produits}
          produitsAgent={etat.produits}
          priorites={brouillon.priorites}
          majPriorites={(p) => maj({ priorites: p })}
        />
      )}

      {tab === "Qualification & règles métier" && (
        <Panneau
          titre="Règles de qualification par produit"
          description="Informations requises, paliers de location et conditions de vente utilisés par l’Agent."
          bodyClassName="p-0"
        >
          <div className="flex items-center gap-2 border-b border-border px-4 py-3">
            <div className="relative">
              <Search className="pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Rechercher un matériel..."
                className="h-9 w-[260px] pl-8 text-[13px]"
              />
            </div>
          </div>
          {reglesFiltrees.length === 0 ? (
            <div className="p-6">
              <VideEtat titre="Aucune règle" description="Aucun produit ne correspond à votre recherche." />
            </div>
          ) : (
            <Tableau colonnes={["Produit", "Référence", "Vente", "Location", "Règles", "Modifiée le", ""]}>
              {reglesFiltrees.map((r) => {
                const p = produits.find((x) => x.id === r.produitId)!;
                return (
                  <Ligne key={r.produitId} to={`/qualification/${r.produitId}`}>
                    <Cellule className="max-w-[280px]">
                      <span className="block truncate font-semibold text-foreground">{p.nom}</span>
                      <span className="block text-[11.5px] text-muted-foreground">{p.categorie}</span>
                    </Cellule>
                    <Cellule num>{p.reference}</Cellule>
                    <Cellule>
                      <Statut valeur={r.venteActive ? "Activée" : "Désactivée"} ton={r.venteActive ? "succes" : "neutre"} />
                    </Cellule>
                    <Cellule>
                      <Statut
                        valeur={r.locationActive ? "Activée" : "Désactivée"}
                        ton={r.locationActive ? "succes" : "neutre"}
                      />
                    </Cellule>
                    <Cellule>
                      <Statut
                        valeur={r.configureLe ? "Configurées" : "À configurer"}
                        ton={r.configureLe ? "succes" : "attention"}
                      />
                    </Cellule>
                    <Cellule className="text-muted-foreground">{r.modifieLe}</Cellule>
                    <Cellule>
                      <Lien to={`/qualification/${r.produitId}`}>
                        <Button variant="outline" size="sm" className="h-7 gap-1.5 px-2 text-[12px]">
                          <Settings2 className="size-3.5" /> Configurer
                        </Button>
                      </Lien>
                    </Cellule>
                  </Ligne>
                );
              })}
            </Tableau>
          )}
        </Panneau>
      )}

      {tab === "Automatisations" && <OngletAutomatisations config={brouillon} maj={maj} />}

      {tab === "Transfert humain" && <OngletTransfert config={brouillon} maj={maj} />}

      {tab === "Test de l’Agent" && (
        <OngletTest config={brouillon} sources={etat.sources} produits={produits} regles={regles} />
      )}

      <Dialog
        open={blocage.status === "blocked" || dialogueQuitter}
        onOpenChange={(v) => {
          if (!v) {
            setDialogueQuitter(false);
            if (blocage.status === "blocked") blocage.reset();
          }
        }}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Vous avez des modifications non enregistrées.</DialogTitle>
            <DialogDescription>
              Souhaitez-vous enregistrer la configuration de l’Agent IA avant de quitter cette page ?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setBrouillon(etat.config);
                setDialogueQuitter(false);
                if (blocage.status === "blocked") blocage.proceed();
              }}
            >
              Quitter sans enregistrer
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setDialogueQuitter(false);
                if (blocage.status === "blocked") blocage.reset();
              }}
            >
              Continuer
            </Button>
            <Button
              onClick={() => {
                enregistrer();
                setDialogueQuitter(false);
                if (blocage.status === "blocked") blocage.proceed();
              }}
            >
              Enregistrer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function Metrique({ libelle, valeur }: { libelle: string; valeur: string }) {
  return (
    <div className="min-w-0">
      <p className="text-[11.5px] text-muted-foreground">{libelle}</p>
      <p className="num truncate text-[13.5px] font-semibold text-foreground">{valeur}</p>
    </div>
  );
}

function HistoriqueAgent({ etat }: { etat: EtatAgent }) {
  return (
    <Panneau titre="Historique des modifications" description="Dernières actions de configuration.">
      <ul className="space-y-2.5">
        {etat.audit.slice(0, 8).map((e) => (
          <li key={e.id} className="flex items-start gap-3">
            <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-md bg-muted">
              <History className="size-3 text-muted-foreground" />
            </span>
            <div className="min-w-0">
              <p className="text-[13px] font-medium text-foreground">{e.libelle}</p>
              <p className="text-[12px] text-muted-foreground">
                {formaterDateHeure(e.date)} · {e.auteur}
              </p>
            </div>
          </li>
        ))}
      </ul>
      <p className="mt-3 inline-flex items-center gap-1.5 text-[12px] text-muted-foreground">
        <Sparkles className="size-3.5 text-primary" /> Chaque action automatisée reste modifiable manuellement.
      </p>
    </Panneau>
  );
}
