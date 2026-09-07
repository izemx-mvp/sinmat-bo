import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  AnalyseIA,
  Cellule,
  EnTeteDetail,
  Infos,
  Kpi,
  Ligne,
  Onglets,
  Panneau,
  Statut,
  Tableau,
  VideEtat,
} from "@/components/app/ui-kit";
import { useSinmat } from "@/data/store";
import { formatDate, formatNombre, nomUtilisateur } from "@/data/sinmat";

export const Route = createFileRoute("/campagnes/$id")({
  head: ({ params }) => ({
    meta: [
      { title: `Campagne ${params.id} — Gestion SINMAT` },
      {
        name: "description",
        content:
          "Résultats de la campagne WhatsApp SINMAT : audience, réponses, prospects qualifiés et opportunités générées.",
      },
      { property: "og:title", content: `Campagne ${params.id} — Gestion SINMAT` },
      {
        property: "og:description",
        content: "Performance et prospects qualifiés issus de la campagne.",
      },
    ],
  }),
  component: FicheCampagne,
});

const TABS = ["Performance", "Prospects qualifiés", "Opportunités", "Paramètres"];

function FicheCampagne() {
  const { id } = Route.useParams();
  const { campagnes, prospects, opportunites } = useSinmat();
  const [tab, setTab] = useState("Performance");

  const campagne = campagnes.find((c) => c.id === id);
  if (!campagne) {
    return (
      <div className="p-6">
        <VideEtat titre="Campagne introuvable" description="Cet enregistrement n'existe pas." />
      </div>
    );
  }

  const prospectsCampagne = prospects.filter((p) => p.campagneId === campagne.id);
  const qualifies = prospectsCampagne.filter((p) => p.qualification === "Qualifié");
  const oppsGenerees = opportunites.filter((o) =>
    prospectsCampagne.some((p) => p.id === o.prospectId),
  );

  const entonnoir = [
    { label: "Contactés", valeur: campagne.envoyes },
    { label: "Réponses", valeur: campagne.reponses },
    { label: "Qualifiés", valeur: campagne.qualifies },
    { label: "Opportunités", valeur: campagne.opportunites },
  ];
  const max = entonnoir[0]!.valeur || 1;

  return (
    <div>
      <EnTeteDetail
        retour={{ to: "/campagnes", libelle: "Campagnes WhatsApp" }}
        titre={campagne.nom}
        badges={<Statut valeur={campagne.statut} />}
        sousTitre={`${campagne.id} · Lancée le ${formatDate(campagne.date)} · ${formatNombre(
          campagne.audience,
        )} prospects ciblés`}
        actions={
          <Button variant="outline" size="sm">
            Exporter les résultats
          </Button>
        }
      />

      <div className="border-b border-border bg-surface px-6">
        <Onglets valeurs={TABS} actif={tab} onChange={setTab} />
      </div>

      <div className="space-y-5 p-6">
        {tab === "Performance" && (
          <>
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              <Kpi libelle="Prospects contactés" valeur={formatNombre(campagne.envoyes)} ton="info" />
              <Kpi
                libelle="Réponses reçues"
                valeur={formatNombre(campagne.reponses)}
                detail={`${Math.round((campagne.reponses / (campagne.envoyes || 1)) * 100)} % de réponse`}
                ton="accent"
              />
              <Kpi
                libelle="Prospects qualifiés"
                valeur={formatNombre(campagne.qualifies)}
                ton="succes"
              />
              <Kpi
                libelle="Opportunités générées"
                valeur={formatNombre(campagne.opportunites)}
                detail={`Conversion ${campagne.conversion} %`}
                ton="succes"
              />
            </div>

            <div className="grid gap-5 lg:grid-cols-3">
              <Panneau titre="Entonnoir de qualification" className="lg:col-span-2">
                <div className="space-y-3">
                  {entonnoir.map((e) => (
                    <div key={e.label}>
                      <div className="mb-1 flex items-baseline justify-between">
                        <span className="text-[13px] font-medium text-foreground">{e.label}</span>
                        <span className="num text-[13px] font-semibold">
                          {formatNombre(e.valeur)}
                        </span>
                      </div>
                      <div className="h-2.5 w-full overflow-hidden rounded-full bg-surface-muted">
                        <div
                          className="h-full rounded-full bg-primary/85"
                          style={{ width: `${Math.max(4, (e.valeur / max) * 100)}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </Panneau>

              <AnalyseIA
                lignes={[
                  { label: "Taux de réponse", valeur: `${Math.round((campagne.reponses / (campagne.envoyes || 1)) * 100)} %` },
                  { label: "Taux de qualification", valeur: `${Math.round((campagne.qualifies / (campagne.reponses || 1)) * 100)} %` },
                  { label: "Conversion globale", valeur: `${campagne.conversion} %` },
                ]}
                recommandation={campagne.insight}
              />
            </div>
          </>
        )}

        {tab === "Prospects qualifiés" && (
          <Panneau bodyClassName="p-0">
            {qualifies.length === 0 ? (
              <div className="p-6">
                <VideEtat
                  titre="Aucun prospect qualifié"
                  description="La qualification automatique est encore en cours pour cette campagne."
                />
              </div>
            ) : (
              <Tableau
                colonnes={["Prospect", "Ville", "Besoin", "Matériel", "Intérêt", "Responsable"]}
              >
                {qualifies.map((p) => (
                  <Ligne key={p.id} to={`/prospects/${p.id}`}>
                    <Cellule>
                      <span className="block font-semibold text-foreground">{p.entreprise}</span>
                      <span className="block text-[11.5px] text-muted-foreground">{p.contact}</span>
                    </Cellule>
                    <Cellule>{p.ville}</Cellule>
                    <Cellule>{p.ia?.besoin ?? "—"}</Cellule>
                    <Cellule>{p.ia?.produit ?? "—"}</Cellule>
                    <Cellule>
                      <Statut valeur={p.interet} />
                    </Cellule>
                    <Cellule className="text-muted-foreground">
                      {nomUtilisateur(p.responsableId)}
                    </Cellule>
                  </Ligne>
                ))}
              </Tableau>
            )}
          </Panneau>
        )}

        {tab === "Opportunités" && (
          <Panneau bodyClassName="p-0">
            {oppsGenerees.length === 0 ? (
              <div className="p-6">
                <VideEtat
                  titre="Aucune opportunité générée"
                  description="Les opportunités créées depuis cette campagne apparaîtront ici."
                />
              </div>
            ) : (
              <Tableau colonnes={["Référence", "Opportunité", "Client", "Étape", "Responsable"]}>
                {oppsGenerees.map((o) => (
                  <Ligne key={o.id} to={`/opportunites/${o.id}`}>
                    <Cellule num>{o.id}</Cellule>
                    <Cellule>{o.titre}</Cellule>
                    <Cellule>{o.entreprise}</Cellule>
                    <Cellule>
                      <Statut valeur={o.etape} ton="info" />
                    </Cellule>
                    <Cellule className="text-muted-foreground">
                      {nomUtilisateur(o.responsableId)}
                    </Cellule>
                  </Ligne>
                ))}
              </Tableau>
            )}
          </Panneau>
        )}

        {tab === "Paramètres" && (
          <Panneau titre="Configuration de la campagne">
            <Infos
              donnees={[
                { label: "Nom", valeur: campagne.nom },
                { label: "Objectif", valeur: campagne.objectif },
                { label: "Audience", valeur: `${formatNombre(campagne.audience)} prospects` },
                { label: "Critères", valeur: campagne.criteres.join(" · ") },
                { label: "Statut", valeur: <Statut valeur={campagne.statut} /> },
                { label: "Date de lancement", valeur: formatDate(campagne.date) },
              ]}
            />
          </Panneau>
        )}
      </div>
    </div>
  );
}
