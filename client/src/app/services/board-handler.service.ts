import { BOARD_COLUMNS, BOARD_ROWS, CASE_SIZE, INDEX_INVALID, INDEX_REAL_PLAYER, LAST_INDEX } from '@app/classes/constants';
import { MouseButton, TypeMessage } from '@app/classes/enum';
import { GridService } from '@app/services/grid.service';
import { Injectable } from '@angular/core';
import { PlaceLetterService } from '@app/services/place-letter.service';
import { SendMessageService } from '@app/services/send-message.service';
import { SkipTurnService } from '@app/services/skip-turn.service';
import { Vec2 } from '@app/classes/vec2';

@Injectable({
    providedIn: 'root',
})
export class BoardHandlerService {
    currentCase: Vec2 = { x: INDEX_INVALID, y: INDEX_INVALID };
    firstCase: Vec2 = { x: INDEX_INVALID, y: INDEX_INVALID };
    word: string = '';
    placedLetters: boolean[] = [];
    isFirstCasePicked = false;
    isFirstCaseLocked = false;
    orientation = 'h';

    constructor(
        private gridService: GridService,
        private placeLetterService: PlaceLetterService,
        private sendMessageService: SendMessageService,
        private skipTurnService: SkipTurnService,
    ) {}

    buttonDetect(event: KeyboardEvent): void {
        switch (event.key) {
            case 'Backspace': {
                this.removePlacedLetter();
                break;
            }
            case 'Enter': {
                if (this.word.length) {
                    this.confirmPlacement();
                }
                break;
            }
            case 'Escape': {
                this.cancelPlacement();
                break;
            }
            default: {
                if (!this.skipTurnService.isTurn) break;
                if (/([a-zA-Z\u00C0-\u00FF])+/g.test(event.key) && event.key.length === 1) {
                    // Remove accents from the letter to place
                    const letterNoAccents = event.key.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
                    this.placeLetter(letterNoAccents);
                }
                break;
            }
        }
    }

    mouseHitDetect(event: MouseEvent): void {
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

    placeLetter(letter: string): void {
        if (this.isFirstCasePicked && !this.isFirstCaseLocked) {
            // Placing the 1st letter
            if (this.placeLetterService.placeWithKeyboard(this.currentCase, letter, this.orientation, this.word.length, INDEX_REAL_PLAYER)) {
                this.placedLetters[this.word.length] = true;
                this.word += letter;
                this.isFirstCaseLocked = true;
                this.updateCaseDisplay();
            }
        } else if (this.isFirstCaseLocked) {
            // Placing following letters
            this.goToNextCase();
            if (this.placeLetterService.placeWithKeyboard(this.currentCase, letter, this.orientation, this.word.length, INDEX_REAL_PLAYER)) {
                this.placedLetters[this.word.length] = true;
                this.word += letter;
                this.updateCaseDisplay();
            } else {
                this.goToPreviousCase();
            }
        }
    }

    removePlacedLetter(): void {
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
            this.placedLetters = [];
            this.updateCaseDisplay();
        }
    }

    confirmPlacement(): void {
        // Validation of the placement
        if (this.placeLetterService.validateKeyboardPlacement(this.firstCase, this.orientation, this.word, INDEX_REAL_PLAYER)) {
            const column = (this.firstCase.x + 1).toString();
            const row: string = String.fromCharCode(this.firstCase.y + 'a'.charCodeAt(0));
            this.sendMessageService.displayMessageByType('!placer ' + row + column + this.orientation + ' ' + this.word, TypeMessage.Player);
            this.word = '';
            this.placedLetters = [];
            this.isFirstCasePicked = false;
            this.isFirstCaseLocked = false;
            this.gridService.eraseLayer(this.gridService.gridContextPlacementLayer);
        } else {
            this.word = '';
            this.placedLetters = [];
            this.isFirstCasePicked = false;
            this.isFirstCaseLocked = false;
            this.gridService.eraseLayer(this.gridService.gridContextPlacementLayer);
        }
    }

    cancelPlacement(): void {
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
        if (caseSelected.x >= 0 && caseSelected.y >= 0) {
            return this.placeLetterService.scrabbleBoard[caseSelected.y][caseSelected.x] === '';
        }
        return false;
    }

    goToNextCase(): void {
        if (this.orientation === 'h') {
            this.goToNextHorizontalCase();
        } else if (this.orientation === 'v') {
            this.goToNextVerticalCase();
        }
    }

    goToNextHorizontalCase(): void {
        this.currentCase.x++;
        if (this.currentCase.x + 1 > BOARD_COLUMNS) return;
        while (this.placeLetterService.scrabbleBoard[this.currentCase.y][this.currentCase.x] !== '') {
            this.placedLetters[this.word.length] = false;
            this.word += this.placeLetterService.scrabbleBoard[this.currentCase.y][this.currentCase.x];
            this.currentCase.x++;
            if (this.currentCase.x + 1 > BOARD_COLUMNS) return;
        }
    }

    goToNextVerticalCase(): void {
        this.currentCase.y++;
        if (this.currentCase.y + 1 > BOARD_ROWS) return;
        while (this.placeLetterService.scrabbleBoard[this.currentCase.y][this.currentCase.x] !== '') {
            this.placedLetters[this.word.length] = false;
            this.word += this.placeLetterService.scrabbleBoard[this.currentCase.y][this.currentCase.x];
            this.currentCase.y++;
            if (this.currentCase.y + 1 > BOARD_ROWS) return;
        }
    }

    goToPreviousCase(): void {
        if (this.orientation === 'h') {
            this.currentCase.x--;
            while (!this.placedLetters[this.currentCase.x - this.firstCase.x]) {
                this.word = this.word.slice(0, LAST_INDEX);
                this.currentCase.x--;
            }
        } else {
            this.currentCase.y--;
            while (!this.placedLetters[this.currentCase.y - this.firstCase.y]) {
                this.word = this.word.slice(0, LAST_INDEX);
                this.currentCase.y--;
            }
        }
    }

    updateCaseDisplay(): void {
        this.gridService.eraseLayer(this.gridService.gridContextPlacementLayer);
        this.gridService.drawBorder(this.gridService.gridContextPlacementLayer, this.currentCase);
        // Drawing the arrow on the starting case when no letters are placed
        if (!this.isFirstCaseLocked) {
            this.gridService.drawArrow(this.gridService.gridContextPlacementLayer, this.currentCase, this.orientation);
            return;
        }
        // Colored border of the current placement if there is letters placed{
        this.drawPlacementBorder();
        // Only display the arrow on the next empty tile if there is an empty tile in the direction of the orientation
        this.drawArrowOnNextEmpty();
    }

    drawPlacementBorder(): void {
        for (let i = 0; i < this.word.length; i++) {
            if (this.orientation === 'h')
                this.gridService.drawBorder(this.gridService.gridContextPlacementLayer, { x: this.currentCase.x - i, y: this.currentCase.y });
            else if (this.orientation === 'v')
                this.gridService.drawBorder(this.gridService.gridContextPlacementLayer, { x: this.currentCase.x, y: this.currentCase.y - i });
        }
    }

    drawArrowOnNextEmpty(): void {
        const currentArrowIndex: Vec2 = { x: this.currentCase.x, y: this.currentCase.y };
        if (this.orientation === 'h') {
            do {
                currentArrowIndex.x++;
                if (currentArrowIndex.x + 1 > BOARD_COLUMNS) return;
            } while (this.placeLetterService.scrabbleBoard[currentArrowIndex.y][currentArrowIndex.x] !== '');
        }
        if (this.orientation === 'v') {
            do {
                currentArrowIndex.y++;
                if (currentArrowIndex.y + 1 > BOARD_ROWS) return;
            } while (this.placeLetterService.scrabbleBoard[currentArrowIndex.y][currentArrowIndex.x] !== '');
        }
        this.gridService.drawArrow(this.gridService.gridContextPlacementLayer, currentArrowIndex, this.orientation);
    }
}
