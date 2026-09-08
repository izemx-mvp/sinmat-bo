import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { EnTeteDetail, Panneau } from "@/components/app/ui-kit";
import { useAller } from "@/components/app/nav";
import { useSinmat } from "@/data/store";
import {
  calculerLocation,
  palierVentePourQte,
  type LigneDocument,
  type Produit,
  type RegleProduit,
  type TypeActivite,
} from "@/data/sinmat";
import { VisionneuseDocument, type DocumentPDF } from "@/components/app/DocumentPDF";

import { cn } from "@/lib/utils";

export const Route = createFileRoute("/devis/nouveau")({
  head: () => ({
    meta: [
      { title: "Nouveau devis — Gestion SINMAT" },
      { name: "description", content: "Création d'une proposition commerciale SINMAT." },
      { property: "og:title", content: "Nouveau devis — Gestion SINMAT" },
      { property: "og:description", content: "Construisez une proposition commerciale." },
    ],
  }),
  component: NouveauDevis,
});

function NouveauDevis() {
  const { clients, creerDevis, produits: tous, regles } = useSinmat();
  const aller = useAller();

  const produits = useMemo(() => tous.filter((p) => !p.archive), [tous]);
  const premier = produits[0];

  const [clientId, setClientId] = useState(clients[0]?.id ?? "");
  const [type, setType] = useState<TypeActivite>("Vente");
  const [expiration, setExpiration] = useState("2026-09-21");
  const [conditions, setConditions] = useState("Paiement 30 % à la commande, solde à la livraison.");
  const [lignes, setLignes] = useState<LigneDocument[]>(
    premier
      ? [{ produitId: premier.id, designation: premier.nom, quantite: 1, prixUnitaire: premier.prixVente, remise: 0, tva: 20 }]
      : [],
  );

  const client = clients.find((c) => c.id === clientId);
  const regleDe = (produitId: string): RegleProduit | undefined => regles.find((r) => r.produitId === produitId);

  /** Prix unitaire issu des règles Agent IA enregistrées (paliers vente / location). */
  const prixUnitaire = (
    p: Produit,
    activite: TypeActivite,
    quantite: number,
    duree: number,
    unite: "Jour" | "Semaine" | "Mois",
  ) => {
    const regle = regleDe(p.id);
    if (activite === "Vente") {
      const palier = regle ? palierVentePourQte(regle.paliersVente, Math.max(1, quantite)) : undefined;
      return palier?.prix ?? p.prixVente;
    }
    const jours = Math.max(1, duree) * (unite === "Jour" ? 1 : unite === "Semaine" ? 7 : 30);
    if (regle) {
      const calcul = calculerLocation(regle.paliersLocation, jours, 1);
      if (calcul.total > 0) return Math.round(calcul.total / Math.max(1, duree));
    }
    return unite === "Jour" ? p.prixJour : unite === "Semaine" ? p.prixSemaine : p.prixMois;
  };

  const total = useMemo(
    () =>
      lignes.reduce(
        (s, l) => s + l.quantite * l.prixUnitaire * (l.duree ?? 1) * (1 - l.remise / 100) * (1 + l.tva / 100),
        0,
      ),
    [lignes],
  );

  const ajouterLigne = () => {
    const p = premier;
    if (!p) return;
    setLignes((prev) => [
      ...prev,
      {
        produitId: p.id,
        designation: p.nom,
        quantite: 1,
        prixUnitaire: prixUnitaire(p, type, 1, 1, "Jour"),
        remise: 0,
        tva: p.tva ?? 20,
        ...(type === "Location" ? { duree: 1, uniteDuree: "Jour" as const } : {}),
      },
    ]);
  };

  const majLigne = (i: number, patch: Partial<LigneDocument>) => {
    setLignes((prev) =>
      prev.map((l, idx) => {
        if (idx !== i) return l;
        const next = { ...l, ...patch };
        const p = produits.find((x) => x.id === next.produitId);
        if (p) {
          if (patch.produitId) {
            next.designation = p.nom;
            next.tva = p.tva ?? 20;
          }
          if (patch.produitId || patch.quantite || patch.duree || patch.uniteDuree) {
            next.prixUnitaire = prixUnitaire(
              p,
              type,
              next.quantite,
              next.duree ?? 1,
              next.uniteDuree ?? "Jour",
            );
          }
        }
        return next;
      }),
    );
  };

  const supprimerLigne = (i: number) => setLignes((prev) => prev.filter((_, idx) => idx !== i));

  const totalHT = lignes.reduce((s, l) => s + l.quantite * l.prixUnitaire * (l.duree ?? 1) * (1 - l.remise / 100), 0);

  const apercu: DocumentPDF = {
    type: "Devis",
    reference: "DEV-APERÇU",
    date: "2026-09-08",
    echeance: expiration,
    echeanceLabel: "Validité",
    client: {
      nom: client?.nom ?? "—",
      contact: client?.contact,
      adresse: client?.adresse,
      ville: client?.ville,
      ice: client?.ice,
    },
    lignes: lignes.map((l) => ({
      designation: l.designation,
      reference: produits.find((p) => p.id === l.produitId)?.reference,
      quantite: l.quantite,
      duree: l.duree ? `${l.duree} ${l.uniteDuree?.toLowerCase() ?? ""}` : undefined,
      prixUnitaire: l.prixUnitaire,
      total: Math.round(l.quantite * l.prixUnitaire * (l.duree ?? 1) * (1 - l.remise / 100) * (1 + l.tva / 100)),
    })),
    totalHT: Math.round(totalHT),
    totalTVA: Math.round(total - totalHT),
    totalTTC: Math.round(total),
    conditions,
  };

  const enregistrer = () => {
    if (!clientId || lignes.length === 0) {
      toast.error("Devis incomplet", { description: "Sélectionnez un client et au moins un produit." });
      return;
    }
    const d = creerDevis({ clientId, type, lignes, conditions, expiration, statut: "Généré" });
    toast.success("Devis généré", { description: `${d.id} · ${formatDH(d.montant)}` });
    aller(`/devis/${d.id}`);
  };

  return (
    <div>
      <EnTeteDetail
        retour={{ to: "/devis", libelle: "Devis" }}
        titre="Nouveau devis"
        sousTitre="Construisez une proposition commerciale."
        actions={
          <>
            <VisionneuseDocument doc={apercu} />
            <Button size="sm" onClick={enregistrer}>
              Générer le devis
            </Button>
          </>
        }
      />


      <div className="grid gap-5 p-6 lg:grid-cols-3">
        <div className="space-y-5 lg:col-span-2">
          <Panneau titre="Lignes de la proposition">
            <div className="space-y-3">
              {lignes.map((l, i) => {
                const p = produits.find((x) => x.id === l.produitId);
                return (
                  <div key={i} className="grid gap-3 rounded-lg border border-border bg-surface-muted/40 p-3 sm:grid-cols-12">
                    <div className="sm:col-span-5">
                      <Label className="text-[12px]">Produit</Label>
                      <Select value={l.produitId} onValueChange={(v) => majLigne(i, { produitId: v })}>
                        <SelectTrigger className="mt-1">
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
                    <div className="sm:col-span-2">
                      <Label className="text-[12px]">Qté</Label>
                      <Input
                        type="number"
                        min={1}
                        value={l.quantite}
                        onChange={(e) => majLigne(i, { quantite: Math.max(1, Number(e.target.value)) })}
                        className="mt-1"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <Label className="text-[12px]">Prix unit.</Label>
                      <Input
                        type="number"
                        value={l.prixUnitaire}
                        onChange={(e) => majLigne(i, { prixUnitaire: Number(e.target.value) })}
                        className="mt-1"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <Label className="text-[12px]">Remise %</Label>
                      <Input
                        type="number"
                        value={l.remise}
                        onChange={(e) => majLigne(i, { remise: Math.max(0, Math.min(100, Number(e.target.value))) })}
                        className="mt-1"
                      />
                    </div>
                    <div className="flex items-end justify-end sm:col-span-1">
                      <Button variant="ghost" size="icon" className="size-8 text-muted-foreground hover:text-destructive" onClick={() => supprimerLigne(i)}>
                        <Trash2 className="size-4" />
                      </Button>
                    </div>
                    {type === "Location" && (
                      <div className="flex gap-2 sm:col-span-12">
                        <div className="w-24">
                          <Label className="text-[12px]">Durée</Label>
                          <Input
                            type="number"
                            min={1}
                            value={l.duree ?? 1}
                            onChange={(e) => majLigne(i, { duree: Math.max(1, Number(e.target.value)) })}
                            className="mt-1"
                          />
                        </div>
                        <div className="w-32">
                          <Label className="text-[12px]">Unité</Label>
                          <Select value={l.uniteDuree ?? "Jour"} onValueChange={(v) => majLigne(i, { uniteDuree: v as "Jour" | "Semaine" | "Mois" })}>
                            <SelectTrigger className="mt-1">
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
                      </div>
                    )}
                    <div className="sm:col-span-12 text-right text-[13px] text-muted-foreground">
                      Total ligne TTC :{" "}
                      <span className="num font-semibold text-foreground">
                        {formatDH(l.quantite * l.prixUnitaire * (l.duree ?? 1) * (1 - l.remise / 100) * (1 + l.tva / 100))}
                      </span>
                    </div>
                  </div>
                );
              })}
              <Button variant="outline" size="sm" className="gap-1" onClick={ajouterLigne}>
                <Plus className="size-4" /> Ajouter une ligne
              </Button>
            </div>
          </Panneau>

          <Panneau titre="Conditions">
            <Textarea value={conditions} onChange={(e) => setConditions(e.target.value)} className="min-h-[90px]" />
          </Panneau>
        </div>

        <div className="space-y-5">
          <Panneau titre="Paramètres">
            <div className="space-y-4">
              <div>
                <Label className="text-[12.5px]">Client</Label>
                <Select value={clientId} onValueChange={setClientId}>
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {clients.map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.nom}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-[12.5px]">Type</Label>
                <div className="mt-1 flex gap-2">
                  {(["Vente", "Location"] as TypeActivite[]).map((t) => (
                    <button
                      key={t}
                      onClick={() => setType(t)}
                      className={cn(
                        "flex-1 rounded-md border px-3 py-2 text-[13px] font-medium transition-colors",
                        type === t ? "border-primary bg-primary/[0.06] text-foreground" : "border-border text-muted-foreground hover:bg-surface-muted",
                      )}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <Label className="text-[12.5px]">Date d'expiration</Label>
                <Input type="date" value={expiration} onChange={(e) => setExpiration(e.target.value)} className="mt-1" />
              </div>
            </div>
          </Panneau>

          <Panneau titre="Récapitulatif">
            <div className="space-y-2 text-[13px]">
              <div className="flex justify-between text-muted-foreground">
                <span>Client</span>
                <span className="font-medium text-foreground">{client?.nom ?? "—"}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Type</span>
                <span className="font-medium text-foreground">{type}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Lignes</span>
                <span className="font-medium text-foreground">{lignes.length}</span>
              </div>
              <div className="mt-3 flex justify-between border-t border-border pt-3 text-[16px] font-bold text-foreground">
                <span>Total TTC</span>
                <span className="num">{formatDH(total)}</span>
              </div>
            </div>
          </Panneau>
        </div>
      </div>
    </div>
  );
}

function formatDH(n: number) {
  return `${new Intl.NumberFormat("fr-FR").format(Math.round(n))} DH`;
}
