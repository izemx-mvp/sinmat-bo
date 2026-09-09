# Remix of SINMAT Hub

PROJECT NAME:

SINMAT — Plateforme de Gestion Commerciale, Location, Facturation & Livraison

REFERENCE WEBSITE:

https://sinmat.ma/

==================================================

1. OBJECTIF GLOBAL DU PROJET

==================================================

Create a sophisticated, premium and highly polished B2B web application for SINMAT.

SINMAT operates in the construction equipment sector, mainly around:

- equipment sales

- equipment rental

- quotation management

- order management

- invoicing

- payment tracking

- delivery management

- rental returns

- customer relationship management

- commercial prospecting through WhatsApp AI automation

The objective is to create a centralized business management platform inspired by the operational logic of modern ERP/CRM software such as Odoo, while being completely customized for SINMAT.

The platform must centralize the entire customer lifecycle:

PROSPECT

→ WHATSAPP AI CAMPAIGN

→ AUTOMATIC QUALIFICATION

→ OPPORTUNITY

→ CLIENT

→ SALE OR RENTAL

→ QUOTATION

→ ORDER

→ PAYMENT

→ INVOICE

→ DELIVERY

→ RENTAL RETURN IF APPLICABLE

→ CLOSING

IMPORTANT:

This platform is NOT an ecommerce website.

It is an internal business management platform used by SINMAT teams:

- Direction

- Sales

- Finance

- Accounting

- Logistics

- Administration

All visible interface content must be in FRENCH.

==================================================

2. DESIGN DIRECTION

==================================================

Analyze SINMAT's existing website:

https://sinmat.ma/

Reuse the existing visual identity as inspiration:

- logo

- brand colors

- typography spirit

- industrial / construction universe

- visual identity

- image style

- button style

- general brand personality

Do NOT copy the website literally.

Transform the current visual identity into a sophisticated enterprise application.

The final result should feel like:

"A premium intelligent operating system built specifically for SINMAT."

The design should combine:

- professional ERP

- modern CRM

- premium logistics SaaS

- construction industry identity

- clean financial management

- modern AI-powered business software

STYLE REFERENCES:

- Odoo

- Attio

- Stripe Dashboard

- Linear

- HubSpot

- modern enterprise ERP interfaces

Avoid a generic admin template look.

Avoid:

- generic purple SaaS gradients

- excessive colorful cards

- childish illustrations

- huge empty areas

- excessive rounded cards

- robot illustrations

- futuristic holograms

Use:

- refined typography

- elegant cards

- structured layouts

- thin borders

- subtle shadows

- sophisticated icons

- excellent spacing

- strong information hierarchy

- neutral background

- SINMAT brand colors as accent colors

- construction equipment images only where relevant

==================================================

3. GENERAL APPLICATION ARCHITECTURE

==================================================

Use a persistent LEFT SIDEBAR.

Desktop-first design.

Expanded sidebar:

approximately 250–270px

Collapsed sidebar:

approximately 72–80px

Sidebar must be:

- elegant

- collapsible

- responsive

- professional

- visually aligned with SINMAT branding

TOP:

SINMAT logo

Under the logo:

"Gestion SINMAT"

==================================================

4. SIDEBAR STRUCTURE

==================================================

01. Vue d’ensemble

SECTION: COMMERCIAL

02. Prospects

03. Campagnes WhatsApp

04. Clients

05. Opportunités

SECTION: ACTIVITÉ

06. Catalogue

07. Ventes

08. Locations

09. Devis

10. Commandes

SECTION: FINANCE

11. Paiements

12. Factures

SECTION: LOGISTIQUE

13. Livraisons

14. Retours

SECTION: PILOTAGE

15. Rapports

SECTION: SYSTÈME

16. Utilisateurs

17. Paramètres

IMPORTANT:

Do NOT create:

- Conversations IA

- WhatsApp Inbox

- Chat module

- Message history interface

WhatsApp AI operates only in the background.

Each sidebar item must use:

- minimalist line icon

- label

- active state

- optional counter

Examples:

Prospects

128

Opportunités

24

Devis

12

Livraisons

6

Active item:

- subtle colored background

- SINMAT accent

- highlighted icon

- stronger typography

==================================================

5. TOP HEADER

==================================================

Create a sticky top header.

LEFT:

Dynamic page title.

Example:

"Vue d’ensemble"

Subtitle:

"Pilotez l’activité commerciale, financière et logistique de SINMAT."

CENTER / RIGHT:

Global search:

"Rechercher un client, devis, facture, commande, matériel..."

Keyboard shortcut:

⌘ K

Actions:

- notifications

- "+ Créer"

- user profile

The "+ Créer" menu includes:

Nouveau prospect

Nouveau client

Nouvelle opportunité

Nouveau devis

Nouvelle vente

Nouvelle location

Nouvelle commande

Nouvelle livraison

==================================================

6. GLOBAL BUSINESS LOGIC

==================================================

All modules must be interconnected.

Never create independent disconnected sections.

MAIN BUSINESS RELATIONSHIP:

Prospect

↓

Qualification IA

↓

Opportunity

↓

Customer

↓

Quotation

↓

Order

↓

Payment

↓

Invoice

↓

Delivery

If SALE:

Delivery

↓

Closed

If RENTAL:

Delivery

↓

Active Rental

↓

Return

↓

Inspection

↓

Closed

Every document must remain connected to:

- customer

- opportunity

- quotation

- order

- payment

- invoice

- delivery

- rental if applicable

==================================================

7. MODULE — VUE D’ENSEMBLE

==================================================

Create a sophisticated operational command center.

Do not create a generic dashboard.

HEADER:

"Bonjour Yassine,"

"Voici l’activité de SINMAT aujourd’hui."

Period filter:

Aujourd’hui

Cette semaine

Ce mois

Ce trimestre

TOP KPI CARDS:

1.

Opportunités actives

24

+6 cette semaine

2.

Devis en attente

12

384 500 DH

3.

Commandes à livrer

8

3 urgentes

4.

Paiements à recevoir

156 800 DH

5 échéances dépassées

5.

Matériels en location

36

7 retours cette semaine

Use:

- subtle trend indicators

- compact cards

- strong amounts

- status indicators

SECTION:

"Pipeline commercial"

Display stages:

À qualifier

12

Qualifié

18

Devis à préparer

10

Devis envoyé

9

Négociation

7

Confirmé

5

Gagné

14

Display estimated value for each stage.

SECTION:

"Performance commerciale"

Chart:

Opportunités

Ventes

Locations

Period:

7 jours

30 jours

3 mois

12 mois

SECTION:

"Actions prioritaires"

Example 1:

DEV-2026-0182

Atlas Construction

Devis expire aujourd’hui

87 500 DH

CTA:

Voir le devis

Example 2:

FAC-2026-0098

Paiement en retard

32 400 DH

Retard : 5 jours

CTA:

Voir la facture

Example 3:

LOC-2026-0041

Retour prévu demain

Mini-pelle 3.5T

CTA:

Voir la location

SECTION:

"Performance des campagnes WhatsApp"

Prospects contactés

1 240

Réponses reçues

486

Prospects qualifiés

138

Opportunités générées

64

Display funnel:

Contactés

→ Réponses

→ Qualifiés

→ Opportunités

IMPORTANT:

Do NOT show messages or conversation bubbles.

SECTION:

"Livraisons du jour"

Show compact list:

Référence

Client

Ville

Créneau

Responsable

Statut

==================================================

8. MODULE — PROSPECTS

==================================================

Create an advanced CRM prospect database.

PAGE HEADER:

"Prospects"

Subtitle:

"Gérez et qualifiez votre base de prospection."

Primary CTA:

"+ Ajouter un prospect"

Secondary CTA:

"Importer un fichier"

Search:

"Rechercher un prospect..."

FILTER TABS:

Tous

Nouveaux

À contacter

Contactés

Intéressés

À relancer

Non intéressés

ADVANCED FILTERS:

Ville

Secteur

Source

Responsable

Niveau d’intérêt

Dernier contact

Date de création

Type de besoin

TABLE COLUMNS:

Prospect

Entreprise

Téléphone

Ville

Secteur

Source

Dernière activité

Qualification

Responsable

Actions

REALISTIC DATA:

Atlas Construction

BTP Horizon

Build Maroc

Tanger Travaux

Nord Bâtiment

ProChantier Maroc

Constructa SARL

Marrakech BTP Services

==================================================

9. PROSPECT DETAIL PAGE

==================================================

Do NOT use a popup.

Use full detail page.

HEADER:

Back button

Atlas Construction

Prospect

Responsable:

Yassine El Mansouri

Quick actions:

Créer une opportunité

Ajouter une note

Modifier

Marquer à relancer

TABS:

Aperçu

Opportunités

Documents

Historique

APERÇU:

SECTION:

Informations générales

Entreprise

Contact

Téléphone

Email

Ville

Secteur

Source

Date de création

SECTION:

Qualification WhatsApp IA

Display structured results only.

Statut:

Qualifié

Niveau d’intérêt:

Élevé

Type de besoin:

Location

Matériel:

Mini-pelle 3.5T

Quantité:

2

Durée:

3 semaines

Date souhaitée:

15 septembre 2026

Ville / chantier:

Tanger

Urgence:

Élevée

Résumé IA:

"Le prospect recherche deux mini-pelles pour un chantier à Tanger à partir du 15 septembre pour environ trois semaines. Il souhaite recevoir une proposition incluant la livraison."

Dernière qualification:

07 sept. 2026 à 14:32

AI RECOMMENDATION CARD:

✦ Analyse IA

Probabilité de conversion:

82%

Action recommandée:

"Préparer un devis de location aujourd’hui."

CTA:

Créer l’opportunité

If opportunity already exists:

"Opportunité créée automatiquement"

OPP-2026-0042

CTA:

Voir l’opportunité

HISTORY TIMELINE:

05 sept.

Prospect ajouté

06 sept.

Campagne WhatsApp lancée

06 sept.

Prospect qualifié automatiquement

07 sept.

Opportunité créée

IMPORTANT:

Do not show actual WhatsApp messages.

==================================================

10. MODULE — CAMPAGNES WHATSAPP

==================================================

This module manages WhatsApp AI prospecting campaigns.

Do NOT create individual conversation screens.

PAGE HEADER:

"Campagnes WhatsApp"

Subtitle:

"Lancez et pilotez vos campagnes de prospection automatisées."

CTA:

"+ Nouvelle campagne"

METRICS:

Campagnes actives

4

Prospects contactés

1 240

Taux de réponse

39%

Prospects qualifiés

138

Opportunités générées

64

FILTERS:

Toutes

Brouillons

Planifiées

En cours

Terminées

CAMPAIGN TABLE:

Campagne

Audience

Messages envoyés

Réponses

Qualifiés

Opportunités

Taux conversion

Statut

Date

EXAMPLE:

Relance entreprises BTP — Tanger

218 prospects

184 envoyés

79 réponses

27 qualifiés

14 opportunités

6.4%

En cours

Location matériel — Septembre

342 prospects

342 envoyés

121 réponses

39 qualifiés

17 opportunités

5%

Terminée

==================================================

11. CREATE WHATSAPP CAMPAIGN

==================================================

Create multi-step wizard.

STEP 1:

Informations

Nom de campagne

Description

Objectif

STEP 2:

Audience

Filters:

Ville

Secteur

Type de prospect

Dernier contact

Historique

Intérêt potentiel

Client / Prospect

Example:

Ville = Tanger

Secteur = BTP

Dernier contact > 30 jours

Show dynamically:

"218 prospects correspondent à vos critères."

STEP 3:

Configuration Agent IA

Message d’ouverture

Example:

"Bonjour {{prenom}}, SINMAT souhaite connaître vos besoins actuels en matériel de chantier."

Objectif IA:

"Identifier un besoin potentiel en achat ou location de matériel de construction."

Qualification required fields:

☑ Achat ou location

☑ Produit recherché

☑ Quantité

☑ Durée si location

☑ Date souhaitée

☑ Ville / chantier

☑ Urgence

STEP 4:

Planification

Envoyer maintenant

ou

Programmer

Date

Heure

STEP 5:

Résumé

Audience

Objectif

Critères

Date

Volume

CTA:

"Lancer la campagne"

==================================================

12. CAMPAIGN DETAIL PAGE

==================================================

HEADER:

Relance entreprises BTP — Tanger

Status:

En cours

SUMMARY:

Audience

218

Envoyés

184

Réponses

79

Qualifiés

27

Opportunités

14

Display conversion funnel.

SECTION:

"Prospects qualifiés"

TABLE:

Prospect

Entreprise

Ville

Résultat IA

Besoin

Produit

Niveau d’intérêt

Opportunité

Date qualification

Example:

Atlas Construction

Tanger

Qualifié

Location

Mini-pelle 3.5T

Élevé

OPP-2026-0042

07 sept. 2026

IMPORTANT:

No chat interface.

==================================================

13. MODULE — CLIENTS

==================================================

Create CRM client directory.

PAGE HEADER:

"Clients"

CTA:

"+ Nouveau client"

Views:

Liste

Cartes

FILTERS:

Tous

Actifs

Vente

Location

Vente & Location

Avec impayés

TABLE:

Client

Contact

Ville

Type

Commandes

CA

Encours

Dernière activité

Responsable

Example:

Atlas Construction

Tanger

Vente & Location

8 commandes

426 000 DH

32 400 DH

07 sept.

Yassine

==================================================

14. CLIENT 360° PAGE

==================================================

This must be one of the strongest screens.

HEADER:

Atlas Construction

Badge:

Client actif

Actions:

Créer un devis

Créer une vente

Créer une location

Ajouter un paiement

TOP KPIs:

Chiffre d’affaires

426 800 DH

Commandes

8

Locations actives

2

Encours

32 400 DH

TABS:

Aperçu

Opportunités

Devis

Commandes

Locations

Factures

Paiements

Livraisons

Documents

Historique

APERÇU SECTION:

Informations client

Raison sociale

ICE

RC

Adresse

Ville

Contact

Téléphone

Email

Commercial responsable

SECTION:

Situation commerciale

Current opportunities.

SECTION:

Situation financière

Total facturé

Total payé

Reste à payer

SECTION:

Locations actives

Equipment

Start date

Return date

Status

SECTION:

Activité récente

Timeline:

Prospect qualifié

Opportunité créée

Devis envoyé

Commande confirmée

Paiement reçu

Livraison effectuée

==================================================

15. MODULE — OPPORTUNITÉS

==================================================

Create premium CRM Kanban.

Views:

Kanban

Liste

KANBAN COLUMNS:

À qualifier

Qualifié

Devis à préparer

Devis envoyé

Négociation

Confirmé

Gagné

CARD DATA:

Company

Opportunity title

Sale / Rental badge

Amount

Equipment

Responsible

Next action

Last activity

Example:

Atlas Construction

Location — 2 Mini-pelles

48 000 DH

Location

Responsable:

Yassine

Action:

Devis à envoyer aujourd’hui

Allow:

- drag & drop

- filters

- responsible filter

- activity filter

- sale/rental filter

- date range

- sorting

==================================================

16. OPPORTUNITY DETAIL

==================================================

HEADER:

Location — 2 mini-pelles

Atlas Construction

Status:

Devis à préparer

Value:

48 000 DH

Buttons:

Créer le devis

Modifier

Marquer comme gagné

•••

SECTION:

Besoin

Type:

Location

Equipment:

Mini-pelle 3.5T

Quantity:

2

Duration:

3 weeks

Desired date:

15 Sept. 2026

Construction site:

Tanger

Urgency:

High

SECTION:

Origine

Source:

Agent IA WhatsApp

Qualification date:

07 sept. 2026

SECTION:

Résumé IA

Display structured AI summary.

SECTION:

Documents

SECTION:

Notes commerciales

SECTION:

Timeline

==================================================

17. MODULE — CATALOGUE

==================================================

Create premium internal equipment catalog.

Header:

"Catalogue"

CTA:

"+ Ajouter un produit"

Views:

Grille

Liste

Filters:

Catégorie

Vente

Location

Disponibilité

Stock

PRODUCT CARD:

Image

Mini-pelle 3.5T

Reference:

SIN-PEL-035

Status:

Disponible

Price sale:

325 000 DH

Rental:

1 600 DH / jour

Stock:

4 unités

CTA:

Voir le produit

==================================================

18. PRODUCT DETAIL

==================================================

Header:

Mini-pelle 3.5T

Reference:

SIN-PEL-035

Tabs:

Informations

Tarification

Stock

Locations

Historique

Information:

Description

Category

Technical specifications

Image

Supplier

Tarification:

Sale price

Daily rental

Weekly rental

Monthly rental

Stock:

Available

Reserved

In rental

Maintenance if applicable

==================================================

19. MODULE — VENTES

==================================================

Page:

"Ventes"

Metrics:

Ventes ce mois

23

CA

487 500 DH

Panier moyen

21 195 DH

À livrer

8

Statuses:

Brouillon

Confirmée

En préparation

Payée

Livrée

Annulée

TABLE:

Référence

Client

Produits

Date

Montant

Paiement

Livraison

Responsable

Statut

==================================================

20. SALE DETAIL

==================================================

HEADER:

VTE-2026-0087

Atlas Construction

Confirmed

Amount:

87 500 DH

Display:

Customer

Products

Quantity

Price

Discount

VAT

Total

Payment status

Invoice

Delivery

Use workflow rail:

Opportunité ✓

Devis ✓

Commande ✓

Paiement ●

Livraison ○

Clôture ○

==================================================

21. MODULE — LOCATIONS

==================================================

This module must be very strong visually and functionally.

HEADER:

"Locations"

CTA:

"+ Nouvelle location"

METRICS:

Locations actives

36

CA location

218 000 DH

Retours cette semaine

7

Retards

3

FILTER TABS:

Toutes

Réservées

À préparer

En cours

Retour proche

En retard

Terminées

TABLE:

Référence

Client

Matériel

Quantité

Début

Fin prévue

Durée

Montant

Retour

Statut

Visual urgency:

Retour demain

Retour dans 3 jours

En retard de 2 jours

==================================================

22. RENTAL DETAIL

==================================================

HEADER:

LOC-2026-0041

Atlas Construction

Badge:

En location

EQUIPMENT:

Mini-pelle 3.5T × 2

TOP CARDS:

Début

15 sept.

Retour prévu

05 oct.

Durée

21 jours

Montant

48 000 DH

WORKFLOW RAIL:

Opportunité ✓

Devis ✓

Commande ✓

Paiement ✓

Livraison ✓

Location active ●

Retour ○

Clôture ○

SECTION:

Informations chantier

Adresse

Ville

Responsable chantier

Téléphone

SECTION:

Paiements

SECTION:

Documents

SECTION:

Livraison associée

SECTION:

Retour

CTA:

Enregistrer le retour

==================================================

23. MODULE — DEVIS

==================================================

HEADER:

"Devis"

CTA:

"+ Nouveau devis"

METRICS:

Brouillons

6

En attente

12

Acceptés ce mois

18

Montant en attente

384 500 DH

TABLE:

Numéro

Client

Type

Date

Expiration

Montant

Commercial

Statut

Statuses:

Brouillon

Envoyé

En attente

Accepté

Refusé

Expiré

==================================================

24. QUOTATION BUILDER

==================================================

Create sophisticated editor.

Top:

Client

Opportunity

Type

Options:

Vente

Location

PRODUCT TABLE:

Produit

Description

Quantité

Prix unitaire

Durée

Remise

TVA

Total

For rentals:

duration unit selector

Jour

Semaine

Mois

RIGHT STICKY PANEL:

Sous-total

Remise

TVA

Total TTC

Additional fields:

Validité

Conditions

Mode de livraison

Commentaires

Conditions de paiement

Buttons:

Enregistrer brouillon

Aperçu PDF

Générer le devis

Envoyer au client

PDF preview:

SINMAT branding.

==================================================

25. MODULE — COMMANDES

==================================================

HEADER:

"Commandes"

CTA:

"+ Nouvelle commande"

Statuses:

À confirmer

Confirmée

À préparer

Prête

En livraison

Livrée

Terminée

Annulée

TABLE:

Commande

Client

Type

Produits

Montant

Paiement

Livraison

Statut

Date

Click opens detail page.

==================================================

26. ORDER DETAIL PAGE

==================================================

Display:

Order reference

Client

Source quotation

Products

Quantity

Amounts

Payment

Invoice

Delivery

Internal notes

WORKFLOW:

Devis

✓

Commande

✓

Paiement

●

Facture

○

Livraison

○

Clôture

○

==================================================

27. MODULE — PAIEMENTS

==================================================

HEADER:

"Paiements"

CTA:

"+ Enregistrer un paiement"

METRICS:

À encaisser

156 800 DH

En retard

64 000 DH

Encaissé ce mois

487 300 DH

FILTERS:

Tous

À payer

Partiellement payé

Payé

En retard

TABLE:

Référence

Client

Facture

Montant total

Payé

Reste

Échéance

Mode

Statut

Statuses:

Non payé

Acompte

Partiellement payé

Payé

En retard

==================================================

28. PAYMENT CREATION

==================================================

Create payment form:

Customer

Invoice

Order

Amount

Payment date

Payment method

Methods:

Virement

Chèque

Espèces

Carte

Autre

Reference

Comments

Automatically update:

invoice balance

order payment status

client financial status

==================================================

29. MODULE — FACTURES

==================================================

HEADER:

"Factures"

CTA:

"+ Nouvelle facture"

METRICS:

Facturé ce mois

512 400 DH

Payé

448 400 DH

À recevoir

64 000 DH

En retard

32 400 DH

TABLE:

N° facture

Client

Commande

Date

Échéance

HT

TTC

Payé

Reste

Statut

Statuses:

Brouillon

Émise

Partiellement payée

Payée

En retard

Actions:

Voir

Télécharger PDF

Envoyer

Enregistrer paiement

==================================================

30. INVOICE DETAIL

==================================================

Display professional invoice preview.

Include:

SINMAT logo

company info

customer info

invoice number

date

products

quantities

prices

VAT

HT

TTC

payment history

remaining balance

Connected records panel:

Devis

DEV-2026-0182

Commande

CMD-2026-0091

Facture

FAC-2026-0098

Livraison

LIV-2026-0063

==================================================

31. MODULE — LIVRAISONS

==================================================

Create sophisticated logistics management page.

HEADER:

"Livraisons"

CTA:

"+ Nouvelle livraison"

TOP KPIs:

À préparer

7

Prêtes

4

Aujourd’hui

8

En livraison

3

Livrées

42

Views:

Liste

Planning

Carte

TABLE:

Livraison

Commande

Client

Chantier

Ville

Date

Créneau

Responsable

Statut

Statuses:

À préparer

Préparation en cours

Prête

Planifiée

En livraison

Livrée

==================================================

32. DELIVERY DETAIL

==================================================

HEADER:

LIV-2026-0063

Atlas Construction

Status:

En livraison

Display:

Customer

Order

Equipment

Quantity

Delivery address

Construction site

Contact

Time slot

Responsible

Driver

Vehicle

Notes

TIMELINE:

Commande validée

✓

Préparation

✓

Chargement

✓

Départ

✓

En livraison

●

Livrée

○

CTA:

"Marquer comme livrée"

==================================================

33. MODULE — RETOURS

==================================================

Dedicated rental equipment return management.

HEADER:

"Retours"

METRICS:

Aujourd’hui

4

Cette semaine

12

En retard

3

Terminés

28

TABLE:

Location

Client

Matériel

Retour prévu

Retour réel

Retard

État

Statut

Workflow:

Planifié

À récupérer

En transit

Reçu

À inspecter

Clôturé

==================================================

34. RETURN FORM

==================================================

When recording return:

Rental

Client

Equipment

Actual return date

Condition:

Excellent

Bon

À contrôler

Endommagé

Notes

Photos

Additional charges

Damage fee if applicable

CTA:

"Valider le retour"

After validation:

update equipment availability.

==================================================

35. MODULE — RAPPORTS

==================================================

Create premium reporting.

Filters:

Période

Commercial

Ville

Client

Type activité

SECTION:

Performance commerciale

Revenue

Opportunities

Conversion

Quotations

Orders

SECTION:

Ventes vs Locations

SECTION:

Performance WhatsApp AI

Prospects contacted

Responses

Qualified leads

Opportunities generated

Conversion

SECTION:

Finance

Invoiced

Received

Outstanding

Overdue

SECTION:

Logistics

Deliveries

On-time deliveries

Late deliveries

SECTION:

Rentals

Active equipment

Utilization

Returns

Late returns

Buttons:

Exporter PDF

Exporter Excel

==================================================

36. MODULE — UTILISATEURS

==================================================

Header:

"Utilisateurs"

CTA:

"+ Ajouter un utilisateur"

Roles:

Administrateur

Direction

Commercial

Comptabilité

Logistique

TABLE:

Nom

Email

Rôle

Statut

Dernière connexion

Actions

Permissions matrix:

                 CRM   Devis   Factures   Livraisons   Paramètres

Commercial        ✓      ✓        Lecture      Lecture       -

Comptabilité      Lecture Lecture   ✓           Lecture       -

Logistique        Lecture   -       -           ✓             -

Direction         ✓      ✓         ✓           ✓          Lecture

Administrateur    ✓      ✓         ✓           ✓            ✓

==================================================

37. MODULE — PARAMÈTRES

==================================================

Use modern settings screen.

Vertical sub-navigation:

Général

Entreprise

Catalogue

Vente

Location

Documents

Facturation

WhatsApp IA

Notifications

Utilisateurs & rôles

GENERAL / ENTREPRISE:

Nom entreprise

Logo

Adresse

Ville

ICE

RC

Téléphone

Email

CATALOGUE:

Categories

Units

Stock rules

VENTE:

Default commercial conditions

Discount rules

LOCATION:

Daily pricing

Weekly pricing

Monthly pricing

Deposit rules

Late fees

Return rules

DOCUMENTS:

Quotation template

Invoice template

Logo

Footer

Legal information

FACTURATION:

VAT

Currency:

MAD

Quotation numbering

Invoice numbering

Payment terms

==================================================

38. WHATSAPP AI SETTINGS

==================================================

IMPORTANT:

This section configures the AI automation only.

Do not create conversation history.

FIELDS:

Nom de l’agent

Ton:

Professionnel

Commercial

Amical

Formel

Business hours

Opening message

Objective:

"Identifier les besoins des prospects en achat ou location de matériel de construction."

Required qualification fields:

☑ Achat / Location

☑ Produit recherché

☑ Quantité

☑ Durée

☑ Date souhaitée

☑ Ville

☑ Chantier

☑ Niveau d’urgence

Automatic actions:

☑ Update prospect qualification

☑ Generate AI summary

☑ Create opportunity when lead is qualified

☑ Assign opportunity to a salesperson

☑ Schedule follow-up if needed

Opportunity creation conditions:

Example:

Interest = High

AND

Need identified = Yes

AND

Product identified = Yes

Human intervention conditions:

Customer requests a salesperson

Complex pricing request

Complaint

Specific negotiation

Sensitive request

==================================================

39. GLOBAL SEARCH / COMMAND PALETTE

==================================================

Create Cmd + K global search.

Search:

Clients

Prospects

Opportunities

Quotes

Orders

Invoices

Rentals

Products

Deliveries

Example:

Atlas Construction

Client

DEV-2026-0182

Devis

Mini-pelle 3.5T

Produit

LOC-2026-0041

Location

Quick actions:

Créer client

Créer prospect

Créer devis

Créer vente

Créer location

==================================================

40. NOTIFICATIONS CENTER

==================================================

Create sophisticated notifications.

Examples:

Paiement en retard

FAC-2026-0098

Atlas Construction

32 400 DH

---

Retour prévu demain

LOC-2026-0041

Mini-pelle 3.5T

---

Nouveau prospect qualifié

BTP Horizon

Besoin:

Location · Compacteur

---

Devis accepté

DEV-2026-0182

87 500 DH

==================================================

41. SMART CLIENT TIMELINE

==================================================

Create a unified business timeline.

Example:

02 sept.

Prospect ajouté

04 sept.

Campagne WhatsApp

05 sept.

Qualification IA

05 sept.

Opportunité créée

06 sept.

Devis généré

07 sept.

Devis accepté

07 sept.

Commande créée

08 sept.

Acompte reçu

09 sept.

Facture générée

10 sept.

Livraison planifiée

12 sept.

Livraison effectuée

For rental:

12 sept.

Début location

03 oct.

Retour prévu

==================================================

42. SMART RELATIONSHIP PANEL

==================================================

On client, opportunity, order, invoice and rental pages display connected records.

Example:

DOCUMENTS LIÉS

Opportunité

OPP-2026-0042

↓

Devis

DEV-2026-0182

↓

Commande

CMD-2026-0091

↓

Facture

FAC-2026-0098

↓

Livraison

LIV-2026-0063

Each item clickable.

==================================================

43. SMART STATUS RAIL

==================================================

Use horizontal workflow rail on important detail pages.

SALE:

Opportunité

✓

Devis

✓

Commande

✓

Paiement

●

Facture

○

Livraison

○

Clôture

○

RENTAL:

Opportunité

✓

Devis

✓

Commande

✓

Paiement

✓

Livraison

✓

En location

●

Retour

○

Clôture

○

Add subtle animated progress.

==================================================

44. AI INSIGHT COMPONENT

==================================================

Use AI as integrated business intelligence.

Never show robots.

Use subtle icon:

✦

Example:

✦ Analyse IA

Probabilité de conversion

82%

Besoin identifié

Location

Urgence

Élevée

Action recommandée

"Préparer un devis aujourd’hui."

Another example:

✦ Alerte IA

"Cette facture dépasse son échéance de 7 jours."

Recommended action:

"Relancer le client."

==================================================

45. UX BEHAVIOR

==================================================

Create a high-quality interactive MVP.

Include:

hover states

loading states

skeletons

toast notifications

dropdowns

filters

sorting

pagination

bulk selection

tabs

breadcrumbs

context menus

inline editing

tooltips

empty states

keyboard interactions

drag and drop Kanban

Avoid excessive modal usage.

Complex records must open as:

- full pages

or

- side drawers when appropriate

==================================================

46. RESPONSIVE DESIGN

==================================================

Desktop-first.

Optimize:

1440px

1366px

Also support tablet.

Mobile can use simplified navigation.

Sidebar becomes collapsed navigation on small screens.

Tables should:

- remain usable

- allow horizontal scroll where required

- transform into compact cards when necessary

==================================================

47. REALISTIC DEMO DATA

==================================================

Do NOT use Lorem Ipsum.

Use realistic Moroccan business data.

CUSTOMERS:

Atlas Construction

BTP Horizon

Tanger Travaux

Nord Bâtiment

BatiPro Maroc

Constructa SARL

ProChantier Maroc

CITIES:

Casablanca

Tanger

Rabat

Tétouan

Kénitra

Marrakech

PRODUCTS:

Mini-pelle 3.5T

Marteau-piqueur professionnel

Bétonnière 350 L

Groupe électrogène

Compacteur

Échafaudage

Nacelle élévatrice

Scie circulaire professionnelle

Plaque vibrante

Compresseur professionnel

Use Moroccan currency:

48 500 DH

125 000 DH

387 900 DH

French dates:

07 sept. 2026

15 sept. 2026

05 oct. 2026

==================================================

48. DATA MODEL LOGIC

==================================================

Create realistic relational mock data.

Entities:

Prospect

Campaign

Customer

Opportunity

Product

Quotation

Order

Sale

Rental

Payment

Invoice

Delivery

Return

User

Relations:

Prospect

may become Customer

Prospect

may create Opportunity

Opportunity

belongs to Customer or Prospect

Opportunity

may generate Quotation

Quotation

may generate Order

Order

may generate Invoice

Order

may generate Delivery

Order

may generate Sale or Rental

Rental

may generate Return

Payment

belongs to Invoice and Customer

Everything must remain relational.

==================================================

49. MVP FUNCTIONAL INTERACTIONS

==================================================

Make the prototype clickable and coherent.

The following actions should work with mock data:

Create prospect

Create campaign

Qualify prospect

Create opportunity

Convert prospect into customer

Move opportunity in Kanban

Create quotation

Add products to quotation

Calculate totals

Accept quotation

Generate order

Register payment

Generate invoice

Create delivery

Update delivery status

Create rental

Register return

Update equipment availability

Search globally

Filter data

Switch tabs

Open related records

==================================================

50. IMPORTANT WHATSAPP RULE

==================================================

WhatsApp AI is NOT a user-facing chat feature.

It is a background commercial automation engine.

The platform should only show:

campaign performance

qualification results

lead status

AI summary

AI recommendations

generated opportunities

Do NOT show:

chat bubbles

conversation inbox

individual messages

WhatsApp thread history

live chat screen

message composer

==================================================

51. BUSINESS EXPERIENCE

==================================================

The application must feel optimized for fast business operations.

A salesperson should be able to:

open a prospect

→ understand the need immediately

→ create an opportunity

→ generate a quotation

→ convert into an order

→ follow payment

→ follow delivery

without searching through multiple unrelated interfaces.

A finance user should be able to:

see invoices

→ detect unpaid amounts

→ record payments

→ identify overdue invoices

A logistics user should be able to:

see orders to prepare

→ plan deliveries

→ update status

→ manage rental returns

A director should be able to:

monitor commercial activity

→ sales

→ rentals

→ cash collection

→ deliveries

→ WhatsApp campaign performance

==================================================

52. FIRST VERSION TO BUILD

==================================================

Start with the complete application shell.

Then implement in this priority order:

1. Sidebar and header

2. Vue d’ensemble

3. Prospects

4. Campagnes WhatsApp

5. Clients

6. Opportunités

7. Catalogue

8. Locations

9. Devis

10. Commandes

11. Paiements

12. Factures

13. Livraisons

14. Retours

15. Ventes

16. Rapports

17. Utilisateurs

18. Paramètres

IMPORTANT:

Do NOT stop after creating the dashboard.

Every sidebar item must have a usable and visually finished page.

==================================================

53. TECHNICAL MVP APPROACH

==================================================

Build the first version using realistic mock/local data.

Structure the application cleanly so a backend can later be connected.

Prepare the architecture for possible integration with:

- Supabase

- REST APIs

- WhatsApp Business API

- external accounting systems

- inventory tools

But do NOT require these integrations for the visual MVP.

Use reusable components.

Create clean architecture.

==================================================

54. FINAL DESIGN EXPECTATION

==================================================

The final result must immediately communicate:

"SINMAT dispose désormais de son propre système de gestion commerciale et opérationnelle."

It should look:

premium

professional

industrial

modern

innovative

structured

efficient

enterprise-grade

trustworthy

It should NOT look like:

a generic CRM template

a generic admin dashboard

an ecommerce store

a student project

a simple bootstrap dashboard

a WhatsApp chatbot application

The most important design principle is:

ONE CLIENT

→ ONE COMPLETE BUSINESS HISTORY

→ ONE CENTRALIZED PLATFORM

From prospecting to payment and delivery.

Maintain SINMAT's existing visual identity while significantly elevating it into a sophisticated enterprise management application.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/e8304a56-7265-46b6-8d93-da55f08837d0).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
