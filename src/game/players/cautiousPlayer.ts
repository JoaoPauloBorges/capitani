import { Building } from '../building';
import { Player } from './player.interface';

export class CautiousPlayer extends Player {
  strategy(building: Building) {
    if (this.balance - building.sellValue >= 80) return true;
    return false;
  }
  descriptor = 'cauteloso';
}
