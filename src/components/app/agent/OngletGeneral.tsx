import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Panneau, Statut } from "@/components/app/ui-kit";
import { CaseACocher, LigneChamp, SousSection } from "./partages";
import { LANGUES, type ConfigAgent, type Langue, type TonAgent } from "@/lib/agent-ia";

const TONS: TonAgent[] = [
  "Professionnel",
  "Professionnel et chaleureux",
  "Commercial",
  "Concis",
  "Personnalisé",
];

export function OngletGeneral({
  config,
  maj,
}: {
  config: ConfigAgent;
  maj: (patch: Partial<ConfigAgent>) => void;
}) {
  return (
    <div className="grid gap-5 lg:grid-cols-2">
      <Panneau titre="Identité de l’Agent" description="Qui est l’Agent IA et quel est son rôle.">
        <div className="space-y-4">
          <LigneChamp label="Nom de l’Agent">
            <Input
              className="h-9 text-[13px]"
              value={config.nom}
              onChange={(e) => maj({ nom: e.target.value })}
            />
          </LigneChamp>
          <LigneChamp label="Description / rôle">
            <Textarea
              rows={4}
              className="text-[13px]"
              value={config.description}
              onChange={(e) => maj({ description: e.target.value })}
            />
          </LigneChamp>
          <div className="grid gap-4 sm:grid-cols-2">
            <LigneChamp label="Entreprise">
              <Input
                className="h-9 text-[13px]"
                value={config.entreprise}
                onChange={(e) => maj({ entreprise: e.target.value })}
              />
            </LigneChamp>
            <div>
              <Label className="text-[12px]">Statut</Label>
              <div className="mt-2 flex items-center gap-3">
                <Switch checked={config.actif} onCheckedChange={(v) => maj({ actif: v })} />
                <Statut valeur={config.actif ? "Actif" : "Inactif"} ton={config.actif ? "succes" : "neutre"} />
              </div>
            </div>
          </div>
        </div>
      </Panneau>

      <Panneau
        titre="Langues & communication"
        description="L’Agent répond dans la langue utilisée par le client."
      >
        <div className="space-y-4">
          <CaseACocher
            id="lang-meme"
            label="Répondre automatiquement dans la langue utilisée par le client"
            coche={config.langues.repondreMemeLangue}
            onChange={(v) => maj({ langues: { ...config.langues, repondreMemeLangue: v } })}
          />
          <CaseACocher
            id="lang-adapter"
            label="Adapter automatiquement la langue si le client en change"
            coche={config.langues.adapterChangement}
            onChange={(v) => maj({ langues: { ...config.langues, adapterChangement: v } })}
          />
          <div className="grid gap-4 sm:grid-cols-2">
            <LigneChamp label="Langue par défaut">
              <Select
                value={config.langues.defaut}
                onValueChange={(v) => maj({ langues: { ...config.langues, defaut: v as Langue } })}
              >
                <SelectTrigger className="h-9 text-[13px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {LANGUES.map((l) => (
                    <SelectItem key={l} value={l}>
                      {l}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </LigneChamp>
            <div>
              <Label className="text-[12px]">Détection automatique</Label>
              <div className="mt-2 flex items-center gap-3">
                <Switch
                  checked={config.langues.detectionAuto}
                  onCheckedChange={(v) => maj({ langues: { ...config.langues, detectionAuto: v } })}
                />
                <span className="text-[13px] text-muted-foreground">
                  {config.langues.detectionAuto ? "Activée" : "Désactivée"}
                </span>
              </div>
            </div>
          </div>

          <SousSection titre="Langues prises en charge">
            <div className="flex flex-wrap gap-2">
              {LANGUES.map((l) => {
                const actif = config.langues.supportees.includes(l);
                return (
                  <button
                    key={l}
                    type="button"
                    onClick={() =>
                      maj({
                        langues: {
                          ...config.langues,
                          supportees: actif
                            ? config.langues.supportees.filter((x) => x !== l)
                            : [...config.langues.supportees, l],
                        },
                      })
                    }
                    className={
                      actif
                        ? "rounded-md bg-primary/10 px-2.5 py-1 text-[12.5px] font-semibold text-primary ring-1 ring-inset ring-primary/25"
                        : "rounded-md bg-muted px-2.5 py-1 text-[12.5px] font-medium text-muted-foreground ring-1 ring-inset ring-border"
                    }
                  >
                    {l}
                  </button>
                );
              })}
            </div>
            <p className="text-[12px] text-muted-foreground">
              Exemple : « Bghit nkri compacteur 10 iyam » → réponse en darija. « Je cherche une mini-pelle »
              → réponse en français.
            </p>
          </SousSection>
        </div>
      </Panneau>

      <Panneau titre="Ton de communication" description="Style de réponse utilisé sur les messageries.">
        <div className="space-y-4">
          <LigneChamp label="Style">
            <Select value={config.ton.style} onValueChange={(v) => maj({ ton: { ...config.ton, style: v as TonAgent } })}>
              <SelectTrigger className="h-9 text-[13px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {TONS.map((t) => (
                  <SelectItem key={t} value={t}>
                    {t}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </LigneChamp>
          <LigneChamp label="Instructions de ton">
            <Textarea
              rows={3}
              className="text-[13px]"
              value={config.ton.instructions}
              onChange={(e) => maj({ ton: { ...config.ton, instructions: e.target.value } })}
            />
          </LigneChamp>
          <div className="grid gap-1 sm:grid-cols-2">
            <CaseACocher
              id="ton-prenom"
              label="Utiliser le prénom du client lorsqu’il est connu"
              coche={config.ton.utiliserPrenom}
              onChange={(v) => maj({ ton: { ...config.ton, utiliserPrenom: v } })}
            />
            <CaseACocher
              id="ton-courtes"
              label="Réponses courtes sur messagerie"
              coche={config.ton.reponsesCourtes}
              onChange={(v) => maj({ ton: { ...config.ton, reponsesCourtes: v } })}
            />
            <CaseACocher
              id="ton-simple"
              label="Ne pas utiliser un langage trop technique"
              coche={config.ton.langageSimple}
              onChange={(v) => maj({ ton: { ...config.ton, langageSimple: v } })}
            />
            <CaseACocher
              id="ton-reformuler"
              label="Reformuler les besoins avant validation"
              coche={config.ton.reformulerBesoin}
              onChange={(v) => maj({ ton: { ...config.ton, reformulerBesoin: v } })}
            />
          </div>
        </div>
      </Panneau>

      <Panneau titre="Règle de fiabilité" description="Ce que l’Agent ne doit jamais faire.">
        <div className="rounded-lg border border-primary/25 bg-primary/[0.04] p-3 text-[13px] leading-relaxed text-foreground/85">
          L’Agent ne doit jamais inventer une information absente de la base de connaissance ou des données
          métier.
        </div>
        <div className="mt-3 space-y-1">
          <CaseACocher
            id="g-prix"
            label="Ne jamais inventer un prix"
            coche={config.garanties.jamaisInventerPrix}
            onChange={(v) => maj({ garanties: { ...config.garanties, jamaisInventerPrix: v } })}
          />
          <CaseACocher
            id="g-dispo"
            label="Ne jamais inventer une disponibilité"
            coche={config.garanties.jamaisInventerDisponibilite}
            onChange={(v) => maj({ garanties: { ...config.garanties, jamaisInventerDisponibilite: v } })}
          />
          <CaseACocher
            id="g-carac"
            label="Ne jamais inventer une caractéristique produit"
            coche={config.garanties.jamaisInventerCaracteristique}
            onChange={(v) => maj({ garanties: { ...config.garanties, jamaisInventerCaracteristique: v } })}
          />
          <CaseACocher
            id="g-cond"
            label="Ne jamais inventer une condition commerciale"
            coche={config.garanties.jamaisInventerCondition}
            onChange={(v) => maj({ garanties: { ...config.garanties, jamaisInventerCondition: v } })}
          />
          <CaseACocher
            id="g-valid"
            label="Demander une validation humaine en cas de doute"
            coche={config.garanties.validationSiDoute}
            onChange={(v) => maj({ garanties: { ...config.garanties, validationSiDoute: v } })}
          />
        </div>
      </Panneau>
    </div>
  );
}
