import { Component, inject, ChangeDetectionStrategy, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { SpellService } from '../services/spell.service';
import { LocalizationService } from '../services/localization.service';
import { Spell, getSpellText } from '../models/spell.model';
import { Observable } from 'rxjs';

interface GuessResult {
  spell: Spell;
  feedback: SpellFeedback;
  attemptNumber: number;
}

interface SpellFeedback {
  class: boolean;
  spec: boolean;
  school: boolean;
  useType: boolean;
  cooldown: 'correct' | 'longer' | 'shorter';
}

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="game-container">
      <div class="game-header">
        <h1>WowSpellDle</h1>
        <button (click)="localizationService.toggleLanguage()" class="language-toggle">
          {{ localizationService.getLanguageDisplayName(localizationService.getLanguage()) }}
        </button>
      </div>

      @if (todaysSpell$ | async; as targetSpell) {
        <div class="game-content">
          <!-- Game Status -->
          <div class="game-status">
            <div class="attempts-counter">
              <strong>Attempts:</strong> {{ attemptCount() }}
            </div>
            @if (hasWon()) {
              <div class="win-message">
                <h2>🎉 You Won!</h2>
                <p>You guessed it in {{ attemptCount() }} {{ attemptCount() === 1 ? 'attempt' : 'attempts' }}</p>
                <button (click)="resetGame()" class="btn btn-primary">Play Again</button>
              </div>
            }
          </div>

          <!-- Spell Input -->
          @if (!hasWon()) {
            <div class="spell-input-section">
              <label for="spell-search">Guess the spell:</label>
              <input
                id="spell-search"
                type="text"
                [formControl]="spellInput"
                placeholder="Type a spell name..."
                class="spell-input"
                (keyup.enter)="makeGuess()"
              />
              <button (click)="makeGuess()" class="btn btn-primary" [disabled]="!spellInput.value">
                Guess
              </button>
            </div>
          }

          <!-- Guesses History -->
          @if (guesses().length > 0) {
            <div class="guesses-section">
              <h2>Your Guesses</h2>
              <div class="guesses-list">
                @for (guess of guesses(); track guess.attemptNumber; let last = $last) {
                  <div class="guess-item" [class.last-guess]="last">
                    <div class="guess-header">
                      <span class="spell-name">{{ getSpellName(guess.spell) }}</span>
                      <span class="attempt-number">Attempt {{ guess.attemptNumber }}</span>
                    </div>
                    <div class="guess-feedback">
                      <div class="feedback-item" [class.correct]="guess.feedback.class">
                        <span class="feedback-label">Class:</span>
                        <span class="feedback-icon">{{ guess.feedback.class ? '✓' : '✗' }}</span>
                        <span class="feedback-value">{{ getSpellClass(guess.spell) }}</span>
                      </div>
                      <div class="feedback-item" [class.correct]="guess.feedback.spec">
                        <span class="feedback-label">Spec:</span>
                        <span class="feedback-icon">{{ guess.feedback.spec ? '✓' : '✗' }}</span>
                        <span class="feedback-value">{{ getSpellSpec(guess.spell) || 'N/A' }}</span>
                      </div>
                      <div class="feedback-item" [class.correct]="guess.feedback.school">
                        <span class="feedback-label">School:</span>
                        <span class="feedback-icon">{{ guess.feedback.school ? '✓' : '✗' }}</span>
                        <span class="feedback-value">{{ getSpellSchool(guess.spell) }}</span>
                      </div>
                      <div class="feedback-item" [class.correct]="guess.feedback.useType">
                        <span class="feedback-label">Type:</span>
                        <span class="feedback-icon">{{ guess.feedback.useType ? '✓' : '✗' }}</span>
                        <span class="feedback-value">{{ getSpellUseType(guess.spell) }}</span>
                      </div>
                      <div
                        class="feedback-item"
                        [class.correct]="guess.feedback.cooldown === 'correct'"
                      >
                        <span class="feedback-label">Cooldown:</span>
                        <span class="feedback-icon">
                          @switch (guess.feedback.cooldown) {
                            @case ('correct') {
                              ✓
                            }
                            @case ('longer') {
                              ⬆
                            }
                            @case ('shorter') {
                              ⬇
                            }
                          }
                        </span>
                        <span class="feedback-value">{{ guess.spell.cooldown }}s</span>
                      </div>
                    </div>
                  </div>
                }
              </div>
            </div>
          }
        </div>
      } @else {
        <div class="loading-message">
          <p>Loading today's spell...</p>
        </div>
      }
    </div>
  `,
  styles: `
    .game-container {
      max-width: 800px;
      margin: 0 auto;
      padding: 20px;
      font-family: Arial, sans-serif;
    }

    .game-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 30px;
      gap: 20px;
      border-bottom: 2px solid #333;
      padding-bottom: 15px;
    }

    .game-header h1 {
      margin: 0;
      color: #0066cc;
    }

    .language-toggle {
      padding: 8px 16px;
      border: 2px solid #333;
      border-radius: 4px;
      background-color: #f0f0f0;
      cursor: pointer;
      font-weight: bold;
      transition: all 0.2s ease;
    }

    .language-toggle:hover {
      background-color: #e0e0e0;
      transform: scale(1.05);
    }

    .game-content {
      animation: fadeIn 0.3s ease-in;
    }

    @keyframes fadeIn {
      from {
        opacity: 0;
      }
      to {
        opacity: 1;
      }
    }

    .game-status {
      margin-bottom: 30px;
      padding: 15px;
      background-color: #f9f9f9;
      border-radius: 8px;
      border-left: 4px solid #0066cc;
    }

    .attempts-counter {
      font-size: 16px;
      margin-bottom: 15px;
    }

    .win-message {
      background-color: #e8f5e9;
      border-left: 4px solid #4caf50;
      padding: 15px;
      border-radius: 8px;
      text-align: center;
    }

    .win-message h2 {
      margin: 0 0 10px 0;
      color: #2e7d32;
    }

    .win-message p {
      margin: 0 0 15px 0;
      color: #388e3c;
    }

    .spell-input-section {
      display: flex;
      gap: 10px;
      margin-bottom: 30px;
      flex-wrap: wrap;
      align-items: flex-end;
    }

    .spell-input-section label {
      font-weight: bold;
      min-width: 100%;
      margin-bottom: 5px;
    }

    .spell-input {
      flex: 1;
      min-width: 200px;
      padding: 10px;
      border: 2px solid #ddd;
      border-radius: 4px;
      font-size: 14px;
      transition: border-color 0.2s ease;
    }

    .spell-input:focus {
      outline: none;
      border-color: #0066cc;
      box-shadow: 0 0 5px rgba(0, 102, 204, 0.3);
    }

    .btn {
      padding: 10px 20px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-weight: bold;
      transition: all 0.2s ease;
    }

    .btn-primary {
      background-color: #0066cc;
      color: white;
    }

    .btn-primary:hover:not(:disabled) {
      background-color: #0052a3;
      transform: translateY(-2px);
      box-shadow: 0 4px 8px rgba(0, 102, 204, 0.3);
    }

    .btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .guesses-section {
      margin-top: 30px;
    }

    .guesses-section h2 {
      margin-top: 0;
      margin-bottom: 15px;
      color: #333;
    }

    .guesses-list {
      display: flex;
      flex-direction: column;
      gap: 15px;
    }

    .guess-item {
      background-color: #f9f9f9;
      border: 1px solid #ddd;
      border-radius: 8px;
      padding: 15px;
      animation: slideIn 0.3s ease-in;
    }

    .guess-item.last-guess {
      border-left: 4px solid #0066cc;
    }

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

    .guess-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 10px;
      padding-bottom: 10px;
      border-bottom: 1px solid #eee;
    }

    .spell-name {
      font-weight: bold;
      font-size: 16px;
      color: #333;
    }

    .attempt-number {
      font-size: 12px;
      color: #999;
    }

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
      background-color: white;
      border-radius: 4px;
      border: 1px solid #eee;
    }

    .feedback-item.correct {
      background-color: #e8f5e9;
      border-color: #4caf50;
    }

    .feedback-label {
      font-weight: bold;
      min-width: 70px;
      color: #666;
      font-size: 12px;
    }

    .feedback-icon {
      font-size: 16px;
      font-weight: bold;
      min-width: 20px;
      text-align: center;
    }

    .feedback-item.correct .feedback-icon {
      color: #4caf50;
    }

    .feedback-item:not(.correct) .feedback-icon {
      color: #f44336;
    }

    .feedback-value {
      flex: 1;
      text-align: right;
      font-size: 12px;
      color: #555;
    }

    .loading-message {
      text-align: center;
      padding: 40px;
      font-size: 18px;
      color: #666;
    }
  `,
})
export class GameComponent {
  private spellService = inject(SpellService);
  localizationService = inject(LocalizationService);

  todaysSpell$: Observable<Spell | undefined> = this.spellService.getTodaysDailySpellWithDetails();
  spellInput = new FormControl('');

  // State management - use signal for guesses
  private guessesList = signal<GuessResult[]>([]);
  guesses = this.guessesList;

  attemptCount = computed(() => this.guessesList().length);

  hasWon = computed(() =>
    this.guessesList().some((guess: GuessResult) => this.isGuessCorrect(guess.feedback))
  );

  /**
   * Handle a spell guess
   */
  makeGuess(): void {
    const guessedSpellName = this.spellInput.value?.trim();
    if (!guessedSpellName) return;

    this.todaysSpell$.subscribe((targetSpell) => {
      if (!targetSpell) return;

      this.spellService.getAllSpells().subscribe((allSpells) => {
        const language = this.localizationService.getLanguage();
        const guessedSpell = allSpells.find(
          (spell) =>
            getSpellText(spell, language).name.toLowerCase() === guessedSpellName.toLowerCase()
        );

        if (!guessedSpell) {
          alert('Spell not found. Please check the name and try again.');
          return;
        }

        const feedback = this.compareSpells(guessedSpell, targetSpell);
        const currentGuesses = this.guessesList();
        const newGuess: GuessResult = {
          spell: guessedSpell,
          feedback,
          attemptNumber: currentGuesses.length + 1,
        };

        this.guessesList.set([...currentGuesses, newGuess]);
        this.spellInput.reset();
      });
    });
  }

  /**
   * Compare two spells and return feedback
   */
  private compareSpells(guessedSpell: Spell, targetSpell: Spell): SpellFeedback {
    const language = this.localizationService.getLanguage();
    const guessedText = getSpellText(guessedSpell, language);
    const targetText = getSpellText(targetSpell, language);

    return {
      class: guessedText.class === targetText.class,
      spec: guessedText.spec === targetText.spec,
      school: guessedText.school === targetText.school,
      useType: guessedText.useType === targetText.useType,
      cooldown:
        guessedSpell.cooldown === targetSpell.cooldown
          ? 'correct'
          : guessedSpell.cooldown > targetSpell.cooldown
            ? 'longer'
            : 'shorter',
    };
  }

  /**
   * Check if a guess is completely correct
   */
  private isGuessCorrect(feedback: SpellFeedback): boolean {
    return (
      feedback.class &&
      feedback.spec &&
      feedback.school &&
      feedback.useType &&
      feedback.cooldown === 'correct'
    );
  }

  /**
   * Reset game for next round
   */
  resetGame(): void {
    this.guessesList.set([]);
    this.spellInput.reset();
  }

  // Helper methods for template
  getSpellName(spell: Spell | null | undefined): string {
    if (!spell) return 'Unknown';
    const language = this.localizationService.getLanguage();
    return getSpellText(spell, language).name;
  }

  getSpellClass(spell: Spell | null | undefined): string {
    if (!spell) return 'Unknown';
    const language = this.localizationService.getLanguage();
    return getSpellText(spell, language).class;
  }

  getSpellSpec(spell: Spell | null | undefined): string | null {
    if (!spell) return null;
    const language = this.localizationService.getLanguage();
    return getSpellText(spell, language).spec;
  }

  getSpellSchool(spell: Spell | null | undefined): string {
    if (!spell) return 'Unknown';
    const language = this.localizationService.getLanguage();
    return getSpellText(spell, language).school;
  }

  getSpellUseType(spell: Spell | null | undefined): string {
    if (!spell) return 'Unknown';
    const language = this.localizationService.getLanguage();
    return getSpellText(spell, language).useType;
  }
}
