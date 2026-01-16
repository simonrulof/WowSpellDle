# Quick Start Guide - Data Service Setup

## Prerequisites

Make sure you have Node.js and npm installed.

## Installation

The json-server package should already be installed. If not, run:

```bash
npm install --save-dev json-server
```

## Running the Application

### Terminal 1: Start json-server (Backend API)

```bash
npm run db
```

You should see:

```
  \{^_^}/ hi!

  Loading data/db.json
  Done

  Resources
  http://localhost:3000/spells
  http://localhost:3000/dailySpells

  Home
  http://localhost:3000
```

### Terminal 2: Start Angular (Frontend)

```bash
npm start
```

The application will be available at `http://localhost:4200`

## Testing the Setup

### Check API Endpoints

While json-server is running, you can test the endpoints:

```bash
# Get all spells
curl http://localhost:3000/spells

# Get a specific spell
curl http://localhost:3000/spells/1

# Get today's daily spell
curl http://localhost:3000/dailySpells?date=2026-01-16
```

### Using the SpellService in a Component

```typescript
import { Component, inject } from '@angular/core';
import { SpellService } from './services/spell.service';

@Component({
  selector: 'app-game',
  template: `
    @if (todaysSpell() | async; as spell) {
      <p>Today's spell to guess: {{ spell.nameEn }}</p>
    }
  `
})
export class GameComponent {
  private spellService = inject(SpellService);
  todaysSpell = () => this.spellService.getTodaysDailySpellWithDetails();
}
```

## File Structure

```
WowSpellDle/
├── data/
│   └── db.json                          # Mock database
├── src/
│   └── app/
│       ├── models/
│       │   └── spell.model.ts           # Type definitions
│       ├── services/
│       │   ├── spell.service.ts         # Main service
│       │   └── spell.service.spec.ts    # Unit tests
│       └── app.config.ts                # HttpClient provider
├── package.json                         # npm scripts
└── DATA_SERVICE_SETUP.md                # Detailed documentation
```

## Common Tasks

### Add a New Spell

Edit `data/db.json` and add to the `spells` array:

```json
{
  "id": 9,
  "nameEn": "Holy Light",
  "nameFr": "Lumière sacrée",
  "class": "Paladin",
  "spec": "Holy",
  "cooldown": 0,
  "useType": "Healing",
  "school": "Holy",
  "descriptionEn": "Heal an ally",
  "descriptionFr": "Guérissez un allié"
}
```

### Set Tomorrow's Daily Spell

Edit `data/db.json` and add to `dailySpells`:

```json
{
  "date": "2026-01-17",
  "spellId": 2
}
```

## Troubleshooting

### Port 3000 Already in Use

If json-server fails to start due to port 3000 being in use, modify `package.json`:

```json
"db": "json-server --watch data/db.json --port 3001"
```

Then update `apiUrl` in `spell.service.ts`:

```typescript
private apiUrl = 'http://localhost:3001';
```

### CORS Issues

CORS is enabled by default in json-server, so cross-origin requests should work.

### No Spells Showing

1. Verify `data/db.json` exists and contains data
2. Check that json-server is running on port 3000
3. Check browser console for network errors
4. Verify `provideHttpClient()` is in `app.config.ts`

## Next Steps

Once this is working:

1. ✅ Data service is set up
2. Create the game component
3. Build the guess/feedback UI
4. Implement game statistics (cookies/cache)
5. Add localization (French/English)
