import { Info, Sparkles, User } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Panneau } from "@/components/app/ui-kit";
import {
  GROUPES_AUTOMATISATION,
  type ConfigAgent,
  type ModeValidation,
  type RegleValidation,
} from "@/lib/agent-ia";

const MODES: ModeValidation[] = ["Toujours", "Au-dessus d’un seuil", "Jamais"];

const APPROBATIONS: { cle: keyof ConfigAgent["approbations"]; label: string; unite: string }[] = [
  { cle: "envoyerDevis", label: "Envoyer un devis", unite: "DH" },
  { cle: "emettreFacture", label: "Émettre une facture", unite: "DH" },
  { cle: "appliquerRemise", label: "Appliquer une remise", unite: "%" },
  { cle: "confirmerLocation", label: "Confirmer une location", unite: "jours" },
  { cle: "confirmerVente", label: "Confirmer une vente", unite: "DH" },
];

export function OngletAutomatisations({
  config,
  maj,
}: {
  config: ConfigAgent;
  maj: (patch: Partial<ConfigAgent>) => void;
}) {
  const basculer = (cle: string, v: boolean) =>
    maj({ automatisations: { ...config.automatisations, [cle]: v } });

  const majApprobation = (cle: keyof ConfigAgent["approbations"], patch: Partial<RegleValidation>) =>
    maj({
      approbations: {
        ...config.approbations,
        [cle]: { ...config.approbations[cle], ...patch },
      },
    });

  return (
    <div className="space-y-5">
      <div className="flex items-start gap-3 rounded-lg border border-info/25 bg-info/[0.05] p-3.5">
        <Info className="mt-0.5 size-4 shrink-0 text-info" />
        <div className="text-[13px] leading-relaxed text-foreground/85">
          Chaque action automatisée par l’IA peut également être réalisée, modifiée ou validée manuellement
          par un utilisateur autorisé.
          <div className="mt-2 flex flex-wrap gap-2 text-[12px]">
            <span className="inline-flex items-center gap-1 rounded-md bg-primary/10 px-2 py-0.5 font-semibold text-primary">
              <Sparkles className="size-3" /> IA
            </span>
            <span className="inline-flex items-center gap-1 rounded-md bg-muted px-2 py-0.5 font-semibold text-muted-foreground">
              <User className="size-3" /> Humain
            </span>
            <span className="text-muted-foreground">L’origine de chaque action est tracée dans l’historique.</span>
          </div>
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <Panneau titre="Actions autorisées" description="Ce que l’Agent peut réaliser sans intervention.">
          <div className="space-y-5">
            {GROUPES_AUTOMATISATION.map((groupe) => (
              <div key={groupe.titre}>
                <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
                  {groupe.titre}
                </p>
                <div className="space-y-1.5">
                  {groupe.items.map((item) => (
                    <div
                      key={item.cle}
                      className="flex items-center justify-between gap-3 rounded-md border border-border px-3 py-2"
                    >
                      <span className="text-[13px] text-foreground/90">{item.label}</span>
                      <Switch
                        checked={Boolean(config.automatisations[item.cle])}
                        onCheckedChange={(v) => basculer(item.cle, v)}
                      />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Panneau>

        <Panneau
          titre="Validation humaine requise"
          description="Actions sensibles nécessitant l’accord d’un utilisateur."
        >
          <div className="space-y-3">
            {APPROBATIONS.map((a) => {
              const regle = config.approbations[a.cle];
              return (
                <div key={a.cle} className="rounded-md border border-border p-3">
                  <p className="text-[13px] font-semibold text-foreground">{a.label}</p>
                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    <Select value={regle.mode} onValueChange={(v) => majApprobation(a.cle, { mode: v as ModeValidation })}>
                      <SelectTrigger className="h-9 w-[210px] text-[13px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {MODES.map((m) => (
                          <SelectItem key={m} value={m}>
                            {m}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {regle.mode === "Au-dessus d’un seuil" && (
                      <div className="flex items-center gap-2">
                        <Input
                          className="h-9 w-[120px] text-[13px]"
                          value={String(regle.seuil)}
                          onChange={(e) => majApprobation(a.cle, { seuil: Number(e.target.value) || 0 })}
                        />
                        <span className="text-[12.5px] text-muted-foreground">{a.unite}</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </Panneau>
      </div>
    </div>
  );
}
