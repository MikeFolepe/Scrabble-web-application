import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class RandomBonusesService {
  bonusesPositions: Map<string, string>;
  constructor() { 
    this.bonusesPositions = new Map<string, string>([
      ['A1', 'tripleword'],
      ['A4', 'doubleletter'],
      ['A8', 'tripleword'],
      ['A12', 'doubleletter'],
      ['A15', 'tripleword'],
      ['B2', 'doubleword'],
      ['B6', 'tripleletter'],
      ['B10', 'tripleletter'],
      ['B14', 'doubleword'],
      ['C3', 'doubleword'],
      ['C7', 'doubleletter'],
      ['C9', 'doubleletter'],
      ['C13', 'doubleword'],
      ['D1', 'doubleletter'],
      ['D4', 'doubleword'],
      ['D8', 'doubleletter'],
      ['D12', 'doubleword'],
      ['D15', 'doubleletter'],
      ['E5', 'doubleword'],
      ['E11', 'doubleword'],
      ['F2', 'tripleletter'],
      ['F6', 'tripleletter'],
      ['F10', 'tripleletter'],
      ['F14', 'tripleletter'],
      ['G3', 'doubleletter'],
      ['G7', 'doubleletter'],
      ['G9', 'doubleletter'],
      ['G13', 'doubleletter'],
      ['H1', 'tripleword'],
      ['H4', 'doubleletter'],
      ['H12', 'doubleletter'],
      ['H15', 'tripleword'],
      ['I3', 'doubleletter'],
      ['I7', 'doubleletter'],
      ['I9', 'doubleletter'],
      ['I13', 'doubleletter'],
      ['J2', 'tripleletter'],
      ['J6', 'tripleletter'],
      ['J10', 'tripleletter'],
      ['J14', 'tripleletter'],
      ['K5', 'doubleword'],
      ['K11', 'doubleword'],
      ['L1', 'doubleletter'],
      ['L4', 'doubleword'],
      ['L8', 'doubleletter'],
      ['L12', 'doubleword'],
      ['M3', 'doubleword'],
      ['M7', 'doubleletter'],
      ['M9', 'doubleletter'],
      ['M13', 'doubleword'],
      ['N2', 'doubleword'],
      ['N6', 'tripleletter'],
      ['N10', 'tripleletter'],
      ['N14', 'doubleword'],
      ['O1', 'tripleword'],
      ['O4', 'doubleletter'],
      ['O8', 'tripleword'],
      ['O12', 'doubleletter'],
      ['O15', 'tripleword'],
  ]);
  }

  //Met toutes les valeurs du map de bonus dans un tableau puis mélange ce dernier aléatoirement.
  shuffleBonuses():Array<string>{
      let bonuses = Array.from(this.bonusesPositions.values());
      for (let currentBonusIndex = bonuses.length - 1; currentBonusIndex > 0; currentBonusIndex--) {
        let randomIndex = Math.floor(Math.random() * (currentBonusIndex + 1));
        [bonuses[currentBonusIndex], bonuses[randomIndex]] = [bonuses[randomIndex], bonuses[currentBonusIndex]];
      }
      return bonuses;
  }

  //met dans le map des positions de bonus les valeurs issues du tableau de bonus mélangés
  shuffleBonusesPositions(){
      let bonuses = this.shuffleBonuses();
      this.bonusesPositions.forEach((bonus:string, position:string)=>{
        this.bonusesPositions.set(position,bonuses.pop() as string);
      });
  }
}
