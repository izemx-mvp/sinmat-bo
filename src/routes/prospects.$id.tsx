import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  AnalyseIA,
  Chronologie,
  EnTeteDetail,
  Infos,
  Onglets,
  Panneau,
  Statut,
  VideEtat,
} from "@/components/app/ui-kit";
import { Lien, useAller } from "@/components/app/nav";
import { useSinmat } from "@/data/store";
import { formatDate, nomUtilisateur } from "@/data/sinmat";

export const Route = createFileRoute("/prospects/$id")({
  head: ({ params }) => ({
    meta: [
      { title: `Prospect ${params.id} — Gestion SINMAT` },
      {
        name: "description",
        content:
          "Fiche prospect SINMAT : informations, qualification WhatsApp IA, opportunités liées et historique.",
      },
      { property: "og:title", content: `Prospect ${params.id} — Gestion SINMAT` },
      {
        property: "og:description",
        content: "Qualification automatique et suivi commercial du prospect.",
      },
    ],
  }),
  component: FicheProspect,
});

const TABS = ["Aperçu", "Opportunités", "Documents", "Historique"];

function FicheProspect() {
  const { id } = Route.useParams();
  const { prospects, opportunites, creerOpportuniteDepuisProspect } = useSinmat();
  const aller = useAller();
  const [tab, setTab] = useState("Aperçu");
  const [note, setNote] = useState("");

  const prospect = prospects.find((p) => p.id === id);
  if (!prospect) {
    return (
      <div className="p-6">
        <VideEtat titre="Prospect introuvable" description="Cet enregistrement n'existe pas." />
      </div>
    );
  }

  const oppsLiees = opportunites.filter(
    (o) => o.prospectId === prospect.id || o.entreprise === prospect.entreprise,
  );
  const oppPrincipale = opportunites.find((o) => o.id === prospect.opportuniteId);

  const creerOpp = () => {
    const o = creerOpportuniteDepuisProspect(prospect.id);
    if (o) {
      toast.success("Opportunité créée", { description: `${o.id} · ${o.entreprise}` });
      aller(`/opportunites/${o.id}`);
    }
  };

  return (
    <div>
      <EnTeteDetail
        retour={{ to: "/prospects", libelle: "Prospects" }}
        titre={prospect.entreprise}
        badges={
          <>
            <Statut valeur="Prospect" ton="neutre" />
            <Statut valeur={prospect.qualification} />
          </>
        }
        sousTitre={
          <>
            {prospect.contact} · {prospect.ville} · Responsable :{" "}
            <span className="font-medium text-foreground">
              {nomUtilisateur(prospect.responsableId)}
            </span>
          </>
        }
        actions={
          <>
            <Button variant="outline" size="sm" onClick={() => toast("Relance planifiée pour demain.")}>
              Marquer à relancer
            </Button>
            <Button variant="outline" size="sm" onClick={() => setTab("Aperçu")}>
              Ajouter une note
            </Button>
            <Button variant="outline" size="sm" onClick={() => toast("Mode édition activé.")}>
              Modifier
            </Button>
            {!oppPrincipale && (
              <Button size="sm" onClick={creerOpp}>
                Créer une opportunité
              </Button>
            )}
          </>
        }
      />

      <div className="border-b border-border bg-surface px-6">
        <Onglets valeurs={TABS} actif={tab} onChange={setTab} />
      </div>

      <div className="p-6">
        {tab === "Aperçu" && (
          <div className="grid gap-5 lg:grid-cols-3">
            <div className="space-y-5 lg:col-span-2">
              <Panneau titre="Informations générales">
                <Infos
                  donnees={[
                    { label: "Entreprise", valeur: prospect.entreprise },
                    { label: "Contact", valeur: prospect.contact || "—" },
                    { label: "Téléphone", valeur: prospect.telephone || "—" },
                    { label: "Email", valeur: prospect.email || "—" },
                    { label: "Ville", valeur: prospect.ville },
                    { label: "Secteur", valeur: prospect.secteur },
                    { label: "Source", valeur: prospect.source },
                    { label: "Date de création", valeur: formatDate(prospect.creeLe) },
                  ]}
                />
              </Panneau>

              {prospect.ia ? (
                <Panneau
                  titre="Qualification WhatsApp IA"
                  description={`Dernière qualification : ${formatDate(
                    prospect.ia.qualifieLe.slice(0, 10),
                  )} à ${prospect.ia.qualifieLe.slice(11, 16)}`}
                >
                  <Infos
                    donnees={[
                      { label: "Statut", valeur: <Statut valeur="Qualifié" /> },
                      { label: "Niveau d'intérêt", valeur: <Statut valeur={prospect.interet} /> },
                      { label: "Type de besoin", valeur: prospect.ia.besoin },
                      { label: "Matériel", valeur: prospect.ia.produit },
                      { label: "Quantité", valeur: String(prospect.ia.quantite) },
                      { label: "Durée", valeur: prospect.ia.duree },
                      { label: "Date souhaitée", valeur: formatDate(prospect.ia.dateSouhaitee) },
                      { label: "Ville / chantier", valeur: prospect.ia.chantier },
                      { label: "Urgence", valeur: <Statut valeur={prospect.ia.urgence} /> },
                    ]}
                  />
                  <div className="mt-4 rounded-lg border border-border bg-surface-muted/60 p-3.5">
                    <p className="section-label">Résumé IA</p>
                    <p className="mt-1.5 text-[13.5px] leading-relaxed text-foreground/85">
                      « {prospect.ia.resume} »
                    </p>
                  </div>
                </Panneau>
              ) : (
                <Panneau titre="Qualification WhatsApp IA">
                  <VideEtat
                    titre="Prospect non encore qualifié"
                    description="Intégrez ce prospect à une campagne WhatsApp pour lancer la qualification automatique."
                    action={
                      <Lien to="/campagnes/nouvelle">
                        <Button size="sm">Créer une campagne</Button>
                      </Lien>
                    }
                  />
                </Panneau>
              )}

              <Panneau titre="Notes commerciales">
                <Textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Ajouter une note interne sur ce prospect..."
                  className="min-h-[90px]"
                />
                <div className="mt-3 flex justify-end">
                  <Button
                    size="sm"
                    disabled={!note.trim()}
                    onClick={() => {
                      toast.success("Note enregistrée");
                      setNote("");
                    }}
                  >
                    Enregistrer la note
                  </Button>
                </div>
              </Panneau>
            </div>

            <div className="space-y-5">
              {prospect.ia && (
                <AnalyseIA
                  lignes={[
                    { label: "Probabilité de conversion", valeur: `${prospect.ia.probabilite} %` },
                    { label: "Besoin identifié", valeur: prospect.ia.besoin },
                    { label: "Urgence", valeur: prospect.ia.urgence },
                    { label: "Matériel", valeur: prospect.ia.produit },
                  ]}
                  recommandation={`Action recommandée : ${prospect.ia.recommandation}`}
                  action={
                    oppPrincipale ? (
                      <div className="rounded-md border border-border bg-surface p-3">
                        <p className="text-[12.5px] text-muted-foreground">
                          Opportunité créée automatiquement
                        </p>
                        <p className="num text-[13.5px] font-semibold">{oppPrincipale.id}</p>
                        <Lien to={`/opportunites/${oppPrincipale.id}`}>
                          <Button size="sm" variant="outline" className="mt-2 h-7 text-[12px]">
                            Voir l'opportunité
                          </Button>
                        </Lien>
                      </div>
                    ) : (
                      <Button size="sm" onClick={creerOpp}>
                        Créer l'opportunité
                      </Button>
                    )
                  }
                />
              )}

              <Panneau titre="Historique">
                <Chronologie
                  evenements={prospect.timeline.map((t) => ({
                    date: formatDate(t.date),
                    libelle: t.libelle,
                  }))}
                />
              </Panneau>

              {prospect.campagneId && (
                <Panneau titre="Campagne d'origine">
                  <Lien
                    to={`/campagnes/${prospect.campagneId}`}
                    className="num text-[13.5px] font-semibold text-primary hover:underline"
                  >
                    {prospect.campagneId}
                  </Lien>
                </Panneau>
              )}
            </div>
          </div>
        )}

        {tab === "Opportunités" && (
          <Panneau bodyClassName="p-0">
            {oppsLiees.length === 0 ? (
              <div className="p-6">
                <VideEtat
                  titre="Aucune opportunité"
                  description="Créez une opportunité depuis la qualification de ce prospect."
                />
              </div>
            ) : (
              <ul className="divide-y divide-border">
                {oppsLiees.map((o) => (
                  <li key={o.id}>
                    <Lien
                      to={`/opportunites/${o.id}`}
                      className="flex items-center justify-between gap-4 px-5 py-3.5 transition-colors hover:bg-surface-muted"
                    >
                      <span>
                        <span className="num block text-[12.5px] font-semibold">{o.id}</span>
                        <span className="block text-[13.5px]">{o.titre}</span>
                      </span>
                      <Statut valeur={o.etape} ton="info" />
                    </Lien>
                  </li>
                ))}
              </ul>
            )}
          </Panneau>
        )}

        {tab === "Documents" && (
          <Panneau>
            <VideEtat
              titre="Aucun document"
              description="Les devis et propositions générés pour ce prospect apparaîtront ici."
            />
          </Panneau>
        )}

        {tab === "Historique" && <ConversationQualification prospectId={prospect.id} />}
      </div>
    </div>
  );
}
