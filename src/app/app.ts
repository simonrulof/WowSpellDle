import { Component } from '@angular/core';
import { GameComponent } from './components/game/game.component';
import { CookieConsentComponent } from './components/cookie-consent/cookie-consent.component';

@Component({
  selector: 'app-root',
  imports: [GameComponent, CookieConsentComponent],
  template: `
    <app-cookie-consent></app-cookie-consent>
    <app-game></app-game>
  `,
  styleUrl: './app.scss'
})
export class App {}

