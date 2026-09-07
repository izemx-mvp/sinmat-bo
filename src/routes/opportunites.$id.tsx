import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { AnalyseIA, Cellule, Chronologie, DocumentsLies, EnTeteDetail, Infos, Ligne, Panneau, RailStatut, Statut, Tableau, VideEtat } from "@/components/app/ui-kit";
import { Lien } from "@/components/app/nav";
import { useSinmat } from "@/data/store";
import { ETAPES_PIPELINE, formatDH, formatDate, nomUtilisateur, type Opportunite } from "@/data/sinmat";

export const Route = createFileRoute("/opportunites/$id")({
  head: ({ params }) => ({
    meta: [
      { title: `Opportunité ${params.id} — Gestion SINMAT` },
      { name: "description", content: "Fiche opportunité SINMAT : pipeline, client, montant et actions commerciales." },
      { property: "og:title", content: `Opportunité ${params.id} — Gestion SINMAT` },
      { property: "og:description", content: "Détail d'une opportunité commerciale." },
    ],
  }),
  component: FicheOpportunite,
});

function FicheOpportunite() {
  const { id } = Route.useParams();
  const s = useSinmat();

  const opp = s.opportunites.find((o) => o.id === id);
  if (!opp) {
    return (
      <div className="p-6">
        <VideEtat titre="Opportunité introuvable" description="Cette opportunité n'existe pas." />
      </div>
    );
  }

  const client = s.clients.find((c) => c.id === opp.clientId);
  const prospect = s.prospects.find((p) => p.id === opp.prospectId);
  const devis = s.devis.find((d) => d.opportuniteId === opp.id);
  const responsable = nomUtilisateur(opp.responsableId);

  const deplacer = (direction: 1 | -1) => {
    const idx = ETAPES_PIPELINE.indexOf(opp.etape);
    const next = ETAPES_PIPELINE[idx + direction];
    if (next) {
      s.deplacerOpportunite(opp.id, next);
      toast.success(`Opportunité ${next.toLowerCase()}`, { description: `Étape mise à jour` });
    }
  };

  const creerDevis = () => {
    if (devis) {
      toast.info("Un devis existe déjà pour cette opportunité");
      return;
    }
    toast.info("Utilisez le formulaire Devis pour créer une proposition");
  };

  return (
    <div>
      <EnTeteDetail
        retour={{ to: "/opportunites", libelle: "Opportunités" }}
        titre={opp.titre}
        badges={<Statut valeur={opp.etape} />}
        sousTitre={`${opp.entreprise} · ${opp.type} · ${formatDH(opp.montant)}`}
        actions={
          <>
            <Button variant="outline" size="sm" onClick={() => deplacer(-1)} disabled={opp.etape === ETAPES_PIPELINE[0]}>
              Reculer
            </Button>
            <Button size="sm" onClick={() => deplacer(1)} disabled={opp.etape === ETAPES_PIPELINE[ETAPES_PIPELINE.length - 1]}>
              Avancer
            </Button>
            <Lien to="/devis/nouveau">
              <Button variant="outline" size="sm">Créer un devis</Button>
            </Lien>
          </>
        }
      />

      <div className="grid gap-5 p-6 lg:grid-cols-3">
        <div className="space-y-5 lg:col-span-2">
          <Panneau titre="Pipeline">
            <RailStatut etapes={ETAPES_PIPELINE} courante={ETAPES_PIPELINE.indexOf(opp.etape)} />
          </Panneau>

          <Panneau titre="Informations">
            <Infos
              donnees={[
                { label: "Entreprise", valeur: opp.entreprise },
                { label: "Client", valeur: client?.nom ?? prospect?.entreprise ?? "—" },
                { label: "Produit", valeur: opp.produit },
                { label: "Quantité", valeur: String(opp.quantite) },
                { label: "Montant estimé", valeur: formatDH(opp.montant) },
                { label: "Date souhaitée", valeur: formatDate(opp.dateSouhaitee) },
                { label: "Chantier", valeur: opp.chantier },
                { label: "Urgence", valeur: <Statut valeur={opp.urgence} /> },
                { label: "Responsable", valeur: responsable },
                { label: "Source", valeur: opp.source },
              ]}
            />
          </Panneau>

          {opp.resumeIA && (
            <AnalyseIA
              titre="Analyse IA"
              recommandation={opp.resumeIA}
              lignes={[
                { label: "Probabilité", valeur: `${opp.probabilite}%` },
                { label: "Prochaine action", valeur: opp.prochaineAction },
              ]}
            />
          )}
        </div>

        <div className="space-y-5">
          <Panneau titre="Synthèse">
            <div className="space-y-3">
              <div className="rounded-lg border border-border bg-surface-muted/50 p-4">
                <p className="section-label">Montant estimé</p>
                <p className="num mt-1 font-display text-[26px] font-bold text-foreground">{formatDH(opp.montant)}</p>
              </div>
              <div className="rounded-lg border border-border bg-surface-muted/50 p-4">
                <p className="section-label">Probabilité</p>
                <p className="num mt-1 font-display text-[26px] font-bold text-foreground">{opp.probabilite}%</p>
              </div>
              <div className="rounded-lg border border-border bg-surface-muted/50 p-4">
                <p className="section-label">Prochaine action</p>
                <p className="mt-1 text-[13.5px] font-medium text-foreground">{opp.prochaineAction}</p>
              </div>
            </div>
          </Panneau>

          <Panneau titre="Documents liés">
            <DocumentsLies
              elements={[
                ...(devis ? [{ label: "Devis", ref: devis.id, to: `/devis/${devis.id}` }] : []),
                ...(client ? [{ label: "Client", ref: client.nom, to: `/clients/${client.id}` }] : []),
                ...(prospect ? [{ label: "Prospect", ref: prospect.entreprise, to: `/prospects/${prospect.id}` }] : []),
              ]}
            />
          </Panneau>

          <Panneau titre="Historique">
            <Chronologie
              evenements={[
                { date: opp.derniereActivite, libelle: "Dernière activité", detail: opp.prochaineAction },
                { date: opp.dateSouhaitee, libelle: "Date souhaitée", detail: "Livraison / mise à disposition prévue" },
              ]}
            />
          </Panneau>
        </div>
      </div>
    </div>
  );
}
