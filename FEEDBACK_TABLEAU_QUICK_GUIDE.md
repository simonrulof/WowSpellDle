# Étapes de Refactoring: Grid Feedback → Tableau

## 🎯 Objectif Général
Transformer le système de feedback en **tableau HTML horizontal** pour meilleure lisibilité sur desktop (16:9, etc) tout en restant responsive sur mobile.

---

## 📋 Les 6 Étapes Principales

### 1️⃣ **Traductions** (5 min)
- Fichier: `src/assets/translations.json`
- Ajouter en-têtes: "Spell", "Class", "Spec", "School", "Type", "Cooldown"
- EN et FR

### 2️⃣ **Template HTML** (15 min)
- Fichier: `src/app/components/game/game.component.html`
- Remplacer `<div class="guess-feedback">` par `<table class="guesses-table">`
- Créer `<thead>` avec en-têtes
- Convertir items en `<tr>` dans `<tbody>`

### 3️⃣ **Styles Tableau** (20 min)
- Fichier: `src/app/components/game/game.component.scss`
- Ajouter styles `.guesses-table`
- `.guesses-table thead`: couleur bronze/doré
- `.guesses-table tbody tr`: bordures, hover, last-guess
- `.feedback-cell`: styles pour correct/incorrect

### 4️⃣ **Nettoyage** (10 min)
- Supprimer anciens styles `.guess-feedback`, `.feedback-item`, `.feedback-label`
- Vérifier aucune référence dans le template

### 5️⃣ **Responsive Mobile** (15 min)
- Media query `@media (max-width: 768px)`
- Masquer `<thead>` ou convertir en grid 2 colonnes
- Ajouter `data-label` à chaque `<td>`
- CSS `::before` pour afficher labels sur mobile

### 6️⃣ **Tests** (15 min)
- Desktop (1920x1080): tableau horizontal ✓
- Tablette (768px): adapté ✓
- Mobile (<768px): readable ✓
- Multilingue: EN/FR ✓

---

## 📊 Comparaison

| Aspect | Avant (Grid) | Après (Tableau) |
|--------|-------------|-----------------|
| **Vue** | Vertical/grid 5 éléments | Horizontal ligne unique |
| **Desktop** | Compact | Très lisible |
| **Comparaison** | Difficile | Facile (côte à côte) |
| **Mobile** | OK | Responsive adapté |
| **Sémantique** | `<div>` | `<table>` ✓ |

---

## 🔧 Ressources Fournies

- **REFACTORING_TABLEAU_FEEDBACK.md** - Plan détaillé complet
  - Structure HTML avant/après
  - Code SCSS complet
  - Traductions JSON
  - Responsive design
  - Étapes détaillées pour chaque modification

---

## ⏱️ Temps Total Estimé: 1-2 heures

