import { createFileRoute } from "@tanstack/react-router";
import { Download } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Cellule, DocumentsLies, EnTeteDetail, Infos, Ligne, Panneau, Statut, Tableau, VideEtat } from "@/components/app/ui-kit";
import { Lien, useAller } from "@/components/app/nav";
import { useSinmat } from "@/data/store";
import { LecteurPDF, telechargerDocument, type DocumentPDF } from "@/components/app/DocumentPDF";
import { formatDH, formatDate, nomUtilisateur } from "@/data/sinmat";


export const Route = createFileRoute("/devis/$id")({
  head: ({ params }) => ({
    meta: [
      { title: `Devis ${params.id} — Gestion SINMAT` },
      { name: "description", content: "Fiche détaillée d'un devis SINMAT : lignes, totaux, statut et actions." },
      { property: "og:title", content: `Devis ${params.id} — Gestion SINMAT` },
      { property: "og:description", content: "Détail de la proposition commerciale." },
    ],
  }),
  component: FicheDevis,
});

function FicheDevis() {
  const { id } = Route.useParams();
  const s = useSinmat();
  const aller = useAller();

  const devis = s.devis.find((d) => d.id === id);
  if (!devis) {
    return (
      <div className="p-6">
        <VideEtat titre="Devis introuvable" description="Cet enregistrement n'existe pas." />
      </div>
    );
  }

  const client = s.clients.find((c) => c.id === devis.clientId);
  const opp = s.opportunites.find((o) => o.id === devis.opportuniteId);

  const totalHT = devis.lignes.reduce((s, l) => s + l.quantite * l.prixUnitaire * (l.duree ?? 1) * (1 - l.remise / 100), 0);
  const totalTVA = devis.lignes.reduce((s, l) => s + l.quantite * l.prixUnitaire * (l.duree ?? 1) * (1 - l.remise / 100) * (l.tva / 100), 0);

  const doc: DocumentPDF = {
    type: "Devis",
    reference: devis.id,
    date: devis.date,
    echeance: devis.expiration,
    echeanceLabel: "Validité",
    client: {
      nom: client?.nom ?? "—",
      contact: client?.contact,
      adresse: client?.adresse,
      ville: client?.ville,
      ice: client?.ice,
    },
    lignes: devis.lignes.map((l) => ({
      designation: l.designation,
      reference: s.produits.find((p) => p.id === l.produitId)?.reference,
      quantite: l.quantite,
      duree: l.duree ? `${l.duree} ${l.uniteDuree?.toLowerCase() ?? ""}` : undefined,
      prixUnitaire: l.prixUnitaire,
      total: Math.round(l.quantite * l.prixUnitaire * (l.duree ?? 1) * (1 - l.remise / 100) * (1 + l.tva / 100)),
    })),
    totalHT: Math.round(totalHT),
    totalTVA: Math.round(totalTVA),
    totalTTC: devis.montant,
    conditions: devis.conditions,
  };

  const accepter = () => {
    const res = s.accepterDevis(devis.id);
    if (res) {
      toast.success("Devis accepté", { description: `${res.type} ${res.id} créée` });
      aller(res.type === "Vente" ? `/ventes/${res.id}` : `/locations/${res.id}`);
    }
  };

  const refuser = () => {
    s.majStatutDevis(devis.id, "Refusé");
    toast.info("Devis marqué refusé");
  };

  return (
    <div>
      <EnTeteDetail
        retour={{ to: "/devis", libelle: "Devis" }}
        titre={devis.id}
        badges={<Statut valeur={devis.statut} />}
        sousTitre={`${client?.nom ?? "—"} · ${devis.type} · Responsable : ${nomUtilisateur(devis.responsableId)}`}
        actions={
          <>
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5"
              onClick={() => {
                telechargerDocument(doc);
                if (devis.statut === "Brouillon") s.majStatutDevis(devis.id, "Généré");
                toast.success("PDF téléchargé", { description: `Devis ${devis.id}` });
              }}
            >
              <Download className="size-3.5" /> Télécharger le PDF
            </Button>
            {(devis.statut === "Brouillon" || devis.statut === "Généré") && (
              <Button variant="outline" size="sm" onClick={() => { s.envoyerDevis(devis.id); toast.success("Devis envoyé au client"); }}>
                Envoyer
              </Button>
            )}
            {(devis.statut === "Envoyé" || devis.statut === "En attente") && (
              <>
                <Button variant="outline" size="sm" onClick={refuser}>
                  Marquer refusé
                </Button>
                <Button size="sm" onClick={accepter}>
                  Accepter le devis
                </Button>
              </>
            )}
            {devis.venteId && (
              <Lien to={`/ventes/${devis.venteId}`}>
                <Button variant="outline" size="sm">Voir la vente</Button>
              </Lien>
            )}
            {devis.locationId && (
              <Lien to={`/locations/${devis.locationId}`}>
                <Button variant="outline" size="sm">Voir la location</Button>
              </Lien>
            )}
          </>
        }
      />

      <div className="grid gap-5 p-6 lg:grid-cols-3">
        <div className="space-y-5 lg:col-span-2">
          <LecteurPDF doc={doc} hauteur={760} titre={`Devis ${devis.id} — document PDF`} />

          <Panneau titre="Lignes du devis" bodyClassName="p-0">
            <Tableau colonnes={["Produit", "Quantité", "Durée", "Prix unitaire", "Remise", "TVA", "Total TTC"]}>
              {devis.lignes.map((l) => {
                const produit = s.produits.find((p) => p.id === l.produitId);

                const total = l.quantite * l.prixUnitaire * (l.duree ?? 1) * (1 - l.remise / 100) * (1 + l.tva / 100);
                return (
                  <Ligne key={`${l.produitId}-${l.duree}`}>
                    <Cellule className="max-w-[280px]">
                      <span className="block truncate font-semibold text-foreground">{l.designation}</span>
                      <span className="block text-[11.5px] text-muted-foreground">{produit?.reference ?? l.produitId}</span>
                    </Cellule>
                    <Cellule num>{l.quantite}</Cellule>
                    <Cellule>{l.duree ? `${l.duree} ${l.uniteDuree?.toLowerCase() ?? ""}` : "—"}</Cellule>
                    <Cellule num>{formatDH(l.prixUnitaire)}</Cellule>
                    <Cellule num>{l.remise} %</Cellule>
                    <Cellule num>{l.tva} %</Cellule>
                    <Cellule num className="font-semibold">{formatDH(total)}</Cellule>
                  </Ligne>
                );
              })}
            </Tableau>
            <div className="border-t border-border bg-surface-muted/50 px-5 py-3">
              <div className="flex justify-between text-[13px]">
                <span className="text-muted-foreground">Total HT</span>
                <span className="num font-semibold">{formatDH(totalHT)}</span>
              </div>
              <div className="mt-1 flex justify-between text-[13px]">
                <span className="text-muted-foreground">TVA (20 %)</span>
                <span className="num font-semibold">{formatDH(totalTVA)}</span>
              </div>
              <div className="mt-2 flex justify-between border-t border-border pt-2 text-[15px]">
                <span className="font-semibold text-foreground">Total TTC</span>
                <span className="num font-bold text-foreground">{formatDH(devis.montant)}</span>
              </div>
            </div>
          </Panneau>

          <Panneau titre="Conditions">
            <p className="text-[13.5px] leading-relaxed text-foreground/85">
              {devis.conditions || "Aucune condition spécifique renseignée."}
            </p>
          </Panneau>
        </div>

        <div className="space-y-5">
          <Panneau titre="Informations">
            <Infos
              donnees={[
                { label: "Client", valeur: client?.nom ?? "—" },
                { label: "Type", valeur: devis.type },
                { label: "Date", valeur: formatDate(devis.date) },
                { label: "Expiration", valeur: formatDate(devis.expiration) },
                { label: "Responsable", valeur: nomUtilisateur(devis.responsableId) },
                { label: "Montant TTC", valeur: formatDH(devis.montant) },
              ]}
            />
          </Panneau>

          <Panneau titre="Documents liés">
            <DocumentsLies
              elements={[
                ...(opp ? [{ label: "Opportunité", ref: opp.id, to: `/opportunites/${opp.id}` }] : []),
                ...(devis.venteId ? [{ label: "Vente", ref: devis.venteId, to: `/ventes/${devis.venteId}` }] : []),
                ...(devis.locationId ? [{ label: "Location", ref: devis.locationId, to: `/locations/${devis.locationId}` }] : []),
              ]}
            />
          </Panneau>
        </div>
      </div>
    </div>
  );
}
