import { useAller } from "./nav";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { useSinmat } from "@/data/store";

export function CommandPalette({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const navigate = useAller();
  const { clients, prospects, opportunites, devis, commandes, factures, locations, produits, livraisons } =
    useSinmat();

  const aller = (to: string) => {
    onOpenChange(false);
    navigate(to);
  };

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput placeholder="Rechercher un client, devis, facture, commande, matériel..." />
      <CommandList className="max-h-[420px]">
        <CommandEmpty>Aucun résultat.</CommandEmpty>
        <CommandGroup heading="Actions rapides">
          <CommandItem onSelect={() => aller("/clients")}>Créer un client</CommandItem>
          <CommandItem onSelect={() => aller("/prospects")}>Créer un prospect</CommandItem>
          <CommandItem onSelect={() => aller("/devis/nouveau")}>Créer un devis</CommandItem>
          <CommandItem onSelect={() => aller("/ventes")}>Créer une vente</CommandItem>
          <CommandItem onSelect={() => aller("/locations")}>Créer une location</CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Clients">
          {clients.map((c) => (
            <CommandItem key={c.id} value={`${c.nom} ${c.ville} client`} onSelect={() => aller(`/clients/${c.id}`)}>
              {c.nom} <span className="ml-2 text-muted-foreground">Client · {c.ville}</span>
            </CommandItem>
          ))}
        </CommandGroup>
        <CommandGroup heading="Prospects">
          {prospects.slice(0, 8).map((p) => (
            <CommandItem key={p.id} value={`${p.entreprise} prospect`} onSelect={() => aller(`/prospects/${p.id}`)}>
              {p.entreprise} <span className="ml-2 text-muted-foreground">Prospect</span>
            </CommandItem>
          ))}
        </CommandGroup>
        <CommandGroup heading="Opportunités">
          {opportunites.slice(0, 8).map((o) => (
            <CommandItem key={o.id} value={`${o.id} ${o.titre}`} onSelect={() => aller(`/opportunites/${o.id}`)}>
              {o.id} <span className="ml-2 text-muted-foreground">{o.titre}</span>
            </CommandItem>
          ))}
        </CommandGroup>
        <CommandGroup heading="Devis">
          {devis.map((d) => (
            <CommandItem key={d.id} value={`${d.id} devis`} onSelect={() => aller(`/devis/${d.id}`)}>
              {d.id} <span className="ml-2 text-muted-foreground">Devis</span>
            </CommandItem>
          ))}
        </CommandGroup>
        <CommandGroup heading="Commandes">
          {commandes.map((c) => (
            <CommandItem key={c.id} value={`${c.id} commande`} onSelect={() => aller(`/commandes/${c.id}`)}>
              {c.id} <span className="ml-2 text-muted-foreground">Commande</span>
            </CommandItem>
          ))}
        </CommandGroup>
        <CommandGroup heading="Factures">
          {factures.map((f) => (
            <CommandItem key={f.id} value={`${f.id} facture`} onSelect={() => aller(`/factures/${f.id}`)}>
              {f.id} <span className="ml-2 text-muted-foreground">Facture</span>
            </CommandItem>
          ))}
        </CommandGroup>
        <CommandGroup heading="Locations">
          {locations.map((l) => (
            <CommandItem key={l.id} value={`${l.id} location`} onSelect={() => aller(`/locations/${l.id}`)}>
              {l.id} <span className="ml-2 text-muted-foreground">Location</span>
            </CommandItem>
          ))}
        </CommandGroup>
        <CommandGroup heading="Produits">
          {produits.map((p) => (
            <CommandItem key={p.id} value={`${p.nom} ${p.reference} produit`} onSelect={() => aller(`/catalogue/${p.id}`)}>
              {p.nom} <span className="ml-2 text-muted-foreground">Produit · {p.reference}</span>
            </CommandItem>
          ))}
        </CommandGroup>
        <CommandGroup heading="Livraisons">
          {livraisons.map((l) => (
            <CommandItem key={l.id} value={`${l.id} livraison`} onSelect={() => aller(`/livraisons/${l.id}`)}>
              {l.id} <span className="ml-2 text-muted-foreground">Livraison</span>
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
