import { Building } from '../building';

export abstract class Player {
  abstract descriptor: string;

  balance = 300;

  positionOnBoard?: number;

  abstract strategy(building: Building);

  protected buyBuilding(building: Building) {
    this.balance -= building.sellValue;
    building.owner = this.descriptor;
  }

  payRent(rentValue: number, owner: Player) {
    this.balance -= rentValue;
    owner.receivePayment(rentValue);
    return this.balance;
  }

  receivePayment(payment: number) {
    this.balance += payment;
  }

  tryBuyBuilding(building: Building) {
    if (!!building.owner || building.sellValue > this.balance) {
      return;
    }
    if (!this.strategy(building)) {
      return;
    }
    this.buyBuilding(building);
  }
}
