import { Component, inject, ChangeDetectionStrategy, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { SpellService } from '../../services/spell.service';
import { LocalizationService } from '../../services/localization.service';
import { UITranslationService } from '../../services/ui-translation.service';
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
  class: boolean;
  spec: 'correct' | 'partial' | 'incorrect'; // Changed to support 3 states
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
export class GameComponent {
  private spellService = inject(SpellService);
  localizationService = inject(LocalizationService);
  uiTranslationService = inject(UITranslationService);

  todaysSpell$: Observable<Spell | undefined> = this.spellService.getTodaysDailySpellWithDetails();
  
  // Convert Observable to Signal for use in computed
  private todaysSpellSignal = toSignal(this.todaysSpell$);

  // State management - use signal for guesses
  private guessesList = signal<GuessResult[]>([]);
  guesses = this.guessesList;

  attemptCount = computed(() => this.guessesList().length);

  hasWon = computed(() => {
    const todaysSpell = this.todaysSpellSignal();
    if (!todaysSpell) return false;
    // Check if any guess matches the actual spell ID
    return this.guessesList().some((guess: GuessResult) => guess.spell.id === todaysSpell.id);
  });

  // Extract guessed spells for the search component to exclude
  guessedSpells = computed(() => this.guessesList().map((guess) => guess.spell));

  /**
   * Handle a spell guess
   */
  makeGuess(guessedSpell: Spell): void {
    this.todaysSpell$.subscribe((targetSpell) => {
      if (!targetSpell || !guessedSpell) return;

      const feedback = this.compareSpells(guessedSpell, targetSpell);
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
   * Compare two spells and return feedback
   */
  private compareSpells(guessedSpell: Spell, targetSpell: Spell): SpellFeedback {
    const language = this.localizationService.getLanguage();
    const guessedText = getSpellText(guessedSpell, language);
    const targetText = getSpellText(targetSpell, language);

    return {
      class: guessedText.class === targetText.class,
      spec: this.compareSpecs(guessedText.spec, targetText.spec),
      school: guessedText.school === targetText.school,
      useType: guessedText.useType === targetText.useType,
      cooldown:
        guessedSpell.cooldown === targetSpell.cooldown
          ? 'correct'
          : guessedSpell.cooldown > targetSpell.cooldown
            ? 'shorter'
            : 'longer',
    };
  }

  /**
   * Compare two spec arrays
   * Returns 'correct' if arrays are identical, 'partial' if there's any overlap, 'incorrect' otherwise
   */
  private compareSpecs(guessedSpecs: string[], targetSpecs: string[]): 'correct' | 'partial' | 'incorrect' {
    // Safety check: ensure both are arrays
    const guessedArray = Array.isArray(guessedSpecs) ? guessedSpecs : [guessedSpecs];
    const targetArray = Array.isArray(targetSpecs) ? targetSpecs : [targetSpecs];
    
    // Check if arrays are identical (same length and same items)
    if (guessedArray.length === targetArray.length && 
        guessedArray.every(spec => targetArray.includes(spec))) {
      return 'correct';
    }
    
    // Check for any overlap
    const hasOverlap = guessedArray.some(spec => targetArray.includes(spec));
    return hasOverlap ? 'partial' : 'incorrect';
  }

  /**
   * Check if a guess is completely correct
   */
  private isGuessCorrect(feedback: SpellFeedback): boolean {
    return (
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
