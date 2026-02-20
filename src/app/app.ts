import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CookieConsentComponent } from './components/cookie-consent/cookie-consent.component';
import { HeaderComponent } from './components/header/header.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CookieConsentComponent, HeaderComponent],
  template: `
    <app-cookie-consent></app-cookie-consent>
    <app-header></app-header>
    <router-outlet></router-outlet>
  `,
  styleUrl: './app.scss'
})
export class App {}

