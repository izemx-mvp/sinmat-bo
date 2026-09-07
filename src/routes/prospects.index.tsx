import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Download, Filter, Plus, Search, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Cellule, Ligne, Onglets, Panneau, Statut, Tableau, VideEtat } from "@/components/app/ui-kit";
import { Lien, useAller } from "@/components/app/nav";
import { useSinmat } from "@/data/store";
import { formatDateCourte, nomUtilisateur, utilisateurs, type Ville } from "@/data/sinmat";

export const Route = createFileRoute("/prospects/")({
  head: () => ({
    meta: [
      { title: "Prospects — Gestion SINMAT" },
      {
        name: "description",
        content:
          "Base de prospection SINMAT : qualification automatique, sources, relances et responsables commerciaux.",
      },
      { property: "og:title", content: "Prospects — Gestion SINMAT" },
      {
        property: "og:description",
        content: "Gérez et qualifiez votre base de prospection.",
      },
    ],
  }),
  component: PageProspects,
});

const TABS = [
  "Tous",
  "Nouveaux",
  "À contacter",
  "Contactés",
  "Intéressés",
  "À relancer",
  "Non intéressés",
];

const VILLES: Ville[] = ["Casablanca", "Tanger", "Rabat", "Tétouan", "Kénitra", "Marrakech"];

function PageProspects() {
  const { prospects, ajouterProspect } = useSinmat();
  const aller = useAller();
  const [tab, setTab] = useState("Tous");
  const [q, setQ] = useState("");
  const [ville, setVille] = useState("Toutes");
  const [source, setSource] = useState("Toutes");
  const [responsable, setResponsable] = useState("Tous");
  const [interet, setInteret] = useState("Tous");
  const [ouvert, setOuvert] = useState(false);
  const [form, setForm] = useState({
    entreprise: "",
    contact: "",
    telephone: "",
    ville: "Casablanca" as Ville,
    secteur: "BTP",
  });

  const filtres = useMemo(() => {
    const parTab: Record<string, (s: string) => boolean> = {
      Tous: () => true,
      Nouveaux: (s) => s === "Nouveau",
      "À contacter": (s) => s === "À contacter",
      Contactés: (s) => s === "Contacté",
      Intéressés: (s) => s === "Intéressé",
      "À relancer": (s) => s === "À relancer",
      "Non intéressés": (s) => s === "Non intéressé",
    };
    return prospects.filter(
      (p) =>
        parTab[tab]!(p.statut) &&
        (ville === "Toutes" || p.ville === ville) &&
        (source === "Toutes" || p.source === source) &&
        (responsable === "Tous" || p.responsableId === responsable) &&
        (interet === "Tous" || p.interet === interet) &&
        (q === "" ||
          `${p.entreprise} ${p.contact} ${p.telephone} ${p.ville}`
            .toLowerCase()
            .includes(q.toLowerCase())),
    );
  }, [prospects, tab, ville, source, responsable, interet, q]);

  const compteurs = {
    Tous: prospects.length,
    Nouveaux: prospects.filter((p) => p.statut === "Nouveau").length,
    "À contacter": prospects.filter((p) => p.statut === "À contacter").length,
    Contactés: prospects.filter((p) => p.statut === "Contacté").length,
    Intéressés: prospects.filter((p) => p.statut === "Intéressé").length,
    "À relancer": prospects.filter((p) => p.statut === "À relancer").length,
    "Non intéressés": prospects.filter((p) => p.statut === "Non intéressé").length,
  };

  const sources = Array.from(new Set(prospects.map((p) => p.source)));

  const creer = () => {
    if (!form.entreprise.trim()) {
      toast.error("Le nom de l'entreprise est obligatoire.");
      return;
    }
    const p = ajouterProspect(form);
    setOuvert(false);
    setForm({ entreprise: "", contact: "", telephone: "", ville: "Casablanca", secteur: "BTP" });
    toast.success("Prospect ajouté", { description: p.entreprise });
    aller(`/prospects/${p.id}`);
  };

  return (
    <div className="space-y-4 p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Rechercher un prospect..."
            className="h-9 pl-9"
          />
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="h-9 gap-1.5" onClick={() => toast("Import de fichier CSV/Excel bientôt disponible.")}>
            <Download className="size-4" /> Importer un fichier
          </Button>
          <Dialog open={ouvert} onOpenChange={setOuvert}>
            <DialogTrigger asChild>
              <Button size="sm" className="h-9 gap-1.5 font-semibold">
                <Plus className="size-4" /> Ajouter un prospect
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Nouveau prospect</DialogTitle>
                <DialogDescription>
                  Renseignez les informations de base. La qualification pourra être automatisée
                  via une campagne WhatsApp.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <Label className="text-[12.5px]">Entreprise</Label>
                  <Input
                    className="mt-1"
                    value={form.entreprise}
                    onChange={(e) => setForm({ ...form, entreprise: e.target.value })}
                    placeholder="Ex. Atlas Construction"
                  />
                </div>
                <div>
                  <Label className="text-[12.5px]">Contact</Label>
                  <Input
                    className="mt-1"
                    value={form.contact}
                    onChange={(e) => setForm({ ...form, contact: e.target.value })}
                    placeholder="Ex. Rachid Alaoui"
                  />
                </div>
                <div>
                  <Label className="text-[12.5px]">Téléphone</Label>
                  <Input
                    className="mt-1"
                    value={form.telephone}
                    onChange={(e) => setForm({ ...form, telephone: e.target.value })}
                    placeholder="+212 6.."
                  />
                </div>
                <div>
                  <Label className="text-[12.5px]">Ville</Label>
                  <Select
                    value={form.ville}
                    onValueChange={(v) => setForm({ ...form, ville: v as Ville })}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {VILLES.map((v) => (
                        <SelectItem key={v} value={v}>
                          {v}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-[12.5px]">Secteur</Label>
                  <Input
                    className="mt-1"
                    value={form.secteur}
                    onChange={(e) => setForm({ ...form, secteur: e.target.value })}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setOuvert(false)}>
                  Annuler
                </Button>
                <Button onClick={creer}>Créer le prospect</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Panneau bodyClassName="p-0">
        <div className="px-4">
          <Onglets valeurs={TABS} actif={tab} onChange={setTab} compteurs={compteurs} />
        </div>

        <div className="flex flex-wrap items-center gap-2 border-b border-border bg-surface-muted/50 px-4 py-2.5">
          <span className="flex items-center gap-1.5 text-[12px] font-medium text-muted-foreground">
            <Filter className="size-3.5" /> Filtres
          </span>
          <SelectFiltre valeur={ville} onChange={setVille} options={["Toutes", ...VILLES]} label="Ville" />
          <SelectFiltre valeur={source} onChange={setSource} options={["Toutes", ...sources]} label="Source" />
          <SelectFiltre
            valeur={responsable}
            onChange={setResponsable}
            options={["Tous", ...utilisateurs.filter((u) => u.role === "Commercial").map((u) => u.id)]}
            label="Responsable"
            rendu={(v) => (v === "Tous" ? "Responsable : tous" : nomUtilisateur(v))}
          />
          <SelectFiltre
            valeur={interet}
            onChange={setInteret}
            options={["Tous", "Élevé", "Moyen", "Faible"]}
            label="Intérêt"
          />
          <span className="ml-auto text-[12.5px] text-muted-foreground">
            {filtres.length} prospect{filtres.length > 1 ? "s" : ""}
          </span>
        </div>

        {filtres.length === 0 ? (
          <div className="p-6">
            <VideEtat
              titre="Aucun prospect trouvé"
              description="Ajustez vos filtres ou ajoutez un nouveau prospect à votre base."
            />
          </div>
        ) : (
          <Tableau
            colonnes={[
              "Prospect",
              "Entreprise",
              "Téléphone",
              "Ville",
              "Secteur",
              "Source",
              "Dernière activité",
              "Qualification",
              "Responsable",
              "",
            ]}
          >
            {filtres.map((p) => (
              <Ligne key={p.id} to={`/prospects/${p.id}`}>
                <Cellule className="font-semibold">
                  <span className="flex items-center gap-2">
                    {p.contact || "—"}
                    {p.ia && <Sparkles className="size-3.5 text-primary" />}
                  </span>
                </Cellule>
                <Cellule>{p.entreprise}</Cellule>
                <Cellule className="num text-muted-foreground">{p.telephone}</Cellule>
                <Cellule>{p.ville}</Cellule>
                <Cellule className="text-muted-foreground">{p.secteur}</Cellule>
                <Cellule className="text-muted-foreground">{p.source}</Cellule>
                <Cellule className="text-muted-foreground">
                  {formatDateCourte(p.derniereActivite)}
                </Cellule>
                <Cellule>
                  <Statut valeur={p.qualification} />
                </Cellule>
                <Cellule className="text-muted-foreground">
                  {nomUtilisateur(p.responsableId)}
                </Cellule>
                <Cellule>
                  <Lien to={`/prospects/${p.id}`}>
                    <Button variant="ghost" size="sm" className="h-7 text-[12px]">
                      Ouvrir
                    </Button>
                  </Lien>
                </Cellule>
              </Ligne>
            ))}
          </Tableau>
        )}
      </Panneau>
    </div>
  );
}

export function SelectFiltre({
  valeur,
  onChange,
  options,
  label,
  rendu,
}: {
  valeur: string;
  onChange: (v: string) => void;
  options: string[];
  label: string;
  rendu?: (v: string) => string;
}) {
  return (
    <Select value={valeur} onValueChange={onChange}>
      <SelectTrigger className="h-8 w-auto min-w-[130px] gap-1.5 border-border bg-surface text-[12.5px]">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {options.map((o) => (
          <SelectItem key={o} value={o} className="text-[13px]">
            {rendu ? rendu(o) : o === options[0] ? `${label} : ${o.toLowerCase()}` : o}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
