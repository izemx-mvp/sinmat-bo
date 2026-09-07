import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Plus, Radio, Reply, Sparkles, Target, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Cellule, Kpi, Ligne, Onglets, Panneau, Statut, Tableau } from "@/components/app/ui-kit";
import { Lien } from "@/components/app/nav";
import { useSinmat } from "@/data/store";
import { formatDate, formatNombre } from "@/data/sinmat";

export const Route = createFileRoute("/campagnes/")({
  head: () => ({
    meta: [
      { title: "Campagnes WhatsApp — Gestion SINMAT" },
      {
        name: "description",
        content:
          "Pilotage des campagnes de prospection WhatsApp automatisées SINMAT : audience, réponses, qualification et opportunités générées.",
      },
      { property: "og:title", content: "Campagnes WhatsApp — Gestion SINMAT" },
      {
        property: "og:description",
        content: "Lancez et pilotez vos campagnes de prospection automatisées.",
      },
    ],
  }),
  component: PageCampagnes,
});

const TABS = ["Toutes", "Brouillons", "Planifiées", "En cours", "Terminées"];

function PageCampagnes() {
  const { campagnes } = useSinmat();
  const [tab, setTab] = useState("Toutes");

  const filtrees = campagnes.filter((c) => {
    if (tab === "Toutes") return true;
    if (tab === "Brouillons") return c.statut === "Brouillon";
    if (tab === "Planifiées") return c.statut === "Planifiée";
    if (tab === "En cours") return c.statut === "En cours";
    return c.statut === "Terminée";
  });

  const total = (k: "envoyes" | "reponses" | "qualifies" | "opportunites") =>
    campagnes.reduce((s, c) => s + c[k], 0);

  return (
    <div className="space-y-5 p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="max-w-xl text-[13px] text-muted-foreground">
          L'agent IA WhatsApp qualifie automatiquement les prospects en arrière-plan. Seuls les
          résultats de qualification remontent ici.
        </p>
        <Lien to="/campagnes/nouvelle">
          <Button size="sm" className="h-9 gap-1.5 font-semibold">
            <Plus className="size-4" /> Nouvelle campagne
          </Button>
        </Lien>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        <Kpi
          libelle="Campagnes actives"
          valeur={String(campagnes.filter((c) => c.statut === "En cours").length)}
          detail="En cours d'exécution"
          ton="accent"
          icone={Radio}
        />
        <Kpi
          libelle="Prospects contactés"
          valeur={formatNombre(total("envoyes"))}
          tendance={18}
          ton="info"
          icone={Users}
        />
        <Kpi
          libelle="Taux de réponse"
          valeur={`${Math.round((total("reponses") / total("envoyes")) * 100)} %`}
          detail={`${formatNombre(total("reponses"))} réponses`}
          ton="succes"
          icone={Reply}
        />
        <Kpi
          libelle="Prospects qualifiés"
          valeur={formatNombre(total("qualifies"))}
          tendance={9}
          ton="succes"
          icone={Sparkles}
        />
        <Kpi
          libelle="Opportunités générées"
          valeur={formatNombre(total("opportunites"))}
          detail="Créées automatiquement"
          ton="accent"
          icone={Target}
        />
      </div>

      <Panneau bodyClassName="p-0">
        <div className="px-4">
          <Onglets valeurs={TABS} actif={tab} onChange={setTab} />
        </div>
        <Tableau
          colonnes={[
            "Campagne",
            "Audience",
            "Messages envoyés",
            "Réponses",
            "Qualifiés",
            "Opportunités",
            "Taux conversion",
            "Statut",
            "Date",
          ]}
        >
          {filtrees.map((c) => (
            <Ligne key={c.id} to={`/campagnes/${c.id}`}>
              <Cellule className="max-w-[280px]">
                <span className="block truncate font-semibold text-foreground">{c.nom}</span>
                <span className="num block text-[11.5px] text-muted-foreground">{c.id}</span>
              </Cellule>
              <Cellule num>{formatNombre(c.audience)}</Cellule>
              <Cellule num>{formatNombre(c.envoyes)}</Cellule>
              <Cellule num>{formatNombre(c.reponses)}</Cellule>
              <Cellule num>{formatNombre(c.qualifies)}</Cellule>
              <Cellule num>{formatNombre(c.opportunites)}</Cellule>
              <Cellule num>
                <span className="font-semibold text-primary">{c.conversion} %</span>
              </Cellule>
              <Cellule>
                <Statut valeur={c.statut} />
              </Cellule>
              <Cellule className="text-muted-foreground">{formatDate(c.date)}</Cellule>
            </Ligne>
          ))}
        </Tableau>
      </Panneau>
    </div>
  );
}
