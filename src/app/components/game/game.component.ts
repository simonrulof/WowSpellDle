import { Component, inject, ChangeDetectionStrategy, signal, computed, OnInit, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { SpellService, GuessResponse } from '../../services/spell.service';
import { LocalizationService } from '../../services/localization.service';
import { UITranslationService } from '../../services/ui-translation.service';
import { CookieService, GameState } from '../../services/cookie.service';
import { AttemptsComponent } from '../attempts/attempts.component';
import { SpellSearchComponent } from '../spell-search/spell-search.component';
import { Spell, getSpellText } from '../../models/spell.model';
import { Observable } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';

export interface GuessResult {
  spell: Spell;
  feedback: SpellFeedback;
  attemptNumber: number;
}

export interface SpellFeedback {
  spell: boolean;
  class: boolean;
  spec: 'correct' | 'partial' | 'incorrect';
  school: boolean;
  useType: boolean;
  cooldown: 'correct' | 'longer' | 'shorter';
}

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, AttemptsComponent, SpellSearchComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './game.component.html',
  styleUrl: './game.component.scss',
})
export class GameComponent implements OnInit {
  private spellService = inject(SpellService);
  private cookieService = inject(CookieService);
  localizationService = inject(LocalizationService);
  uiTranslationService = inject(UITranslationService);

  // State management - use signal for guesses
  private guessesList = signal<GuessResult[]>([]);
  guesses = this.guessesList;

  attemptCount = computed(() => this.guessesList().length);

  // Track if hint was used
  private hintUsedSignal = signal<boolean>(false);

  // Check if the user has won by looking at the last guess feedback
  hasWon = computed(() => {
    const guesses = this.guessesList();
    if (guesses.length === 0) return false;
    const lastGuess = guesses[guesses.length - 1];
    return this.isGuessCorrect(lastGuess.feedback);
  });

  // Extract guessed spells for the search component to exclude
  guessedSpells = computed(() => this.guessesList().map((guess) => guess.spell));

  constructor() {
    // Effect to save game state when guesses or hasWon changes
    effect(() => {
      const guesses = this.guessesList();
      const won = this.hasWon();
      const hintUsed = this.hintUsedSignal();

      // Only save if cookies are accepted
      if (this.cookieService.cookieConsentGiven()) {
        this.saveGameState(guesses, won, hintUsed);
      }
    });
  }

  ngOnInit(): void {
    this.loadGameState();
  }

  /**
   * Get today's date in YYYY-MM-DD format
   */
  private getTodayDate(): string {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  /**
   * Load game state from cookies if available
   */
  private loadGameState(): void {
    const savedState = this.cookieService.loadTodaysGameState();
    if (!savedState) return;

    // Restore guesses by fetching spell details and recreating GuessResult objects
    if (savedState.guesses && savedState.guesses.length > 0) {
      savedState.guesses.forEach((spellId) => {
        this.spellService.getSpellById(spellId).subscribe((spell) => {
          if (spell) {
            this.spellService.compareSpell(spell.id).subscribe((response) => {
              if (response) {
                const feedback = this.convertApiResponseToFeedback(response);
                const currentGuesses = this.guessesList();
                const newGuess: GuessResult = {
                  spell,
                  feedback,
                  attemptNumber: currentGuesses.length + 1,
                };
                this.guessesList.set([...currentGuesses, newGuess]);
              }
            });
          }
        });
      });
    }

    // Restore hint state
    if (savedState.hintUsed) {
      this.hintUsedSignal.set(true);
    }
  }

  /**
   * Save game state to cookies
   */
  private saveGameState(guesses: GuessResult[], won: boolean, hintUsed: boolean): void {
    const gameState: GameState = {
      date: this.getTodayDate(),
      guesses: guesses.map((guess) => guess.spell.id),
      won,
      hintUsed,
    };
    this.cookieService.saveGameState(gameState);
  }

  /**
   * Mark hint as used (called from AttemptsComponent)
   */
  markHintUsed(): void {
    this.hintUsedSignal.set(true);
  }

  /**
   * Handle a spell guess
   */
  makeGuess(guessedSpell: Spell): void {
    if (!guessedSpell) return;

    // Call the API to compare the spell
    this.spellService.compareSpell(guessedSpell.id).subscribe((response) => {
      if (!response) {
        console.error('Failed to get comparison response from API');
        return;
      }

      const feedback = this.convertApiResponseToFeedback(response);
      const currentGuesses = this.guessesList();
      const newGuess: GuessResult = {
        spell: guessedSpell,
        feedback,
        attemptNumber: currentGuesses.length + 1,
      };

      this.guessesList.set([...currentGuesses, newGuess]);
    });
  }

  /**
   * Convert API response to SpellFeedback format
   * API values: 0 = incorrect, 1 = correct, 2 = partial, 3 = more, 4 = less
   */
  private convertApiResponseToFeedback(response: GuessResponse): SpellFeedback {
    return {
      spell: response.spell === 1,
      class: response.class === 1,
      spec: this.convertSpecValue(response.spec),
      school: response.school === 1,
      useType: response.useType === 1,
      cooldown: this.convertCooldownValue(response.cooldown),
    };
  }

  /**
   * Convert spec value from API
   * 0 = incorrect, 1 = correct, 2 = partial
   */
  private convertSpecValue(value: number): 'correct' | 'partial' | 'incorrect' {
    if (value === 1) return 'correct';
    if (value === 2) return 'partial';
    return 'incorrect';
  }

  /**
   * Convert cooldown value from API
   * 1 = correct, 3 = more (guessed spell has longer cooldown), 4 = less (guessed spell has shorter cooldown)
   */
  private convertCooldownValue(value: number): 'correct' | 'longer' | 'shorter' {
    if (value === 1) return 'correct';
    if (value === 3) return 'longer'; // Guessed spell has MORE cooldown -> arrow up
    return 'shorter'; // Guessed spell has LESS cooldown -> arrow down
  }

  /**
   * Check if a guess is completely correct
   */
  isGuessCorrect(feedback: SpellFeedback): boolean {
    return (
      feedback.spell &&
      feedback.class &&
      feedback.spec === 'correct' &&
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

  getSpellSpec(spell: Spell | null | undefined): string[] {
    if (!spell) return [];
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
