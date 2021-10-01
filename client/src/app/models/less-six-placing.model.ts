/* eslint-disable @typescript-eslint/no-magic-numbers */
/* eslint-disable @typescript-eslint/prefer-for-of */
// import { BOARD_COLUMNS, BOARD_ROWS, CENTRAL_CASE_POSX, CENTRAL_CASE_POSY, dictionary } from '@app/classes/constants';
// import { Letter } from '@app/classes/letter';
// import { Vec2 } from '@app/classes/vec2';
// import { PlayerIAComponent } from '@app/modules/game-view/components/player-ia/player-ia.component';
// import { PlaceLetters } from './place-letter-strategy.model';
// import { PlayerIA } from './player-ia.model';
// export class LessSix extends PlaceLetters {
//     execute(player: PlayerIA, context: PlayerIAComponent): void {
//         // get the player's hand to generate a pattern containing
//         // only player's disponible letters
//         let pattern: string = this.pattern(player.letterTable);
//         let randomX: number = CENTRAL_CASE_POSX;
//         let randomY: number = CENTRAL_CASE_POSY;

//         if (!context.isFirstRound) {
//             do {
//                 randomX = new Date().getTime() % BOARD_COLUMNS;
//                 randomY = new Date().getTime() % BOARD_ROWS;
//             } while (context.scrabbleBoard[randomX][randomY] === '');
//             // get the player's hand to generate a pattern containing
//             // a character already on the scrabbleBoard + player's disponible letters (only)
//             pattern = this.pattern(player.letterTable, context.scrabbleBoard[randomX][randomY]);
//         }

//         debugger;
//         // generate all possibilities matching the pattern
//         const allPossibleWord: string[] = this.generateAllPossibilities(pattern);
//         // remove those who nb(char(x)) > nb(char(x of player's hand))
//         const possibleWord: string[] = this.generatePossibilities(allPossibleWord, player);
//         // Choose within the possibilities
//         this.choosePossibility(possibleWord, context, { x: randomX, y: randomY });
//     }

//     choosePossibility(possibleWord: string[], context: PlayerIAComponent, startPos: Vec2): void {
//         const MAX_POINTING = 6;
//         const randomPointing = new Date().getTime() % MAX_POINTING;
//         const randomOrientation: string = ['h', 'v'][new Date().getTime() % ['h', 'v'].length];
//         let randomPointingFound = false;
//         let alternativePointingFound = false;
//         const priorityPossibilities: string[] = [];
//         const alternativePossibilities: string[] = [];

//         // Whitin all the possible words separate those who matches this turn randomPointing
//         // from those who doesn't matches the randomPointing but are in range min < x < max
//         for (let i = 0; i < possibleWord.length; i++) {
//             const nbPt = this.calculatePoint(startPos, randomOrientation, possibleWord[i], context.scrabbleBoard);
//             if (nbPt === randomPointing) {
//                 randomPointingFound = true;
//                 priorityPossibilities.push(possibleWord[i]);
//             } else if (nbPt < MAX_POINTING && nbPt > 0) {
//                 alternativePointingFound = true;
//                 alternativePossibilities.push(possibleWord[i]);
//             }
//         }
//         debugger;

//         // If a word matching this turn randomPointing is found place it on the scrabble board
//         if (randomPointingFound) {
//             context.place({
//                 start: startPos,
//                 orientation: randomOrientation,
//                 word: priorityPossibilities[new Date().getTime() % priorityPossibilities.length],
//             });
//             // set le score du joueur
//         }
//         // If there isn't word matching this turn randomPointing but exists alternatives place it as well
//         else if (!randomPointingFound && alternativePointingFound) {
//             context.place({
//                 start: startPos,
//                 orientation: randomOrientation,
//                 word: alternativePossibilities[new Date().getTime() % alternativePossibilities.length],
//             });
//             // set le score du joueur
//         }
//         // If there isn't word matching this turn randomPointing & existing alternatives skip the turn
//         else if (!randomPointingFound && !alternativePointingFound) {
//             context.skip();
//         }
//     }

//     pattern(letterTable: Letter[], startingChar = ''): string {
//         let pattern = '^[';

//         if (startingChar !== '') {
//             pattern = '^[' + startingChar + '][';
//         }

//         for (let i = 0; i < letterTable.length; i++) {
//             pattern += letterTable[i].value;
//         }
//         pattern += ']+$';

//         return pattern;
//     }

//     generateAllPossibilities(pattern: string): string[] {
//         const allPossibleWord: string[] = [];
//         const re = new RegExp(pattern, 'igm');
//         for (let i = 0; i < dictionary.length; i++) {
//             // test all word and retain those who satisfies the pattern
//             if (re.test(dictionary[i])) {
//                 allPossibleWord.push(dictionary[i]);
//             }
//         }
//         return allPossibleWord;
//     }

//     generatePossibilities(allPossibleWord: string[], player: PlayerIA): string[] {
//         const possibleWord: string[] = [];
//         // Into all possible word...
//         for (let i = 0; i < allPossibleWord.length; i++) {
//             const word = allPossibleWord[i];
//             let isValidWord = true;
//             // ...pick those who letter's quantity matches the player letter quantity
//             for (let j = 0; j < word.length; j++) {
//                 const re = new RegExp(word[j], 'g');
//                 const count: number = (word.match(re) || []).length;

//                 if (count > this.playerQuantityOf(word[j], player)) {
//                     isValidWord = false;
//                     break;
//                 }
//             }

//             if (isValidWord) {
//                 possibleWord.push(word);
//             }
//         }
//         return possibleWord;
//     }

//     playerQuantityOf(letter: string, player: PlayerIA): number {
//         let quantity = 0;

//         for (let i = 0; i < player.letterTable.length; i++) {
//             if (player.letterTable[i].value === letter) {
//                 quantity++;
//             }
//         }
//         return quantity;
//     }
// }
