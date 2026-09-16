import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Panneau, Statut } from "@/components/app/ui-kit";
import { useAgentIA } from "@/lib/agent-ia";

export function PanneauProduitAgent({ produitId, produitNom }: { produitId: string; produitNom: string }) {
  const { etat, charge, persister, journaliser } = useAgentIA();
  const enregistre = etat.produits[produitId] ?? { utilise: true, instructions: "" };

  const [utilise, setUtilise] = useState(enregistre.utilise);
  const [instructions, setInstructions] = useState(enregistre.instructions);

  useEffect(() => {
    if (!charge) return;
    const actuel = etat.produits[produitId] ?? { utilise: true, instructions: "" };
    setUtilise(actuel.utilise);
    setInstructions(actuel.instructions);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [charge, produitId]);

  const modifie = utilise !== enregistre.utilise || instructions !== enregistre.instructions;

  const enregistrer = () => {
    persister({
      ...etat,
      produits: { ...etat.produits, [produitId]: { utilise, instructions } },
      audit: journaliser(etat, `Instructions Agent IA mises à jour : ${produitNom}`),
      enregistreLe: new Date().toISOString(),
    });
    toast.success("Configuration de l’Agent IA enregistrée.", { description: produitNom });
  };

  return (
    <Panneau
      titre="Utilisation par l’Agent IA"
      description="Consignes visibles dans le centre de configuration Agent IA."
    >
      <div className="flex items-center justify-between gap-3 rounded-md border border-border px-3 py-2.5">
        <div>
          <p className="text-[13px] font-medium text-foreground">Utilisé par l’Agent IA</p>
          <p className="text-[12px] text-muted-foreground">
            L’Agent peut proposer ce matériel dans ses réponses et qualifications.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Statut valeur={utilise ? "Oui" : "Non"} ton={utilise ? "succes" : "neutre"} />
          <Switch checked={utilise} onCheckedChange={setUtilise} />
        </div>
      </div>

      <div className="mt-4">
        <Label className="text-[12px]">Instructions Agent IA</Label>
        <Textarea
          rows={3}
          className="mt-1 text-[13px]"
          value={instructions}
          placeholder="Présenter ce produit uniquement pour les besoins de compactage léger. Demander la durée du chantier avant de proposer une location."
          onChange={(e) => setInstructions(e.target.value)}
        />
      </div>

      <div className="mt-3 flex justify-end">
        <Button size="sm" disabled={!modifie} onClick={enregistrer}>
          Enregistrer
        </Button>
      </div>
    </Panneau>
  );
}
