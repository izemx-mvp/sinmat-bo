import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Cellule, DocumentsLies, EnTeteDetail, Infos, Ligne, Panneau, Statut, Tableau, VideEtat } from "@/components/app/ui-kit";
import { Lien, useAller } from "@/components/app/nav";
import { useSinmat } from "@/data/store";
import { formatDH, formatDate, produits } from "@/data/sinmat";

export const Route = createFileRoute("/locations/$id")({
  head: ({ params }) => ({
    meta: [
      { title: `Location ${params.id} — Gestion SINMAT` },
      { name: "description", content: "Fiche location SINMAT : matériel, client, planning et retour." },
      { property: "og:title", content: `Location ${params.id} — Gestion SINMAT` },
      { property: "og:description", content: "Détail d'une location." },
    ],
  }),
  component: FicheLocation,
});

function FicheLocation() {
  const { id } = Route.useParams();
  const s = useSinmat();
  const aller = useAller();
  const [etat, setEtat] = useState<"Excellent" | "Bon" | "À contrôler" | "Endommagé" | "—">("Bon");
  const [frais, setFrais] = useState("0");
  const [notes, setNotes] = useState("");

  const location = s.locations.find((l) => l.id === id);
  if (!location) {
    return (
      <div className="p-6">
        <VideEtat titre="Location introuvable" description="Cet enregistrement n'existe pas." />
      </div>
    );
  }

  const client = s.clients.find((c) => c.id === location.clientId);
  const produit = produits.find((p) => p.id === location.produitId);
  const commande = s.commandes.find((c) => c.id === location.commandeId);
  const retour = s.retours.find((r) => r.id === location.retourId);

  const clore = () => {
    const r = s.retours.find((r) => r.locationId === location.id && r.statut !== "Clôturé");
    if (r) {
      s.enregistrerRetour(r.id, {
        retourReel: "2026-09-07",
        etat,
        notes,
        frais: Number(frais) || 0,
      });
      toast.success("Retour enregistré", { description: `Location ${location.id} clôturée` });
      aller(`/retours/${r.id}`);
    }
  };

  return (
    <div>
      <EnTeteDetail
        retour={{ to: "/locations", libelle: "Locations" }}
        titre={location.id}
        badges={<Statut valeur={location.statut} />}
        sousTitre={`${client?.nom ?? "—"} · ${produit?.nom ?? "—"} · ${location.ville}`}
        actions={
          <>
            {commande && (
              <Lien to={`/commandes/${commande.id}`}>
                <Button variant="outline" size="sm">Voir la commande</Button>
              </Lien>
            )}
            {location.statut !== "Terminée" && (
              <Button size="sm" onClick={clore}>Enregistrer le retour</Button>
            )}
          </>
        }
      />

      <div className="grid gap-5 p-6 lg:grid-cols-3">
        <div className="space-y-5 lg:col-span-2">
          <Panneau titre="Planning">
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-lg border border-border bg-surface-muted/50 p-4">
                <p className="section-label">Début</p>
                <p className="num mt-1 text-[18px] font-semibold text-foreground">{formatDate(location.debut)}</p>
              </div>
              <div className="rounded-lg border border-border bg-surface-muted/50 p-4">
                <p className="section-label">Fin prévue</p>
                <p className="num mt-1 text-[18px] font-semibold text-foreground">{formatDate(location.finPrevue)}</p>
              </div>
              <div className="rounded-lg border border-border bg-surface-muted/50 p-4">
                <p className="section-label">Durée</p>
                <p className="num mt-1 text-[18px] font-semibold text-foreground">{location.dureeJours} jours</p>
              </div>
            </div>
          </Panneau>

          <Panneau titre="Chantier">
            <Infos
              donnees={[
                { label: "Chantier", valeur: location.chantier },
                { label: "Ville", valeur: location.ville },
                { label: "Responsable chantier", valeur: location.responsableChantier },
                { label: "Téléphone chantier", valeur: location.telephoneChantier },
              ]}
            />
          </Panneau>

          {location.statut !== "Terminée" && (
            <Panneau titre="Inspection au retour">
              <div className="grid gap-4 sm:grid-cols-3">
                <div>
                  <label className="text-[12.5px] font-medium text-muted-foreground">État du matériel</label>
                  <select
                    value={etat}
                    onChange={(e) => setEtat(e.target.value as typeof etat)}
                    className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-[13px]"
                  >
                    {["Excellent", "Bon", "À contrôler", "Endommagé", "—"].map((e) => (
                      <option key={e} value={e}>{e}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-[12.5px] font-medium text-muted-foreground">Frais supplémentaires</label>
                  <input
                    type="number"
                    value={frais}
                    onChange={(e) => setFrais(e.target.value)}
                    className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-[13px]"
                  />
                </div>
                <div className="sm:col-span-3">
                  <label className="text-[12.5px] font-medium text-muted-foreground">Notes</label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-[13px]"
                    rows={3}
                  />
                </div>
              </div>
            </Panneau>
          )}
        </div>

        <div className="space-y-5">
          <Panneau titre="Informations">
            <Infos
              donnees={[
                { label: "Client", valeur: client?.nom ?? "—" },
                { label: "Matériel", valeur: produit?.nom ?? "—" },
                { label: "Quantité", valeur: String(location.quantite) },
                { label: "Montant", valeur: formatDH(location.montant) },
                { label: "Statut", valeur: <Statut valeur={location.statut} /> },
                { label: "Retard", valeur: `${location.statut === "En retard" ? "Oui" : "Non"}` },
              ]}
            />
          </Panneau>

          <Panneau titre="Documents liés">
            <DocumentsLies
              elements={[
                ...(commande ? [{ label: "Commande", ref: commande.id, to: `/commandes/${commande.id}` }] : []),
                ...(retour ? [{ label: "Retour", ref: retour.id, to: `/retours/${retour.id}` }] : []),
              ]}
            />
          </Panneau>
        </div>
      </div>
    </div>
  );
}
