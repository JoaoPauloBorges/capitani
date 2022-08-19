import { Injectable } from '@nestjs/common';
import buildings from '../../buildings.seed';
import { Building } from './building';
import { CautiousPlayer } from './players/cautiousPlayer';
import { ImpulsivePlayer } from './players/impulsivePlayer';
import { Player } from './players/player.interface';
import { RandomPlayer } from './players/randomPlayer';
import { RigorousPlayer } from './players/rigorousPlayer';

@Injectable()
export class GameService {
  private rounds = 1;
  private board: Building[] = buildings;
  private players: Player[] = [
    new CautiousPlayer(),
    new ImpulsivePlayer(),
    new RandomPlayer(),
    new RigorousPlayer(),
  ];

  ranking: Player[] = [];

  private generatePlayersTurnOrder() {
    const wrap = [];

    for (const _ in this.players) {
      const position = Math.floor(Math.random() * this.players.length);
      wrap.push(this.players[position]);
      this.players = this.players.filter((val, idx) => idx !== position);
    }
    this.players = wrap;
  }

  // private createTurnLoop() {
  //   const playersNumber = this.players.length;
  //   function* generator() {
  //     let counter = 0;
  //     while (true) {
  //       yield counter % playersNumber;
  //       counter++;
  //     }
  //   }

  //   return generator();
  // }

  private rollTheDice() {
    return Math.floor(Math.random() * 6) + 1;
  }

  private collectRents(currentPlayer: Player) {
    const building = this.board[currentPlayer.positionOnBoard];
    if (!!building.owner && building.owner !== currentPlayer.descriptor) {
      const newBalance = currentPlayer.payRent(
        building.rentValue,
        this.players.find((player) => player.descriptor === building.owner),
      );

      if (newBalance < 0) {
        this.removePlayer(currentPlayer);
      }
    }
  }

  private setNewPlayerPosition(current: Player, diceValue: number) {
    let steps;
    if (current.positionOnBoard == undefined) {
      steps = diceValue - 1;
    } else {
      steps = current.positionOnBoard + diceValue;
    }

    if (steps >= this.board.length) {
      current.receivePayment(100);
      current.positionOnBoard = steps % this.board.length;
      return;
    }
    current.positionOnBoard = steps;
  }

  private freeBuildings(current: Player) {
    this.board = this.board.map((building) => {
      if (building.owner === current.descriptor) {
        building.owner = undefined;
      }
      return building;
    });
  }

  private removePlayer(currentPlayer: Player) {
    this.players = this.players.filter(
      (player) => player.descriptor !== currentPlayer.descriptor,
    );
    this.ranking.push(currentPlayer);

    this.freeBuildings(currentPlayer);
  }

  execute(): Player[] {
    this.rounds = 1;
    this.generatePlayersTurnOrder();

    while (this.players.length > 1) {
      for (const currentPlayer of this.players) {
        const diceValue = this.rollTheDice();

        this.setNewPlayerPosition(currentPlayer, diceValue);

        const building = this.board[currentPlayer.positionOnBoard]; //atention

        currentPlayer.tryBuyBuilding(building);

        this.collectRents(currentPlayer);
      }
      // const currentPlayer = this.players[genNextPlayer.next().value as number];

      if (this.rounds === 1000) {
        //Since version 10 (or EcmaScript 2019), the specification dictates that Array.prototype.sort is stable.
        //so it should meet the tiebreaker rule as the players turn order
        return [
          ...this.players.sort((a, b) => b.balance - a.balance),
          ...this.ranking.reverse(),
        ];
      }

      this.rounds++;
    }
    return [...this.players, ...this.ranking.reverse()];
  }
}
