# Plan — Finaliser l'application SINMAT

## Contexte

L'application SINMAT dispose déjà d'une coque solide (sidebar, header, palette de commandes, thème visuel) et des modules suivants :

- Vue d'ensemble (`/`)
- Prospects (`/prospects`, `/prospects/$id`)
- Campagnes WhatsApp (`/campagnes`, `/campagnes/$id`, `/campagnes/nouvelle`)
- Clients (`/clients`, `/clients/$id`)
- Opportunités (`/opportunites` liste uniquement)

Toutes les entrées de la sidebar pointent actuellement vers des routes inexistantes. Le modèle de données (`src/data/sinmat.ts`) et le store (`src/data/store.tsx`) sont complets et prêts à recevoir les nouveaux écrans.

## Objectif

Construire tous les modules et pages détail restants, avec une navigation entièrement fonctionnelle et un rendu cohérent avec l'identité visuelle SINMAT déjà en place.

## Phases

### Phase 1 — Flux commercial principal

Pages à créer :

- `/devis` : liste des devis avec filtres (statut, type, client, période), KPI en-tête.
- `/devis/$id` : fiche devis avec lignes, totaux, statut, actions (marquer envoyé/accepter/refuser), documents liés.
- `/devis/nouveau` : constructeur de devis (choix client, type Vente/Location, ajout de lignes produit avec quantité/durée/remise/TVA, conditions, expiration).
- `/commandes` : liste des commandes avec filtres et KPI.
- `/commandes/$id` : fiche commande avec statut, paiement, livraison, facture liées, actions (générer facture, créer livraison).
- `/factures` : liste des factures avec filtres et KPI (reste dû, en retard).
- `/factures/$id` : fiche facture avec échéance, historique de paiements, actions (enregistrer paiement).
- `/paiements` : liste des paiements reçus avec filtres.
- `/paiements/$id` : fiche paiement.

### Phase 2 — Catalogue, ventes et locations

Pages à créer :

- `/catalogue` : grille/liste du matériel avec disponibilité, prix, stock.
- `/catalogue/$id` : fiche produit avec caractéristiques, historique locations/ventes, stock.
- `/ventes` : liste des ventes avec filtres.
- `/ventes/$id` : fiche vente.
- `/locations` : liste des locations avec filtres (en cours, retour proche, en retard).
- `/locations/$id` : fiche location avec planning, retour lié.

### Phase 3 — Logistique et retours

Pages à créer :

- `/livraisons` : planning des livraisons avec filtres.
- `/livraisons/$id` : fiche livraison avec statut, itinéraire, commande liée.
- `/retours` : liste des retours avec filtres.
- `/retours/$id` : fiche retour avec inspection, frais, matériel récupéré.

### Phase 4 — Pilotage, utilisateurs et paramètres

Pages à créer :

- `/rapports` : tableau de bord rapports avec graphiques clés (CA, pipeline, parc de location, encours).
- `/utilisateurs` : liste des utilisateurs avec rôles et statuts.
- `/parametres` : écran de configuration (entreprise, numérotation, notifications, intégrations).

### Phase 5 — Finitions

- Créer la page détail manquante `/opportunites/$id`.
- Ajouter le menu mobile slide-out dans `AppSidebar`.
- Vérifier que tous les liens de la sidebar, du header "+ Créer" et du dashboard pointent vers des routes existantes.
- Vérifier les métadonnées `head()` de chaque nouvelle route.

## Contraintes et patterns à respecter

- Routes TanStack Start sous `src/routes/` avec `createFileRoute`.
- Utiliser exclusivement les composants du `ui-kit` existant (`Panneau`, `Kpi`, `Tableau`, `Statut`, `Onglets`, `EnTeteDetail`, etc.).
- Pas de backend ni de Lovable Cloud requis : les données restent dans le store React existant.
- Pas de hardcoded colors : utiliser les tokens CSS du design system.
- Chaque nouvelle route doit définir son propre `head()` avec titre, description, og:title et og:description.
- Les listes doivent inclure des états vides réalistes (`VideEtat`).

## Livrables attendus

- Toutes les routes de la sidebar fonctionnelles.
- Aucun lien mort dans l'interface.
- Build TypeScript sans erreur.
- Aperçu visuel cohérent avec les modules existants.
