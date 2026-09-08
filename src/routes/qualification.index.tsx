import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search, Sparkles } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Cellule, Kpi, Ligne, Onglets, Panneau, Statut, Tableau, VideEtat } from "@/components/app/ui-kit";
import { useSinmat } from "@/data/store";
import { calculerLocation, formatDH, libellePalier, palierVentePourQte } from "@/data/sinmat";

export const Route = createFileRoute("/qualification/")({
  head: () => ({
    meta: [
      { title: "Qualification Agent IA — Gestion SINMAT" },
      {
        name: "description",
        content:
          "Configurez les règles de qualification et de tarification produit utilisées par l'agent IA SINMAT.",
      },
      { property: "og:title", content: "Qualification Agent IA — Gestion SINMAT" },
      { property: "og:description", content: "Règles produit, paliers tarifaires et simulateur." },
    ],
  }),
  component: PageQualification,
});

const TABS = ["Toutes", "Location active", "Vente active", "Validation manuelle", "Inactives"];

function PageQualification() {
  const { regles, produits } = useSinmat();
  const [tab, setTab] = useState("Toutes");
  const [q, setQ] = useState("");

  const [simProduit, setSimProduit] = useState(produits[0]?.id ?? "");
  const [simType, setSimType] = useState<"Location" | "Vente">("Location");
  const [simQte, setSimQte] = useState("1");
  const [simDuree, setSimDuree] = useState("10");

  const nomProduit = (id: string) => produits.find((p) => p.id === id)?.nom ?? id;

  const filtres = useMemo(() => {
    const t = q.trim().toLowerCase();
    return regles.filter((r) => {
      if (t && !nomProduit(r.produitId).toLowerCase().includes(t)) return false;
      if (tab === "Location active") return r.locationActive;
      if (tab === "Vente active") return r.venteActive;
      if (tab === "Validation manuelle") return r.validationManuelle;
      if (tab === "Inactives") return !r.actif;
      return true;
    });
  }, [regles, tab, q, produits]);

  const regle = regles.find((r) => r.produitId === simProduit);
  const resultat = useMemo(() => {
    if (!regle) return null;
    const qte = Math.max(1, Number(simQte) || 1);
    if (simType === "Location") {
      const jours = Math.max(1, Number(simDuree) || 1);
      const calcul = calculerLocation(regle.paliersLocation, jours, qte);
      const conforme =
        regle.locationActive &&
        jours >= regle.dureeMin &&
        jours <= regle.dureeMax &&
        qte >= regle.quantiteMin &&
        qte <= regle.quantiteMax;
      return {
        conforme,
        palier: calcul.palier ? libellePalier(calcul.palier) : "Aucun palier",
        prixUnitaire: calcul.prixUnitaire,
        total: calcul.total,
        auto: conforme && !regle.validationManuelle && calcul.total <= regle.montantAutoMax,
      };
    }
    const palier = palierVentePourQte(regle.paliersVente, qte);
    const total = (palier?.prix ?? 0) * qte;
    const conforme = regle.venteActive && qte >= regle.quantiteMin && qte <= regle.quantiteMax;
    return {
      conforme,
      palier: palier ? `${palier.minQte} à ${palier.maxQte ?? "+"} unités` : "Aucun palier",
      prixUnitaire: palier?.prix ?? 0,
      total,
      auto: conforme && !regle.validationManuelle && total <= regle.approbationVenteAuDessus,
    };
  }, [regle, simType, simQte, simDuree]);

  const compteurs = {
    Toutes: regles.length,
    "Location active": regles.filter((r) => r.locationActive).length,
    "Vente active": regles.filter((r) => r.venteActive).length,
    "Validation manuelle": regles.filter((r) => r.validationManuelle).length,
    Inactives: regles.filter((r) => !r.actif).length,
  };

  return (
    <div className="space-y-5 p-6">
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <Kpi libelle="Produits paramétrés" valeur={String(regles.filter((r) => r.configureLe).length)} ton="accent" icone={Sparkles} />
        <Kpi libelle="Règles actives" valeur={String(regles.filter((r) => r.actif).length)} ton="succes" />

        <Kpi
          libelle="Qualification automatique"
          valeur={String(regles.filter((r) => r.actionsAutomatiques.qualifierProspect).length)}
          ton="info"
        />
        <Kpi
          libelle="Validation manuelle"
          valeur={String(regles.filter((r) => r.validationManuelle).length)}
          ton="attention"
        />
      </div>

      <Panneau
        titre="Simulateur de qualification"
        description="Testez une demande client et vérifiez la décision de l'agent IA."
      >
        <div className="grid gap-4 lg:grid-cols-[1.2fr_1fr]">
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <Label className="text-[12px]">Produit</Label>
              <Select value={simProduit} onValueChange={setSimProduit}>
                <SelectTrigger className="mt-1 h-9 text-[13px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {produits.map((p) => (
                    <SelectItem key={p.id} value={p.id}>
                      {p.nom}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-[12px]">Type de besoin</Label>
              <Select value={simType} onValueChange={(v) => setSimType(v as "Location" | "Vente")}>
                <SelectTrigger className="mt-1 h-9 text-[13px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Location">Location</SelectItem>
                  <SelectItem value="Vente">Vente</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-[12px]">Quantité</Label>
              <Input className="mt-1 h-9 text-[13px]" value={simQte} onChange={(e) => setSimQte(e.target.value)} />
            </div>
            {simType === "Location" && (
              <div>
                <Label className="text-[12px]">Durée (jours)</Label>
                <Input className="mt-1 h-9 text-[13px]" value={simDuree} onChange={(e) => setSimDuree(e.target.value)} />
              </div>
            )}
          </div>

          <div className="rounded-lg border border-border bg-surface-muted/50 p-4">
            <p className="section-label">Résultat de la simulation</p>
            {resultat ? (
              <div className="mt-3 space-y-2 text-[13px]">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Décision</span>
                  <Statut
                    valeur={resultat.conforme ? (resultat.auto ? "Qualifié automatiquement" : "Validation requise") : "Non conforme"}
                    ton={resultat.conforme ? (resultat.auto ? "succes" : "attention") : "danger"}
                  />
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Palier appliqué</span>
                  <span className="font-semibold">{resultat.palier}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Prix unitaire</span>
                  <span className="num font-semibold">{formatDH(resultat.prixUnitaire)}</span>
                </div>
                <div className="flex justify-between border-t border-border pt-2">
                  <span className="font-semibold">Montant estimé HT</span>
                  <span className="num font-bold text-primary">{formatDH(resultat.total)}</span>
                </div>
              </div>
            ) : (
              <p className="mt-3 text-[13px] text-muted-foreground">Sélectionnez un produit.</p>
            )}
          </div>
        </div>
      </Panneau>

      <Panneau bodyClassName="p-0">
        <div className="flex flex-wrap items-center justify-between gap-3 px-4 pt-3">
          <Onglets valeurs={TABS} actif={tab} onChange={setTab} compteurs={compteurs} />
          <div className="flex items-center gap-2 pb-2">
            <div className="relative">
              <Search className="pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Rechercher un matériel..."
                className="h-9 w-[240px] pl-8 text-[13px]"
              />
            </div>
          </div>
        </div>

        {filtres.length === 0 ? (
          <div className="p-6">
            <VideEtat titre="Aucune règle" description="Aucune règle ne correspond à votre recherche." />
          </div>
        ) : (
          <Tableau
            colonnes={["Matériel", "Configuration", "Vente", "Location", "Quantité", "Durée", "Validation", "Modifiée le", "État"]}
          >
            {filtres.map((r) => (
              <Ligne key={r.produitId} to={`/qualification/${r.produitId}`}>
                <Cellule className="max-w-[280px]">
                  <span className="block truncate font-semibold text-foreground">{nomProduit(r.produitId)}</span>
                  <span className="block text-[11.5px] text-muted-foreground">{r.produitId}</span>
                </Cellule>
                <Cellule>
                  <Statut
                    valeur={r.configureLe ? "Configuré" : "À configurer"}
                    ton={r.configureLe ? "succes" : "attention"}
                  />
                </Cellule>
                <Cellule>
                  <Statut valeur={r.venteActive ? "Activée" : "Désactivée"} ton={r.venteActive ? "succes" : "neutre"} />
                </Cellule>
                <Cellule>
                  <Statut valeur={r.locationActive ? "Activée" : "Désactivée"} ton={r.locationActive ? "succes" : "neutre"} />
                </Cellule>
                <Cellule num>{`${r.quantiteMin} – ${r.quantiteMax}`}</Cellule>
                <Cellule num>{`${r.dureeMin} – ${r.dureeMax} j`}</Cellule>
                <Cellule>
                  <Statut
                    valeur={r.validationManuelle ? "Manuelle" : "Automatique"}
                    ton={r.validationManuelle ? "attention" : "info"}
                  />
                </Cellule>
                <Cellule className="text-muted-foreground">{r.modifieLe}</Cellule>
                <Cellule>
                  <Statut valeur={r.actif ? "Active" : "Inactive"} ton={r.actif ? "succes" : "neutre"} />
                </Cellule>
              </Ligne>
            ))}
          </Tableau>

        )}
      </Panneau>
    </div>
  );
}
