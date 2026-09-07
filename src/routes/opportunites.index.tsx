import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { LayoutGrid, Table2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Cellule, Kpi, Ligne, Panneau, Statut, Tableau, VideEtat } from "@/components/app/ui-kit";
import { Lien, useAller } from "@/components/app/nav";
import { useSinmat } from "@/data/store";
import { ETAPES_PIPELINE, formatDH, formatDate, nomUtilisateur, type EtapePipeline } from "@/data/sinmat";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/opportunites/")({
  head: () => ({
    meta: [
      { title: "Opportunités — Gestion SINMAT" },
      {
        name: "description",
        content:
          "Pipeline commercial SINMAT : opportunités de vente et de location par étape, valeur estimée et probabilité.",
      },
      { property: "og:title", content: "Opportunités — Gestion SINMAT" },
      { property: "og:description", content: "Pipeline commercial vente et location." },
    ],
  }),
  component: PageOpportunites,
});

function PageOpportunites() {
  const { opportunites, deplacerOpportunite } = useSinmat();
  const aller = useAller();
  const [vue, setVue] = useState<"kanban" | "liste">("kanban");
  const [drag, setDrag] = useState<string | null>(null);

  const total = opportunites.reduce((s, o) => s + o.montant, 0);
  const gagnees = opportunites.filter((o) => o.etape === "Gagné");

  const deposer = (etape: EtapePipeline) => {
    if (!drag) return;
    deplacerOpportunite(drag, etape);
    toast.success("Opportunité déplacée", { description: `${drag} → ${etape}` });
    setDrag(null);
  };

  return (
    <div className="space-y-5 p-6">
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <Kpi libelle="Opportunités actives" valeur={String(opportunites.length - gagnees.length)} ton="accent" />
        <Kpi libelle="Valeur du pipeline" valeur={formatDH(total)} tendance={8} ton="info" />
        <Kpi libelle="Opportunités gagnées" valeur={String(gagnees.length)} ton="succes" />
        <Kpi
          libelle="Taux de conversion"
          valeur={`${Math.round((gagnees.length / (opportunites.length || 1)) * 100)} %`}
          detail="Sur la période"
          ton="succes"
        />
      </div>

      <div className="flex items-center justify-between">
        <div className="inline-flex rounded-lg border border-border bg-surface p-0.5">
          {(
            [
              ["kanban", "Kanban", LayoutGrid],
              ["liste", "Liste", Table2],
            ] as const
          ).map(([v, l, I]) => (
            <button
              key={v}
              onClick={() => setVue(v)}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-[12.5px] font-medium transition-colors",
                vue === v ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground",
              )}
            >
              <I className="size-3.5" /> {l}
            </button>
          ))}
        </div>
        <Lien to="/devis/nouveau">
          <Button size="sm" className="h-9 font-semibold">
            Créer un devis
          </Button>
        </Lien>
      </div>

      {vue === "kanban" ? (
        <div className="scroll-slim flex gap-3 overflow-x-auto pb-3">
          {ETAPES_PIPELINE.map((etape) => {
            const items = opportunites.filter((o) => o.etape === etape);
            const valeur = items.reduce((s, o) => s + o.montant, 0);
            return (
              <div
                key={etape}
                onDragOver={(e) => e.preventDefault()}
                onDrop={() => deposer(etape)}
                className="flex w-[280px] shrink-0 flex-col rounded-xl border border-border bg-surface-muted/50"
              >
                <div className="border-b border-border px-3.5 py-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[13px] font-semibold text-foreground">{etape}</span>
                    <span className="num rounded-md bg-surface px-1.5 py-0.5 text-[11.5px] font-semibold text-muted-foreground ring-1 ring-border">
                      {items.length}
                    </span>
                  </div>
                  <p className="num mt-0.5 text-[12px] text-muted-foreground">{formatDH(valeur)}</p>
                </div>
                <div className="space-y-2 p-2.5">
                  {items.map((o) => (
                    <article
                      key={o.id}
                      draggable
                      onDragStart={() => setDrag(o.id)}
                      onClick={() => aller(`/opportunites/${o.id}`)}
                      className="cursor-pointer rounded-lg border border-border bg-card p-3 shadow-xs transition-shadow hover:shadow-sm"
                    >
                      <p className="num text-[11px] font-medium text-muted-foreground">{o.id}</p>
                      <p className="mt-0.5 text-[13.5px] font-semibold leading-snug text-foreground">
                        {o.titre}
                      </p>
                      <p className="mt-1 text-[12.5px] text-muted-foreground">{o.entreprise}</p>
                      <div className="mt-2.5 flex items-center justify-between">
                        <span className="num text-[13px] font-semibold text-foreground">
                          {formatDH(o.montant)}
                        </span>
                        <Statut valeur={o.type} ton={o.type === "Location" ? "info" : "accent"} />
                      </div>
                      <div className="mt-2 flex items-center justify-between text-[11.5px] text-muted-foreground">
                        <span>{nomUtilisateur(o.responsableId)}</span>
                        <span className="num">{o.probabilite} %</span>
                      </div>
                    </article>
                  ))}
                  {items.length === 0 && (
                    <p className="px-1 py-4 text-center text-[12px] text-muted-foreground">
                      Aucune opportunité
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <Panneau bodyClassName="p-0">
          {opportunites.length === 0 ? (
            <div className="p-6">
              <VideEtat titre="Aucune opportunité" description="Le pipeline est vide." />
            </div>
          ) : (
            <Tableau
              colonnes={[
                "Référence",
                "Opportunité",
                "Client",
                "Type",
                "Montant",
                "Étape",
                "Probabilité",
                "Clôture",
                "Responsable",
              ]}
            >
              {opportunites.map((o) => (
                <Ligne key={o.id} to={`/opportunites/${o.id}`}>
                  <Cellule num>{o.id}</Cellule>
                  <Cellule className="max-w-[240px]">
                    <span className="block truncate font-semibold text-foreground">{o.titre}</span>
                  </Cellule>
                  <Cellule>{o.entreprise}</Cellule>
                  <Cellule>
                    <Statut valeur={o.type} ton={o.type === "Location" ? "info" : "accent"} />
                  </Cellule>
                  <Cellule num>{formatDH(o.montant)}</Cellule>
                  <Cellule>
                    <Statut valeur={o.etape} ton="info" />
                  </Cellule>
                  <Cellule num>{o.probabilite} %</Cellule>
                  <Cellule className="text-muted-foreground">{formatDate(o.clotureEstimee)}</Cellule>
                  <Cellule className="text-muted-foreground">
                    {nomUtilisateur(o.responsableId)}
                  </Cellule>
                </Ligne>
              ))}
            </Tableau>
          )}
        </Panneau>
      )}
    </div>
  );
}
