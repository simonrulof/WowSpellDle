# Development Guide

This guide provides detailed information for developers working on the WowSpellDle project.

## Getting Started

### Environment Setup

1. **Install Node.js and npm**
   ```bash
   # Check versions
   node --version  # Should be 18+
   npm --version
   ```

2. **Install Angular CLI**
   ```bash
   npm install -g @angular/cli@21
   ```

3. **Clone and setup project**
   ```bash
   git clone <repo-url>
   cd WowSpellDle
   npm install
   ```

## Development Workflow

### Starting the Application

```bash
# Terminal 1: Mock API server
npm run json-server

# Terminal 2: Angular dev server
npm start
```

The app will be available at `http://localhost:4200/`

### Project Structure Explanation

#### `/src/app/components/`
Each component is self-contained with:
- `component-name.ts` - Logic and component class
- `component-name.html` - Template
- `component-name.scss` - Styles
- `component-name.spec.ts` - Unit tests

#### `/src/app/services/`
Services are singleton providers for cross-component logic:
- `spell.service.ts` - Game logic and API calls
- `localization.service.ts` - Language state
- `ui-translation.service.ts` - Text translations
- `icon.service.ts` - Icon path mapping

#### `/src/assets/`
Static assets:
- `translations.json` - EN/FR UI strings
- `spell-icons/` - SVG icon files

#### `/public/assets/`
Served directly by web server:
- `background.png` - Game background
- `spell-icons/` - Accessible SVG icons

## Code Standards

### TypeScript Best Practices

```typescript
// ✅ Use signals for reactive state
count = signal(0);

// ✅ Use inject() function for dependencies
constructor() {
  this.spellService = inject(SpellService);
}

// ✅ Use OnPush change detection
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush
})

// ✅ Type all function parameters and return types
getSpellName(spell: Spell): string {
  return spell.translations[language].name;
}

// ✅ Use readonly properties
private readonly logger = console;
```

### Component Structure

```typescript
import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { signal, computed } from '@angular/core';

@Component({
  selector: 'app-example',
  templateUrl: './example.component.html',
  styleUrl: './example.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ExampleComponent {
  // Signals first
  private readonly mySignal = signal('initial');
  
  // Computed properties
  derivedValue = computed(() => this.mySignal().toUpperCase());
  
  // Dependencies injected
  private readonly myService = inject(MyService);
  
  // Constructor (minimal)
  constructor() {}
  
  // Lifecycle hooks
  ngOnInit(): void {
    this.loadData();
  }
  
  // Methods
  private loadData(): void {
    // Implementation
  }
}
```

### Template Best Practices

```html
<!-- ✅ Use control flow syntax -->
@if (condition) {
  <p>Content</p>
} @else {
  <p>Alternative</p>
}

<!-- ✅ Use @for for loops -->
@for (item of items(); track item.id) {
  <div>{{ item.name }}</div>
}

<!-- ✅ Use signals directly -->
<p>{{ count() }}</p>

<!-- ✅ Bind events properly -->
<button (click)="onClick()">Click</button>

<!-- ✅ Use two-way binding carefully -->
<input [formControl]="searchInput" />
```

### SCSS Best Practices

```scss
// ✅ Use BEM naming
.component-name {
  &__element {
    &--modifier {
      // Styles
    }
  }
}

// ✅ Use variables and mixins
$primary-color: #ffd700;
$dark-bg: rgba(45, 42, 37, 0.8);

@mixin flex-center {
  display: flex;
  align-items: center;
  justify-content: center;
}

.card {
  @include flex-center;
  background-color: $dark-bg;
  color: $primary-color;
}

// ✅ Keep specificity low
.button {
  padding: 10px;
  
  &:hover {
    background-color: darker-color;
  }
}
```

## Adding Features

### Add a New Spell

1. **Add to `data/db.json`**
   ```json
   {
     "id": 9,
     "translations": {
       "en": {
         "name": "New Spell",
         "description": "...",
         "class": "Class",
         "spec": "Specialization",
         "school": "School",
         "useType": "Type"
       },
       "fr": {
         "name": "Nouveau Sort",
         ...
       }
     },
     "cooldown": 5
   }
   ```

2. **Create SVG icon**
   - Save as `public/assets/spell-icons/new-spell.svg`
   - Keep consistent size with other icons

3. **Update `IconService`**
   - Add mapping in `getSpellIcon()` method

### Add a New Language

1. **Update `data/db.json`**
   - Add translations for all spells

2. **Update `src/assets/translations.json`**
   - Add UI translations for new language

3. **Update `LocalizationService`**
   ```typescript
   toggleLanguage(): void {
     this.currentLanguage.set(
       this.currentLanguage() === 'en' ? 'fr' : 'es' // Add 'es'
     );
   }
   ```

4. **Update `UITranslationService`**
   ```typescript
   getLanguageDisplayName(language: string): string {
     return {
       'en': 'English',
       'fr': 'Français',
       'es': 'Español' // Add
     }[language];
   }
   ```

### Create a New Component

```bash
ng generate component components/my-new-component
```

The CLI will create:
- `my-new-component.ts`
- `my-new-component.html`
- `my-new-component.scss`
- `my-new-component.spec.ts`

### Create a New Service

```bash
ng generate service services/my-new-service
```

## Testing

### Running Tests

```bash
# Unit tests
npm test

# Run specific test file
npm test -- --include='**/spell.service.spec.ts'

# Run with coverage
npm test -- --coverage

# Watch mode
npm test -- --watch
```

### Writing Unit Tests

```typescript
import { TestBed } from '@angular/core/testing';
import { MyService } from './my.service';

describe('MyService', () => {
  let service: MyService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return expected value', () => {
    const result = service.myMethod();
    expect(result).toBe(expectedValue);
  });
});
```

## Debugging

### Chrome DevTools

1. Open DevTools (F12)
2. Check **Sources** tab for breakpoints
3. Use **Console** for logging
4. Check **Network** tab for API calls

### Angular DevTools

1. Install [Angular DevTools Extension](https://angular.io/guide/devtools)
2. Open DevTools and go to Angular tab
3. Inspect component signals and properties

### Common Issues

**Signals not updating UI:**
- Ensure component uses `ChangeDetectionStrategy.OnPush`
- Check that signal is properly tracked in template

**API calls not working:**
- Verify json-server is running on port 3000
- Check browser Network tab for failed requests
- Check service endpoints in console

**Styles not applying:**
- Check component SCSS is properly imported
- Verify CSS class names match template
- Look for conflicting global styles

## Build and Deployment

### Production Build

```bash
npm run build

# Output in dist/wowspeldle/
```

### Serve Production Build

```bash
npx http-server dist/wowspeldle
```

### Deployment Checklist

- [ ] All tests passing
- [ ] No console errors/warnings
- [ ] Icons loading correctly
- [ ] Responsive on mobile
- [ ] Languages working
- [ ] Spells loading from API
- [ ] Build completed successfully

## Performance Tips

### Reduce Bundle Size

1. Enable production mode
2. Use OnPush change detection everywhere
3. Lazy load components if needed
4. Optimize images/SVGs

### Improve Runtime Performance

1. Use signals instead of observables for simple state
2. Use computed() for derived state
3. Unsubscribe from observables (or use async pipe)
4. Debounce/throttle frequent operations

Example of optimized component:

```typescript
export class OptimizedComponent {
  // Fast local state
  private readonly count = signal(0);
  
  // Memoized derived state
  doubled = computed(() => this.count() * 2);
  
  // API calls debounced
  private readonly searchTerm = signal('');
  results = this.searchTerm.pipe(
    debounceTime(300),
    switchMap(term => this.service.search(term)),
    toSignal()
  );
}
```

## Git Workflow

### Branch Naming

```
feature/autocomplete-search
bugfix/icon-not-loading
docs/update-readme
```

### Commit Messages

```
feat: add keyboard navigation to spell search
fix: correct icon path for frost bolt
docs: update component documentation
style: improve dark theme colors
```

### Pull Request Process

1. Create feature branch from `master`
2. Make changes with meaningful commits
3. Push to remote
4. Create PR with description
5. Request review
6. Address feedback
7. Merge when approved

## Useful Commands

```bash
# Development
npm start                   # Start dev server
npm run json-server        # Start mock API
npm test                   # Run tests
npm run build              # Build for production

# Code quality
npm run lint               # Run linter
npm run format             # Format code
npm run type-check         # Check TypeScript

# Git
git status                 # Check changes
git add .                  # Stage all changes
git commit -m "message"    # Commit changes
git push                   # Push to remote
```

## Resources

- [Angular Documentation](https://angular.io/docs)
- [Angular Signals Guide](https://angular.io/guide/signals)
- [RxJS Documentation](https://rxjs.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [WoW Spell Database](https://www.wowhead.com/)

## Troubleshooting Development Issues

### Port 4200 already in use
```bash
ng serve --port 4300
```

### Port 3000 already in use (json-server)
```bash
json-server --watch data/db.json --port 3001
# Update SpellService API URLs
```

### Dependencies issues
```bash
rm -rf node_modules package-lock.json
npm install
```

### Clear Angular cache
```bash
npm run ng -- cache clean
```

---

**Last Updated:** January 2026
