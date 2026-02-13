import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CookieService } from '../../services/cookie.service';
import { UITranslationService } from '../../services/ui-translation.service';

@Component({
  selector: 'app-cookie-consent',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cookie-consent.component.html',
  styleUrls: ['./cookie-consent.component.scss'],
})
export class CookieConsentComponent {
  private cookieService = inject(CookieService);
  protected uiTranslation = inject(UITranslationService);

  // Expose cookie consent signal
  cookieConsentGiven = this.cookieService.cookieConsentGiven;

  acceptCookies(): void {
    this.cookieService.setCookieConsent(true);
  }

  declineCookies(): void {
    this.cookieService.setCookieConsent(false);
  }
}
