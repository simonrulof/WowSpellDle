# Plan de Refactoring: Feedback System → Tableau

## Objectif
Convertir le système de feedback actuellement en format "grid de lignes" vers un **tableau HTML avec en-têtes en horizontal** pour une meilleure lisibilité sur les écrans larges (desktop, 16:9, etc).

## Structure Actuelle vs Cible

### Actuelle (Vertical/Grid):
```
[Icon] Fireball - Attempt 1
├─ Class: Mage ✓
├─ Spec: Fire ✓
├─ School: Fire ✓
├─ Type: Damaging ✓
└─ Cooldown: 0s ✓
```

### Cible (Tableau Horizontal):
```
┌─────────────┬────────┬──────┬────────┬──────────┬──────────┐
│ Spell Name  │ Class  │ Spec │ School │ Type     │ Cooldown │
├─────────────┼────────┼──────┼────────┼──────────┼──────────┤
│ Fireball    │ Mage ✓ │ Fire │ Fire ✓ │ Damaging │ 0s ✓     │
│ Heal        │ Priest │ Holy │ Holy   │ Healing  │ 0s ✓     │
└─────────────┴────────┴──────┴────────┴──────────┴──────────┘
```

---

## Étapes de Mise en Œuvre

### Étape 1: Créer les Traductions pour les En-têtes
**Fichier**: `src/assets/translations.json`

**À ajouter**:
```json
{
  "game": {
    "feedback": {
      "tableHeader": {
        "spell": "Spell",
        "class": "Class",
        "spec": "Spec",
        "school": "School",
        "type": "Type",
        "cooldown": "Cooldown"
      }
    }
  },
  "fr": {
    "game": {
      "feedback": {
        "tableHeader": {
          "spell": "Sort",
          "class": "Classe",
          "spec": "Spécialisation",
          "school": "Écoles",
          "type": "Type",
          "cooldown": "Délai"
        }
      }
    }
  }
}
```

**Étapes détaillées**:
1. Ouvrir `src/assets/translations.json`
2. Ajouter les clés pour les en-têtes en EN et FR
3. Vérifier la structure JSON
4. Tester les traductions avec `UITranslationService.getText()`

---

### Étape 2: Refactoriser le Template HTML
**Fichier**: `src/app/components/game/game.component.html`

**Changements**:
```html
<!-- Ancien structure (grid) -->
<div class="guess-feedback">
  <div class="feedback-item">...</div>
  <div class="feedback-item">...</div>
  ...
</div>

<!-- Nouveau structure (tableau) -->
<table class="guesses-table">
  <thead>
    <tr>
      <th>{{ uiTranslationService.getText('game.feedback.tableHeader.spell') }}</th>
      <th>{{ uiTranslationService.getText('game.feedback.tableHeader.class') }}</th>
      <th>{{ uiTranslationService.getText('game.feedback.tableHeader.spec') }}</th>
      <th>{{ uiTranslationService.getText('game.feedback.tableHeader.school') }}</th>
      <th>{{ uiTranslationService.getText('game.feedback.tableHeader.type') }}</th>
      <th>{{ uiTranslationService.getText('game.feedback.tableHeader.cooldown') }}</th>
    </tr>
  </thead>
  <tbody>
    @for (guess of guesses().slice().reverse(); track guess.attemptNumber; let last = $last) {
      <tr class="guess-row" [class.last-guess]="last">
        <td class="spell-cell">
          <img [src]="iconService.getSpellIcon(getSpellName(guess.spell))" class="spell-icon" />
          {{ getSpellName(guess.spell) }}
        </td>
        <td class="feedback-cell" [class.correct]="guess.feedback.class">
          {{ getSpellClass(guess.spell) }} {{ guess.feedback.class ? '✓' : '✗' }}
        </td>
        <td class="feedback-cell" [class.correct]="guess.feedback.spec">
          {{ getSpellSpec(guess.spell) || uiTranslationService.getText('game.feedback.na') }} {{ guess.feedback.spec ? '✓' : '✗' }}
        </td>
        <td class="feedback-cell" [class.correct]="guess.feedback.school">
          {{ getSpellSchool(guess.spell) }} {{ guess.feedback.school ? '✓' : '✗' }}
        </td>
        <td class="feedback-cell" [class.correct]="guess.feedback.useType">
          {{ getSpellUseType(guess.spell) }} {{ guess.feedback.useType ? '✓' : '✗' }}
        </td>
        <td class="feedback-cell" [class.correct]="guess.feedback.cooldown === 'correct'">
          {{ guess.spell.cooldown }}s
          @switch (guess.feedback.cooldown) {
            @case ('correct') { ✓ }
            @case ('longer') { ⬆️ }
            @case ('shorter') { ⬇️ }
          }
        </td>
      </tr>
    }
  </tbody>
</table>
```

**Étapes détaillées**:
1. Localiser le bloc `<div class="guess-feedback">` dans le template
2. Remplacer la structure grid par un tableau HTML
3. Créer une `<thead>` avec les en-têtes
4. Convertir chaque guess en `<tr>` dans `<tbody>`
5. Tester que les données s'affichent correctement

---

### Étape 3: Créer les Styles du Tableau
**Fichier**: `src/app/components/game/game.component.scss`

**À ajouter**:
```scss
.guesses-table {
  width: 100%;
  border-collapse: collapse;
  background-color: rgba(45, 42, 37, 0.8);
  border: 1px solid #8b7355;
  border-radius: 8px;
  overflow: hidden;
  margin-top: 20px;

  thead {
    background-color: rgba(139, 115, 85, 0.3);
    border-bottom: 2px solid #8b7355;

    th {
      padding: 15px;
      text-align: left;
      font-weight: bold;
      color: #ffd700;
      font-size: 0.95em;
      white-space: nowrap;
    }
  }

  tbody {
    tr {
      border-bottom: 1px solid #8b7355;
      transition: background-color 0.2s ease;

      &:hover {
        background-color: rgba(139, 115, 85, 0.15);
      }

      &.last-guess {
        border-left: 4px solid #ffd700;
      }

      &:last-child {
        border-bottom: none;
      }
    }
  }

  td {
    padding: 12px 15px;
    color: #ffffff;
    font-size: 0.9em;

    &.spell-cell {
      font-weight: bold;
      display: flex;
      align-items: center;
      gap: 10px;
    }

    &.feedback-cell {
      text-align: center;
      transition: all 0.2s ease;

      &.correct {
        background-color: rgba(76, 175, 80, 0.15);
        color: #4caf50;
        font-weight: bold;
      }

      &:not(.correct) {
        color: #ff6b6b;
      }
    }
  }
}

.spell-icon {
  width: 32px;
  height: 32px;
  object-fit: contain;
  flex-shrink: 0;
}

// Responsive: Masquer le tableau sur très petit écran et retourner à la vue grid
@media (max-width: 768px) {
  .guesses-table {
    font-size: 0.85em;

    thead {
      display: none;
    }

    tbody {
      tr {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 10px;
        padding: 10px;
        margin-bottom: 10px;
        border: 1px solid #8b7355;
        border-radius: 4px;
      }
    }

    td {
      padding: 5px;

      &::before {
        content: attr(data-label);
        font-weight: bold;
        color: #ffd700;
        margin-right: 5px;
      }

      &.spell-cell {
        grid-column: 1 / -1;
      }
    }
  }
}
```

**Étapes détaillées**:
1. Ajouter les styles du tableau à `game.component.scss`
2. Styliser `<thead>` avec couleur bronze et doré
3. Styliser `<tbody>` avec bordures et hover effects
4. Ajouter styles pour `.correct` (vert/doré)
5. Ajouter styles pour les cellules
6. Ajouter media query pour mobile (retour à grid ou format adapté)

---

### Étape 4: Nettoyer les Anciens Styles
**Fichier**: `src/app/components/game/game.component.scss`

**À supprimer/modifier**:
```scss
// Anciens styles (à supprimer)
.guess-feedback {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 10px;
}

.feedback-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px;
  background-color: rgba(60, 57, 52, 0.6);
  border-radius: 4px;
  border: 1px solid #8b7355;

  &.correct {
    background-color: rgba(76, 175, 80, 0.2);
    border-color: #4caf50;
  }
}

.feedback-label {
  font-weight: bold;
  min-width: 70px;
  color: #a89968;
  font-size: 12px;
}
```

**Étapes détaillées**:
1. Localiser `.guess-feedback` et son style grid
2. Localiser `.feedback-item`, `.feedback-label`, `.feedback-icon`, `.feedback-value`
3. Les commenter ou supprimer
4. Vérifier que le template ne les utilise plus
5. Tester l'affichage

---

### Étape 5: Ajouter l'Attribut `data-label` pour Mobile
**Fichier**: `src/app/components/game/game.component.html`

Pour la version mobile (format adapté):
```html
<td class="feedback-cell" [class.correct]="guess.feedback.class" data-label="Class">
  {{ getSpellClass(guess.spell) }} {{ guess.feedback.class ? '✓' : '✗' }}
</td>
<td class="feedback-cell" [class.correct]="guess.feedback.spec" data-label="Spec">
  {{ getSpellSpec(guess.spell) || ... }} {{ guess.feedback.spec ? '✓' : '✗' }}
</td>
<!-- etc. -->
```

**Étapes détaillées**:
1. Ajouter `data-label` à chaque `<td>`
2. Les valeurs correspondront aux clés de traduction
3. Le CSS `::before` affichera les labels sur mobile
4. Tester sur mobile et desktop

---

### Étape 6: Tester et Valider
**Points de test**:

**Desktop (1920x1080+)**:
- ✓ Tableau s'affiche horizontalement
- ✓ Tous les éléments visibles
- ✓ Pas de scroll horizontal
- ✓ Hover effect fonctionne
- ✓ Couleurs correctes (vert pour correct, rouge pour incorrect)

**Tablette (768px)**:
- ✓ Tableau reste visible ou s'adapte
- ✓ Pas de scroll excessif
- ✓ Readable

**Mobile (< 768px)**:
- ✓ Format grid ou adapté
- ✓ Labels `data-label` affichés
- ✓ Readable sur petit écran

**Multilingue**:
- ✓ EN: Headers en anglais
- ✓ FR: Headers en français
- ✓ Pas d'erreur de traduction

---

## Résumé des Fichiers à Modifier

| Fichier | Changement | Complexité |
|---------|-----------|-----------|
| `src/assets/translations.json` | Ajouter en-têtes du tableau | Facile |
| `src/app/components/game/game.component.html` | Convertir grid → tableau | Moyen |
| `src/app/components/game/game.component.scss` | Ajouter styles tableau | Moyen |
| `src/app/components/game/game.component.ts` | Aucun (logique identique) | N/A |

---

## Ordre Recommandé

1. **Étape 1**: Ajouter les traductions
2. **Étape 2**: Refactoriser le HTML
3. **Étape 3**: Ajouter les styles
4. **Étape 4**: Nettoyer les anciens styles
5. **Étape 5**: Ajouter data-labels pour mobile
6. **Étape 6**: Tester sur tous les écrans

---

## Avantages du Tableau

✅ **Desktop**: Meilleure lisibilité horizontale  
✅ **Comparaison**: Facile de comparer les guesses  
✅ **Professionnel**: Apparence plus polished  
✅ **Responsive**: Peut s'adapter sur mobile  
✅ **Accessible**: Sémantique HTML correcte  

---

## Exemple Visuel Final

```
╔════════════════╦═════════╦═══════╦════════╦══════════╦═════════╗
║ Spell Name     ║ Class   ║ Spec  ║ School ║ Type     ║ Cooldown║
╠════════════════╬═════════╬═══════╬════════╬══════════╬═════════╣
║🔥 Fireball     ║ Mage ✓  ║ Fire  ║ Fire ✓ ║ Damaging ║ 0s ✓    ║
╠════════════════╬═════════╬═══════╬════════╬══════════╬═════════╣
║💚 Heal         ║ Priest ✓║ Holy  ║ Holy ✓ ║ Healing  ║ 0s ✓    ║
╠════════════════╬═════════╬═══════╬════════╬══════════╬═════════╣
║⚔️ Charge       ║ Warrior ║ Prot  ║ Phys ✓ ║ Utility  ║ 8s ✓    ║
╚════════════════╩═════════╩═══════╩════════╩══════════╩═════════╝
```

---

**Temps estimé**: 1-2 heures pour les développeurs expérimentés

