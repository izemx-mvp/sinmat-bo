import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Building2, Plus, Search, TrendingUp, Wallet } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Cellule, Kpi, Ligne, Onglets, Panneau, Statut, Tableau, VideEtat } from "@/components/app/ui-kit";
import { useAller } from "@/components/app/nav";
import { useSinmat } from "@/data/store";
import { formatDH, formatDate } from "@/data/sinmat";

export const Route = createFileRoute("/clients/")({
  head: () => ({
    meta: [
      { title: "Clients — Gestion SINMAT" },
      {
        name: "description",
        content:
          "Portefeuille clients SINMAT : chiffre d'affaires, encours, locations en cours et historique commercial complet.",
      },
      { property: "og:title", content: "Clients — Gestion SINMAT" },
      {
        property: "og:description",
        content: "Vue 360° du portefeuille clients SINMAT.",
      },
    ],
  }),
  component: PageClients,
});

const TABS = ["Tous", "Actifs", "Inactifs", "Encours élevé"];

function PageClients() {
  const { clients, ajouterClient } = useSinmat();
  const aller = useAller();
  const [tab, setTab] = useState("Tous");
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    nom: "",
    contact: "",
    telephone: "",
    email: "",
    ville: "Casablanca",
    ice: "",
  });

  const filtres = useMemo(() => {
    const t = q.trim().toLowerCase();
    return clients.filter((c) => {
      if (t && !`${c.nom} ${c.contact} ${c.ville} ${c.id}`.toLowerCase().includes(t)) return false;
      if (tab === "Actifs") return c.statut === "Actif";
      if (tab === "Inactifs") return c.statut !== "Actif";
      if (tab === "Encours élevé") return c.encours > 50000;
      return true;
    });
  }, [clients, q, tab]);

  const ca = clients.reduce((s, c) => s + c.caTotal, 0);
  const encours = clients.reduce((s, c) => s + c.encours, 0);

  const creer = () => {
    if (!form.nom.trim()) return;
    const c = ajouterClient(form);
    setOpen(false);
    toast.success("Client créé", { description: `${c.id} · ${c.nom}` });
    aller(`/clients/${c.id}`);
  };

  return (
    <div className="space-y-5 p-6">
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <Kpi libelle="Clients actifs" valeur={String(clients.filter((c) => c.statut === "Actif").length)} ton="accent" icone={Building2} />
        <Kpi libelle="Chiffre d'affaires cumulé" valeur={formatDH(ca)} tendance={12} ton="succes" icone={TrendingUp} />
        <Kpi libelle="Encours total" valeur={formatDH(encours)} detail="Factures non soldées" ton="alerte" icone={Wallet} />
        <Kpi
          libelle="Locations en cours"
          valeur={String(clients.reduce((s, c) => s + c.locationsActives, 0))}
          detail="Matériels chez les clients"
          ton="info"
        />
      </div>

      <Panneau bodyClassName="p-0">
        <div className="flex flex-wrap items-center justify-between gap-3 px-4 pt-3">
          <Onglets valeurs={TABS} actif={tab} onChange={setTab} />
          <div className="flex items-center gap-2 pb-2">
            <div className="relative">
              <Search className="pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Rechercher un client..."
                className="h-9 w-[240px] pl-8 text-[13px]"
              />
            </div>
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button size="sm" className="h-9 gap-1.5 font-semibold">
                  <Plus className="size-4" /> Nouveau client
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Nouveau client</DialogTitle>
                </DialogHeader>
                <div className="grid gap-3 sm:grid-cols-2">
                  {[
                    ["nom", "Raison sociale"],
                    ["contact", "Contact principal"],
                    ["telephone", "Téléphone"],
                    ["email", "Email"],
                    ["ville", "Ville"],
                    ["ice", "ICE"],
                  ].map(([k, l]) => (
                    <div key={k} className={k === "nom" ? "sm:col-span-2" : ""}>
                      <Label className="text-[12.5px]">{l}</Label>
                      <Input
                        className="mt-1"
                        value={form[k as keyof typeof form]}
                        onChange={(e) => setForm({ ...form, [k]: e.target.value })}
                      />
                    </div>
                  ))}
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setOpen(false)}>
                    Annuler
                  </Button>
                  <Button onClick={creer}>Créer le client</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {filtres.length === 0 ? (
          <div className="p-6">
            <VideEtat titre="Aucun client" description="Aucun client ne correspond à votre recherche." />
          </div>
        ) : (
          <Tableau
            colonnes={[
              "Client",
              "Ville",
              "Type",
              "CA total",
              "Encours",
              "Locations",
              "Dernière activité",
              "Statut",
            ]}
          >
            {filtres.map((c) => (
              <Ligne key={c.id} to={`/clients/${c.id}`}>
                <Cellule className="max-w-[260px]">
                  <span className="block truncate font-semibold text-foreground">{c.nom}</span>
                  <span className="block text-[11.5px] text-muted-foreground">{c.contact}</span>
                </Cellule>
                <Cellule>{c.ville}</Cellule>
                <Cellule className="text-muted-foreground">{c.type}</Cellule>
                <Cellule num>{formatDH(c.caTotal)}</Cellule>
                <Cellule num>
                  <span className={c.encours > 0 ? "font-semibold text-warning-strong" : ""}>
                    {formatDH(c.encours)}
                  </span>
                </Cellule>
                <Cellule num>{c.locationsActives}</Cellule>
                <Cellule className="text-muted-foreground">{formatDate(c.derniereActivite)}</Cellule>
                <Cellule>
                  <Statut valeur={c.statut} />
                </Cellule>
              </Ligne>
            ))}
          </Tableau>
        )}
      </Panneau>
    </div>
  );
}
