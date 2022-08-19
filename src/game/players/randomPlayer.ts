import { Player } from './player.interface';

export class RandomPlayer extends Player {
  strategy() {
    return Math.random() >= 0.5;
  }
  descriptor = 'aleatório';
}
