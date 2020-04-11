import {LobbyWithGame} from '../pages/Lobby';
import Game from '../pages/Game';

export const Routes = [
  {
    path: '/',
    exact: true,
    component: LobbyWithGame,
  },
  {
    path: '/game',
    exact: true,
    component: Game,
  },
];
