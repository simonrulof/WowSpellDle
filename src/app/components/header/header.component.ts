import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { LocalizationService } from '../../services/localization.service';
import { UITranslationService } from '../../services/ui-translation.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {
  localizationService = inject(LocalizationService);
  uiTranslationService = inject(UITranslationService);
}
