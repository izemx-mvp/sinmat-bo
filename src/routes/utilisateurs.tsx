import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search, Users } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Cellule, Kpi, Ligne, Onglets, Panneau, Statut, Tableau, VideEtat } from "@/components/app/ui-kit";
import { utilisateurs } from "@/data/sinmat";

export const Route = createFileRoute("/utilisateurs")({
  head: () => ({
    meta: [
      { title: "Utilisateurs — Gestion SINMAT" },
      { name: "description", content: "Gestion des utilisateurs et rôles SINMAT." },
      { property: "og:title", content: "Utilisateurs — Gestion SINMAT" },
      { property: "og:description", content: "Équipe commerciale et opérationnelle." },
    ],
  }),
  component: PageUtilisateurs,
});

const TABS = ["Tous", "Administrateur", "Direction", "Commercial", "Comptabilité", "Logistique"];

function PageUtilisateurs() {
  const [tab, setTab] = useState("Tous");
  const [q, setQ] = useState("");

  const filtres = useMemo(() => {
    const t = q.trim().toLowerCase();
    return utilisateurs.filter((u) => {
      if (t && !`${u.nom} ${u.email} ${u.role}`.toLowerCase().includes(t)) return false;
      if (tab === "Tous") return true;
      return u.role === tab;
    });
  }, [tab, q]);

  const compteurs = Object.fromEntries(TABS.map((t) => [t, t === "Tous" ? utilisateurs.length : utilisateurs.filter((u) => u.role === t).length]));

  return (
    <div className="space-y-5 p-6">
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <Kpi libelle="Utilisateurs" valeur={String(utilisateurs.length)} ton="info" icone={Users} />
        <Kpi libelle="Actifs" valeur={String(utilisateurs.filter((u) => u.statut === "Actif").length)} ton="succes" />
        <Kpi libelle="Suspendus" valeur={String(utilisateurs.filter((u) => u.statut === "Suspendu").length)} ton="danger" />
        <Kpi libelle="Commerciaux" valeur={String(utilisateurs.filter((u) => u.role === "Commercial").length)} ton="accent" />
      </div>

      <Panneau bodyClassName="p-0">
        <div className="flex flex-wrap items-center justify-between gap-3 px-4 pt-3">
          <Onglets valeurs={TABS} actif={tab} onChange={setTab} compteurs={compteurs} />
          <div className="relative pb-2">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Rechercher un utilisateur..." className="h-9 w-[260px] pl-8 text-[13px]" />
          </div>
        </div>

        {filtres.length === 0 ? (
          <div className="p-6">
            <VideEtat titre="Aucun utilisateur" description="Aucun utilisateur ne correspond à votre recherche." />
          </div>
        ) : (
          <Tableau colonnes={["Initiales", "Nom", "Email", "Rôle", "Statut", "Dernière connexion"]}>
            {filtres.map((u) => (
              <Ligne key={u.id}>
                <Cellule>
                  <span className="flex size-8 items-center justify-center rounded-full bg-primary/10 text-[12px] font-bold text-primary">
                    {u.initiales}
                  </span>
                </Cellule>
                <Cellule className="font-semibold">{u.nom}</Cellule>
                <Cellule className="text-muted-foreground">{u.email}</Cellule>
                <Cellule>{u.role}</Cellule>
                <Cellule>
                  <Statut valeur={u.statut} />
                </Cellule>
                <Cellule className="text-muted-foreground">{u.derniereConnexion}</Cellule>
              </Ligne>
            ))}
          </Tableau>
        )}
      </Panneau>
    </div>
  );
}
