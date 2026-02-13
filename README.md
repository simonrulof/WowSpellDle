# WarcraftDle 🎮✨

A **World of Warcraft**-themed spelling guessing game built with **Angular 21** and **TypeScript**. Guess the daily spell based on feedback about class, specialization, school, type, and cooldown.

## Table of Contents

- [Features](#features)
- [Project Structure](#project-structure)
- [Quick Start](#quick-start)
- [Development](#development)
- [Game Mechanics](#game-mechanics)
- [Architecture](#architecture)
- [Technologies](#technologies)
- [Components](#components)
- [Services](#services)

## Features

✅ **Daily Spell Challenge** - A new spell each day to guess  
✅ **Multilingual Support** - English and French UI and spells  
✅ **Autocomplete Spell Search** - Type-ahead with spell filtering and keyboard navigation  
✅ **Real-time Feedback** - Get hints about class, spec, school, type, and cooldown  
✅ **Spell Icons** - WoW-themed SVG icons for each spell  
✅ **Dark Theme** - World of Warcraft-inspired dark UI with gold accents  
✅ **Responsive Design** - Works on desktop and mobile  
✅ **Keyboard Navigation** - Arrow keys for dropdown selection, Enter to select  

## Project Structure

```
WowSpellDle/
├── src/
│   ├── app/
│   │   ├── components/
│   │   │   ├── game/                    # Main game component
│   │   │   ├── attempts/                # Attempt counter display
│   │   │   ├── spell-search/            # Autocomplete spell selector
│   │   │   └── spell-service-example/   # Service usage example
│   │   ├── services/
│   │   │   ├── spell.service.ts         # API calls to .NET backend
│   │   │   ├── localization.service.ts  # Language management
│   │   │   ├── ui-translation.service.ts # UI text translations
│   │   │   └── icon.service.ts          # SVG icon path mapping
│   │   ├── models/
│   │   │   └── spell.model.ts           # Spell data model
│   │   ├── app.ts                       # Root component
│   │   ├── app.scss                     # Root styles
│   │   └── app.routes.ts                # Routing configuration
│   ├── environment.ts                   # Development environment config
│   ├── environment.prod.ts              # Production environment config
│   ├── assets/
│   │   └── translations.json            # EN/FR translations
│   ├── styles.scss                      # Global styles
│   └── main.ts                          # Application entry point
├── public/
│   └── assets/
│       ├── background.png               # Game background
│       └── spell-icons/                 # SVG spell icons
├── data/
│   └── db.json                          # Spell database (used by .NET API)
├── angular.json                         # Angular configuration
├── package.json                         # Dependencies
└── tsconfig.json                        # TypeScript configuration
```

## Quick Start

### Prerequisites
- **Node.js** 18+ and npm
- **Angular CLI** 21+

### Installation

```bash
# Clone the repository
git clone <repo-url>
cd WowSpellDle

# Install dependencies
npm install
```

### Running the Application

#### Prerequisites
- **Angular Frontend**: Node.js 20+ and npm
- **.NET Backend API**: .NET 8+ SDK (running on port 5000)

#### Option 1: Using Docker (Recommended)

```bash
# Build and start the frontend
docker-compose up --build

# The frontend will be available at http://localhost:80/
# Make sure your .NET API is running on http://localhost:5000/
```

To stop the containers:
```bash
docker-compose down
```

#### Option 2: Local Development

```bash
# Make sure your .NET API is running on port 5000
# Then start the Angular development server
npm start
```

The app will be available at **http://localhost:4200/**

### Building for Production

```bash
npm run build
```

Output will be in the `dist/` directory.

### Docker Deployment

Build the production Docker image:
```bash
docker build -t wowspelldle:latest .
```

Run the container:
```bash
docker run -p 80:80 wowspelldle:latest
```

## Development

### Development Server

```bash
ng serve --open
```

The app automatically reloads on file changes.

### Running Tests

```bash
# Unit tests
npm test

# End-to-end tests
npm run e2e
```

### Code Generation

```bash
# Generate a new component
ng generate component components/my-component

# Generate a new service
ng generate service services/my-service
```

## Game Mechanics

### How to Play

1. **Daily Spell** - A random spell is selected each day
2. **Make a Guess** - Type a spell name using the autocomplete search
3. **Get Feedback** - Each guess provides hints:
   - ✓ Correct class
   - ✓ Correct specialization
   - ✓ Correct school (magic type)
   - ✓ Correct use type (damage, heal, buff, utility)
   - ⬆️/⬇️ Cooldown comparison
4. **Win** - Guess the correct spell within unlimited attempts

### Feedback System

Each guess shows visual feedback:
- **Green checkmark** (✓) - Attribute matches
- **Red X** (✗) - Attribute doesn't match
- **Up/Down arrows** (⬆️/⬇️) - Cooldown is higher/lower

## Architecture

### Component Hierarchy

```
App (Root)
└── GameComponent
    ├── AttemptsComponent
    ├── SpellSearchComponent
    └── Guess History Display
```

### State Management

**Signals** (Angular 21 reactivity):
- `attemptCount`: Number of guesses made
- `guesses`: Array of all guesses with feedback
- `hasWon`: Win state
- Game state in `SpellSearchComponent` for search/dropdown

**Form Control** (Reactive Forms):
- `searchInput`: Spell search field with reactive filtering

### Data Flow

```
.NET API (localhost:5000) → Provides spells and comparison
              ↓
SpellService → Fetch spells and send guesses to API
              ↓
GameComponent → Display game state and feedback
              ↓
SpellSearchComponent → Filter spells, handle selection
                     ↓
GameComponent.makeGuess() → Send to API, receive feedback
                          ↓
Update guesses array with API response
```

### API Integration

The application communicates with a .NET backend API on port 5000:

**Endpoints:**
- `GET /Spells/all` - Fetch all available spells
- `GET /Spells/guess/{spellId}` - Compare spell with today's daily spell
- `GET /Spells/guess/{spellId}/{date}` - Compare spell with a specific date

**Response format:**
```json
{
  "spell": 0,      // 0 = incorrect, 1 = correct
  "class": 0,      // 0 = incorrect, 1 = correct  
  "spec": 1,       // 0 = incorrect, 1 = correct, 2 = partial
  "school": 0,     // 0 = incorrect, 1 = correct
  "useType": 0,    // 0 = incorrect, 1 = correct
  "cooldown": 4    // 1 = correct, 3 = more, 4 = less
}
```

## Technologies

| Technology | Version | Purpose |
|-----------|---------|---------|
| Angular | 21.1.0 | Frontend framework |
| TypeScript | 5.9.2 | Language |
| SCSS | Latest | Styling |
| RxJS | 7.8.0 | Reactive programming |
| Angular Forms | 21.1.0 | Reactive forms |
| .NET 8+ | Latest | Backend API |

## Components

### GameComponent
**Path:** `src/app/components/game/`

**Responsibilities:**
- Manage game state (attempts, guesses, win condition)
- Orchestrate daily spell fetching
- Calculate feedback for each guess
- Handle spell search integration

**Key Methods:**
- `makeGuess(spell: Spell)` - Process a spell guess
- `resetGame()` - Start a new game
- `getSpellName(spell)` - Get localized spell name

**Signals:**
```typescript
attemptCount = signal(0);
guesses = signal<Guess[]>([]);
hasWon = signal(false);
```

### SpellSearchComponent
**Path:** `src/app/components/spell-search/`

**Responsibilities:**
- Autocomplete spell selection
- Keyboard navigation (arrow keys, enter)
- Input validation
- Spell filtering based on user input

**Key Features:**
- Real-time spell filtering with debounce
- Dropdown display with spell icons
- Arrow key navigation with visual highlight
- Enter key to select first result
- Clear button to reset input
- Error state for invalid spells

**Signals:**
```typescript
selectedIndex = signal(-1);  // For keyboard navigation
isOpen = signal(false);       // Dropdown visibility
filteredSpells = computed();  // Filtered spell list
```

### AttemptsComponent
**Path:** `src/app/components/attempts/`

**Responsibilities:**
- Display the current attempt count

## Services

### SpellService
**Path:** `src/app/services/spell.service.ts`

**Methods:**
- `getAllSpells()` - Fetch all spells from .NET API
- `getSpellById(id)` - Get specific spell by ID
- `compareSpell(spellId, date?)` - Send guess to API and receive comparison feedback

**API Integration:**
- Base URL: `http://localhost:5000`
- All spell data and game logic handled by .NET backend
- Returns structured feedback for each guess

### LocalizationService
**Path:** `src/app/services/localization.service.ts`

**Methods:**
- `toggleLanguage()` - Switch between EN and FR
- `getLanguage()` - Get current language

### UITranslationService
**Path:** `src/app/services/ui-translation.service.ts`

**Methods:**
- `getText(key: string)` - Get localized UI text
- `getLanguageDisplayName(lang)` - Get language display name

**Supported Languages:** English (en), French (fr)

### IconService
**Path:** `src/app/services/icon.service.ts`

**Methods:**
- `getSpellIcon(spellName)` - Get SVG icon path for spell
- `getSpellIconFromSpell(spell, language)` - Get icon from spell object

**Icon Location:** `/assets/spell-icons/[spell-name].svg`

## Styling

### Theme Colors (WoW-Inspired)

- **Primary**: `#2d2a25` (Dark brown)
- **Accent**: `#ffd700` (Gold)
- **Border**: `#8b7355` (Bronze)
- **Success**: `#4caf50` (Green)
- **Error**: `#f44336` (Red)
- **Text**: `#ffffff` (White)

### CSS Architecture

- **Global**: `src/styles.scss` - Base colors, inputs, buttons
- **Component-level**: Individual SCSS files per component
- **Responsive**: Flexbox-based layouts

## Multilingual Support

### Available Translations

**Languages:** English (en), French (fr)

**Translated Content:**
- UI labels and buttons
- Spell names and descriptions
- Spell class, specialization, school, use type
- Game status messages
- Feedback labels

**Translation File:** `src/assets/translations.json`

### Adding a New Language

1. Add translations to `translations.json`
2. Update language options in `LocalizationService`
3. Update `UITranslationService.getLanguageDisplayName()`

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| ⬇️ Arrow Down | Select next spell in dropdown |
| ⬆️ Arrow Up | Select previous spell in dropdown |
| ↩️ Enter | Select highlighted spell |
| Esc | Close dropdown |

## API Endpoints (.NET Backend)

The application requires a .NET backend API running on `http://localhost:5000` with the following endpoints:

```
GET  /Spells/all                  - Fetch all available spells
GET  /Spells/guess/{spellId}      - Compare spell with today's daily spell
GET  /Spells/guess/{spellId}/{date} - Compare spell with a specific date
```

**Response Format:**
```typescript
{
  spell: number;     // 0 = incorrect, 1 = correct
  class: number;     // 0 = incorrect, 1 = correct
  spec: number;      // 0 = incorrect, 1 = correct, 2 = partial
  school: number;    // 0 = incorrect, 1 = correct
  useType: number;   // 0 = incorrect, 1 = correct
  cooldown: number;  // 1 = correct, 3 = more, 4 = less
}
```

## Performance Optimizations

- **OnPush Change Detection** - Used in all components
- **Signals** - Automatic reactivity without zone.js overhead
- **Computed Properties** - Memoized spell filtering
- **Debounced Search** - 300ms debounce on user input

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+

## Troubleshooting

### Icons not loading
- Check that `public/assets/spell-icons/` contains SVG files
- Verify `IconService` has correct paths

### Spells not appearing
- Ensure .NET API is running on port 5000
- Check browser console for CORS or network errors
- Verify environment.ts has correct API URL

### API Connection Issues
- Make sure your .NET backend is running
- Check that the API is accessible at `http://localhost:5000`
- Verify CORS is properly configured on the .NET API
- Check `SpellService` API endpoints in browser DevTools

### Language not changing
- Verify `translations.json` is loaded
- Check `UITranslationService` initialization

## Contributing

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request

## License

MIT License - See LICENSE file for details

## Credits

Built with ❤️ for WoW spell enthusiasts!

---

**Last Updated:** January 2026  
**Version:** 1.0.0
