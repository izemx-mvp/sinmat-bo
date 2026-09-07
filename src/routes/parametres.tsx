import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Building2, CreditCard, Mail, Palette, Save, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Panneau } from "@/components/app/ui-kit";

export const Route = createFileRoute("/parametres")({
  head: () => ({
    meta: [
      { title: "Paramètres — Gestion SINMAT" },
      { name: "description", content: "Configuration de la plateforme SINMAT : société, paiement, sécurité et apparence." },
      { property: "og:title", content: "Paramètres — Gestion SINMAT" },
      { property: "og:description", content: "Configuration de l'application." },
    ],
  }),
  component: PageParametres,
});

function PageParametres() {
  const [societe, setSociete] = useState("SINMAT SARL");
  const [ice, setIce] = useState("001526839000012");
  const [email, setEmail] = useState("contact@sinmat.ma");
  const [tva, setTva] = useState("20");

  const enregistrer = () => {
    toast.success("Paramètres enregistrés", { description: "Les modifications seront appliquées." });
  };

  return (
    <div className="space-y-5 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">Paramètres</h1>
          <p className="text-sm text-muted-foreground">Configuration générale de l'application</p>
        </div>
        <Button onClick={enregistrer} className="gap-1.5">
          <Save className="size-4" /> Enregistrer
        </Button>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <Panneau titre="Société" description="Informations légales et de contact" icone={<Building2 className="size-4 text-muted-foreground" />}>
          <div className="space-y-4">
            <div>
              <label className="text-[12.5px] font-medium text-muted-foreground">Raison sociale</label>
              <Input value={societe} onChange={(e) => setSociete(e.target.value)} className="mt-1" />
            </div>
            <div>
              <label className="text-[12.5px] font-medium text-muted-foreground">ICE</label>
              <Input value={ice} onChange={(e) => setIce(e.target.value)} className="mt-1" />
            </div>
            <div>
              <label className="text-[12.5px] font-medium text-muted-foreground">Email de contact</label>
              <Input value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1" />
            </div>
          </div>
        </Panneau>

        <Panneau titre="Facturation" description="Paramètres de calcul et de paiement" icone={<CreditCard className="size-4 text-muted-foreground" />}>
          <div className="space-y-4">
            <div>
              <label className="text-[12.5px] font-medium text-muted-foreground">TVA par défaut (%)</label>
              <Input value={tva} onChange={(e) => setTva(e.target.value)} className="mt-1" />
            </div>
            <div>
              <label className="text-[12.5px] font-medium text-muted-foreground">Mode de paiement principal</label>
              <select className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-[13px]">
                <option>Virement bancaire</option>
                <option>Chèque</option>
                <option>Espèces</option>
                <option>Carte bancaire</option>
              </select>
            </div>
            <div>
              <label className="text-[12.5px] font-medium text-muted-foreground">Délai d'échéance (jours)</label>
              <Input defaultValue="30" className="mt-1" />
            </div>
          </div>
        </Panneau>

        <Panneau titre="Notifications" description="Canaux de communication" icone={<Mail className="size-4 text-muted-foreground" />}>
          <div className="space-y-3">
            {["Nouveau prospect qualifié", "Devis accepté", "Paiement reçu", "Livraison planifiée"].map((label) => (
              <label key={label} className="flex items-center justify-between rounded-lg border border-border bg-surface-muted/30 p-3">
                <span className="text-[13.5px] text-foreground">{label}</span>
                <input type="checkbox" defaultChecked className="size-4 accent-primary" />
              </label>
            ))}
          </div>
        </Panneau>

        <Panneau titre="Sécurité" description="Accès et authentification" icone={<Shield className="size-4 text-muted-foreground" />}>
          <div className="space-y-3">
            <label className="flex items-center justify-between rounded-lg border border-border bg-surface-muted/30 p-3">
              <span className="text-[13.5px] text-foreground">Authentification à deux facteurs</span>
              <input type="checkbox" className="size-4 accent-primary" />
            </label>
            <label className="flex items-center justify-between rounded-lg border border-border bg-surface-muted/30 p-3">
              <span className="text-[13.5px] text-foreground">Déconnexion automatique</span>
              <input type="checkbox" defaultChecked className="size-4 accent-primary" />
            </label>
          </div>
        </Panneau>

        <Panneau titre="Apparence" description="Thème et langue" icone={<Palette className="size-4 text-muted-foreground" />}>
          <div className="space-y-4">
            <div>
              <label className="text-[12.5px] font-medium text-muted-foreground">Langue</label>
              <select defaultValue="fr" className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-[13px]">
                <option value="fr">Français</option>
                <option value="ar">العربية</option>
                <option value="en">English</option>
              </select>
            </div>
            <div>
              <label className="text-[12.5px] font-medium text-muted-foreground">Thème</label>
              <select defaultValue="dark" className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-[13px]">
                <option value="dark">Sombre industriel</option>
                <option value="light">Clair</option>
                <option value="system">Système</option>
              </select>
            </div>
          </div>
        </Panneau>
      </div>
    </div>
  );
}
