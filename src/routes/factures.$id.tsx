import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Cellule, DocumentsLies, EnTeteDetail, Infos, Ligne, Panneau, Statut, Tableau, VideEtat } from "@/components/app/ui-kit";
import { Lien } from "@/components/app/nav";
import { useSinmat } from "@/data/store";
import { VisionneuseDocument } from "@/components/app/DocumentPDF";
import { formatDH, formatDate } from "@/data/sinmat";

export const Route = createFileRoute("/factures/$id")({
  head: ({ params }) => ({
    meta: [
      { title: `Facture ${params.id} — Gestion SINMAT` },
      { name: "description", content: "Fiche facture SINMAT : montants, échéance, historique de paiements et encaissement." },
      { property: "og:title", content: `Facture ${params.id} — Gestion SINMAT` },
      { property: "og:description", content: "Détail d'une facture client." },
    ],
  }),
  component: FicheFacture,
});

function FicheFacture() {
  const { id } = Route.useParams();
  const s = useSinmat();
  const [montant, setMontant] = useState("");
  const [mode, setMode] = useState<"Virement" | "Chèque" | "Espèces" | "Carte" | "Autre">("Virement");
  const [reference, setReference] = useState("");

  const facture = s.factures.find((f) => f.id === id);
  if (!facture) {
    return (
      <div className="p-6">
        <VideEtat titre="Facture introuvable" description="Cet enregistrement n'existe pas." />
      </div>
    );
  }

  const client = s.clients.find((c) => c.id === facture.clientId);
  const paiements = s.paiements.filter((p) => p.factureId === facture.id);
  const reste = Math.max(0, facture.ttc - facture.paye);
  const origine =
    facture.origineType === "Vente"
      ? s.ventes.find((v) => v.id === facture.origineId)
      : s.locations.find((l) => l.id === facture.origineId);
  const lignesFacture =
    origine && "lignes" in origine
      ? origine.lignes.map((l) => ({
          designation: l.designation,
          reference: l.produitId,
          quantite: l.quantite,
          duree: l.duree ? `${l.duree} ${l.uniteDuree?.toLowerCase() ?? ""}` : undefined,
          prixUnitaire: l.prixUnitaire,
          total: Math.round(l.quantite * l.prixUnitaire * (l.duree ?? 1) * (1 - l.remise / 100) * (1 + l.tva / 100)),
        }))
      : [
          {
            designation: `${facture.origineType} ${facture.origineId}`,
            quantite: 1,
            prixUnitaire: facture.ht,
            total: facture.ttc,
          },
        ];

  const enregistrer = () => {
    const m = Number(montant);
    if (!m || m <= 0 || m > reste) {
      toast.error("Montant invalide");
      return;
    }
    s.enregistrerPaiement({
      clientId: facture.clientId,
      factureId: facture.id,
      montant: m,
      date: "2026-09-07",
      mode,
      reference: reference || "—",
      commentaire: "Paiement enregistré depuis la fiche facture",
    });
    toast.success("Paiement enregistré", { description: `${formatDH(m)} · ${mode}` });
    setMontant("");
    setReference("");
  };

  return (
    <div>
      <EnTeteDetail
        retour={{ to: "/factures", libelle: "Factures" }}
        titre={facture.id}
        badges={<Statut valeur={facture.statut} />}
        sousTitre={`${client?.nom ?? "—"} · Échéance : ${formatDate(facture.echeance)}`}
        actions={
          <>
            <VisionneuseDocument
              doc={{
                type: "Facture",
                reference: facture.id,
                date: facture.date,
                echeance: facture.echeance,
                client: {
                  nom: client?.nom ?? "—",
                  contact: client?.contact,
                  adresse: client?.adresse,
                  ville: client?.ville,
                  ice: client?.ice,
                },
                lignes: lignesFacture,
                totalHT: facture.ht,
                totalTVA: facture.ttc - facture.ht,
                totalTTC: facture.ttc,
                conditions: `Origine : ${facture.origineType} ${facture.origineId}. Règlement à l'échéance indiquée.`,
              }}
            />
            {reste > 0 && (
              <Button size="sm" onClick={() => document.getElementById("paiement-form")?.scrollIntoView({ behavior: "smooth" })}>
                Enregistrer un paiement
              </Button>
            )}
          </>
        }
      />

      <div className="grid gap-5 p-6 lg:grid-cols-3">
        <div className="space-y-5 lg:col-span-2">
          <Panneau titre="Détail de la facture" bodyClassName="p-0">
            <div className="border-b border-border bg-surface-muted/50 px-5 py-3">
              <div className="flex justify-between text-[13px]">
                <span className="text-muted-foreground">Total HT</span>
                <span className="num font-semibold">{formatDH(facture.ht)}</span>
              </div>
              <div className="mt-1 flex justify-between text-[13px]">
                <span className="text-muted-foreground">TVA</span>
                <span className="num font-semibold">{formatDH(facture.ttc - facture.ht)}</span>
              </div>
              <div className="mt-2 flex justify-between border-t border-border pt-2 text-[15px]">
                <span className="font-semibold text-foreground">Total TTC</span>
                <span className="num font-bold text-foreground">{formatDH(facture.ttc)}</span>
              </div>
            </div>
            <Tableau colonnes={["Date", "Mode", "Montant", "Référence", "Commentaire"]}>
              {paiements.map((p) => (
                <Ligne key={p.id} to={`/paiements/${p.id}`}>
                  <Cellule className="text-muted-foreground">{formatDate(p.date)}</Cellule>
                  <Cellule>{p.mode}</Cellule>
                  <Cellule num className="font-semibold">{formatDH(p.montant)}</Cellule>
                  <Cellule num>{p.reference}</Cellule>
                  <Cellule className="max-w-[260px] truncate text-muted-foreground">{p.commentaire}</Cellule>
                </Ligne>
              ))}
              {paiements.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-6 text-center text-[13px] text-muted-foreground">
                    Aucun paiement enregistré.
                  </td>
                </tr>
              )}
            </Tableau>
          </Panneau>

          {reste > 0 && (
            <div id="paiement-form" className="scroll-mt-6">
            <Panneau titre="Enregistrer un paiement">
              <div className="grid gap-4 sm:grid-cols-4">
                <div>
                  <Label className="text-[12.5px]">Montant</Label>
                  <Input type="number" value={montant} onChange={(e) => setMontant(e.target.value)} placeholder={`Max ${reste}`} className="mt-1" />
                </div>
                <div>
                  <Label className="text-[12.5px]">Mode</Label>
                  <Select value={mode} onValueChange={(v) => setMode(v as typeof mode)}>
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {["Virement", "Chèque", "Espèces", "Carte", "Autre"].map((m) => (
                        <SelectItem key={m} value={m}>
                          {m}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="sm:col-span-2">
                  <Label className="text-[12.5px]">Référence</Label>
                  <Input value={reference} onChange={(e) => setReference(e.target.value)} placeholder="N° de chèque, virement..." className="mt-1" />
                </div>
              </div>
              <div className="mt-4 flex justify-end">
                <Button size="sm" onClick={enregistrer}>Enregistrer le paiement</Button>
              </div>
            </Panneau>
            </div>
          )}
        </div>

        <div className="space-y-5">
          <Panneau titre="Informations">
            <Infos
              donnees={[
                { label: "Client", valeur: client?.nom ?? "—" },
                { label: "Date", valeur: formatDate(facture.date) },
                { label: "Échéance", valeur: formatDate(facture.echeance) },
                { label: "Total TTC", valeur: formatDH(facture.ttc) },
                { label: "Payé", valeur: formatDH(facture.paye) },
                { label: "Reste dû", valeur: <span className={reste > 0 ? "font-semibold text-warning-strong" : ""}>{formatDH(reste)}</span> },
              ]}
            />
          </Panneau>

          <Panneau titre="Documents liés">
            <DocumentsLies
              elements={[
                { label: facture.origineType, ref: facture.origineId, to: facture.origineType === "Vente" ? `/ventes/${facture.origineId}` : `/locations/${facture.origineId}` },
                ...(facture.devisId ? [{ label: "Devis", ref: facture.devisId, to: `/devis/${facture.devisId}` }] : []),
              ]}
            />
          </Panneau>
        </div>
      </div>
    </div>
  );
}
