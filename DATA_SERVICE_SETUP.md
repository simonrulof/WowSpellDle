# Data Service Setup - WowSpellDle

This document explains how the data service is set up for the WowSpellDle application.

## Overview

The application uses **json-server** as a mock backend to serve spell data. This allows development without a real backend while we prepare the custom database.

## Project Structure

```
src/app/
├── models/
│   └── spell.model.ts          # Spell interface definitions
├── services/
│   ├── spell.service.ts        # Main data service
│   └── spell.service.spec.ts   # Service unit tests
data/
└── db.json                     # Mock database with spells
```

## Data Models

### Spell Interface (`spell.model.ts`)

```typescript
interface Spell {
  id: number;
  translations: {
    en: { 
      name: string; 
      description: string;
      class: string;
      spec: string | null;
      school: string;
      useType: string;
    };
    fr: { 
      name: string; 
      description: string;
      class: string;
      spec: string | null;
      school: string;
      useType: string;
    };
  };
  cooldown: number;            // In seconds
}
```

### Helper Function

```typescript
getSpellText(spell: Spell, language: 'en' | 'fr')
```

Returns the appropriate name, description, class, spec, school, and useType based on the language.


## API Endpoints (json-server)

All endpoints are available at `http://localhost:3000`

### Spells Endpoints

- `GET /spells` - Get all spells
- `GET /spells/:id` - Get a specific spell by ID
- `POST /spells` - Create a new spell (dev only)
- `PATCH /spells/:id` - Update a spell (dev only)
- `DELETE /spells/:id` - Delete a spell (dev only)

### Daily Spells Endpoints

- `GET /dailySpells` - Get all daily spell entries
- `GET /dailySpells?date=YYYY-MM-DD` - Get daily spell for a specific date
- `POST /dailySpells` - Create a new daily spell entry (dev only)

## SpellService Methods

### Getting All Spells

```typescript
getAllSpells(): Observable<Spell[]>
```

Fetches all available spells from the database.

### Getting a Specific Spell

```typescript
getSpellById(id: number): Observable<Spell | undefined>
```

Fetches a single spell by its ID.

### Getting Daily Spells

```typescript
getTodaysDailySpellWithDetails(): Observable<Spell | undefined>
```

Fetches today's spell to guess (combines daily spell entry with full spell details).

```typescript
getDailySpellWithDetails(date: string): Observable<Spell | undefined>
```

Fetches the spell for a specific date (format: YYYY-MM-DD).

```typescript
getDailySpellEntry(date: string): Observable<DailySpellEntry | undefined>
```

Gets just the daily spell entry (ID) for a specific date.

### Utility Methods

```typescript
getTodaysDailySpellEntry(): Observable<DailySpellEntry | undefined>
getAllDailySpells(): Observable<DailySpellEntry[]>
```

## Running the Application

### Start json-server

```bash
npm run db
```

This starts json-server on port 3000 and watches the `data/db.json` file for changes.

### Start Angular Development Server

In a separate terminal:

```bash
npm start
```

This starts the Angular dev server on port 4200.

### Both Together

You can run both in parallel using a process manager or terminal multiplexer.

## Database File Structure (`data/db.json`)

The `db.json` file contains two main collections:

```json
{
  "spells": [
    {
      "id": 1,
      "nameEn": "Fireball",
      "nameFr": "Boule de feu",
      "class": "Mage",
      "spec": "Fire",
      "cooldown": 0,
      "useType": "Damaging",
      "school": "Fire",
      "descriptionEn": "...",
      "descriptionFr": "..."
    }
  ],
  "dailySpells": [
    {
      "date": "2026-01-16",
      "spellId": 1
    }
  ]
}
```

## Adding Spells

Edit `data/db.json` and add new spell objects to the `spells` array:

```json
{
  "id": 9,
  "translations": {
    "en": {
      "name": "Holy Light",
      "description": "Heal an ally"
    },
    "fr": {
      "name": "Lumière sacrée",
      "description": "Guérissez un allié"
    }
  },
  "class": "Paladin",
  "spec": "Holy",
  "cooldown": 0,
  "useType": "Healing",
  "school": "Holy"
}
```

## Adding Daily Spells

Edit `data/db.json` and add entries to the `dailySpells` array:

```json
{
  "date": "2026-01-17",
  "spellId": 5
}
```

The date must be in `YYYY-MM-DD` format.

## Error Handling

The service includes error handling for:
- Network failures
- Invalid spell IDs
- Missing daily spells

When an error occurs, the service logs it to the console and returns `undefined` or an empty array, allowing the UI to handle gracefully.

## Future Migration

When the custom database is ready:

1. Replace the `apiUrl` in `spell.service.ts`
2. Update the database format/models if needed
3. No changes needed to the service methods - they remain the same

## Testing

Run the test suite:

```bash
npm test
```

The service includes unit tests that mock HTTP calls using Angular's `HttpClientTestingModule`.

## Development Tips

- **json-server GUI**: Access http://localhost:3000 for a simple GUI to browse the database
- **Live reload**: The database file is watched, so changes to `db.json` are reflected immediately
- **Add more data**: Simply add more objects to the spells and dailySpells arrays in `db.json`
