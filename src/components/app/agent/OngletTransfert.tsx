import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Panneau } from "@/components/app/ui-kit";
import { CaseACocher, LigneChamp } from "./partages";
import { DECLENCHEURS_TRANSFERT, LIMITES_AGENT, type ConfigAgent } from "@/lib/agent-ia";
import { utilisateurs } from "@/data/sinmat";

export function OngletTransfert({
  config,
  maj,
}: {
  config: ConfigAgent;
  maj: (patch: Partial<ConfigAgent>) => void;
}) {
  const majTransfert = (patch: Partial<ConfigAgent["transfert"]>) =>
    maj({ transfert: { ...config.transfert, ...patch } });

  return (
    <div className="grid gap-5 lg:grid-cols-2">
      <Panneau
        titre="Règles de transfert vers un commercial"
        description="Situations dans lesquelles l’Agent passe la main à une personne."
      >
        <div className="space-y-1">
          {DECLENCHEURS_TRANSFERT.map((d) => (
            <CaseACocher
              key={d.cle}
              id={`decl-${d.cle}`}
              label={d.label}
              coche={Boolean(config.transfert.declencheurs[d.cle])}
              onChange={(v) =>
                majTransfert({ declencheurs: { ...config.transfert.declencheurs, [d.cle]: v } })
              }
            />
          ))}
        </div>
      </Panneau>

      <div className="space-y-5">
        <Panneau titre="Commercial assigné" description="Destinataire par défaut des demandes transférées.">
          <div className="space-y-4">
            <LigneChamp label="Commercial par défaut">
              <Select value={config.transfert.commercialId} onValueChange={(v) => majTransfert({ commercialId: v })}>
                <SelectTrigger className="h-9 text-[13px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {utilisateurs.map((u) => (
                    <SelectItem key={u.id} value={u.id}>
                      {u.nom} — {u.role}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </LigneChamp>
            <LigneChamp label="Message de transfert">
              <Textarea
                rows={3}
                className="text-[13px]"
                value={config.transfert.message}
                onChange={(e) => majTransfert({ message: e.target.value })}
              />
            </LigneChamp>
            <p className="text-[12px] text-muted-foreground">
              L’Agent adapte automatiquement ce message à la langue du client (darija, arabe, anglais).
              L’affectation peut ensuite être affinée par ville, produit, propriétaire du compte ou
              disponibilité.
            </p>
          </div>
        </Panneau>

        <Panneau titre="Limites de l’Agent" description="Garde-fous appliqués à chaque conversation.">
          <div className="space-y-1">
            {LIMITES_AGENT.map((l) => (
              <CaseACocher
                key={l.cle}
                id={`lim-${l.cle}`}
                label={l.label}
                coche={Boolean(config.transfert.limites[l.cle])}
                onChange={(v) => majTransfert({ limites: { ...config.transfert.limites, [l.cle]: v } })}
              />
            ))}
          </div>
        </Panneau>
      </div>
    </div>
  );
}
