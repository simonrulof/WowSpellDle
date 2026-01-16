import { Component } from '@angular/core';
import { SpellServiceExampleComponent } from './components/spell-service-example.component';

@Component({
  selector: 'app-root',
  imports: [SpellServiceExampleComponent],
  template: '<app-spell-service-example></app-spell-service-example>',
  styleUrl: './app.scss'
})
export class App {}

