import { Injectable } from '@angular/core';
import { EASEL_SIZE } from '@app/classes/constants';
import { Letter } from '@app/classes/letter';
import { LetterService } from './letter.service';

@Injectable({
  providedIn: 'root'
})
export class LetterEaselService {   //https://stackoverflow.com/questions/40788458/how-to-call-component-method-from-service-angular2

  letters: Array<Letter> = new Array<Letter>();

  constructor(private letterService: LetterService) {
    for (let i = 0; i < EASEL_SIZE; i++) {
      this.letters[i] = this.letterService.getRandomLetter();
    }
  }

  private myFunc: () => void;
  updateLettersEasel(fn: () => void) {
    this.myFunc = fn;
    // from now on, call myFunc wherever you want inside this service
  }

  getAll(): Array<Letter> {
    return this.letters;
  }

  removeLetter(letterToRemove: string): void {   // Enlève une lettre du chevalet

    for (let i = 0; i < this.letters.length; i++) {
      if (this.letters[i].value === letterToRemove.toUpperCase()) {
        this.letters.splice(i, 1);
        this.myFunc();
        break;
      }
    }
  }

  refillEasel(): void {
    let letterToInsert: Letter;
    for (let i = this.letters.length; i < EASEL_SIZE; i++) {
      letterToInsert = this.letterService.getRandomLetter();
      if (letterToInsert.value === '') {
        break;
      }
      this.letters[i] = letterToInsert;
    }
    this.myFunc();
  }

}
