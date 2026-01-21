import { Component, ChangeDetectionStrategy, input } from '@angular/core';
import { UITranslationService } from '../../services/ui-translation.service';
import { inject } from '@angular/core';

@Component({
  selector: 'app-attempts',
  standalone: true,
  template: `
    <div class="attempts-container">
      <strong>{{ uiTranslationService.getText('game.attempts') }}</strong>
      <span class="attempts-count">{{ attemptCount() }}</span>
    </div>
  `,
  styleUrl: './attempts.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AttemptsComponent {
  uiTranslationService = inject(UITranslationService);

  // Input: number of attempts
  attemptCount = input<number>(0);
}
