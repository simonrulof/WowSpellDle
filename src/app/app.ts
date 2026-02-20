import { Component } from '@angular/core';
import { GameComponent } from './components/game/game.component';
import { CookieConsentComponent } from './components/cookie-consent/cookie-consent.component';
import { HeaderComponent } from './components/header/header.component';

@Component({
  selector: 'app-root',
  imports: [GameComponent, CookieConsentComponent, HeaderComponent],
  template: `
    <app-cookie-consent></app-cookie-consent>
    <app-header></app-header>
    <app-game></app-game>
  `,
  styleUrl: './app.scss'
})
export class App {}

