import { Component } from '@angular/core';
import { GameComponent } from './components/game/game.component';

@Component({
  selector: 'app-root',
  imports: [GameComponent],
  template: '<app-game></app-game>',
  styleUrl: './app.scss'
})
export class App {}

