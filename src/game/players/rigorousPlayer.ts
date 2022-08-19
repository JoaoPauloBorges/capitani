import { Building } from '../building';
import { Player } from './player.interface';

export class RigorousPlayer extends Player {
  strategy(building: Building) {
    if (building.rentValue > 50) return true;
    return false;
  }
  descriptor = 'exigente';
}
