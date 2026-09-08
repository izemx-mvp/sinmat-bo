import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Cellule, EnTeteDetail, Ligne, Onglets, Panneau, Statut, Tableau, VideEtat } from "@/components/app/ui-kit";
import { useSinmat } from "@/data/store";
import { calculerLocation, formatDH, libellePalier, palierVentePourQte, type NiveauCritere } from "@/data/sinmat";

export const Route = createFileRoute("/qualification/$id")({
  head: ({ params }) => ({
    meta: [
      { title: `Règle produit ${params.id} — Gestion SINMAT` },
      {
        name: "description",
        content: "Configuration de la règle de qualification et de tarification d'un matériel SINMAT.",
      },
      { property: "og:title", content: `Règle produit ${params.id} — Gestion SINMAT` },
      { property: "og:description", content: "Paliers, critères IA et simulation." },
    ],
  }),
  component: FicheRegle,
});

const TABS = ["Général", "Tarification location", "Tarification vente", "Critères IA", "Testeur"];
const NIVEAUX: NiveauCritere[] = ["Requis", "Optionnel", "Non demandé"];

function FicheRegle() {
  const { id } = Route.useParams();
  const { regles, produits, majRegle } = useSinmat();
  const [tab, setTab] = useState("Général");
  const [qte, setQte] = useState("1");
  const [duree, setDuree] = useState("10");
  const [type, setType] = useState<"Location" | "Vente">("Location");

  const regle = regles.find((r) => r.produitId === id);
  const produit = produits.find((p) => p.id === id);

  if (!regle || !produit) {
    return (
      <div className="p-6">
        <VideEtat titre="Règle introuvable" description="Ce matériel n'a pas de règle configurée." />
      </div>
    );
  }

  const maj = (patch: Parameters<typeof majRegle>[1]) => majRegle(regle.produitId, patch);
  const nombre = (v: string) => Math.max(0, Number(v) || 0);

  const jours = Math.max(1, Number(duree) || 1);
  const quantite = Math.max(1, Number(qte) || 1);
  const calculLoc = calculerLocation(regle.paliersLocation, jours, quantite);
  const palierVente = palierVentePourQte(regle.paliersVente, quantite);
  const totalVente = (palierVente?.prix ?? 0) * quantite;
  const conforme =
    type === "Location"
      ? regle.locationActive && jours >= regle.dureeMin && jours <= regle.dureeMax
      : regle.venteActive;

  return (
    <div>
      <EnTeteDetail
        retour={{ to: "/qualification", libelle: "Qualification Agent IA" }}
        titre={produit.nom}
        badges={
          <>
            <Statut valeur={regle.actif ? "Active" : "Inactive"} ton={regle.actif ? "succes" : "neutre"} />
            <Statut valeur={regle.validationManuelle ? "Validation manuelle" : "Automatique"} ton={regle.validationManuelle ? "attention" : "info"} />
          </>
        }
        sousTitre={`${produit.reference} · ${produit.categorie} · Modifiée le ${regle.modifieLe}`}
        actions={
          <Button size="sm" onClick={() => toast.success("Règle enregistrée", { description: produit.nom })}>
            Enregistrer la règle
          </Button>
        }
      />

      <div className="space-y-5 p-6">
        <Onglets valeurs={TABS} actif={tab} onChange={setTab} />

        {tab === "Général" && (
          <div className="grid gap-5 lg:grid-cols-2">
            <Panneau titre="Disponibilité" description="Ce que l'agent IA peut proposer pour ce matériel.">
              <div className="space-y-4">
                {[
                  { label: "Règle active", valeur: regle.actif, cle: "actif" as const },
                  { label: "Vente autorisée", valeur: regle.venteActive, cle: "venteActive" as const },
                  { label: "Location autorisée", valeur: regle.locationActive, cle: "locationActive" as const },
                  { label: "Validation humaine obligatoire", valeur: regle.validationManuelle, cle: "validationManuelle" as const },
                  { label: "Prolongation autorisée", valeur: regle.prolongation, cle: "prolongation" as const },
                ].map((o) => (
                  <div key={o.cle} className="flex items-center justify-between">
                    <Label className="text-[13px]">{o.label}</Label>
                    <Switch checked={o.valeur} onCheckedChange={(v) => maj({ [o.cle]: v })} />
                  </div>
                ))}
              </div>
            </Panneau>

            <Panneau titre="Limites" description="Bornes appliquées avant toute proposition automatique.">
              <div className="grid gap-3 sm:grid-cols-2">
                {[
                  { label: "Quantité min.", v: regle.quantiteMin, k: "quantiteMin" as const },
                  { label: "Quantité max.", v: regle.quantiteMax, k: "quantiteMax" as const },
                  { label: "Durée min. (jours)", v: regle.dureeMin, k: "dureeMin" as const },
                  { label: "Durée max. (jours)", v: regle.dureeMax, k: "dureeMax" as const },
                  { label: "Caution (DH)", v: regle.caution, k: "caution" as const },
                  { label: "Pénalité retard / jour (DH)", v: regle.retardParJour, k: "retardParJour" as const },
                  { label: "Montant auto max. location (DH)", v: regle.montantAutoMax, k: "montantAutoMax" as const },
                  { label: "Approbation vente au-dessus de (DH)", v: regle.approbationVenteAuDessus, k: "approbationVenteAuDessus" as const },
                ].map((f) => (
                  <div key={f.k}>
                    <Label className="text-[12px]">{f.label}</Label>
                    <Input
                      className="mt-1 h-9 text-[13px]"
                      value={String(f.v)}
                      onChange={(e) => maj({ [f.k]: nombre(e.target.value) })}
                    />
                  </div>
                ))}
                <div>
                  <Label className="text-[12px]">Livraison</Label>
                  <Select value={regle.livraison} onValueChange={(v) => maj({ livraison: v as typeof regle.livraison })}>
                    <SelectTrigger className="mt-1 h-9 text-[13px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {["Optionnelle", "Obligatoire", "Indisponible"].map((v) => (
                        <SelectItem key={v} value={v}>
                          {v}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-[12px]">Week-end</Label>
                  <Select value={regle.weekend} onValueChange={(v) => maj({ weekend: v as typeof regle.weekend })}>
                    <SelectTrigger className="mt-1 h-9 text-[13px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {["Inclus", "Exclu", "Personnalisé"].map((v) => (
                        <SelectItem key={v} value={v}>
                          {v}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </Panneau>
          </div>
        )}

        {tab === "Tarification location" && (
          <Panneau
            titre="Paliers de location"
            description="Tarifs indicatifs modifiables — appliqués automatiquement selon la durée demandée."
            bodyClassName="p-0"
          >
            <Tableau colonnes={["Palier", "Jours min.", "Jours max.", "Unité", "Prix unitaire"]}>
              {regle.paliersLocation.map((t, i) => (
                <Ligne key={t.id}>
                  <Cellule className="font-semibold">{libellePalier(t)}</Cellule>
                  <Cellule num>{t.minJours}</Cellule>
                  <Cellule num>{t.maxJours ?? "∞"}</Cellule>
                  <Cellule>{t.unite}</Cellule>
                  <Cellule>
                    <Input
                      className="h-8 w-[130px] text-[13px]"
                      value={String(t.prix)}
                      onChange={(e) => {
                        const paliers = regle.paliersLocation.map((x, j) =>
                          j === i ? { ...x, prix: nombre(e.target.value) } : x,
                        );
                        maj({ paliersLocation: paliers });
                      }}
                    />
                  </Cellule>
                </Ligne>
              ))}
            </Tableau>
          </Panneau>
        )}

        {tab === "Tarification vente" && (
          <Panneau
            titre="Paliers de vente"
            description="Tarifs indicatifs modifiables — appliqués selon la quantité demandée."
            bodyClassName="p-0"
          >
            <Tableau colonnes={["Palier", "Qté min.", "Qté max.", "Prix unitaire"]}>
              {regle.paliersVente.map((t, i) => (
                <Ligne key={t.id}>
                  <Cellule className="font-semibold">{`${t.minQte} à ${t.maxQte ?? "+"} unités`}</Cellule>
                  <Cellule num>{t.minQte}</Cellule>
                  <Cellule num>{t.maxQte ?? "∞"}</Cellule>
                  <Cellule>
                    <Input
                      className="h-8 w-[130px] text-[13px]"
                      value={String(t.prix)}
                      onChange={(e) => {
                        const paliers = regle.paliersVente.map((x, j) =>
                          j === i ? { ...x, prix: nombre(e.target.value) } : x,
                        );
                        maj({ paliersVente: paliers });
                      }}
                    />
                  </Cellule>
                </Ligne>
              ))}
            </Tableau>
          </Panneau>
        )}

        {tab === "Critères IA" && (
          <div className="grid gap-5 lg:grid-cols-2">
            <Panneau titre="Informations à collecter" description="Ce que l'agent doit obtenir avant de qualifier.">
              <ul className="space-y-3">
                {regle.criteres.map((c, i) => (
                  <li key={c.cle} className="flex items-center justify-between gap-3">
                    <span className="text-[13px]">{c.label}</span>
                    <Select
                      value={c.niveau}
                      onValueChange={(v) => {
                        const criteres = regle.criteres.map((x, j) =>
                          j === i ? { ...x, niveau: v as NiveauCritere } : x,
                        );
                        maj({ criteres });
                      }}
                    >
                      <SelectTrigger className="h-8 w-[160px] text-[12.5px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {NIVEAUX.map((n) => (
                          <SelectItem key={n} value={n}>
                            {n}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </li>
                ))}
              </ul>
            </Panneau>

            <Panneau titre="Actions automatiques" description="Ce que l'agent IA peut déclencher seul.">
              <div className="space-y-4">
                {[
                  { label: "Qualifier le prospect", k: "qualifierProspect" as const },
                  { label: "Créer l'opportunité", k: "creerOpportunite" as const },
                  { label: "Calculer le montant", k: "calculerMontant" as const },
                  { label: "Préparer le devis", k: "preparerDevis" as const },
                ].map((a) => (
                  <div key={a.k} className="flex items-center justify-between">
                    <Label className="text-[13px]">{a.label}</Label>
                    <Switch
                      checked={regle.actionsAutomatiques[a.k]}
                      onCheckedChange={(v) =>
                        maj({ actionsAutomatiques: { ...regle.actionsAutomatiques, [a.k]: v } })
                      }
                    />
                  </div>
                ))}
              </div>
            </Panneau>
          </div>
        )}

        {tab === "Testeur" && (
          <Panneau titre="Testeur de règle" description="Vérifiez la décision de l'agent pour une demande type.">
            <div className="grid gap-4 lg:grid-cols-[1fr_1fr]">
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <Label className="text-[12px]">Type</Label>
                  <Select value={type} onValueChange={(v) => setType(v as "Location" | "Vente")}>
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
                  <Input className="mt-1 h-9 text-[13px]" value={qte} onChange={(e) => setQte(e.target.value)} />
                </div>
                {type === "Location" && (
                  <div>
                    <Label className="text-[12px]">Durée (jours)</Label>
                    <Input className="mt-1 h-9 text-[13px]" value={duree} onChange={(e) => setDuree(e.target.value)} />
                  </div>
                )}
              </div>
              <div className="rounded-lg border border-border bg-surface-muted/50 p-4 text-[13px]">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Décision</span>
                  <Statut valeur={conforme ? "Conforme" : "Non conforme"} ton={conforme ? "succes" : "danger"} />
                </div>
                <div className="mt-2 flex justify-between">
                  <span className="text-muted-foreground">Palier</span>
                  <span className="font-semibold">
                    {type === "Location"
                      ? calculLoc.palier
                        ? libellePalier(calculLoc.palier)
                        : "Aucun"
                      : palierVente
                        ? `${palierVente.minQte} à ${palierVente.maxQte ?? "+"} unités`
                        : "Aucun"}
                  </span>
                </div>
                <div className="mt-2 flex justify-between border-t border-border pt-2">
                  <span className="font-semibold">Montant estimé HT</span>
                  <span className="num font-bold text-primary">
                    {formatDH(type === "Location" ? calculLoc.total : totalVente)}
                  </span>
                </div>
              </div>
            </div>
          </Panneau>
        )}
      </div>
    </div>
  );
}
