import { useRef, useState } from "react";
import { GripVertical, ImagePlus, Plus, Sparkles, Star, Trash2, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { EnTeteDetail, Panneau } from "@/components/app/ui-kit";
import { Lien } from "@/components/app/nav";
import type { Produit } from "@/data/sinmat";
import { cn } from "@/lib/utils";

export const CATEGORIES = [
  "Terrassement",
  "Démolition",
  "Béton",
  "Énergie",
  "Compactage",
  "Accès",
  "Découpe",
  "Divers",
];

interface Spec {
  label: string;
  valeur: string;
  unite?: string | undefined;
}

/** Redimensionne et compresse une image en data URL pour un stockage local léger. */
function lireImage(fichier: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const lecteur = new FileReader();
    lecteur.onerror = () => reject(new Error("lecture impossible"));
    lecteur.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error("image invalide"));
      img.onload = () => {
        const max = 900;
        const ratio = Math.min(1, max / Math.max(img.width, img.height));
        const canvas = document.createElement("canvas");
        canvas.width = Math.round(img.width * ratio);
        canvas.height = Math.round(img.height * ratio);
        const ctx = canvas.getContext("2d");
        if (!ctx) return resolve(String(lecteur.result));
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL("image/jpeg", 0.72));
      };
      img.src = String(lecteur.result);
    };
    lecteur.readAsDataURL(fichier);
  });
}

export interface FormulaireProduitProps {
  produit?: Produit | undefined;
  onEnregistrer: (valeurs: Partial<Produit>) => void;
  onAnnuler: () => void;
}

export function FormulaireProduit({ produit, onEnregistrer, onAnnuler }: FormulaireProduitProps) {
  const edition = Boolean(produit);
  const inputFichier = useRef<HTMLInputElement>(null);

  const [nom, setNom] = useState(produit?.nom ?? "");
  const [reference, setReference] = useState(produit?.reference ?? "");
  const [categorie, setCategorie] = useState(produit?.categorie ?? "Compactage");
  const [sousCategorie, setSousCategorie] = useState(produit?.sousCategorie ?? "");
  const [marque, setMarque] = useState(produit?.marque ?? "");
  const [fournisseur, setFournisseur] = useState(produit?.fournisseur ?? "");
  const [description, setDescription] = useState(produit?.description ?? "");

  const [images, setImages] = useState<string[]>(
    produit?.images && produit.images.length > 0
      ? produit.images
      : produit?.image
        ? [produit.image]
        : [],
  );
  const [survol, setSurvol] = useState(false);

  const [venteActive, setVenteActive] = useState(produit?.venteActive ?? true);
  const [locationActive, setLocationActive] = useState(produit?.locationActive ?? true);

  const [prixVente, setPrixVente] = useState(String(produit?.prixVente ?? ""));
  const [tva, setTva] = useState(String(produit?.tva ?? 20));
  const [prixMinimum, setPrixMinimum] = useState(String(produit?.prixMinimum ?? ""));
  const [remiseMax, setRemiseMax] = useState(String(produit?.remiseMax ?? ""));

  const [uniteLocation, setUniteLocation] = useState<"Jour" | "Semaine" | "Mois">(
    produit?.uniteLocation ?? "Jour",
  );
  const [prixBase, setPrixBase] = useState(
    String(
      produit
        ? produit.uniteLocation === "Semaine"
          ? produit.prixSemaine
          : produit.uniteLocation === "Mois"
            ? produit.prixMois
            : produit.prixJour
        : "",
    ),
  );

  const [stock, setStock] = useState(String(produit?.stock ?? ""));
  const [reserve, setReserve] = useState(String(produit?.reserve ?? 0));
  const [enLocation, setEnLocation] = useState(String(produit?.enLocation ?? 0));
  const [maintenance, setMaintenance] = useState(String(produit?.maintenance ?? 0));

  const [specs, setSpecs] = useState<Spec[]>(produit?.specs ?? []);

  const [poids, setPoids] = useState(String(produit?.poids ?? ""));
  const [longueur, setLongueur] = useState(String(produit?.longueur ?? ""));
  const [largeur, setLargeur] = useState(String(produit?.largeur ?? ""));
  const [hauteur, setHauteur] = useState(String(produit?.hauteur ?? ""));
  const [livrable, setLivrable] = useState(produit?.livrable ?? true);
  const [infosLogistiques, setInfosLogistiques] = useState(produit?.infosLogistiques ?? "");

  const [qualificationIA, setQualificationIA] = useState(produit?.qualificationIA ?? true);

  const nb = (v: string) => Math.max(0, Number(v) || 0);
  const total = nb(stock);
  const engage = nb(reserve) + nb(enLocation) + nb(maintenance);
  const stockInvalide = engage > total;

  const ajouterFichiers = async (fichiers: FileList | null) => {
    if (!fichiers?.length) return;
    const nouvelles: string[] = [];
    for (const f of Array.from(fichiers)) {
      if (!f.type.startsWith("image/")) continue;
      try {
        nouvelles.push(await lireImage(f));
      } catch {
        toast.error("Image illisible", { description: f.name });
      }
    }
    if (nouvelles.length) setImages((p) => [...p, ...nouvelles]);
  };

  const enregistrer = () => {
    if (!nom.trim() || !reference.trim() || !categorie) {
      toast.error("Champs obligatoires manquants", {
        description: "Nom, référence et catégorie sont requis.",
      });
      return;
    }
    if (stockInvalide) {
      toast.error("Stock incohérent", {
        description: "Réservé + en location + maintenance dépasse le stock total.",
      });
      return;
    }
    const base = nb(prixBase);
    onEnregistrer({
      nom: nom.trim(),
      reference: reference.trim().toUpperCase(),
      categorie,
      sousCategorie: sousCategorie.trim(),
      marque: marque.trim(),
      fournisseur: fournisseur.trim() || marque.trim() || "—",
      description: description.trim(),
      image: images[0] ?? "",
      images,
      venteActive,
      locationActive,
      prixVente: venteActive ? nb(prixVente) : 0,
      tva: nb(tva),
      prixMinimum: nb(prixMinimum),
      remiseMax: nb(remiseMax),
      uniteLocation,
      prixJour: locationActive
        ? uniteLocation === "Jour"
          ? base
          : uniteLocation === "Semaine"
            ? Math.round(base / 7)
            : Math.round(base / 30)
        : 0,
      prixSemaine: locationActive
        ? uniteLocation === "Semaine"
          ? base
          : uniteLocation === "Jour"
            ? base * 7
            : Math.round(base / 4)
        : 0,
      prixMois: locationActive
        ? uniteLocation === "Mois"
          ? base
          : uniteLocation === "Jour"
            ? base * 30
            : base * 4
        : 0,
      stock: total,
      reserve: nb(reserve),
      enLocation: nb(enLocation),
      maintenance: nb(maintenance),
      specs: specs.filter((s) => s.label.trim()),
      poids: nb(poids),
      longueur: nb(longueur),
      largeur: nb(largeur),
      hauteur: nb(hauteur),
      livrable,
      infosLogistiques: infosLogistiques.trim(),
      qualificationIA,
    });
  };

  const champ = (label: string, valeur: string, set: (v: string) => void, requis = false, type = "text") => (
    <div>
      <Label className="text-[12px]">
        {label} {requis && <span className="text-primary">*</span>}
      </Label>
      <Input type={type} className="mt-1 h-9 text-[13px]" value={valeur} onChange={(e) => set(e.target.value)} />
    </div>
  );

  return (
    <div>
      <EnTeteDetail
        retour={{ to: "/catalogue", libelle: "Catalogue" }}
        titre={edition ? `Modifier — ${produit?.nom}` : "Nouveau matériel"}
        sousTitre="Renseignez les informations du matériel, sa commercialisation et ses caractéristiques."
        actions={
          <>
            <Button variant="outline" size="sm" onClick={onAnnuler}>
              Annuler
            </Button>
            <Button size="sm" onClick={enregistrer}>
              {edition ? "Enregistrer les modifications" : "Enregistrer le produit"}
            </Button>
          </>
        }
      />

      <div className="grid gap-5 p-6 lg:grid-cols-3">
        <div className="space-y-5 lg:col-span-2">
          <Panneau titre="Informations générales" description="Les champs marqués d'une étoile sont obligatoires.">
            <div className="grid gap-3 sm:grid-cols-2">
              {champ("Nom du produit", nom, setNom, true)}
              {champ("Référence produit", reference, setReference, true)}
              <div>
                <Label className="text-[12px]">
                  Catégorie <span className="text-primary">*</span>
                </Label>
                <Select value={categorie} onValueChange={setCategorie}>
                  <SelectTrigger className="mt-1 h-9 text-[13px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((c) => (
                      <SelectItem key={c} value={c}>
                        {c}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {champ("Sous-catégorie", sousCategorie, setSousCategorie)}
              {champ("Marque", marque, setMarque)}
              {champ("Fournisseur", fournisseur, setFournisseur)}
            </div>
            <div className="mt-3">
              <Label className="text-[12px]">Description</Label>
              <Textarea
                className="mt-1 min-h-[90px] text-[13px]"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
          </Panneau>

          <Panneau titre="Photos du produit" description="La première image est la photo principale affichée au catalogue.">
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setSurvol(true);
              }}
              onDragLeave={() => setSurvol(false)}
              onDrop={(e) => {
                e.preventDefault();
                setSurvol(false);
                void ajouterFichiers(e.dataTransfer.files);
              }}
              onClick={() => inputFichier.current?.click()}
              className={cn(
                "flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-8 text-center transition-colors",
                survol ? "border-primary bg-primary/[0.06]" : "border-border hover:bg-surface-muted/60",
              )}
            >
              <ImagePlus className="size-6 text-muted-foreground" />
              <p className="mt-2 text-[13px] font-medium">Glissez vos photos ici</p>
              <p className="text-[12px] text-muted-foreground">ou cliquez pour parcourir (JPG, PNG)</p>
              <input
                ref={inputFichier}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={(e) => void ajouterFichiers(e.target.files)}
              />
            </div>

            {images.length > 0 && (
              <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
                {images.map((src, i) => (
                  <div key={i} className="group relative overflow-hidden rounded-lg border border-border">
                    <img src={src} alt={`Photo ${i + 1} du produit`} className="aspect-square w-full object-cover" />
                    {i === 0 && (
                      <span className="absolute left-1.5 top-1.5 rounded bg-primary px-1.5 py-0.5 text-[10px] font-semibold text-primary-foreground">
                        Principale
                      </span>
                    )}
                    <div className="absolute inset-x-0 bottom-0 flex justify-between gap-1 bg-foreground/70 p-1 opacity-0 transition-opacity group-hover:opacity-100">
                      <button
                        type="button"
                        title="Définir comme principale"
                        className="rounded p-1 text-white hover:bg-white/20"
                        onClick={() => setImages((p) => [p[i]!, ...p.filter((_, j) => j !== i)])}
                      >
                        <Star className="size-3.5" />
                      </button>
                      <button
                        type="button"
                        title="Retirer"
                        className="rounded p-1 text-white hover:bg-white/20"
                        onClick={() => setImages((p) => p.filter((_, j) => j !== i))}
                      >
                        <X className="size-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Panneau>

          <Panneau titre="Mode de commercialisation">
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="flex items-center justify-between rounded-lg border border-border p-3">
                <Label className="text-[13px]">Disponible à la vente</Label>
                <Switch checked={venteActive} onCheckedChange={setVenteActive} />
              </div>
              <div className="flex items-center justify-between rounded-lg border border-border p-3">
                <Label className="text-[13px]">Disponible à la location</Label>
                <Switch checked={locationActive} onCheckedChange={setLocationActive} />
              </div>
            </div>
          </Panneau>

          {venteActive && (
            <Panneau titre="Tarification vente">
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {champ("Prix de vente HT (DH)", prixVente, setPrixVente, false, "number")}
                {champ("TVA (%)", tva, setTva, false, "number")}
                {champ("Prix minimum autorisé (DH)", prixMinimum, setPrixMinimum, false, "number")}
                {champ("Remise maximale (%)", remiseMax, setRemiseMax, false, "number")}
              </div>
              <p className="mt-2 text-[12px] text-muted-foreground">Devise : DH (MAD)</p>
            </Panneau>
          )}

          {locationActive && (
            <Panneau
              titre="Tarification location"
              description="Tarif de base uniquement. Les paliers détaillés se configurent dans Qualification Agent IA."
            >
              <div className="grid gap-3 sm:grid-cols-3">
                <div>
                  <Label className="text-[12px]">Unité principale</Label>
                  <Select value={uniteLocation} onValueChange={(v) => setUniteLocation(v as typeof uniteLocation)}>
                    <SelectTrigger className="mt-1 h-9 text-[13px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {["Jour", "Semaine", "Mois"].map((u) => (
                        <SelectItem key={u} value={u}>
                          {u}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                {champ(`Prix de base (DH / ${uniteLocation.toLowerCase()})`, prixBase, setPrixBase, false, "number")}
                {produit && (
                  <div className="flex items-end">
                    <Lien to={`/qualification/${produit.id}`}>
                      <Button variant="outline" size="sm" className="gap-1.5">
                        <Sparkles className="size-3.5" /> Configurer les règles de location
                      </Button>
                    </Lien>
                  </div>
                )}
              </div>
            </Panneau>
          )}

          <Panneau titre="Stock">
            <div className="grid gap-3 sm:grid-cols-4">
              {champ("Stock total", stock, setStock, false, "number")}
              {champ("Stock réservé", reserve, setReserve, false, "number")}
              {champ("Stock en location", enLocation, setEnLocation, false, "number")}
              {champ("En maintenance", maintenance, setMaintenance, false, "number")}
            </div>
            <p className={cn("mt-2 text-[12px]", stockInvalide ? "text-destructive" : "text-muted-foreground")}>
              {stockInvalide
                ? "Réservé + en location + maintenance ne peut pas dépasser le stock total."
                : `Stock disponible : ${Math.max(0, total - engage)} unité(s)`}
            </p>
          </Panneau>

          <Panneau titre="Caractéristiques techniques">
            <div className="space-y-2">
              {specs.map((s, i) => (
                <div key={i} className="grid grid-cols-12 items-end gap-2">
                  <div className="col-span-1 flex justify-center pb-2 text-muted-foreground">
                    <GripVertical className="size-4" />
                  </div>
                  <div className="col-span-4">
                    <Input
                      className="h-9 text-[13px]"
                      placeholder="Nom (ex. Puissance)"
                      value={s.label}
                      onChange={(e) =>
                        setSpecs((p) => p.map((x, j) => (j === i ? { ...x, label: e.target.value } : x)))
                      }
                    />
                  </div>
                  <div className="col-span-3">
                    <Input
                      className="h-9 text-[13px]"
                      placeholder="Valeur"
                      value={s.valeur}
                      onChange={(e) =>
                        setSpecs((p) => p.map((x, j) => (j === i ? { ...x, valeur: e.target.value } : x)))
                      }
                    />
                  </div>
                  <div className="col-span-2">
                    <Input
                      className="h-9 text-[13px]"
                      placeholder="Unité"
                      value={s.unite ?? ""}
                      onChange={(e) =>
                        setSpecs((p) => p.map((x, j) => (j === i ? { ...x, unite: e.target.value } : x)))
                      }
                    />
                  </div>
                  <div className="col-span-2 flex gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-9"
                      disabled={i === 0}
                      onClick={() =>
                        setSpecs((p) => {
                          const c = [...p];
                          const [x] = c.splice(i, 1);
                          c.splice(i - 1, 0, x!);
                          return c;
                        })
                      }
                    >
                      ↑
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-9 text-muted-foreground hover:text-destructive"
                      onClick={() => setSpecs((p) => p.filter((_, j) => j !== i))}
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                </div>
              ))}
              <Button
                variant="outline"
                size="sm"
                className="gap-1"
                onClick={() => setSpecs((p) => [...p, { label: "", valeur: "", unite: "" }])}
              >
                <Plus className="size-4" /> Ajouter une caractéristique
              </Button>
            </div>
          </Panneau>

          <Panneau titre="Logistique">
            <div className="grid gap-3 sm:grid-cols-4">
              {champ("Poids (kg)", poids, setPoids, false, "number")}
              {champ("Longueur (mm)", longueur, setLongueur, false, "number")}
              {champ("Largeur (mm)", largeur, setLargeur, false, "number")}
              {champ("Hauteur (mm)", hauteur, setHauteur, false, "number")}
            </div>
            <div className="mt-3 flex items-center justify-between rounded-lg border border-border p-3">
              <Label className="text-[13px]">Livraison possible</Label>
              <Switch checked={livrable} onCheckedChange={setLivrable} />
            </div>
            <div className="mt-3">
              <Label className="text-[12px]">Informations logistiques complémentaires</Label>
              <Textarea
                className="mt-1 min-h-[70px] text-[13px]"
                value={infosLogistiques}
                onChange={(e) => setInfosLogistiques(e.target.value)}
              />
            </div>
          </Panneau>
        </div>

        <div className="space-y-5">
          <Panneau titre="Agent IA">
            <div className="flex items-center justify-between">
              <Label className="text-[13px]">Qualification IA active</Label>
              <Switch checked={qualificationIA} onCheckedChange={setQualificationIA} />
            </div>
            {qualificationIA && (
              <div className="mt-3 rounded-lg border border-border bg-surface-muted/50 p-3">
                <p className="text-[12.5px] text-muted-foreground">
                  {produit
                    ? "Configurez les paliers tarifaires et les informations à collecter."
                    : "Une règle par défaut sera créée. Vous pourrez la configurer après l'enregistrement."}
                </p>
                {produit && (
                  <Lien to={`/qualification/${produit.id}`}>
                    <Button variant="outline" size="sm" className="mt-3 w-full gap-1.5">
                      <Sparkles className="size-3.5" /> Configurer les règles Agent IA
                    </Button>
                  </Lien>
                )}
              </div>
            )}
          </Panneau>

          <Panneau titre="Récapitulatif">
            <div className="space-y-2 text-[13px]">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Nom</span>
                <span className="font-medium">{nom || "—"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Référence</span>
                <span className="num font-medium">{reference || "—"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Commercialisation</span>
                <span className="font-medium">
                  {[venteActive && "Vente", locationActive && "Location"].filter(Boolean).join(" + ") || "—"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Photos</span>
                <span className="font-medium">{images.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Caractéristiques</span>
                <span className="font-medium">{specs.filter((s) => s.label.trim()).length}</span>
              </div>
            </div>
            <Button className="mt-4 w-full" onClick={enregistrer}>
              {edition ? "Enregistrer les modifications" : "Enregistrer le produit"}
            </Button>
            <Button variant="outline" className="mt-2 w-full" onClick={onAnnuler}>
              Annuler
            </Button>
          </Panneau>
        </div>
      </div>
    </div>
  );
}
