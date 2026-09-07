import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Cellule,
  Chronologie,
  DocumentsLies,
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
import { Lien } from "@/components/app/nav";
import { useSinmat } from "@/data/store";
import { formatDH, formatDate, nomUtilisateur } from "@/data/sinmat";

export const Route = createFileRoute("/clients/$id")({
  head: ({ params }) => ({
    meta: [
      { title: `Client ${params.id} — Gestion SINMAT` },
      {
        name: "description",
        content:
          "Fiche client 360° SINMAT : opportunités, devis, commandes, factures, paiements, livraisons et locations.",
      },
      { property: "og:title", content: `Client ${params.id} — Gestion SINMAT` },
      { property: "og:description", content: "Vue complète de la relation client SINMAT." },
    ],
  }),
  component: FicheClient,
});

const TABS = [
  "Aperçu",
  "Opportunités",
  "Devis",
  "Commandes",
  "Factures",
  "Paiements",
  "Livraisons",
  "Locations",
];

function FicheClient() {
  const { id } = Route.useParams();
  const s = useSinmat();
  const [tab, setTab] = useState("Aperçu");

  const client = s.clients.find((c) => c.id === id);
  if (!client) {
    return (
      <div className="p-6">
        <VideEtat titre="Client introuvable" description="Cet enregistrement n'existe pas." />
      </div>
    );
  }

  const opps = s.opportunites.filter((o) => o.clientId === client.id);
  const devis = s.devis.filter((d) => d.clientId === client.id);
  const commandes = s.commandes.filter((c) => c.clientId === client.id);
  const factures = s.factures.filter((f) => f.clientId === client.id);
  const paiements = s.paiements.filter((p) => p.clientId === client.id);
  const livraisons = s.livraisons.filter((l) => l.clientId === client.id);
  const locations = s.locations.filter((l) => l.clientId === client.id);

  return (
    <div>
      <EnTeteDetail
        retour={{ to: "/clients", libelle: "Clients" }}
        titre={client.nom}
        badges={
          <>
            <Statut valeur={client.statut} />
            <Statut valeur={client.type} ton="info" />
          </>
        }
        sousTitre={`${client.id} · ${client.ville} · Client depuis ${formatDate(client.depuis)} · Responsable : ${nomUtilisateur(client.responsableId)}`}
        actions={
          <>
            <Lien to="/devis/nouveau">
              <Button variant="outline" size="sm">
                Nouveau devis
              </Button>
            </Lien>
            <Lien to="/opportunites">
              <Button size="sm">Nouvelle opportunité</Button>
            </Lien>
          </>
        }
      />

      <div className="border-b border-border bg-surface px-6">
        <Onglets valeurs={TABS} actif={tab} onChange={setTab} />
      </div>

      <div className="space-y-5 p-6">
        {tab === "Aperçu" && (
          <>
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              <Kpi libelle="Chiffre d'affaires" valeur={formatDH(client.ca)} ton="succes" />
              <Kpi libelle="Commandes" valeur={String(client.commandes)} ton="info" />
              <Kpi
                libelle="Encours client"
                valeur={formatDH(client.encours)}
                detail={client.encours > 0 ? "Factures non soldées" : "Aucun impayé"}
                ton={client.encours > 0 ? "attention" : "succes"}
              />
              <Kpi
                libelle="Locations en cours"
                valeur={String(locations.filter((l) => l.statut !== "Terminée").length)}
                ton="accent"
              />
            </div>

            <div className="grid gap-5 lg:grid-cols-3">
              <Panneau titre="Informations société" className="lg:col-span-2">
                <Infos
                  donnees={[
                    { label: "Raison sociale", valeur: client.nom },
                    { label: "Contact principal", valeur: client.contact },
                    { label: "Téléphone", valeur: client.telephone },
                    { label: "Email", valeur: client.email },
                    { label: "Adresse", valeur: client.adresse },
                    { label: "Ville", valeur: client.ville },
                    { label: "ICE", valeur: client.ice },
                    { label: "RC", valeur: client.rc },
                  ]}
                />
              </Panneau>

              <div className="space-y-5">
                <Panneau titre="Documents liés">
                  <DocumentsLies
                    elements={[
                      { label: "Opportunités", ref: `${opps.length}`, to: "/opportunites" },
                      { label: "Devis", ref: `${devis.length}`, to: "/devis" },
                      { label: "Commandes", ref: `${commandes.length}`, to: "/commandes" },
                      { label: "Factures", ref: `${factures.length}`, to: "/factures" },
                      { label: "Livraisons", ref: `${livraisons.length}`, to: "/livraisons" },
                      { label: "Locations", ref: `${locations.length}`, to: "/locations" },
                    ]}
                  />
                </Panneau>
                <Panneau titre="Activité récente">
                  <Chronologie
                    evenements={[
                      ...commandes.map((c) => ({
                        date: formatDate(c.date),
                        libelle: `Commande ${c.id} — ${formatDH(c.montant)}`,
                      })),
                      ...factures.map((f) => ({
                        date: formatDate(f.date),
                        libelle: `Facture ${f.id} — ${f.statut}`,
                      })),
                    ]
                      .sort((a, b) => (a.date < b.date ? 1 : -1))
                      .slice(0, 8)}
                  />
                </Panneau>
              </div>
            </div>
          </>
        )}

        {tab === "Opportunités" && (
          <TableSimple vide="Aucune opportunité" colonnes={["Référence", "Titre", "Étape", "Montant"]}>
            {opps.map((o) => (
              <Ligne key={o.id} to={`/opportunites/${o.id}`}>
                <Cellule num>{o.id}</Cellule>
                <Cellule>{o.titre}</Cellule>
                <Cellule>
                  <Statut valeur={o.etape} ton="info" />
                </Cellule>
                <Cellule num>{formatDH(o.montant)}</Cellule>
              </Ligne>
            ))}
          </TableSimple>
        )}

        {tab === "Devis" && (
          <TableSimple vide="Aucun devis" colonnes={["Référence", "Date", "Montant TTC", "Statut"]}>
            {devis.map((d) => (
              <Ligne key={d.id} to={`/devis/${d.id}`}>
                <Cellule num>{d.id}</Cellule>
                <Cellule>{formatDate(d.date)}</Cellule>
                <Cellule num>{formatDH(d.montant)}</Cellule>
                <Cellule>
                  <Statut valeur={d.statut} />
                </Cellule>
              </Ligne>
            ))}
          </TableSimple>
        )}

        {tab === "Commandes" && (
          <TableSimple vide="Aucune commande" colonnes={["Référence", "Date", "Type", "Total", "Statut"]}>
            {commandes.map((c) => (
              <Ligne key={c.id} to={`/commandes/${c.id}`}>
                <Cellule num>{c.id}</Cellule>
                <Cellule>{formatDate(c.date)}</Cellule>
                <Cellule>{c.type}</Cellule>
                <Cellule num>{formatDH(c.montant)}</Cellule>
                <Cellule>
                  <Statut valeur={c.statut} />
                </Cellule>
              </Ligne>
            ))}
          </TableSimple>
        )}

        {tab === "Factures" && (
          <TableSimple vide="Aucune facture" colonnes={["Référence", "Date", "Montant", "Reste dû", "Statut"]}>
            {factures.map((f) => (
              <Ligne key={f.id} to={`/factures/${f.id}`}>
                <Cellule num>{f.id}</Cellule>
                <Cellule>{formatDate(f.date)}</Cellule>
                <Cellule num>{formatDH(f.ttc)}</Cellule>
                <Cellule num>{formatDH(f.ttc - f.paye)}</Cellule>
                <Cellule>
                  <Statut valeur={f.statut} />
                </Cellule>
              </Ligne>
            ))}
          </TableSimple>
        )}

        {tab === "Paiements" && (
          <TableSimple vide="Aucun paiement" colonnes={["Référence", "Date", "Mode", "Montant", "Pièce"]}>
            {paiements.map((p) => (
              <Ligne key={p.id} to={`/paiements/${p.id}`}>
                <Cellule num>{p.id}</Cellule>
                <Cellule>{formatDate(p.date)}</Cellule>
                <Cellule>{p.mode}</Cellule>
                <Cellule num>{formatDH(p.montant)}</Cellule>
                <Cellule className="text-muted-foreground">{p.reference}</Cellule>
              </Ligne>
            ))}
          </TableSimple>
        )}

        {tab === "Livraisons" && (
          <TableSimple vide="Aucune livraison" colonnes={["Référence", "Date", "Ville", "Créneau", "Statut"]}>
            {livraisons.map((l) => (
              <Ligne key={l.id} to={`/livraisons/${l.id}`}>
                <Cellule num>{l.id}</Cellule>
                <Cellule>{formatDate(l.date)}</Cellule>
                <Cellule>{l.ville}</Cellule>
                <Cellule>{l.creneau}</Cellule>
                <Cellule>
                  <Statut valeur={l.statut} />
                </Cellule>
              </Ligne>
            ))}
          </TableSimple>
        )}

        {tab === "Locations" && (
          <TableSimple vide="Aucune location" colonnes={["Référence", "Début", "Fin prévue", "Montant", "Statut"]}>
            {locations.map((l) => (
              <Ligne key={l.id} to={`/locations/${l.id}`}>
                <Cellule num>{l.id}</Cellule>
                <Cellule>{formatDate(l.debut)}</Cellule>
                <Cellule>{formatDate(l.finPrevue)}</Cellule>
                <Cellule num>{formatDH(l.montant)}</Cellule>
                <Cellule>
                  <Statut valeur={l.statut} />
                </Cellule>
              </Ligne>
            ))}
          </TableSimple>
        )}
      </div>
    </div>
  );
}

function TableSimple({
  colonnes,
  vide,
  children,
}: {
  colonnes: string[];
  vide: string;
  children: React.ReactNode;
}) {
  const estVide = Array.isArray(children) ? children.flat().length === 0 : !children;
  return (
    <Panneau bodyClassName="p-0">
      {estVide ? (
        <div className="p-6">
          <VideEtat titre={vide} description="Aucun enregistrement pour ce client." />
        </div>
      ) : (
        <Tableau colonnes={colonnes}>{children}</Tableau>
      )}
    </Panneau>
  );
}
