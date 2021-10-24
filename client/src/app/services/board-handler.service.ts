import { Injectable } from '@angular/core';
import { CASE_SIZE, INDEX_INVALID, INDEX_REAL_PLAYER, MouseButton, LAST_INDEX } from '@app/classes/constants';
import { Vec2 } from '@app/classes/vec2';
import { GridService } from './grid.service';
import { PlaceLetterService } from './place-letter.service';
import { PlayerService } from './player.service';
import { PassTourService } from './pass-tour.service';
import { TourService } from './tour.service';
import { SendMessageService } from './send-message.service';

@Injectable({
    providedIn: 'root',
})
export class BoardHandlerService {
    currentCase: Vec2 = { x: INDEX_INVALID, y: INDEX_INVALID };
    firstCase: Vec2 = { x: INDEX_INVALID, y: INDEX_INVALID };
    word: string = '';

    isFirstCasePicked = false;
    isFirstCaseLocked = false;
    orientation = 'h';

    constructor(
        private gridService: GridService,
        private placeLetterService: PlaceLetterService,
        private playerService: PlayerService,
        private passTurnService: PassTourService,
        private turnService: TourService,
        private sendMessageService: SendMessageService,
    ) {}

    buttonDetect(event: KeyboardEvent) {
        switch (event.key) {
            case 'Backspace': {
                this.removePlacedLetter();
                break;
            }
            case 'Enter': {
                if (this.word.length > 0) {
                    this.confirmPlacement();
                }
                break;
            }
            case 'Escape': {
                this.cancelPlacement();
                break;
            }
            default: {
                if (!this.turnService.getTour()) break;
                if (/([a-zA-Z\u00C0-\u00FF])+/g.test(event.key) && event.key.length === 1) {
                    // Remove accents from the letter to place
                    const letterNoAccents = event.key.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
                    this.placeLetter(letterNoAccents);
                }
                break;
            }
        }
    }

    mouseHitDetect(event: MouseEvent) {
        if (event.button === MouseButton.Left) {
            if (this.isFirstCaseLocked) return;
            const caseClicked: Vec2 = this.calculateFirstCasePosition(event);
            if (!this.isCasePositionValid(caseClicked)) return;

            // If the click is on the same case, it will change the orientation
            if (this.areCasePositionsEqual(this.currentCase, caseClicked)) {
                this.switchOrientation();
                // If the click is on a different case, it will select this case as the new starting case
            } else {
                this.selectStartingCase(caseClicked);
            }
        }
    }

    placeLetter(letter: string) {
        if (this.isFirstCasePicked && !this.isFirstCaseLocked) {
            // Placing the 1st letter
            if (this.placeLetterService.placeWithKeyboard(this.currentCase, letter, this.orientation, this.word.length, INDEX_REAL_PLAYER)) {
                this.word += letter;
                this.isFirstCaseLocked = true;
            }
        } else if (this.isFirstCaseLocked) {
            // Placing following letters
            this.goToNextCase();
            if (this.placeLetterService.placeWithKeyboard(this.currentCase, letter, this.orientation, this.word.length, INDEX_REAL_PLAYER)) {
                this.word += letter;
                this.updateCaseDisplay();
            } else {
                this.goToPreviousCase();
            }
        }
    }

    removePlacedLetter() {
        const letterToRemove = this.word[this.word.length - 1];
        // Verify that letterToRemove isn't undefined
        if (letterToRemove) {
            this.word = this.word.slice(0, LAST_INDEX);
            this.placeLetterService.removePlacedLetter(this.currentCase, letterToRemove, INDEX_REAL_PLAYER);
        }
        // If there's still at least one letter to remove
        if (this.word.length) {
            this.goToPreviousCase();
            this.updateCaseDisplay();
        }
        // All the letters placed were removed
        else {
            // We can now select a new starting case
            this.isFirstCaseLocked = false;
        }
    }

    confirmPlacement() {
        // Validation of the placement
        if (this.placeLetterService.validateKeyboardPlacement(this.firstCase, this.orientation, this.word, INDEX_REAL_PLAYER)) {
            this.gridService.eraseLayer(this.gridService.gridContextPlacementLayer);
            const column = (this.firstCase.x + 1).toString();
            const row: string = String.fromCharCode(this.firstCase.y + 'a'.charCodeAt(0));
            this.sendMessageService.displayMessageByType('!placer ' + row + column + this.orientation + ' ' + this.word, 'player');
            this.word = '';
            this.isFirstCasePicked = false;
            this.isFirstCaseLocked = false;
        } else {
            this.gridService.eraseLayer(this.gridService.gridContextPlacementLayer);
            this.sendMessageService.displayMessageByType('ERREUR : Le placement est invalide', 'error');
            this.word = '';
            this.isFirstCasePicked = false;
            this.isFirstCaseLocked = false;
        }
        this.passTurnService.writeMessage();
    }

    cancelPlacement() {
        while (this.word.length) {
            this.removePlacedLetter();
        }
        this.gridService.eraseLayer(this.gridService.gridContextPlacementLayer);
        this.currentCase.x = INDEX_INVALID;
        this.currentCase.y = INDEX_INVALID;
        this.isFirstCasePicked = false;
    }

    selectStartingCase(caseClicked: Vec2): void {
        this.currentCase = { x: caseClicked.x, y: caseClicked.y };
        this.firstCase = { x: caseClicked.x, y: caseClicked.y };
        this.isFirstCasePicked = true;
        this.orientation = 'h';
        this.updateCaseDisplay();
    }

    switchOrientation(): void {
        this.orientation = this.orientation === 'h' ? 'v' : 'h'; // Change orientation when clicked
        this.updateCaseDisplay();
    }

    calculateFirstCasePosition(event: MouseEvent): Vec2 {
        const currentCase: Vec2 = { x: 0, y: 0 };
        currentCase.x = Math.floor((event.offsetX - CASE_SIZE) / CASE_SIZE);
        currentCase.y = Math.floor((event.offsetY - CASE_SIZE) / CASE_SIZE);
        return currentCase;
    }

    areCasePositionsEqual(case1: Vec2, case2: Vec2): boolean {
        return case1.x === case2.x && case1.y === case2.y;
    }

    isCasePositionValid(caseSelected: Vec2): boolean {
        return caseSelected.x >= 0 && caseSelected.y >= 0;
    }

    goToNextCase(): void {
        if (this.orientation === 'h') {
            this.currentCase.x++;
        } else {
            this.currentCase.y++;
        }
    }

    goToPreviousCase() {
        if (this.orientation === 'h') {
            this.currentCase.x--;
        } else {
            this.currentCase.y--;
        }
    }

    updateCaseDisplay() {
        this.gridService.eraseLayer(this.gridService.gridContextPlacementLayer);
        this.gridService.drawBorder(this.gridService.gridContextPlacementLayer, this.currentCase.x, this.currentCase.y);
        // Colored border of the current placement
        if (this.isFirstCaseLocked) {
            for (let i = 0; i < this.word.length; i++) {
                if (this.orientation === 'h')
                    this.gridService.drawBorder(this.gridService.gridContextPlacementLayer, this.currentCase.x - i, this.currentCase.y);
                else if (this.orientation === 'v')
                    this.gridService.drawBorder(this.gridService.gridContextPlacementLayer, this.currentCase.x, this.currentCase.y - i);
            }
        }
        // Only display the arrow if there is an empty tile in the direction of the orientation
        if (
            (this.orientation === 'h' && this.playerService.scrabbleBoard[this.currentCase.y][this.currentCase.x + 1] === '') ||
            (this.orientation === 'v' && this.playerService.scrabbleBoard[this.currentCase.y + 1][this.currentCase.x] === '')
        ) {
            this.gridService.drawArrow(this.gridService.gridContextPlacementLayer, this.currentCase.x, this.currentCase.y, this.orientation);
        }
    }
}
