import { useRouterState } from "@tanstack/react-router";
import { Lien, useAller } from "./nav";
import { Bell, ChevronDown, Plus, Search } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { notificationsSeed, utilisateurCourant } from "@/data/sinmat";
import { cn } from "@/lib/utils";

const META: Record<string, { titre: string; sousTitre: string }> = {
  "/": {
    titre: "Vue d'ensemble",
    sousTitre: "Pilotez l'activité commerciale, financière et logistique de SINMAT.",
  },
  "/prospects": {
    titre: "Prospects",
    sousTitre: "Gérez et qualifiez votre base de prospection.",
  },
  "/campagnes": {
    titre: "Campagnes WhatsApp",
    sousTitre: "Lancez et pilotez vos campagnes de prospection automatisées.",
  },
  "/clients": { titre: "Clients", sousTitre: "Vue 360° de votre portefeuille client." },
  "/opportunites": {
    titre: "Opportunités",
    sousTitre: "Suivez votre pipeline commercial étape par étape.",
  },
  "/catalogue": {
    titre: "Catalogue",
    sousTitre: "Matériel disponible à la vente et à la location.",
  },
  "/ventes": { titre: "Ventes", sousTitre: "Suivi des ventes de matériel et d'outillage." },
  "/locations": {
    titre: "Locations",
    sousTitre: "Parc en location, retours et disponibilités.",
  },
  "/devis": { titre: "Devis", sousTitre: "Proposition commerciale, validité et acceptation." },
  "/qualification": {
    titre: "Qualification Agent IA",
    sousTitre: "Règles produit, tarification et simulation de qualification.",
  },
  "/paiements": { titre: "Paiements", sousTitre: "Encaissements, échéances et retards." },
  "/factures": { titre: "Factures", sousTitre: "Facturation client et suivi des règlements." },
  "/livraisons": { titre: "Livraisons", sousTitre: "Préparation, planning et tournées." },
  "/retours": { titre: "Retours", sousTitre: "Récupération et inspection du matériel loué." },
  "/rapports": { titre: "Rapports", sousTitre: "Performance commerciale, financière et logistique." },
  "/utilisateurs": { titre: "Utilisateurs", sousTitre: "Équipes, rôles et permissions." },
  "/parametres": { titre: "Paramètres", sousTitre: "Configuration de la plateforme SINMAT." },
};

const CREATIONS = [
  { label: "Nouveau prospect", to: "/prospects" },
  { label: "Importer des prospects", to: "/prospects/import" },
  { label: "Nouveau client", to: "/clients" },
  { label: "Nouvelle opportunité", to: "/opportunites" },
  { label: "Nouveau devis", to: "/devis/nouveau" },
  { label: "Nouvelle vente", to: "/ventes/nouvelle" },
  { label: "Nouvelle location", to: "/locations/nouvelle" },
  { label: "Nouveau matériel", to: "/catalogue/nouveau" },
  { label: "Nouvelle livraison", to: "/livraisons/nouvelle" },
];

export function TopHeader({ onOuvrirRecherche }: { onOuvrirRecherche: () => void }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const navigate = useAller();
  const base = "/" + (pathname.split("/")[1] ?? "");
  const meta = META[pathname] ?? META[base] ?? META["/"]!;

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-border bg-surface/85 px-6 backdrop-blur-md">
      <div className="min-w-0 flex-1">
        <h1 className="truncate font-display text-[17px] font-bold leading-tight text-foreground">
          {meta.titre}
        </h1>
        <p className="truncate text-[12.5px] text-muted-foreground">{meta.sousTitre}</p>
      </div>

      <button
        onClick={onOuvrirRecherche}
        className="hidden h-9 w-[340px] items-center gap-2.5 rounded-md border border-border bg-surface-muted px-3 text-left text-[13px] text-muted-foreground transition-colors hover:border-border-strong hover:bg-surface lg:flex xl:w-[420px]"
      >
        <Search className="size-4 shrink-0" />
        <span className="truncate">
          Rechercher un client, devis, facture, vente, location, matériel...
        </span>
        <kbd className="ml-auto rounded border border-border bg-surface px-1.5 py-0.5 text-[10.5px] font-semibold">
          ⌘K
        </kbd>
      </button>

      <button
        onClick={onOuvrirRecherche}
        className="flex size-9 items-center justify-center rounded-md border border-border text-muted-foreground transition-colors hover:text-foreground lg:hidden"
        aria-label="Rechercher"
      >
        <Search className="size-4" />
      </button>

      <Popover>
        <PopoverTrigger asChild>
          <button
            className="relative flex size-9 items-center justify-center rounded-md border border-border text-muted-foreground transition-colors hover:bg-surface-muted hover:text-foreground"
            aria-label="Notifications"
          >
            <Bell className="size-4" />
            <span className="absolute right-1.5 top-1.5 size-2 rounded-full bg-primary ring-2 ring-surface" />
          </button>
        </PopoverTrigger>
        <PopoverContent align="end" className="w-[360px] p-0">
          <div className="flex items-center justify-between border-b border-border px-4 py-2.5">
            <p className="text-[13px] font-semibold">Notifications</p>
            <span className="num rounded bg-primary/10 px-1.5 py-0.5 text-[11px] font-semibold text-primary">
              {notificationsSeed.length}
            </span>
          </div>
          <ul className="max-h-[360px] divide-y divide-border overflow-y-auto">
            {notificationsSeed.map((n) => (
              <li key={n.id}>
                <Lien
                  to={n.lien}
                  className="flex gap-3 px-4 py-3 transition-colors hover:bg-surface-muted"
                >
                  <span
                    className={cn(
                      "mt-1.5 size-2 shrink-0 rounded-full",
                      n.type === "alerte" && "bg-destructive",
                      n.type === "logistique" && "bg-warning",
                      n.type === "commercial" && "bg-info",
                      n.type === "succes" && "bg-success",
                    )}
                  />
                  <span className="min-w-0">
                    <span className="block text-[13px] font-semibold text-foreground">
                      {n.titre}
                    </span>
                    <span className="num block text-[12px] font-medium text-muted-foreground">
                      {n.ref}
                    </span>
                    <span className="block truncate text-[12.5px] text-foreground/75">
                      {n.detail}
                    </span>
                    <span className="mt-0.5 block text-[11.5px] text-muted-foreground">
                      {n.date}
                    </span>
                  </span>
                </Lien>
              </li>
            ))}
          </ul>
        </PopoverContent>
      </Popover>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button size="sm" className="h-9 gap-1.5 px-3 font-semibold">
            <Plus className="size-4" /> Créer
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>Créer un enregistrement</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {CREATIONS.map((c) => (
            <DropdownMenuItem key={c.label} onSelect={() => navigate(c.to)}>
              {c.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="flex items-center gap-2 rounded-md border border-border py-1 pl-1 pr-2 transition-colors hover:bg-surface-muted">
            <span className="flex size-7 items-center justify-center rounded bg-secondary text-[11px] font-bold text-secondary-foreground">
              {utilisateurCourant.initiales}
            </span>
            <ChevronDown className="size-3.5 text-muted-foreground" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel className="font-normal">
            <p className="text-[13px] font-semibold">{utilisateurCourant.nom}</p>
            <p className="text-[12px] text-muted-foreground">{utilisateurCourant.email}</p>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onSelect={() => navigate("/parametres")}>
            Paramètres
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={() => navigate("/utilisateurs")}>
            Utilisateurs & rôles
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem>Se déconnecter</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
