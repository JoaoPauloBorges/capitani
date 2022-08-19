import { Player } from './player.interface';

export class ImpulsivePlayer extends Player {
  strategy() {
    return true;
  }
  descriptor = 'impulsivo';
}
