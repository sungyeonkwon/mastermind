import {LobbyWithUser} from '../pages/Lobby';
import {GameWithUser} from '../pages/Game';

export const Routes = [
  {
    path: '/',
    exact: true,
    component: LobbyWithUser,
  },
  {
    path: '/game',
    exact: true,
    component: GameWithUser,
  },
];
