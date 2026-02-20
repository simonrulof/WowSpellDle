import { Routes } from '@angular/router';
import { GameComponent } from './components/game/game.component';
import { ArchiveComponent } from './components/archive/archive.component';

export const routes: Routes = [
  {
    path: '',
    component: GameComponent,
  },
  {
    path: 'archive',
    component: ArchiveComponent,
  },
  {
    path: 'game/:date',
    component: GameComponent,
  },
];
