import Lobby from '../pages/Lobby';
import Game from '../pages/Game';

export const Routes = [
  {
    path: '/',
    exact: true,
    component: Lobby,
  },
  {
    path: '/game',
    exact: true,
    component: Game,
  },
];
