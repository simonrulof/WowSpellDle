# Architecture Guide

Comprehensive overview of WowSpellDle's architecture and design decisions.

## System Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    WowSpellDle App                       │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  ┌────────────────────────────────────────────────────┐ │
│  │            PRESENTATION LAYER                      │ │
│  │  ┌──────────────┐  ┌──────────────────────┐       │ │
│  │  │ GameComponent│  │ SpellSearchComponent │       │ │
│  │  └──────────────┘  └──────────────────────┘       │ │
│  │  ┌──────────────┐                                │ │
│  │  │AttemptsComponent                             │ │
│  │  └──────────────┘                                │ │
│  └────────────────────────────────────────────────────┘ │
│                        ↓                                  │
│  ┌────────────────────────────────────────────────────┐ │
│  │           SERVICE LAYER                            │ │
│  │  ┌────────────┐  ┌────────────────┐  ┌────────┐  │ │
│  │  │SpellService│  │LocalizationSvc │  │IconSvc │  │ │
│  │  └────────────┘  └────────────────┘  └────────┘  │ │
│  │                                                    │ │
│  │  ┌──────────────────────┐                         │ │
│  │  │UITranslationService  │                         │ │
│  │  └──────────────────────┘                         │ │
│  └────────────────────────────────────────────────────┘ │
│                        ↓                                  │
│  ┌────────────────────────────────────────────────────┐ │
│  │           DATA/API LAYER                           │ │
│  │  ┌──────────────────────────────────────────────┐ │ │
│  │  │   json-server (Mock REST API)               │ │ │
│  │  │   - /spells                                  │ │ │
│  │  │   - /dailySpells                             │ │ │
│  │  └──────────────────────────────────────────────┘ │ │
│  └────────────────────────────────────────────────────┘ │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

## Component Architecture

### Component Hierarchy

```
App
└── GameComponent
    ├── AttemptsComponent
    ├── SpellSearchComponent
    │   └── (Dropdown, Items)
    └── Guess History
        └── Individual Guess Items
            └── Feedback Items
```

### Component Responsibilities

#### GameComponent (Container/Smart)
- **Role**: Main game orchestrator
- **State**: attemptCount, guesses, hasWon, todaysSpell
- **Responsibilities**:
  - Fetch daily spell on init
  - Handle spell submissions
  - Calculate feedback
  - Manage game flow
- **Dependencies**: SpellService, LocalizationService, UITranslationService

#### SpellSearchComponent (Container/Presentational)
- **Role**: Spell input and selection
- **State**: searchInput FormControl, filteredSpells, isOpen, selectedIndex
- **Responsibilities**:
  - Filter spells by user input
  - Display dropdown with icons
  - Handle keyboard navigation
  - Emit selected spell
- **Dependencies**: SpellService, LocalizationService, UITranslationService, IconService

#### AttemptsComponent (Presentational)
- **Role**: Display attempt counter
- **Input**: attemptCount
- **Responsibilities**:
  - Show number of attempts
  - Display visual indicator
- **Dependencies**: None

## State Management

### Signals Pattern

```typescript
// Local component state
private readonly searchTerm = signal('');
private readonly isOpen = signal(false);
private readonly selectedIndex = signal(-1);

// Computed derived state
filteredSpells = computed(() => {
  const term = this.searchTerm().toLowerCase();
  return this.allSpells().filter(spell =>
    spell.translations[this.language()].name.toLowerCase().includes(term)
  );
});

// Signal update
updateSearch(term: string): void {
  this.searchTerm.set(term);
  this.selectedIndex.set(-1); // Reset selection
}
```

### Observable Pattern

```typescript
// For async operations
todaysSpell$ = this.spellService.getTodaysSpell();

// In template with async pipe
@if (todaysSpell$ | async; as spell) {
  {{ spell.name }}
}
```

## Data Flow

### User Guesses a Spell

```
User Input (SpellSearchComponent)
    ↓
Validate spell exists
    ↓
Emit spellSelected event
    ↓
GameComponent.makeGuess(spell)
    ↓
SpellService.calculateFeedback(guess, target)
    ↓
Update guesses signal
    ↓
Template rerenders with new feedback
    ↓
Check if won (spell === todaysSpell)
    ↓
Update hasWon signal
```

### Language Switch

```
User clicks language button
    ↓
LocalizationService.toggleLanguage()
    ↓
Update language signal
    ↓
UITranslationService detects change
    ↓
All components get new text via getText()
    ↓
Template rerenders with new translations
```

### Daily Spell Selection

```
Game loads
    ↓
SpellService.getTodaysSpell()
    ↓
Fetch /dailySpells?date=YYYY-MM-DD
    ↓
Get spellId for today
    ↓
Fetch /spells/:id
    ↓
Set as todaysSpell
    ↓
Display game UI
```

## Service Architecture

### SpellService
**Responsibility**: Game logic and API communication

```typescript
class SpellService {
  // Get all spells for search/filtering
  getAllSpells(): Observable<Spell[]>
  
  // Get today's daily spell
  getTodaysSpell(): Observable<Spell>
  
  // Calculate feedback for a guess
  calculateFeedback(guess: Spell, target: Spell): Feedback
  
  // Feedback contains:
  // - class: boolean
  // - spec: boolean
  // - school: boolean
  // - useType: boolean
  // - cooldown: 'correct' | 'shorter' | 'longer'
}
```

### LocalizationService
**Responsibility**: Language state management

```typescript
class LocalizationService {
  // Get current language
  getLanguage(): Language
  
  // Toggle between EN and FR
  toggleLanguage(): void
  
  // Signal for reactive updates
  currentLanguage = signal<Language>('en')
}
```

### UITranslationService
**Responsibility**: UI string localization

```typescript
class UITranslationService {
  // Get translated UI text
  getText(key: string): string
  
  // Get display name for language
  getLanguageDisplayName(lang: Language): string
  
  // Load translations from JSON
  private loadTranslations(): void
}
```

### IconService
**Responsibility**: SVG icon path management

```typescript
class IconService {
  // Get icon path for spell name
  getSpellIcon(spellName: string): string
  
  // Get icon from spell object (handles localization)
  getSpellIconFromSpell(spell: Spell, language: Language): string
}
```

## Data Models

### Spell Model

```typescript
interface Spell {
  id: number;
  translations: {
    en: SpellTranslation;
    fr: SpellTranslation;
    [key: string]: SpellTranslation;
  };
  cooldown: number; // seconds
}

interface SpellTranslation {
  name: string;
  description: string;
  class: string;
  spec: string;
  school: string;
  useType: string;
}
```

### Guess Model

```typescript
interface Guess {
  spell: Spell;
  attemptNumber: number;
  feedback: Feedback;
}

interface Feedback {
  class: boolean;
  spec: boolean;
  school: boolean;
  useType: boolean;
  cooldown: 'correct' | 'shorter' | 'longer';
}
```

### Daily Spell Record

```typescript
interface DailySpell {
  date: string; // YYYY-MM-DD
  spellId: number;
}
```

## Dependency Injection

### Service Injection Pattern

```typescript
@Injectable({ providedIn: 'root' })
export class MyService {
  constructor(private http: HttpClient) {}
}

// In component
export class MyComponent {
  private spellService = inject(SpellService);
  private localization = inject(LocalizationService);
}
```

## Change Detection Strategy

### OnPush Optimization

All components use `ChangeDetectionStrategy.OnPush`:

```typescript
@Component({
  selector: 'app-example',
  template: '...',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ExampleComponent {
  // Changes detected when:
  // 1. Input properties change
  // 2. Event handler executes
  // 3. Signal updates
}
```

**Benefits**:
- Faster change detection
- Less re-renders
- Better performance
- Works perfectly with Signals

## Performance Considerations

### Bundle Size Optimization

- Tree-shaking unused code
- OnPush change detection
- No unnecessary imports
- Lazy loading where possible

### Runtime Performance

- Signals for fast state updates
- Computed signals for memoization
- Debouncing search input (300ms)
- Efficient template binding

```typescript
// Debounced search
searchTerm$ = new Subject<string>();
filteredSpells$ = this.searchTerm$.pipe(
  debounceTime(300),
  distinctUntilChanged(),
  switchMap(term => this.filterSpells(term))
);
```

## Styling Architecture

### Global Styles (`styles.scss`)

```scss
// Base theme colors
$primary-dark: #2d2a25;
$accent-gold: #ffd700;
$border-bronze: #8b7355;

// Global element styles
body, html { background: $primary-dark; }
button { color: $accent-gold; }
input { border-color: $border-bronze; }
```

### Component Styles

```scss
// Component-scoped styles
.component-name {
  &__element {
    // Styles only apply to this component
  }
}

// Responsive
@media (max-width: 768px) {
  .component-name {
    flex-direction: column;
  }
}
```

### Theme System

**Current Theme**: WoW Dark
- Primary: `#2d2a25` (Dark brown)
- Accent: `#ffd700` (Gold)
- Border: `#8b7355` (Bronze)
- Success: `#4caf50` (Green)
- Error: `#f44336` (Red)
- Text: `#ffffff` (White)

## Error Handling

### Service Level

```typescript
getAllSpells(): Observable<Spell[]> {
  return this.http.get<Spell[]>('/spells').pipe(
    catchError(error => {
      console.error('Failed to load spells', error);
      return of([]); // Return empty array on error
    })
  );
}
```

### Component Level

```typescript
todaysSpell$ = this.spellService.getTodaysSpell().pipe(
  catchError(() => {
    this.errorMessage = 'Failed to load today\'s spell';
    return of(null);
  })
);
```

## Testing Architecture

### Unit Test Structure

```typescript
describe('SpellService', () => {
  let service: SpellService;
  let httpClient: HttpClient;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SpellService]
    });
    service = TestBed.inject(SpellService);
  });

  it('should calculate feedback correctly', () => {
    const feedback = service.calculateFeedback(guess, target);
    expect(feedback.class).toBe(true);
  });
});
```

## Security Considerations

### Input Validation

```typescript
// Spell search only accepts real spell names
isValidSpell(): boolean {
  return this.allSpells().some(spell =>
    spell.translations[language].name.toLowerCase() === 
    this.searchInput.value.toLowerCase()
  );
}
```

### API Security

- Use HTTPS in production
- Validate all API responses
- Sanitize HTML content

## Scalability

### Future Improvements

1. **State Management**: Consider NgRx for complex state
2. **Lazy Loading**: Load components on demand
3. **Caching**: Cache spell data with service worker
4. **Database**: Replace json-server with real backend
5. **PWA**: Add offline capability

### Adding 100+ Spells

```typescript
// Current: 8 spells in db.json
// Future: Load from real database

// Implement pagination
getSpells(page: number, limit: number): Observable<Spell[]> {
  return this.http.get<Spell[]>(`/spells?_page=${page}&_limit=${limit}`);
}

// Update search to handle large datasets
filteredSpells = computed(() => {
  // Virtualization for large lists
  return this.filterAndVirtualize();
});
```

## Deployment Architecture

### Build Output

```
dist/wowspeldle/
├── index.html
├── main.js (bundled code)
├── styles.css (bundled styles)
├── assets/
│   ├── background.png
│   ├── spell-icons/
│   └── translations.json
└── favicon.ico
```

### CDN Considerations

```typescript
// In production, serve assets from CDN
export const environment = {
  production: true,
  apiUrl: 'https://api.example.com',
  assetsUrl: 'https://cdn.example.com/assets'
};
```

---

**Last Updated:** January 2026
