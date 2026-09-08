import { createFileRoute } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { Check, Download, FileSpreadsheet, Upload } from "lucide-react";
import * as XLSX from "xlsx";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Cellule, EnTeteDetail, Ligne, Panneau, Statut, Tableau, VideEtat } from "@/components/app/ui-kit";
import { useAller } from "@/components/app/nav";
import { useSinmat } from "@/data/store";
import { VILLES, utilisateurs, type Ville } from "@/data/sinmat";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/prospects/import")({
  head: () => ({
    meta: [
      { title: "Importer des prospects — Gestion SINMAT" },
      {
        name: "description",
        content: "Importez en masse vos prospects SINMAT depuis un fichier CSV, XLS ou XLSX.",
      },
      { property: "og:title", content: "Importer des prospects — Gestion SINMAT" },
      { property: "og:description", content: "Assistant d'import en masse." },
    ],
  }),
  component: PageImport,
});

const CHAMPS = [
  { cle: "entreprise", label: "Entreprise", requis: true },
  { cle: "contact", label: "Contact", requis: false },
  { cle: "telephone", label: "Téléphone", requis: true },
  { cle: "email", label: "E-mail", requis: false },
  { cle: "ville", label: "Ville", requis: false },
  { cle: "secteur", label: "Secteur", requis: false },
] as const;

type Cle = (typeof CHAMPS)[number]["cle"];

const ETAPES = ["Fichier", "Correspondance", "Vérification", "Import"];

function PageImport() {
  const { importerProspects } = useSinmat();
  const aller = useAller();
  const inputRef = useRef<HTMLInputElement>(null);
  const [etape, setEtape] = useState(0);
  const [nomFichier, setNomFichier] = useState("");
  const [colonnes, setColonnes] = useState<string[]>([]);
  const [lignes, setLignes] = useState<Record<string, string>[]>([]);
  const [mapping, setMapping] = useState<Record<Cle, string>>({
    entreprise: "",
    contact: "",
    telephone: "",
    email: "",
    ville: "",
    secteur: "",
  });
  const [source, setSource] = useState("Import fichier");
  const [responsableId, setResponsableId] = useState("U1");
  const [statut, setStatut] = useState<"Nouveau" | "À contacter">("Nouveau");
  const [survol, setSurvol] = useState(false);
  const [importes, setImportes] = useState(0);

  const lire = async (fichier: File) => {
    const buffer = await fichier.arrayBuffer();
    const classeur = XLSX.read(buffer, { type: "array" });
    const feuille = classeur.Sheets[classeur.SheetNames[0] ?? ""];
    if (!feuille) {
      toast.error("Fichier illisible", { description: "Aucune feuille de données trouvée." });
      return;
    }
    const donnees = XLSX.utils.sheet_to_json<Record<string, unknown>>(feuille, { defval: "" });
    if (donnees.length === 0) {
      toast.error("Fichier vide", { description: "Aucune ligne à importer." });
      return;
    }
    const cols = Object.keys(donnees[0] ?? {});
    const normalisees = donnees.map((d) =>
      Object.fromEntries(Object.entries(d).map(([k, v]) => [k, String(v ?? "").trim()])),
    );
    const auto = { ...mapping };
    CHAMPS.forEach((c) => {
      const trouve = cols.find((col) => col.toLowerCase().includes(c.cle.slice(0, 5)));
      if (trouve) auto[c.cle] = trouve;
    });
    setNomFichier(fichier.name);
    setColonnes(cols);
    setLignes(normalisees);
    setMapping(auto);
    setEtape(1);
    toast.success("Fichier chargé", { description: `${normalisees.length} lignes détectées` });
  };

  const modele = () => {
    const feuille = XLSX.utils.aoa_to_sheet([
      ["entreprise", "contact", "telephone", "email", "ville", "secteur"],
      ["Société Exemple SARL", "Nom Prénom", "+212 6 00 00 00 00", "contact@exemple.ma", "Casablanca", "BTP"],
    ]);
    const classeur = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(classeur, feuille, "Prospects");
    XLSX.writeFile(classeur, "modele-import-prospects-sinmat.xlsx");
    toast.success("Modèle téléchargé");
  };

  const valeur = (l: Record<string, string>, c: Cle) => (mapping[c] ? (l[mapping[c]] ?? "") : "");
  const valides = lignes.filter((l) => valeur(l, "entreprise") && valeur(l, "telephone"));
  const rejetees = lignes.length - valides.length;

  const lancer = () => {
    const n = importerProspects(
      valides.map((l) => ({
        entreprise: valeur(l, "entreprise"),
        contact: valeur(l, "contact"),
        telephone: valeur(l, "telephone"),
        email: valeur(l, "email"),
        ville: (VILLES as readonly string[]).includes(valeur(l, "ville"))
          ? (valeur(l, "ville") as Ville)
          : ("Casablanca" as Ville),
        secteur: valeur(l, "secteur") || "BTP",
      })),
      { source, responsableId, statut },
    );
    setImportes(n);
    setEtape(3);
    toast.success("Import terminé", { description: `${n} prospects ajoutés` });
  };

  return (
    <div>
      <EnTeteDetail
        retour={{ to: "/prospects", libelle: "Prospects" }}
        titre="Import en masse de prospects"
        sousTitre="Fichiers CSV, XLS et XLSX · correspondance de colonnes et contrôle qualité"
        actions={
          <Button variant="outline" size="sm" onClick={modele}>
            <Download className="size-4" /> Télécharger le modèle
          </Button>
        }
      />

      <div className="space-y-5 p-6">
        <div className="flex flex-wrap items-center gap-2">
          {ETAPES.map((e, i) => (
            <div key={e} className="flex items-center gap-2">
              <span
                className={cn(
                  "flex items-center gap-2 rounded-md px-3 py-1.5 text-[12.5px] font-semibold",
                  i === etape
                    ? "bg-primary/10 text-primary ring-1 ring-inset ring-primary/20"
                    : i < etape
                      ? "bg-success/10 text-success"
                      : "bg-muted text-muted-foreground",
                )}
              >
                {i < etape ? <Check className="size-3.5" /> : <span className="num">{i + 1}</span>}
                {e}
              </span>
              {i < ETAPES.length - 1 && <span className="h-px w-6 bg-border" />}
            </div>
          ))}
        </div>

        {etape === 0 && (
          <Panneau titre="Sélection du fichier" description="Glissez votre fichier ou parcourez votre ordinateur.">
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setSurvol(true);
              }}
              onDragLeave={() => setSurvol(false)}
              onDrop={(e) => {
                e.preventDefault();
                setSurvol(false);
                const f = e.dataTransfer.files[0];
                if (f) void lire(f);
              }}
              className={cn(
                "flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-12 text-center transition-colors",
                survol ? "border-primary bg-primary/5" : "border-border bg-surface-muted/40",
              )}
            >
              <FileSpreadsheet className="size-10 text-muted-foreground/60" />
              <p className="mt-3 text-[14px] font-semibold">Déposez votre fichier ici</p>
              <p className="mt-1 text-[12.5px] text-muted-foreground">Formats acceptés : .csv, .xls, .xlsx</p>
              <Button className="mt-4" size="sm" onClick={() => inputRef.current?.click()}>
                <Upload className="size-4" /> Parcourir
              </Button>
              <input
                ref={inputRef}
                type="file"
                accept=".csv,.xls,.xlsx"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) void lire(f);
                }}
              />
            </div>
          </Panneau>
        )}

        {etape === 1 && (
          <Panneau
            titre="Correspondance des colonnes"
            description={`${nomFichier} · ${lignes.length} lignes détectées`}
          >
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {CHAMPS.map((c) => (
                <div key={c.cle}>
                  <Label className="text-[12px]">
                    {c.label} {c.requis && <span className="text-destructive">*</span>}
                  </Label>
                  <Select
                    value={mapping[c.cle] || "—"}
                    onValueChange={(v) => setMapping((m) => ({ ...m, [c.cle]: v === "—" ? "" : v }))}
                  >
                    <SelectTrigger className="mt-1 h-9 text-[13px]">
                      <SelectValue placeholder="Colonne du fichier" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="—">Ne pas importer</SelectItem>
                      {colonnes.map((col) => (
                        <SelectItem key={col} value={col}>
                          {col}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              ))}
            </div>
            <div className="mt-5 flex justify-end gap-2">
              <Button variant="outline" size="sm" onClick={() => setEtape(0)}>
                Retour
              </Button>
              <Button
                size="sm"
                disabled={!mapping.entreprise || !mapping.telephone}
                onClick={() => setEtape(2)}
              >
                Continuer
              </Button>
            </div>
          </Panneau>
        )}

        {etape === 2 && (
          <div className="space-y-5">
            <Panneau titre="Paramètres d'import">
              <div className="grid gap-3 sm:grid-cols-3">
                <div>
                  <Label className="text-[12px]">Source</Label>
                  <Select value={source} onValueChange={setSource}>
                    <SelectTrigger className="mt-1 h-9 text-[13px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {["Import fichier", "Salon professionnel", "Base achetée", "Recommandation", "Site web"].map((s) => (
                        <SelectItem key={s} value={s}>
                          {s}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-[12px]">Responsable</Label>
                  <Select value={responsableId} onValueChange={setResponsableId}>
                    <SelectTrigger className="mt-1 h-9 text-[13px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {utilisateurs.map((u) => (
                        <SelectItem key={u.id} value={u.id}>
                          {u.nom}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-[12px]">Statut initial</Label>
                  <Select value={statut} onValueChange={(v) => setStatut(v as typeof statut)}>
                    <SelectTrigger className="mt-1 h-9 text-[13px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Nouveau">Nouveau</SelectItem>
                      <SelectItem value="À contacter">À contacter</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </Panneau>

            <Panneau
              titre="Vérification"
              description={`${valides.length} lignes valides · ${rejetees} lignes ignorées (entreprise ou téléphone manquant)`}
              bodyClassName="p-0"
            >
              {valides.length === 0 ? (
                <div className="p-6">
                  <VideEtat titre="Aucune ligne valide" description="Vérifiez la correspondance des colonnes." />
                </div>
              ) : (
                <Tableau colonnes={["Entreprise", "Contact", "Téléphone", "E-mail", "Ville", "Secteur", "État"]}>
                  {lignes.slice(0, 25).map((l, i) => {
                    const ok = valeur(l, "entreprise") && valeur(l, "telephone");
                    return (
                      <Ligne key={i}>
                        <Cellule className="font-semibold">{valeur(l, "entreprise") || "—"}</Cellule>
                        <Cellule>{valeur(l, "contact") || "—"}</Cellule>
                        <Cellule num>{valeur(l, "telephone") || "—"}</Cellule>
                        <Cellule className="text-muted-foreground">{valeur(l, "email") || "—"}</Cellule>
                        <Cellule>{valeur(l, "ville") || "—"}</Cellule>
                        <Cellule>{valeur(l, "secteur") || "—"}</Cellule>
                        <Cellule>
                          <Statut valeur={ok ? "Valide" : "Incomplet"} ton={ok ? "succes" : "danger"} />
                        </Cellule>
                      </Ligne>
                    );
                  })}
                </Tableau>
              )}
              <div className="flex justify-end gap-2 border-t border-border p-4">
                <Button variant="outline" size="sm" onClick={() => setEtape(1)}>
                  Retour
                </Button>
                <Button size="sm" disabled={valides.length === 0} onClick={lancer}>
                  Importer {valides.length} prospects
                </Button>
              </div>
            </Panneau>
          </div>
        )}

        {etape === 3 && (
          <Panneau titre="Import terminé">
            <div className="flex flex-col items-center py-8 text-center">
              <span className="flex size-12 items-center justify-center rounded-full bg-success/10 text-success">
                <Check className="size-6" />
              </span>
              <p className="mt-4 font-display text-[20px] font-bold">{importes} prospects importés</p>
              <p className="mt-1 text-[13px] text-muted-foreground">
                Source « {source} » · {rejetees} lignes ignorées
              </p>
              <div className="mt-5 flex gap-2">
                <Button variant="outline" size="sm" onClick={() => setEtape(0)}>
                  Nouvel import
                </Button>
                <Button size="sm" onClick={() => aller("/prospects")}>
                  Voir les prospects
                </Button>
              </div>
            </div>
          </Panneau>
        )}
      </div>
    </div>
  );
}
