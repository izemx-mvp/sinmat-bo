import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Check } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { EnTeteDetail, Panneau, RailStatut } from "@/components/app/ui-kit";
import { useAller } from "@/components/app/nav";
import { useSinmat } from "@/data/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/campagnes/nouvelle")({
  head: () => ({
    meta: [
      { title: "Nouvelle campagne WhatsApp — Gestion SINMAT" },
      {
        name: "description",
        content:
          "Assistant de création de campagne WhatsApp SINMAT : audience, agent IA, planification et lancement.",
      },
      { property: "og:title", content: "Nouvelle campagne WhatsApp — Gestion SINMAT" },
      {
        property: "og:description",
        content: "Configurez l'audience, l'agent IA et la planification de votre campagne.",
      },
    ],
  }),
  component: NouvelleCampagne,
});

const ETAPES = ["Informations", "Audience", "Agent IA", "Planification", "Résumé"];
const CHAMPS_QUALIF = [
  "Achat ou location",
  "Produit recherché",
  "Quantité",
  "Durée si location",
  "Date souhaitée",
  "Ville / chantier",
  "Urgence",
];

function NouvelleCampagne() {
  const { ajouterCampagne } = useSinmat();
  const aller = useAller();
  const [etape, setEtape] = useState(0);
  const [data, setData] = useState({
    nom: "Relance entreprises BTP — Tanger",
    description: "Relance de la base BTP du nord non contactée depuis 30 jours.",
    objectif: "Identifier un besoin potentiel en achat ou location de matériel de construction.",
    ville: "Tanger",
    secteur: "BTP",
    typeProspect: "Prospect",
    dernierContact: "> 30 jours",
    message:
      "Bonjour {{prenom}}, SINMAT souhaite connaître vos besoins actuels en matériel de chantier.",
    champs: CHAMPS_QUALIF,
    planification: "Programmer",
    date: "2026-09-09",
    heure: "09:30",
  });

  const audience =
    (data.ville === "Tanger" ? 218 : data.ville === "Casablanca" ? 264 : 148) -
    (data.secteur === "BTP" ? 0 : 46);

  const toggleChamp = (c: string) =>
    setData((d) => ({
      ...d,
      champs: d.champs.includes(c) ? d.champs.filter((x) => x !== c) : [...d.champs, c],
    }));

  const lancer = () => {
    const c = ajouterCampagne({
      nom: data.nom,
      objectif: data.objectif,
      audience,
      statut: data.planification === "Envoyer maintenant" ? "En cours" : "Planifiée",
      date: data.date,
      criteres: [
        `Ville = ${data.ville}`,
        `Secteur = ${data.secteur}`,
        `Dernier contact ${data.dernierContact}`,
      ],
    });
    toast.success("Campagne lancée", { description: `${c.id} · ${audience} prospects ciblés` });
    aller(`/campagnes/${c.id}`);
  };

  return (
    <div>
      <EnTeteDetail
        retour={{ to: "/campagnes", libelle: "Campagnes WhatsApp" }}
        titre="Nouvelle campagne"
        sousTitre="Configurez l'audience et l'agent IA de prospection."
      />
      <div className="border-b border-border bg-surface px-6 py-5">
        <RailStatut etapes={ETAPES} courante={etape} />
      </div>

      <div className="mx-auto max-w-3xl space-y-5 p-6">
        {etape === 0 && (
          <Panneau titre="Informations de la campagne">
            <div className="space-y-4">
              <div>
                <Label className="text-[12.5px]">Nom de campagne</Label>
                <Input
                  className="mt-1"
                  value={data.nom}
                  onChange={(e) => setData({ ...data, nom: e.target.value })}
                />
              </div>
              <div>
                <Label className="text-[12.5px]">Description</Label>
                <Textarea
                  className="mt-1"
                  value={data.description}
                  onChange={(e) => setData({ ...data, description: e.target.value })}
                />
              </div>
              <div>
                <Label className="text-[12.5px]">Objectif</Label>
                <Input
                  className="mt-1"
                  value={data.objectif}
                  onChange={(e) => setData({ ...data, objectif: e.target.value })}
                />
              </div>
            </div>
          </Panneau>
        )}

        {etape === 1 && (
          <Panneau titre="Audience ciblée" description="Filtrez votre base de prospection">
            <div className="grid gap-4 sm:grid-cols-2">
              <ChampSelect
                label="Ville"
                valeur={data.ville}
                options={["Tanger", "Casablanca", "Rabat", "Tétouan", "Kénitra", "Marrakech"]}
                onChange={(v) => setData({ ...data, ville: v })}
              />
              <ChampSelect
                label="Secteur"
                valeur={data.secteur}
                options={["BTP", "Travaux publics", "Second œuvre", "Industrie"]}
                onChange={(v) => setData({ ...data, secteur: v })}
              />
              <ChampSelect
                label="Type"
                valeur={data.typeProspect}
                options={["Prospect", "Client", "Prospect & Client"]}
                onChange={(v) => setData({ ...data, typeProspect: v })}
              />
              <ChampSelect
                label="Dernier contact"
                valeur={data.dernierContact}
                options={["> 7 jours", "> 30 jours", "> 90 jours", "> 180 jours"]}
                onChange={(v) => setData({ ...data, dernierContact: v })}
              />
            </div>
            <div className="mt-5 rounded-lg border border-primary/25 bg-primary/[0.05] px-4 py-3">
              <p className="num text-[15px] font-semibold text-foreground">
                {audience} prospects correspondent à vos critères.
              </p>
              <p className="text-[12.5px] text-muted-foreground">
                L'audience est recalculée automatiquement à chaque modification de filtre.
              </p>
            </div>
          </Panneau>
        )}

        {etape === 2 && (
          <Panneau titre="Configuration de l'agent IA">
            <div className="space-y-4">
              <div>
                <Label className="text-[12.5px]">Message d'ouverture</Label>
                <Textarea
                  className="mt-1"
                  value={data.message}
                  onChange={(e) => setData({ ...data, message: e.target.value })}
                />
                <p className="mt-1 text-[12px] text-muted-foreground">
                  Variables disponibles : {"{{prenom}}"}, {"{{entreprise}}"}, {"{{ville}}"}
                </p>
              </div>
              <div>
                <Label className="text-[12.5px]">Objectif de qualification</Label>
                <Input
                  className="mt-1"
                  value={data.objectif}
                  onChange={(e) => setData({ ...data, objectif: e.target.value })}
                />
              </div>
              <div>
                <p className="section-label">Informations à collecter</p>
                <div className="mt-2 grid gap-2 sm:grid-cols-2">
                  {CHAMPS_QUALIF.map((c) => (
                    <label
                      key={c}
                      className="flex cursor-pointer items-center gap-2.5 rounded-md border border-border px-3 py-2 text-[13px] transition-colors hover:bg-surface-muted"
                    >
                      <Checkbox
                        checked={data.champs.includes(c)}
                        onCheckedChange={() => toggleChamp(c)}
                      />
                      {c}
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </Panneau>
        )}

        {etape === 3 && (
          <Panneau titre="Planification">
            <div className="flex gap-2">
              {["Envoyer maintenant", "Programmer"].map((p) => (
                <button
                  key={p}
                  onClick={() => setData({ ...data, planification: p })}
                  className={cn(
                    "flex-1 rounded-lg border px-4 py-3 text-left text-[13.5px] font-medium transition-colors",
                    data.planification === p
                      ? "border-primary bg-primary/[0.06] text-foreground"
                      : "border-border text-muted-foreground hover:bg-surface-muted",
                  )}
                >
                  {p}
                </button>
              ))}
            </div>
            {data.planification === "Programmer" && (
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <div>
                  <Label className="text-[12.5px]">Date</Label>
                  <Input
                    type="date"
                    className="mt-1"
                    value={data.date}
                    onChange={(e) => setData({ ...data, date: e.target.value })}
                  />
                </div>
                <div>
                  <Label className="text-[12.5px]">Heure</Label>
                  <Input
                    type="time"
                    className="mt-1"
                    value={data.heure}
                    onChange={(e) => setData({ ...data, heure: e.target.value })}
                  />
                </div>
              </div>
            )}
          </Panneau>
        )}

        {etape === 4 && (
          <Panneau titre="Résumé de la campagne">
            <dl className="divide-y divide-border">
              {[
                ["Campagne", data.nom],
                ["Objectif", data.objectif],
                ["Audience", `${audience} prospects`],
                [
                  "Critères",
                  `${data.ville} · ${data.secteur} · Dernier contact ${data.dernierContact}`,
                ],
                ["Informations collectées", `${data.champs.length} champs de qualification`],
                [
                  "Envoi",
                  data.planification === "Envoyer maintenant"
                    ? "Immédiat"
                    : `${data.date} à ${data.heure}`,
                ],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between gap-6 py-2.5">
                  <dt className="text-[12.5px] text-muted-foreground">{k}</dt>
                  <dd className="text-right text-[13.5px] font-medium text-foreground">{v}</dd>
                </div>
              ))}
            </dl>
          </Panneau>
        )}

        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            disabled={etape === 0}
            onClick={() => setEtape((e) => e - 1)}
          >
            Précédent
          </Button>
          {etape < ETAPES.length - 1 ? (
            <Button onClick={() => setEtape((e) => e + 1)}>Continuer</Button>
          ) : (
            <Button onClick={lancer} className="gap-1.5">
              <Check className="size-4" /> Lancer la campagne
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

function ChampSelect({
  label,
  valeur,
  options,
  onChange,
}: {
  label: string;
  valeur: string;
  options: string[];
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <Label className="text-[12.5px]">{label}</Label>
      <Select value={valeur} onValueChange={onChange}>
        <SelectTrigger className="mt-1">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {options.map((o) => (
            <SelectItem key={o} value={o}>
              {o}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
