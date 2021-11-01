import { Injectable } from '@angular/core';
import { BONUS_POSITIONS } from '@app/classes/constants';

@Injectable({
  providedIn: 'root'
})
export class RandomBonusesService {
  bonusPositions: Map<string, string>;
  constructor() { 
    this.bonusPositions = new Map<string, string>(BONUS_POSITIONS);
  }
  
  //Met toutes les valeurs du map de bonus dans un tableau puis mélange ce dernier aléatoirement.
  shuffleBonuses():Array<string>{
      let bonuses = Array.from(this.bonusPositions.values());
      for (let currentBonusIndex = bonuses.length - 1; currentBonusIndex > 0; currentBonusIndex--) {
        let randomIndex = Math.floor(Math.random() * (currentBonusIndex + 1));
        [bonuses[currentBonusIndex], bonuses[randomIndex]] = [bonuses[randomIndex], bonuses[currentBonusIndex]];
      }
      return bonuses;
  }

  //met dans le map des positions de bonus les valeurs issues du tableau de bonus mélangés
  shuffleBonusesPositions(): Map<string, string> {
      let bonuses = this.shuffleBonuses();
      this.bonusPositions.forEach((bonus:string, position:string)=>{
        this.bonusPositions.set(position,bonuses.pop() as string);
      });
      return this.bonusPositions;
  //this.gridService.bonusesPositions = this.bonusesPositions;
  }
}
