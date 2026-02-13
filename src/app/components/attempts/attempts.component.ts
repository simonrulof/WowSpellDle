import { Component, ChangeDetectionStrategy, input, signal, computed, output } from '@angular/core';
import { UITranslationService } from '../../services/ui-translation.service';
import { LocalizationService } from '../../services/localization.service';
import { SpellService, HintResponse } from '../../services/spell.service';
import { inject } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-attempts',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './attempts.component.html',
  styleUrl: './attempts.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AttemptsComponent {
  uiTranslationService = inject(UITranslationService);
  private localizationService = inject(LocalizationService);
  private spellService = inject(SpellService);

  // Input: number of attempts
  attemptCount = input<number>(0);

  // Output: emit when hint is used
  hintUsed = output<void>();

  // Hint state - store the full hint response
  private hintResponse = signal<HintResponse | undefined>(undefined);
  isHintRevealed = signal<boolean>(false);

  // Computed properties
  canUnlockHint = computed(() => this.attemptCount() >= 5);
  remainingGuesses = computed(() => Math.max(0, 5 - this.attemptCount()));
  
  // Computed hint that changes dynamically with language
  hint = computed(() => {
    const response = this.hintResponse();
    if (!response) return '';
    
    const currentLang = this.localizationService.getLanguage();
    return currentLang === 'fr' ? response.hintFr : response.hintEn;
  });

  /**
   * Handle hint box click
   */
  onHintClick(): void {
    if (this.canUnlockHint() && !this.isHintRevealed()) {
      this.spellService.getHint().subscribe((hintResponse) => {
        if (hintResponse) {
          this.hintResponse.set(hintResponse);
          this.isHintRevealed.set(true);
          this.hintUsed.emit(); // Notify parent component
        }
      });
    }
  }
}
