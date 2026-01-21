import { Component, inject, ChangeDetectionStrategy, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { SpellService } from '../../services/spell.service';
import { LocalizationService } from '../../services/localization.service';
import { UITranslationService } from '../../services/ui-translation.service';
import { IconService } from '../../services/icon.service';
import { AttemptsComponent } from '../attempts/attempts.component';
import { SpellSearchComponent } from '../spell-search/spell-search.component';
import { Spell, getSpellText } from '../../models/spell.model';
import { Observable } from 'rxjs';

export interface GuessResult {
  spell: Spell;
  feedback: SpellFeedback;
  attemptNumber: number;
}

export interface SpellFeedback {
  class: boolean;
  spec: boolean;
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
  iconService = inject(IconService);

  todaysSpell$: Observable<Spell | undefined> = this.spellService.getTodaysDailySpellWithDetails();

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
      spec: guessedText.spec === targetText.spec,
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
