# Localization Setup - WowSpellDle

## Overview

The WowSpellDle application uses a centralized `LocalizationService` to manage language preferences. The application automatically detects the user's browser language and stores their preference in localStorage.

## How It Works

### 1. **Language Detection**

The service detects language in this order:
1. Check localStorage for saved preference
2. Detect browser language from `navigator.language`
3. Default to English if not French or previously stored

French users will automatically see French content. All other users will see English.

### 2. **Spell Data Structure**

Spells now use a `translations` object instead of separate `nameEn` and `nameFr` fields:

```typescript
interface Spell {
  id: number;
  translations: {
    en: { name: string; description: string };
    fr: { name: string; description: string };
  };
  // ... other properties
}
```

### 3. **LocalizationService Methods**

#### Get Current Language
```typescript
localizationService.getLanguage(): Language
```

#### Set Language
```typescript
localizationService.setLanguage('en' | 'fr')
```

This also saves to localStorage.

#### Toggle Language
```typescript
localizationService.toggleLanguage()
```

Switches between English and French.

#### Get Language Display Name
```typescript
localizationService.getLanguageDisplayName(language: Language): string
```

Returns "English" or "Français".

### 4. **Using Localization in Components**

#### Get Spell Text Helper

```typescript
import { getSpellText } from './models/spell.model';

// In your component
getSpellName(spell: Spell): string {
  const language = this.localizationService.getLanguage();
  return getSpellText(spell, language).name;
}

getSpellDescription(spell: Spell): string {
  const language = this.localizationService.getLanguage();
  return getSpellText(spell, language).description;
}
```

#### Access Translations Directly

```typescript
spell.translations.en.name  // English name
spell.translations.fr.name  // French name
spell.translations.en.description  // English description
```

#### Reactive Language Switching

```typescript
@Component({...})
export class GameComponent {
  localizationService = inject(LocalizationService);
  
  // Component will automatically update when language changes
  // because currentLanguage is a signal
  currentLanguage = this.localizationService.currentLanguage;
  
  getSpellName(spell: Spell): string {
    const lang = this.localizationService.getLanguage();
    return getSpellText(spell, lang).name;
  }
}
```

## File Structure

```
src/app/
├── services/
│   └── localization.service.ts       # Handles language management
├── models/
│   └── spell.model.ts                # Includes getSpellText() helper
└── components/
    └── spell-service-example.component.ts  # Shows usage example
```

## Database Format

All spells in `data/db.json` now use the translations structure:

```json
{
  "spells": [
    {
      "id": 1,
      "translations": {
        "en": {
          "name": "Fireball",
          "description": "Launch a fireball at the target"
        },
        "fr": {
          "name": "Boule de feu",
          "description": "Lancez une boule de feu sur la cible"
        }
      },
      "class": "Mage",
      "spec": "Fire",
      "cooldown": 0,
      "useType": "Damaging",
      "school": "Fire"
    }
  ]
}
```

## Adding Translations to New Spells

When adding a new spell, always include both English and French translations:

```json
{
  "id": 9,
  "translations": {
    "en": {
      "name": "Spell Name",
      "description": "What the spell does"
    },
    "fr": {
      "name": "Nom du Sort",
      "description": "Ce que fait le sort"
    }
  },
  "class": "ClassName",
  "spec": "SpecName",
  "cooldown": 0,
  "useType": "Healing" | "Damaging" | "Utility" | "Buff",
  "school": "SchoolType"
}
```

## Language Preference Storage

- **Storage Method**: localStorage
- **Key**: `wowSpellDle_language`
- **Values**: `'en'` or `'fr'`
- **Persistence**: User's choice is remembered across sessions

## Example: Language Toggle Button

```typescript
@Component({
  template: `
    <button (click)="localizationService.toggleLanguage()">
      {{ localizationService.getLanguageDisplayName(
        localizationService.getLanguage()
      ) }}
    </button>
  `
})
export class LanguageToggleComponent {
  localizationService = inject(LocalizationService);
}
```

## Best Practices

1. **Always use the helper function** `getSpellText()` when displaying spell names/descriptions
2. **Avoid hardcoding text** in components - use translations
3. **Test both languages** when adding new features
4. **Store all text in the database** - don't hardcode UI strings
5. **Use the signal** `currentLanguage` for reactive updates

## Migration from Old Format

If you have old spell data with `nameEn`, `nameFr`, `descriptionEn`, `descriptionFr`:

Transform it to:
```typescript
const newFormat = {
  ...oldSpell,
  translations: {
    en: {
      name: oldSpell.nameEn,
      description: oldSpell.descriptionEn
    },
    fr: {
      name: oldSpell.nameFr,
      description: oldSpell.descriptionFr
    }
  }
};
// Remove old fields: nameEn, nameFr, descriptionEn, descriptionFr
```

## Testing Localization

### Test French Locale
```bash
# In browser console
localStorage.setItem('wowSpellDle_language', 'fr');
location.reload();
```

### Test English Locale
```bash
# In browser console
localStorage.setItem('wowSpellDle_language', 'en');
location.reload();
```

### Test Browser Locale Detection
```bash
# Clear stored preference to test auto-detection
localStorage.removeItem('wowSpellDle_language');
location.reload();
```

## Future Enhancements

- Add more languages (Spanish, German, etc.)
- Add language selection UI/settings page
- Translate error messages and UI strings
- Add right-to-left (RTL) language support
- Implement pluralization rules per language
