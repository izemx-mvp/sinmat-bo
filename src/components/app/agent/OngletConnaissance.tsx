import { useMemo, useState } from "react";
import {
  BookOpen,
  Database,
  FileText,
  Globe,
  HelpCircle,
  Package,
  Plus,
  Search,
  Trash2,
  Upload,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Cellule, Kpi, Onglets, Panneau, Statut, Tableau, VideEtat } from "@/components/app/ui-kit";
import { Lien } from "@/components/app/nav";
import {
  CATEGORIES_CONNAISSANCE,
  formaterDateCourte,
  type EntreeFaq,
  type ProduitAgent,
  type SourceConnaissance,
  type TypeSource,
} from "@/lib/agent-ia";
import type { Produit } from "@/data/sinmat";
import { LigneChamp } from "./partages";

type TypeAjout = TypeSource | "Catalogue";

const TYPES: { type: TypeAjout; label: string; icone: typeof FileText; aide: string }[] = [
  { type: "Document", label: "Importer un document", icone: Upload, aide: "PDF, DOCX, XLSX, CSV, TXT" },
  { type: "Texte", label: "Ajouter du texte", icone: FileText, aide: "Information saisie manuellement" },
  { type: "URL", label: "Ajouter une URL", icone: Globe, aide: "Page web autorisée" },
  { type: "FAQ", label: "FAQ", icone: HelpCircle, aide: "Questions / réponses" },
  { type: "Catalogue", label: "Catalogue produit", icone: Package, aide: "Déjà synchronisé" },
];

const FILTRES = ["Toutes les sources", "Documents", "FAQ", "Catalogue", "Texte", "Web"];

const nouvelId = () => `KB-${Date.now()}`;

export function OngletConnaissance({
  sources,
  majSources,
  produits,
  produitsAgent,
  priorites,
  majPriorites,
}: {
  sources: SourceConnaissance[];
  majSources: (suivant: SourceConnaissance[], libelle: string) => void;
  produits: Produit[];
  produitsAgent: Record<string, ProduitAgent>;
  priorites: string[];
  majPriorites: (p: string[]) => void;
}) {
  const [filtre, setFiltre] = useState(FILTRES[0]!);
  const [q, setQ] = useState("");
  const [categorie, setCategorie] = useState("Toutes");
  const [statut, setStatut] = useState("Tous");
  const [ouvertAjout, setOuvertAjout] = useState(false);
  const [detail, setDetail] = useState<SourceConnaissance | null>(null);
  const [edition, setEdition] = useState(false);

  const filtrees = useMemo(() => {
    const t = q.trim().toLowerCase();
    return sources.filter((s) => {
      if (t && !`${s.nom} ${s.categorie} ${s.contenu}`.toLowerCase().includes(t)) return false;
      if (categorie !== "Toutes" && s.categorie !== categorie) return false;
      if (statut !== "Tous" && s.statut !== statut) return false;
      if (filtre === "Documents") return s.type === "Document";
      if (filtre === "FAQ") return s.type === "FAQ";
      if (filtre === "Texte") return s.type === "Texte";
      if (filtre === "Web") return s.type === "URL";
      if (filtre === "Catalogue") return false;
      return true;
    });
  }, [sources, q, categorie, statut, filtre]);

  const derniere = sources
    .map((s) => s.modifieLe)
    .sort()
    .at(-1);

  const produitsInstructions = produits.filter((p) => produitsAgent[p.id]?.instructions?.trim());

  const supprimer = (s: SourceConnaissance) => {
    majSources(sources.filter((x) => x.id !== s.id), `Source supprimée : ${s.nom}`);
    toast.success("Source supprimée", { description: s.nom });
    setDetail(null);
  };

  const basculer = (s: SourceConnaissance) => {
    majSources(
      sources.map((x) => (x.id === s.id ? { ...x, actif: !x.actif } : x)),
      `${s.actif ? "Source désactivée" : "Source activée"} : ${s.nom}`,
    );
  };

  const enregistrerDetail = (maj: SourceConnaissance) => {
    majSources(
      sources.map((x) => (x.id === maj.id ? { ...maj, modifieLe: new Date().toISOString() } : x)),
      `Source modifiée : ${maj.nom}`,
    );
    toast.success("Source mise à jour", { description: maj.nom });
    setEdition(false);
    setDetail(maj);
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="font-display text-[17px] font-bold text-foreground">Base de connaissance de l’Agent</h2>
          <p className="text-[13px] text-muted-foreground">
            Ajoutez les informations que l’Agent IA peut utiliser pour répondre aux prospects et clients.
          </p>
        </div>
        <Button size="sm" className="gap-1.5" onClick={() => setOuvertAjout(true)}>
          <Plus className="size-4" /> Ajouter une source
        </Button>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <Kpi libelle="Documents" valeur={String(sources.length)} ton="info" icone={BookOpen} />
        <Kpi libelle="Informations actives" valeur={String(sources.filter((s) => s.actif).length)} ton="succes" />
        <Kpi libelle="Dernière mise à jour" valeur={derniere ? formaterDateCourte(derniere) : "—"} ton="neutre" />
        <Kpi
          libelle="Documents à traiter"
          valeur={String(sources.filter((s) => s.statut !== "Prêt").length)}
          ton="attention"
        />
      </div>

      <div className="space-y-5">
        <Panneau bodyClassName="p-0">
          <div className="flex flex-wrap items-center justify-between gap-3 px-4 pt-3">
            <Onglets valeurs={FILTRES} actif={filtre} onChange={setFiltre} />
          </div>
          <div className="flex flex-wrap items-center gap-2 border-b border-border px-4 py-3">
            <div className="relative">
              <Search className="pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Rechercher dans la base de connaissance..."
                className="h-9 w-[280px] pl-8 text-[13px]"
              />
            </div>
            <Select value={categorie} onValueChange={setCategorie}>
              <SelectTrigger className="h-9 w-[180px] text-[13px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Toutes">Toutes les catégories</SelectItem>
                {CATEGORIES_CONNAISSANCE.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={statut} onValueChange={setStatut}>
              <SelectTrigger className="h-9 w-[150px] text-[13px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Tous">Tous les statuts</SelectItem>
                <SelectItem value="Prêt">Prêt</SelectItem>
                <SelectItem value="Traitement">Traitement</SelectItem>
                <SelectItem value="Erreur">Erreur</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {filtre === "Catalogue" ? (
            <div className="p-6">
              <VideEtat
                titre="Catalogue synchronisé"
                description="Le catalogue SINMAT est une source structurée automatique, il n’apparaît pas dans la liste des documents."
              />
            </div>
          ) : filtrees.length === 0 ? (
            <div className="p-6">
              <VideEtat titre="Aucune source" description="Aucune source ne correspond à votre recherche." />
            </div>
          ) : (
            <Tableau
              colonnes={["Document", "Catégorie", "Type", "Date d’ajout", "Statut", "Utilisé par l’Agent", "Actions"]}
            >
              {filtrees.map((s) => (
                <tr key={s.id} className="group transition-colors hover:bg-surface-muted/60">
                  <Cellule className="max-w-[280px]">
                    <span className="block truncate font-semibold text-foreground">{s.nom}</span>
                    <span className="block text-[11.5px] text-muted-foreground">
                      {s.url ?? s.description ?? s.id}
                    </span>
                  </Cellule>
                  <Cellule className="text-muted-foreground">{s.categorie}</Cellule>
                  <Cellule className="text-muted-foreground">{s.format}</Cellule>
                  <Cellule className="text-muted-foreground">{formaterDateCourte(s.ajouteLe)}</Cellule>
                  <Cellule>
                    <Statut
                      valeur={s.statut}
                      ton={s.statut === "Prêt" ? "succes" : s.statut === "Traitement" ? "attention" : "danger"}
                    />
                  </Cellule>
                  <Cellule>
                    <Statut valeur={s.actif ? "Oui" : "Non"} ton={s.actif ? "succes" : "neutre"} />
                  </Cellule>
                  <Cellule>
                    <div className="flex items-center gap-1.5">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 px-2 text-[12px]"
                        onClick={() => {
                          setDetail(s);
                          setEdition(false);
                        }}
                      >
                        Voir
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 px-2 text-[12px]"
                        onClick={() => {
                          setDetail(s);
                          setEdition(true);
                        }}
                      >
                        Modifier
                      </Button>
                      <Button variant="ghost" size="sm" className="h-7 px-2 text-[12px]" onClick={() => basculer(s)}>
                        {s.actif ? "Désactiver" : "Activer"}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 px-2 text-destructive hover:text-destructive"
                        onClick={() => supprimer(s)}
                      >
                        <Trash2 className="size-3.5" />
                      </Button>
                    </div>
                  </Cellule>
                </tr>
              ))}
            </Tableau>
          )}
        </Panneau>

        <div className="grid gap-5 lg:grid-cols-3">
          <Panneau titre="Catalogue SINMAT" description="Source structurée utilisée en priorité par l’Agent.">
            <div className="flex items-center justify-between gap-3">
              <span className="inline-flex items-center gap-2 text-[13px] font-semibold text-foreground">
                <Database className="size-4 text-primary" /> {produits.length} références
              </span>
              <Statut valeur="Synchronisé" ton="succes" />
            </div>
            <ul className="mt-3 space-y-1 text-[12.5px] text-muted-foreground">
              <li>Produits, références et descriptions</li>
              <li>Caractéristiques techniques</li>
              <li>Disponibilité vente et location</li>
              <li>Prix et règles de tarification location</li>
              <li>Stock et disponibilité configurés</li>
            </ul>
            <p className="mt-3 text-[12px] text-muted-foreground">
              Les produits ne doivent pas être dupliqués manuellement dans la base de connaissance.
            </p>
            <Lien to="/catalogue">
              <Button variant="outline" size="sm" className="mt-3 w-full">
                Ouvrir le catalogue
              </Button>
            </Lien>
          </Panneau>

          <Panneau titre="Priorité des sources" description="En cas de conflit, la source la plus haute prime.">
            <ol className="space-y-1.5">
              {priorites.map((p, i) => (
                <li
                  key={p}
                  className="flex items-center gap-2.5 rounded-md border border-border px-3 py-2 text-[13px]"
                >
                  <span className="num flex size-5 items-center justify-center rounded bg-primary/10 text-[11px] font-bold text-primary">
                    {i + 1}
                  </span>
                  <span className="flex-1 truncate text-foreground/90">{p}</span>
                  <div className="flex gap-1">
                    <button
                      type="button"
                      className="text-[12px] text-muted-foreground hover:text-foreground disabled:opacity-30"
                      disabled={i === 0}
                      onClick={() => {
                        const suivant = [...priorites];
                        const prec = suivant[i - 1]!;
                        suivant[i - 1] = p;
                        suivant[i] = prec;
                        majPriorites(suivant);
                      }}
                    >
                      ↑
                    </button>
                    <button
                      type="button"
                      className="text-[12px] text-muted-foreground hover:text-foreground disabled:opacity-30"
                      disabled={i === priorites.length - 1}
                      onClick={() => {
                        const suivant = [...priorites];
                        const apres = suivant[i + 1]!;
                        suivant[i + 1] = p;
                        suivant[i] = apres;
                        majPriorites(suivant);
                      }}
                    >
                      ↓
                    </button>
                  </div>
                </li>
              ))}
            </ol>
          </Panneau>

          <Panneau titre="Instructions produit" description="Consignes définies dans les fiches produit.">
            {produitsInstructions.length === 0 ? (
              <p className="text-[13px] text-muted-foreground">
                Aucune instruction produit. Ajoutez-en depuis l’onglet « Règles Agent IA » d’une fiche produit.
              </p>
            ) : (
              <ul className="space-y-2">
                {produitsInstructions.map((p) => (
                  <li key={p.id} className="rounded-md border border-border p-2.5">
                    <Lien to={`/catalogue/${p.id}`} className="text-[13px] font-semibold text-foreground hover:text-primary">
                      {p.nom}
                    </Lien>
                    <p className="mt-0.5 text-[12.5px] text-muted-foreground">
                      {produitsAgent[p.id]?.instructions}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </Panneau>
        </div>
      </div>

      <DialogueAjout
        ouvert={ouvertAjout}
        onOuvert={setOuvertAjout}
        onAjouter={(s) => {
          majSources([s, ...sources], `Source ajoutée : ${s.nom}`);
          toast.success("Source ajoutée à la base de connaissance", { description: s.nom });
        }}
      />

      <DialogueDetail
        source={detail}
        edition={edition}
        onEdition={setEdition}
        onFermer={() => setDetail(null)}
        onEnregistrer={enregistrerDetail}
      />
    </div>
  );
}

/* --------------------------- Dialogue : ajout ----------------------------- */

function DialogueAjout({
  ouvert,
  onOuvert,
  onAjouter,
}: {
  ouvert: boolean;
  onOuvert: (v: boolean) => void;
  onAjouter: (s: SourceConnaissance) => void;
}) {
  const [type, setType] = useState<TypeAjout>("Document");
  const [nom, setNom] = useState("");
  const [categorie, setCategorie] = useState("Produits");
  const [description, setDescription] = useState("");
  const [contenu, setContenu] = useState("");
  const [url, setUrl] = useState("");
  const [fichier, setFichier] = useState<{ nom: string; format: string } | null>(null);
  const [faq, setFaq] = useState<EntreeFaq[]>([
    { id: "f1", question: "", reponse: "", active: true },
  ]);

  const reinitialiser = () => {
    setType("Document");
    setNom("");
    setCategorie("Produits");
    setDescription("");
    setContenu("");
    setUrl("");
    setFichier(null);
    setFaq([{ id: "f1", question: "", reponse: "", active: true }]);
  };

  const valide =
    type === "Catalogue"
      ? false
      : type === "FAQ"
        ? nom.trim().length > 0 && faq.some((f) => f.question.trim() && f.reponse.trim())
        : type === "URL"
          ? url.trim().length > 0 && nom.trim().length > 0
          : type === "Texte"
            ? nom.trim().length > 0 && contenu.trim().length > 0
            : (fichier !== null || nom.trim().length > 0) && nom.trim().length > 0;

  const soumettre = () => {
    if (!valide || type === "Catalogue") return;
    const maintenant = new Date().toISOString();
    const s: SourceConnaissance = {
      id: nouvelId(),
      type,
      nom: nom.trim(),
      categorie,
      description: description.trim(),
      format:
        type === "Document" ? (fichier?.format ?? "PDF") : type === "URL" ? "Web" : type === "FAQ" ? "FAQ" : "Texte",
      contenu: type === "URL" ? `Contenu importé depuis ${url.trim()}` : contenu.trim(),
      faq: type === "FAQ" ? faq.filter((f) => f.question.trim() && f.reponse.trim()) : [],
      statut: "Prêt",
      actif: true,
      ajouteLe: maintenant,
      modifieLe: maintenant,
      instructionsUtiliser: "",
      instructionsEviter: "",
      ...(type === "URL" ? { url: url.trim() } : {}),
    };
    onAjouter(s);
    reinitialiser();
    onOuvert(false);
  };

  return (
    <Dialog
      open={ouvert}
      onOpenChange={(v) => {
        onOuvert(v);
        if (!v) reinitialiser();
      }}
    >
      <DialogContent className="max-h-[88vh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Ajouter à la base de connaissance</DialogTitle>
          <DialogDescription>Choisissez le type d’information à mettre à disposition de l’Agent.</DialogDescription>
        </DialogHeader>

        <div className="grid gap-2 sm:grid-cols-5">
          {TYPES.map((t) => (
            <button
              key={t.label}
              type="button"
              onClick={() => setType(t.type)}
              className={
                type === t.type
                  ? "rounded-lg border border-primary bg-primary/5 p-2.5 text-left"
                  : "rounded-lg border border-border p-2.5 text-left hover:bg-surface-muted"
              }
            >
              <t.icone className="size-4 text-primary" />
              <p className="mt-1.5 text-[12.5px] font-semibold text-foreground">{t.label}</p>
              <p className="text-[11px] text-muted-foreground">{t.aide}</p>
            </button>
          ))}
        </div>

        <div className="space-y-4">
          {type === "Catalogue" && (
            <div className="rounded-lg border border-success/25 bg-success/[0.05] p-4 text-[13px] text-foreground/85">
              Le catalogue SINMAT est déjà synchronisé automatiquement avec l’Agent IA. Les produits, prix et
              règles de location sont lus directement depuis le module Catalogue.
            </div>
          )}

          {type === "Document" && (
            <>
              <label className="flex cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-border px-6 py-8 text-center hover:bg-surface-muted">
                <Upload className="size-5 text-muted-foreground" />
                <p className="mt-2 text-[13px] font-medium text-foreground">
                  Glissez-déposez votre fichier ici
                </p>
                <p className="text-[12px] text-muted-foreground">ou choisir un fichier — PDF, DOCX, XLSX, CSV, TXT</p>
                {fichier && <p className="mt-2 text-[12.5px] font-semibold text-primary">{fichier.nom}</p>}
                <input
                  type="file"
                  className="hidden"
                  accept=".pdf,.docx,.xlsx,.csv,.txt"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (!f) return;
                    const ext = (f.name.split(".").pop() ?? "PDF").toUpperCase();
                    setFichier({ nom: f.name, format: ext });
                    if (!nom.trim()) setNom(f.name);
                  }}
                />
              </label>
              <LigneChamp label="Nom du document">
                <Input className="h-9 text-[13px]" value={nom} onChange={(e) => setNom(e.target.value)} />
              </LigneChamp>
            </>
          )}

          {(type === "Texte" || type === "FAQ") && (
            <LigneChamp label="Titre">
              <Input
                className="h-9 text-[13px]"
                value={nom}
                onChange={(e) => setNom(e.target.value)}
                placeholder={type === "Texte" ? "Conditions de livraison" : "FAQ location"}
              />
            </LigneChamp>
          )}

          {type === "URL" && (
            <>
              <LigneChamp label="URL">
                <Input
                  className="h-9 text-[13px]"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://sinmat.ma/location"
                />
              </LigneChamp>
              <LigneChamp label="Nom de la source">
                <Input className="h-9 text-[13px]" value={nom} onChange={(e) => setNom(e.target.value)} />
              </LigneChamp>
            </>
          )}

          {type !== "Catalogue" && (
            <LigneChamp label="Catégorie">
              <Select value={categorie} onValueChange={setCategorie}>
                <SelectTrigger className="h-9 text-[13px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES_CONNAISSANCE.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </LigneChamp>
          )}

          {type === "Texte" && (
            <LigneChamp label="Contenu">
              <Textarea rows={5} className="text-[13px]" value={contenu} onChange={(e) => setContenu(e.target.value)} />
            </LigneChamp>
          )}

          {(type === "Document" || type === "URL") && (
            <LigneChamp label="Description (optionnel)">
              <Textarea
                rows={2}
                className="text-[13px]"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </LigneChamp>
          )}

          {type === "FAQ" && (
            <div className="space-y-3">
              {faq.map((f, i) => (
                <div key={f.id} className="rounded-md border border-border p-3">
                  <div className="flex items-center justify-between">
                    <Label className="text-[12px]">Question {i + 1}</Label>
                    {faq.length > 1 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 px-2 text-destructive hover:text-destructive"
                        onClick={() => setFaq(faq.filter((x) => x.id !== f.id))}
                      >
                        <Trash2 className="size-3.5" />
                      </Button>
                    )}
                  </div>
                  <Input
                    className="mt-1 h-9 text-[13px]"
                    value={f.question}
                    placeholder="Est-ce que SINMAT propose la location ?"
                    onChange={(e) =>
                      setFaq(faq.map((x) => (x.id === f.id ? { ...x, question: e.target.value } : x)))
                    }
                  />
                  <Textarea
                    rows={2}
                    className="mt-2 text-[13px]"
                    value={f.reponse}
                    placeholder="Oui, certains équipements sont disponibles à la location…"
                    onChange={(e) => setFaq(faq.map((x) => (x.id === f.id ? { ...x, reponse: e.target.value } : x)))}
                  />
                </div>
              ))}
              <Button
                variant="outline"
                size="sm"
                className="gap-1.5"
                onClick={() => setFaq([...faq, { id: `f${Date.now()}`, question: "", reponse: "", active: true }])}
              >
                <Plus className="size-3.5" /> Ajouter une question
              </Button>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOuvert(false)}>
            Annuler
          </Button>
          <Button disabled={!valide} onClick={soumettre}>
            {type === "Texte" ? "Enregistrer" : type === "URL" ? "Ajouter la source" : "Ajouter à la base"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

/* --------------------------- Dialogue : détail ---------------------------- */

function DialogueDetail({
  source,
  edition,
  onEdition,
  onFermer,
  onEnregistrer,
}: {
  source: SourceConnaissance | null;
  edition: boolean;
  onEdition: (v: boolean) => void;
  onFermer: () => void;
  onEnregistrer: (s: SourceConnaissance) => void;
}) {
  const [brouillon, setBrouillon] = useState<SourceConnaissance | null>(source);

  if (source && (!brouillon || brouillon.id !== source.id)) setBrouillon(source);
  const s = edition ? brouillon : source;

  return (
    <Dialog open={Boolean(source)} onOpenChange={(v) => !v && onFermer()}>
      <DialogContent className="max-h-[88vh] max-w-2xl overflow-y-auto">
        {s && (
          <>
            <DialogHeader>
              <DialogTitle>{s.nom}</DialogTitle>
              <DialogDescription>
                {s.categorie} · {s.format} · ajouté le {formaterDateCourte(s.ajouteLe)}
              </DialogDescription>
            </DialogHeader>

            <div className="flex flex-wrap gap-2">
              <Statut valeur={s.statut} ton={s.statut === "Prêt" ? "succes" : s.statut === "Traitement" ? "attention" : "danger"} />
              <Statut valeur={s.actif ? "Utilisé par l’Agent : Oui" : "Utilisé par l’Agent : Non"} ton={s.actif ? "succes" : "neutre"} />
              <Statut valeur={`Modifié le ${formaterDateCourte(s.modifieLe)}`} ton="neutre" />
              {s.url && <Statut valeur="Source web" ton="info" />}
            </div>

            <div className="space-y-4">
              <div>
                <Label className="text-[12px]">Contenu extrait</Label>
                {edition ? (
                  <Textarea
                    rows={6}
                    className="mt-1 text-[13px]"
                    value={brouillon?.contenu ?? ""}
                    onChange={(e) => setBrouillon((b) => (b ? { ...b, contenu: e.target.value } : b))}
                  />
                ) : (
                  <div className="mt-1 max-h-48 overflow-y-auto rounded-md border border-border bg-surface-muted/50 p-3 text-[13px] leading-relaxed text-foreground/85">
                    {s.contenu || "Aucun contenu extrait pour le moment."}
                  </div>
                )}
              </div>

              {s.faq.length > 0 && (
                <div className="space-y-2">
                  <Label className="text-[12px]">Questions / réponses</Label>
                  {s.faq.map((f) => (
                    <div key={f.id} className="rounded-md border border-border p-3">
                      <p className="text-[13px] font-semibold text-foreground">{f.question}</p>
                      <p className="mt-1 text-[12.5px] text-muted-foreground">{f.reponse}</p>
                      <div className="mt-2">
                        <Statut valeur={f.active ? "Active" : "Inactive"} ton={f.active ? "succes" : "neutre"} />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div>
                <Label className="text-[12px]">Instructions d’utilisation — « Utiliser uniquement pour… »</Label>
                <Textarea
                  rows={2}
                  className="mt-1 text-[13px]"
                  disabled={!edition}
                  value={(edition ? brouillon?.instructionsUtiliser : s.instructionsUtiliser) ?? ""}
                  placeholder="L’Agent peut utiliser ce document pour répondre aux questions sur les conditions de location."
                  onChange={(e) => setBrouillon((b) => (b ? { ...b, instructionsUtiliser: e.target.value } : b))}
                />
              </div>
              <div>
                <Label className="text-[12px]">« Ne pas utiliser pour… »</Label>
                <Textarea
                  rows={2}
                  className="mt-1 text-[13px]"
                  disabled={!edition}
                  value={(edition ? brouillon?.instructionsEviter : s.instructionsEviter) ?? ""}
                  placeholder="Ne pas utiliser pour communiquer un prix précis."
                  onChange={(e) => setBrouillon((b) => (b ? { ...b, instructionsEviter: e.target.value } : b))}
                />
              </div>
            </div>

            <DialogFooter>
              {edition ? (
                <>
                  <Button variant="outline" onClick={() => onEdition(false)}>
                    Annuler
                  </Button>
                  <Button onClick={() => brouillon && onEnregistrer(brouillon)}>Enregistrer</Button>
                </>
              ) : (
                <>
                  <Button variant="outline" onClick={onFermer}>
                    Fermer
                  </Button>
                  <Button onClick={() => onEdition(true)}>Modifier</Button>
                </>
              )}
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
