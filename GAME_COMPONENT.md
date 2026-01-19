# GameComponent Documentation

## Overview

The `GameComponent` is the main game interface for WowSpellDle. It handles the core gameplay loop: fetching today's spell, accepting spell guesses, providing feedback, and tracking attempts.

## Location

- **File**: `src/app/components/game.component.ts`
- **Selector**: `app-game`

## Features

### 1. Daily Spell Challenge
- Fetches today's spell using `SpellService.getTodaysDailySpellWithDetails()`
- The target spell remains hidden from the player
- Player must guess the spell by name

### 2. Spell Input & Guessing
- Text input field for spell name guessing
- Enter key or "Guess" button to submit
- Validates that the guessed spell exists in the database
- Case-insensitive spell name matching
- Provides alert if spell name not found

### 3. Feedback System

For each guess, the player receives feedback on:

| Category | Feedback | Type |
|----------|----------|------|
| **Class** | ✓ or ✗ | Exact match only |
| **Spec** | ✓ or ✗ | Exact match only |
| **School** | ✓ or ✗ | Exact match only |
| **UseType** | ✓ or ✗ | Exact match only |
| **Cooldown** | ✓ ⬆ ⬇ | Correct / Longer / Shorter |

### 4. Attempt Tracking
- Displays current attempt number
- Shows all previous guesses with feedback
- Last guess highlighted with blue border
- Organized in reverse chronological order (newest first)

### 5. Win Condition
- Win when all 5 categories match perfectly
- Displays win message with number of attempts
- "Play Again" button resets the game

### 6. Localization
- Respects current language setting (EN/FR)
- Spell names matched against localized names
- Feedback uses localized spell properties
- Language toggle button in header

## State Management

### Signals
```typescript
private guessesList = signal<GuessResult[]>([]);
```
- Stores all guess attempts
- Updated reactively when new guesses are made

### Computed Properties
```typescript
attemptCount = computed(() => this.guessesList().length);
hasWon = computed(() => 
  this.guessesList().some(guess => this.isGuessCorrect(guess.feedback))
);
```
- Automatically recalculate on signal changes
- `attemptCount`: Total number of attempts
- `hasWon`: Boolean indicating if player has won

### Observables
```typescript
todaysSpell$: Observable<Spell | undefined>
```
- Fetches today's spell on component initialization
- Used in async pipe for non-blocking data loading

## Interfaces

### GuessResult
```typescript
interface GuessResult {
  spell: Spell;
  feedback: SpellFeedback;
  attemptNumber: number;
}
```

### SpellFeedback
```typescript
interface SpellFeedback {
  class: boolean;
  spec: boolean;
  school: boolean;
  useType: boolean;
  cooldown: 'correct' | 'longer' | 'shorter';
}
```

## Key Methods

### makeGuess()
- Triggered by Enter key or "Guess" button
- Validates spell name against all available spells
- Compares guessed spell with target spell
- Adds new guess to history
- Clears input field

### compareSpells(guessedSpell, targetSpell): SpellFeedback
- Compares all properties of two spells
- Returns feedback object with match results
- Uses current language for text comparison

### isGuessCorrect(feedback): boolean
- Checks if all 5 categories match perfectly
- Used to determine win condition

### resetGame()
- Clears all guesses
- Resets input field
- Ready for next daily challenge

## Styling

### Key CSS Classes
- `.game-container` - Main container
- `.game-status` - Attempt counter and win message
- `.spell-input-section` - Input area
- `.guesses-section` - History of guesses
- `.guess-item` - Individual guess card
- `.feedback-item` - Individual feedback item
  - `.correct` - Applied when feedback is correct

### Animations
- `fadeIn` - Content loading (0.3s)
- `slideIn` - New guesses added (0.3s)

### Responsive Design
- Max-width: 800px
- Grid-based feedback layout: `repeat(auto-fit, minmax(200px, 1fr))`
- Flexbox for main sections
- Touch-friendly button sizes (10px padding)

## Usage

```typescript
import { GameComponent } from './components/game.component';

@Component({
  selector: 'app-root',
  imports: [GameComponent],
  template: '<app-game></app-game>',
})
export class App {}
```

## Dependencies

### Services
- `SpellService` - Fetch spells and daily challenge
- `LocalizationService` - Language management

### Modules
- `CommonModule` - *ngIf, *ngFor, async pipe
- `ReactiveFormsModule` - FormControl for input

### Models
- `Spell` - Spell data structure
- `getSpellText()` - Helper for localized text

## Testing

### Manual Test Flow
1. Load the application
2. Verify today's spell is loaded (but not shown)
3. Type a spell name (e.g., "Fireball" if it's today's spell)
4. Click "Guess" or press Enter
5. Verify feedback appears correctly
6. Try wrong spell to see mismatches
7. Continue guessing until all categories match
8. Verify win message appears
9. Click "Play Again" to reset

### Test Cases
- [ ] Spell name validation (non-existent spell)
- [ ] Case-insensitive matching
- [ ] Cooldown comparison (correct, longer, shorter)
- [ ] All 5 feedback categories display
- [ ] Win condition triggers on perfect match
- [ ] Attempt counter increments
- [ ] Language switching in mid-game
- [ ] Input clears after guess
- [ ] Multiple guesses display in correct order

## Future Enhancements

1. **SpellSearchComponent** - Autocomplete dropdown with spell suggestions
2. **GameService** - Extract game logic into service (comparison, win detection)
3. **StatisticsService** - Save game results to localStorage
4. **Keyboard Navigation** - Arrow keys for search results
5. **Spell Hints** - Optional hints system
6. **Difficulty Modes** - Hard mode (limited attempts), timed mode
7. **Achievements** - Streak tracking, special badges
8. **Multiplayer** - Compare scores with other players
9. **Sound Effects** - Feedback sounds for correct/incorrect
10. **Mobile Optimization** - Touch-friendly improvements

## Known Limitations

1. **No Autocomplete** - Players must type exact spell name
2. **No Hints** - Players have no clues beyond feedback
3. **No Statistics** - Attempts not saved across sessions
4. **Single Player** - No multiplayer features
5. **Static Spells** - Only 8 spells in initial database

## Troubleshooting

### Issue: "Spell not found" alert
- **Cause**: Typed spell name doesn't exist in database
- **Solution**: Check exact spelling and localization (EN vs FR)

### Issue: No today's spell loads
- **Cause**: Missing entry in dailySpells for today's date
- **Solution**: Add entry to `data/db.json` with format `{ "date": "YYYY-MM-DD", "spellId": N }`

### Issue: Feedback shows incorrect
- **Cause**: Spell data mismatch between database entries
- **Solution**: Verify both spells have correct translations

## Code Statistics

- **Lines of Code**: ~450
- **Interfaces**: 2
- **Methods**: 11
- **Observables**: 1
- **Signals**: 2
- **Computed Properties**: 2
- **CSS Classes**: 20+
