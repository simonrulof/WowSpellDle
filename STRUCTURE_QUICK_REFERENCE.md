# Angular Component Folder Structure - Quick Reference

## 📁 Current Project Structure

```
WowSpellDle/
├── src/
│   ├── app/
│   │   ├── components/
│   │   │   ├── game/                    ← Game component folder
│   │   │   │   ├── game.component.ts    ← Component class & logic
│   │   │   │   ├── game.component.html  ← Template markup
│   │   │   │   └── game.component.scss  ← Styles
│   │   │   │
│   │   │   └── spell-service-example/   ← Example component folder
│   │   │       ├── spell-service-example.component.ts
│   │   │       ├── spell-service-example.component.html
│   │   │       └── spell-service-example.component.scss
│   │   │
│   │   ├── services/
│   │   │   ├── spell.service.ts
│   │   │   ├── localization.service.ts
│   │   │   ├── game.service.ts          ← Next to create
│   │   │   └── statistics.service.ts    ← Next to create
│   │   │
│   │   ├── models/
│   │   │   └── spell.model.ts
│   │   │
│   │   └── app.ts                       ← Root component
│   │
│   ├── index.html
│   ├── main.ts
│   └── styles.scss
│
├── data/
│   └── db.json                          ← Mock database
│
├── package.json
├── angular.json
└── ... (other config files)
```

## 🏗️ Component Folder Pattern

### Standard Component Structure

Every component gets its own folder with three files:

```
component-name/
├── component-name.component.ts      (TypeScript - Logic)
├── component-name.component.html    (HTML - Markup)
└── component-name.component.scss    (SCSS - Styles)
```

### File Sizes

- **`.ts`** file: 100-200 lines (logic only)
- **`.html`** file: 30-100 lines (markup only)
- **`.scss`** file: 100-400 lines (styles only)

## 📝 What Goes In Each File

### `.ts` File - Component Class

```typescript
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

// Import services with relative paths
import { SpellService } from '../../services/spell.service';
import { LocalizationService } from '../../services/localization.service';

@Component({
  selector: 'app-game',                    // Component tag name
  standalone: true,                       // Standalone component
  imports: [CommonModule, ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './game.component.html',   // Points to .html file
  styleUrl: './game.component.scss',      // Points to .scss file
})
export class GameComponent {
  // ✅ Include: Component logic, methods, properties, lifecycle hooks
  // ✅ Include: Service injections
  // ✅ Include: Event handlers
  // ✅ Include: State management (signals, computed)
  // ✅ Include: Helper functions for template
  
  // ❌ Exclude: HTML markup
  // ❌ Exclude: CSS/SCSS styles
  // ❌ Exclude: External template strings (use templateUrl)
  // ❌ Exclude: External style strings (use styleUrl)
}
```

### `.html` File - Template Markup

```html
<!-- Markup only - no logic or styles -->
<div class="game-container">
  <div class="game-header">
    <h1>WowSpellDle</h1>
    <!-- Event binding -->
    <button (click)="makeGuess()" class="btn">Guess</button>
  </div>

  <!-- Property binding -->
  <p>{{ attemptCount() }} attempts</p>

  <!-- Conditional rendering -->
  @if (hasWon()) {
    <p>You won!</p>
  }

  <!-- Loops -->
  @for (guess of guesses(); track guess.attemptNumber) {
    <div>{{ getSpellName(guess.spell) }}</div>
  }

  <!-- Two-way binding -->
  <input [formControl]="spellInput" />

  <!-- Directives -->
  @switch (guess.feedback.cooldown) {
    @case ('correct') {
      ✓
    }
    @case ('longer') {
      ⬆
    }
  }
</div>
```

### `.scss` File - Component Styles

```scss
// Styles for THIS COMPONENT ONLY
// Automatically scoped to this component

// Main container
.game-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;

  // Nested selectors (SCSS feature)
  .game-header {
    display: flex;
    justify-content: space-between;
    border-bottom: 2px solid #333;

    h1 {
      margin: 0;
      color: #0066cc;
    }
  }

  // Pseudo-classes
  .btn {
    padding: 10px 20px;
    
    &:hover {
      background-color: #0052a3;
    }

    &:disabled {
      opacity: 0.5;
    }
  }
}

// Animations (scoped to this component)
@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

// Media queries (responsive)
@media (max-width: 768px) {
  .game-container {
    padding: 10px;
  }
}
```

## 🔗 File Relationships

```
game.component.ts
    │
    ├─→ templateUrl: './game.component.html'
    │
    └─→ styleUrl: './game.component.scss'

game.component.html
    │
    ├─→ Binds to methods in game.component.ts
    ├─→ Applies classes from game.component.scss
    └─→ Uses components imported in game.component.ts

game.component.scss
    │
    └─→ Styles elements in game.component.html
```

## 🎯 Import Paths

### From within component `.ts` file

```typescript
// Import services (go up 2 levels: components/ → app/)
import { SpellService } from '../../services/spell.service';

// Import models (go up 2 levels)
import { Spell, getSpellText } from '../../models/spell.model';

// Import Angular
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

// Relative paths INSIDE component folder
templateUrl: './game.component.html',    // Same folder
styleUrl: './game.component.scss',       // Same folder
```

## 📂 Folder Naming Convention

- **Component folder**: lowercase with hyphens
  ```
  ✅ game/
  ✅ spell-search/
  ✅ statistics-page/
  ❌ Game/              (not PascalCase)
  ❌ game_component/    (not snake_case)
  ```

- **Component class**: PascalCase with "Component" suffix
  ```
  ✅ GameComponent
  ✅ SpellSearchComponent
  ✅ StatisticsPageComponent
  ❌ gameComponent       (not camelCase)
  ❌ Game               (missing Component suffix)
  ```

- **File names**: lowercase with hyphens and component indicator
  ```
  ✅ game.component.ts
  ✅ game.component.html
  ✅ game.component.scss
  ✅ spell-search.component.ts
  ❌ Game.component.ts   (not PascalCase)
  ❌ game.ts             (missing .component indicator)
  ```

## 🚀 Creating New Components

### Quick Start Template

#### 1. Create folder
```bash
mkdir src/app/components/my-component
```

#### 2. Create `.ts` file (`my-component.component.ts`)
```typescript
import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-my-component',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './my-component.component.html',
  styleUrl: './my-component.component.scss',
})
export class MyComponentComponent {}
```

#### 3. Create `.html` file (`my-component.component.html`)
```html
<div class="my-component">
  <h1>My Component</h1>
</div>
```

#### 4. Create `.scss` file (`my-component.component.scss`)
```scss
.my-component {
  padding: 20px;
  background-color: #f9f9f9;
}
```

#### 5. Import in parent (`app.ts` or other component)
```typescript
import { MyComponentComponent } from './components/my-component/my-component.component';

@Component({
  imports: [MyComponentComponent],
  template: '<app-my-component></app-my-component>',
})
export class App {}
```

## 📊 Component Checklist

Before submitting a new component:

```
File Organization
☐ Component has its own folder
☐ Folder name is lowercase with hyphens
☐ All 3 files exist (.ts, .html, .scss)

TypeScript File
☐ Component class exported with "Component" suffix
☐ @Component decorator includes templateUrl and styleUrl
☐ Relative paths are correct (./filename)
☐ Services imported from ../../services/
☐ Models imported from ../../models/
☐ OnPush change detection applied
☐ No inline template or styles

HTML File
☐ Only contains markup and bindings
☐ No styling (use CSS classes instead)
☐ No logic (call component methods)
☐ Uses new control flow syntax (@if, @for, @switch)
☐ Proper semantic HTML

SCSS File
☐ Uses component class prefix (e.g., .game-container)
☐ Styles scoped to component
☐ Uses SCSS features (nesting, variables)
☐ No global styles
☐ Responsive media queries included

Imports
☐ Component imported in parent
☐ Component added to imports array
☐ No import errors in console
```

## 🎨 SCSS Best Practices

### ✅ DO
```scss
// Use nesting
.game-container {
  padding: 20px;

  .game-header {
    display: flex;

    h1 {
      margin: 0;
    }
  }
}

// Use variables
$primary-color: #0066cc;
$spacing: 20px;

.button {
  background-color: $primary-color;
  padding: $spacing;
}

// Use mixins
@mixin flex-center {
  display: flex;
  justify-content: center;
  align-items: center;
}

.centered {
  @include flex-center;
}
```

### ❌ DON'T
```scss
// Don't pollute global namespace
* {
  margin: 0;
}

// Don't style other components
.spell-card {
  border: 1px solid red;  // This affects other components!
}

// Don't use !important
.button {
  color: blue !important;
}

// Don't use inline styles in SCSS
.game {
  border: 1px solid red; color: blue; padding: 10px;
}
```

## 📚 Next Components Ready

### SpellSearchComponent
```
src/app/components/spell-search/
├── spell-search.component.ts
├── spell-search.component.html
└── spell-search.component.scss
```

### StatisticsComponent (Future)
```
src/app/components/statistics/
├── statistics.component.ts
├── statistics.component.html
└── statistics.component.scss
```

## ✅ Summary

| Aspect | Pattern |
|--------|---------|
| **Folder** | `component-name/` (lowercase, hyphens) |
| **Class** | `ComponentNameComponent` (PascalCase + Component) |
| **Files** | `.ts`, `.html`, `.scss` (always 3 files) |
| **Imports** | Use relative paths, import from parent services |
| **Templates** | Use templateUrl, never inline |
| **Styles** | Use styleUrl, never inline |
| **Structure** | One component per folder |

---

**Your project is now organized like a professional Angular application! 🚀**
