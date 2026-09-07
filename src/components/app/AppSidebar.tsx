import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard,
  Users,
  Radio,
  Building2,
  Target,
  Package,
  ShoppingCart,
  CalendarRange,
  FileText,
  ClipboardList,
  Wallet,
  Receipt,
  Truck,
  Undo2,
  BarChart3,
  UserCog,
  Settings,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { SinmatLogo } from "./SinmatLogo";

interface Item {
  to: string;
  label: string;
  icon: LucideIcon;
  compteur?: number;
}

const GROUPES: { titre?: string; items: Item[] }[] = [
  { items: [{ to: "/", label: "Vue d'ensemble", icon: LayoutDashboard }] },
  {
    titre: "Commercial",
    items: [
      { to: "/prospects", label: "Prospects", icon: Users, compteur: 128 },
      { to: "/campagnes", label: "Campagnes WhatsApp", icon: Radio, compteur: 4 },
      { to: "/clients", label: "Clients", icon: Building2 },
      { to: "/opportunites", label: "Opportunités", icon: Target, compteur: 24 },
    ],
  },
  {
    titre: "Activité",
    items: [
      { to: "/catalogue", label: "Catalogue", icon: Package },
      { to: "/ventes", label: "Ventes", icon: ShoppingCart },
      { to: "/locations", label: "Locations", icon: CalendarRange, compteur: 36 },
      { to: "/devis", label: "Devis", icon: FileText, compteur: 12 },
      { to: "/commandes", label: "Commandes", icon: ClipboardList, compteur: 8 },
    ],
  },
  {
    titre: "Finance",
    items: [
      { to: "/paiements", label: "Paiements", icon: Wallet },
      { to: "/factures", label: "Factures", icon: Receipt },
    ],
  },
  {
    titre: "Logistique",
    items: [
      { to: "/livraisons", label: "Livraisons", icon: Truck, compteur: 6 },
      { to: "/retours", label: "Retours", icon: Undo2, compteur: 3 },
    ],
  },
  { titre: "Pilotage", items: [{ to: "/rapports", label: "Rapports", icon: BarChart3 }] },
  {
    titre: "Système",
    items: [
      { to: "/utilisateurs", label: "Utilisateurs", icon: UserCog },
      { to: "/parametres", label: "Paramètres", icon: Settings },
    ],
  },
];

export function AppSidebar({
  collapsed,
  onToggle,
}: {
  collapsed: boolean;
  onToggle: () => void;
}) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  const estActif = (to: string) =>
    to === "/" ? pathname === "/" : pathname === to || pathname.startsWith(to + "/");

  return (
    <aside
      className={cn(
        "flex h-screen shrink-0 flex-col border-r border-sidebar-border bg-sidebar transition-[width] duration-200 ease-out",
        collapsed ? "w-[76px]" : "w-[262px]",
      )}
    >
      <div
        className={cn(
          "flex h-16 items-center border-b border-sidebar-border",
          collapsed ? "justify-center px-2" : "gap-3 px-5",
        )}
      >
        <SinmatLogo compact={collapsed} />
      </div>

      <nav className="scroll-slim flex-1 overflow-y-auto px-3 py-4">
        {GROUPES.map((groupe, gi) => (
          <div key={gi} className={cn(gi > 0 && "mt-5")}>
            {groupe.titre && !collapsed && (
              <p className="mb-1.5 px-3 text-[10.5px] font-semibold uppercase tracking-[0.12em] text-sidebar-foreground/45">
                {groupe.titre}
              </p>
            )}
            {groupe.titre && collapsed && <div className="mx-3 mb-3 h-px bg-sidebar-border" />}
            <ul className="space-y-0.5">
              {groupe.items.map((item) => {
                const actif = estActif(item.to);
                const contenu = (
                  <Link
                    to={item.to}
                    className={cn(
                      "group relative flex items-center rounded-md text-[13.5px] transition-colors",
                      collapsed ? "h-9 w-full justify-center" : "h-9 gap-3 px-3",
                      actif
                        ? "bg-sidebar-accent font-semibold text-sidebar-accent-foreground"
                        : "font-medium text-sidebar-foreground/75 hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground",
                    )}
                  >
                    {actif && (
                      <span className="absolute left-0 top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-r-full bg-sidebar-primary" />
                    )}
                    <item.icon
                      className={cn(
                        "size-[17px] shrink-0",
                        actif ? "text-sidebar-primary" : "text-sidebar-foreground/60",
                      )}
                      strokeWidth={1.8}
                    />
                    {!collapsed && <span className="truncate">{item.label}</span>}
                    {!collapsed && item.compteur !== undefined && (
                      <span
                        className={cn(
                          "num ml-auto rounded px-1.5 py-0.5 text-[11px] font-semibold",
                          actif
                            ? "bg-sidebar-primary/15 text-sidebar-primary"
                            : "bg-white/5 text-sidebar-foreground/55",
                        )}
                      >
                        {item.compteur}
                      </span>
                    )}
                  </Link>
                );
                return (
                  <li key={item.to}>
                    {collapsed ? (
                      <Tooltip>
                        <TooltipTrigger asChild>{contenu}</TooltipTrigger>
                        <TooltipContent side="right">{item.label}</TooltipContent>
                      </Tooltip>
                    ) : (
                      contenu
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      <div className="border-t border-sidebar-border p-3">
        <button
          onClick={onToggle}
          className={cn(
            "flex h-9 items-center rounded-md text-[13px] font-medium text-sidebar-foreground/65 transition-colors hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground",
            collapsed ? "w-full justify-center" : "w-full gap-3 px-3",
          )}
        >
          {collapsed ? (
            <PanelLeftOpen className="size-[17px]" strokeWidth={1.8} />
          ) : (
            <>
              <PanelLeftClose className="size-[17px]" strokeWidth={1.8} />
              <span>Réduire</span>
            </>
          )}
        </button>
      </div>
    </aside>
  );
}
