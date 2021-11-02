import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { DEFAULT_FONT_SIZE, EASEL_SIZE, INDEX_REAL_PLAYER } from '@app/classes/constants';
import { Letter } from '@app/classes/letter';
import { LetterService } from '@app/services/letter.service';
import { PlayerService } from '@app/services/player.service';
import { SwapLetterService } from '@app/services/swap-letter.service';
import { BoardHandlerService } from '@app/services/board-handler.service';
import { SendMessageService } from '@app/services/send-message.service';
import { ManipulateService } from '@app/services/manipulate.service';
import { SkipTurnService } from '@app/services/skip-turn.service';
import { TypeMessage } from '@app/classes/enum';

@Component({
    selector: 'app-letter-easel',
    templateUrl: './letter-easel.component.html',
    styleUrls: ['./letter-easel.component.scss'],
})
export class LetterEaselComponent implements OnInit {
    @ViewChild('easel') easel: ElementRef;

    letterEaselTab: Letter[] = [];
    fontSize: number = DEFAULT_FONT_SIZE;

    constructor(
        private playerService: PlayerService,
        private letterService: LetterService,
        private swapLetterService: SwapLetterService,
        private boardHandlerService: BoardHandlerService,
        private sendMessageService: SendMessageService,
        private manipulateService: ManipulateService,
        private skipTurnService: SkipTurnService,
    ) {}

    // TODO Changer le font size ne deselect pas ?
    @HostListener('document:click', ['$event'])
    @HostListener('document:contextmenu', ['$event'])
    clickEvent(event: MouseEvent): void {
        if (this.easel.nativeElement.contains(event.target)) return;
        // Disable all easel selections made when a click occurs outside the easel
        for (const letterEasel of this.letterEaselTab) {
            letterEasel.isSelectedForSwap = false;
            letterEasel.isSelectedForManipulation = false;
            this.manipulateService.usedLetters.fill(false, 0, this.manipulateService.usedLetters.length);
        }
        this.manipulateService.enableScrolling();
    }

    @HostListener('keydown', ['$event'])
    onKeyPress(event: KeyboardEvent): void {
        if (this.easel.nativeElement.contains(event.target)) {
            this.manipulateService.onKeyPress(event);
        }
    }

    @HostListener('document:wheel', ['$event'])
    onMouseWheelTick(event: WheelEvent): void {
        if (this.letterEaselTab.some((letter) => letter.isSelectedForManipulation)) {
            this.manipulateService.onMouseWheelTick(event);
        }
    }

    ngOnInit(): void {
        this.playerService.bindUpdateEasel(this.update.bind(this));
        this.update();
        this.manipulateService.sendEasel(this.letterEaselTab);
    }

    onRightClick(event: MouseEvent, indexLetter: number): void {
        event.preventDefault();
        this.handleSwapSelection(indexLetter);
    }

    onLeftClick(event: MouseEvent, indexLetter: number): void {
        event.preventDefault();
        this.manipulateService.selectWithClick(indexLetter);
    }

    onEaselClick(): void {
        this.boardHandlerService.cancelPlacement();
    }

    handleFontSizeEvent(fontSizeEvent: number) {
        this.fontSize = fontSizeEvent;
        this.playerService.updateFontSize(this.fontSize);
    }

    swap(): void {
        let lettersToSwap = '';
        for (let i = 0; i < this.letterEaselTab.length; i++) {
            if (this.letterEaselTab[i].isSelectedForSwap) {
                lettersToSwap += this.letterEaselTab[i].value.toLowerCase();
                this.swapLetterService.swap(i, INDEX_REAL_PLAYER);
            }
        }
        // Display the respective message into the chatBox and pass the turn
        const message = this.playerService.players[INDEX_REAL_PLAYER].name + ' : !échanger ' + lettersToSwap;
        this.sendMessageService.displayMessageByType(message, TypeMessage.Player);
        this.skipTurnService.switchTurn();
    }

    cancelSelection(): void {
        for (const letter of this.letterEaselTab) {
            letter.isSelectedForSwap = false;
            letter.isSelectedForManipulation = false;
        }
    }

    isSwapButtonActive(): boolean {
        let isButtonActive = false;
        // Deactivated if it is not your turn
        if (!this.skipTurnService.isTurn) {
            return isButtonActive;
        }
        // Deactivated if there's less than 7 letters in the reserve
        if (this.letterService.reserveSize < EASEL_SIZE) {
            return isButtonActive;
        }
        // Activated if at least one letter is selected to swap
        for (const letter of this.letterEaselTab) {
            if (letter.isSelectedForSwap) {
                isButtonActive = true;
            }
        }
        return isButtonActive;
    }

    isCancelButtonActive(): boolean {
        // Activated if at least one letter is selected to swap or to manipulate
        for (const letter of this.letterEaselTab) {
            if (letter.isSelectedForSwap || letter.isSelectedForManipulation) return true;
        }
        return false;
    }

    private update(): void {
        this.letterEaselTab = this.playerService.getEasel(INDEX_REAL_PLAYER);
    }

    private handleSwapSelection(indexLetter: number): void {
        // Unselect swap
        if (this.letterEaselTab[indexLetter].isSelectedForSwap) {
            this.letterEaselTab[indexLetter].isSelectedForSwap = false;
        }
        // Do not select to swap if the letter is already selected for manipulation
        else if (this.letterEaselTab[indexLetter].isSelectedForManipulation) {
            this.letterEaselTab[indexLetter].isSelectedForSwap = false;
        } else {
            this.letterEaselTab[indexLetter].isSelectedForSwap = true;
        }
    }
}
