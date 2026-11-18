Voici une version complète, structurée et très détaillée de ton `README.md`, rédigée directement à partir de l'intégralité du code source de ton projet. Tu n'as plus qu'à copier-coller ce bloc (et remplacer ton nom dans la section **Auteur** si besoin).

```markdown
# 📇 Contact CRM

## Présentation du projet

**Contact CRM** est une application web monopage (SPA) de gestion de la relation client développée avec **Angular**. Elle permet de centraliser et d'organiser un carnet d'adresses complet : création, édition, suppression, classement par catégories colorées, gestion des favoris, recherche instantanée, filtrage multicritère et tri dynamique.

L'application fonctionne **100 % côté client** : toutes les données sont sauvegardées automatiquement dans le navigateur via `localStorage` (aucun serveur backend ni base de données externe n'est requis).

---

## 🛠️ Stack technique & Architecture Angular

* **Framework :** Angular (Standalone Components, nouvelle syntaxe de contrôle de flux `@if`, `@for`, `@let`)
* **Réactivité & État :** Angular Signals (`signal`, `computed`, `asReadonly`) pour une mise à jour automatique et performante de l'interface
* **Formulaires :** Reactive Forms (`NonNullableFormBuilder`) avec validateurs synchrones personnalisés
* **Routage :** Lazy-loading sur l'ensemble des composants, protection des routes (`CanDeactivate`) et préchargement des données (`ResolveFn`)
* **Langage :** TypeScript en mode strict (typage fort des modèles, aucun `any`)
* **Styles :** SCSS pur avec variables CSS (`:root`), CSS Grid / Flexbox et design responsive (adapté mobile et bureau sans bibliothèque UI tierce)
* **Qualité de code :** ESLint (`angular-eslint`) et Prettier

---

## ✨ Fonctionnalités détaillées

### 1. Tableau de bord (`/`)
* **Indicateurs clés (KPIs) :** Compteurs dynamiques du nombre total de contacts, de contacts favoris et de catégories (cliquables pour accéder directement aux vues correspondantes).
* **Derniers ajouts :** Liste des **5 contacts les plus récemment créés** avec accès rapide à leur fiche détaillée.

### 2. Gestion des contacts (`/contacts` et `/favorites`)
* **Opérations CRUD complètes :** Création, consultation détaillée, modification et suppression avec boîte de dialogue de confirmation.
* **Fiche contact enrichie :** Prénom, nom, email (avec lien `mailto:`), téléphone, entreprise, poste, catégorie associée, notes libres (500 caractères max), statut favori et horodatage automatique (`createdAt`, `updatedAt`).
* **Barre d'outils interactive :**
  * **Recherche en temps réel** par prénom ou nom.
  * **Filtrage** par catégorie et/ou par statut favori (ainsi qu'une route dédiée `/favorites`).
  * **Tri dynamique** : alphabétique (`Nom A → Z`, `Nom Z → A`) ou chronologique (`Plus récents`, `Plus anciens`).
* **Gestion des favoris :** Étoile interactive (`★` / `☆`) accessible aussi bien depuis la liste que depuis la fiche détaillée.

### 3. Gestion des catégories (`/categories`)
* **Jeu de données initial (Seeding) :** Au premier lancement, si aucune catégorie n'existe en mémoire, quatre catégories par défaut sont générées automatiquement : *Étudiants* (bleu), *Entreprises* (vert), *Clients* (orange) et *Partenaires* (violet).
* **Personnalisation :** Création et modification du nom et de la couleur via un sélecteur natif (`<input type="color">`).
* **Vue par catégorie (`/categories/:id`) :** Affiche tous les contacts rattachés à une catégorie précise.
* **Règle métier d'intégrité :** Il est impossible de supprimer une catégorie tant qu'au moins un contact y est encore associé (un message d'alerte explicite s'affiche dans l'interface).

---

## 📂 Structure du projet

```text
src/
├── app/
│   ├── core/
│   │   └── storage.service.ts               # Abstraction unique autour de localStorage (sérialisation JSON & gestion d'erreurs)
│   ├── features/
│   │   ├── categories/
│   │   │   ├── category.model.ts            # Interfaces Category et CategoryInput
│   │   │   ├── category.service.ts          # État réactif (signals), CRUD, seeding initial et règle de suppression
│   │   │   ├── category-list.ts             # Liste des catégories avec compteur de contacts
│   │   │   ├── category-form.ts             # Formulaire partagé création / édition de catégorie
│   │   │   └── category-detail.ts           # Liste des contacts appartenant à une catégorie
│   │   ├── contacts/
│   │   │   ├── contact.model.ts             # Interfaces Contact et ContactInput
│   │   │   ├── contact.service.ts           # État réactif (signals), CRUD, nettoyage des entrées et bascule favori
│   │   │   ├── contact-list.ts              # Liste filtrable/triable (partagée avec /favorites)
│   │   │   ├── contact-form.ts              # Formulaire partagé création / édition de contact
│   │   │   └── contact-detail.ts            # Fiche détaillée complète d'un contact
│   │   └── dashboard/
│   │       └── dashboard.ts                 # Statistiques globales et 5 derniers contacts ajoutés
│   ├── shared/
│   │   ├── directives/
│   │   │   └── autofocus.directive.ts       # Directive [appAutofocus] pour focaliser automatiquement le 1er champ
│   │   ├── guards/
│   │   │   └── unsaved-changes.guard.ts     # Guard CanDeactivate alertant avant de quitter un formulaire modifié
│   │   ├── pipes/
│   │   │   ├── full-name.pipe.ts            # Pipe {{ contact | fullName }} -> "Prénom Nom"
│   │   │   └── initials.pipe.ts             # Pipe {{ contact | initials }} -> "PN" (pour les avatars)
│   │   ├── resolvers/
│   │   │   └── contact.resolver.ts          # Précharge un contact par ID ou redirige vers /contacts s'il n'existe pas
│   │   └── validators/
│   │       └── validators.ts                # Validateurs personnalisés emailValidator et phoneValidator
│   ├── app.config.ts                        # Configuration du routeur Angular
│   ├── app.routes.ts                        # Définition de toutes les routes en lazy-loading
│   └── app.ts                               # Layout principal (header, barre latérale de navigation, footer)
├── main.ts                                  # Point d'entrée de l'application
└── styles.scss                              # Charte graphique globale, grilles, formulaires et media queries
