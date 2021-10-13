import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { DEFAULT_FONT_SIZE, EASEL_SIZE, INDEX_REAL_PLAYER } from '@app/classes/constants';
import { Letter } from '@app/classes/letter';
import { LetterService } from '@app/services/letter.service';
import { PlayerService } from '@app/services/player.service';
import { SwapLetterService } from '@app/services/swap-letter.service';
import { TourService } from '@app/services/tour.service';
import { ChatboxService } from '@app/services/chatbox.service';

@Component({
    selector: 'app-letter-easel',
    templateUrl: './letter-easel.component.html',
    styleUrls: ['./letter-easel.component.scss'],
})
export class LetterEaselComponent implements OnInit {
    @ViewChild('easelContainer') easelContainer: ElementRef;

    letterEaselTab: Letter[] = [];
    fontSize: number = DEFAULT_FONT_SIZE;

    constructor(
        private playerService: PlayerService,
        private turnService: TourService,
        private letterService: LetterService,
        private swapLetterService: SwapLetterService,
        private chatBoxService: ChatboxService,
    ) {}

    // Disable all selections made when a click occurs outside the easel
    // TODO Changer le font size ne deselect pas ?
    @HostListener('document:click', ['$event'])
    clickOut(event: MouseEvent) {
        if (!this.easelContainer.nativeElement.contains(event.target)) {
            for (let i = 0; i < EASEL_SIZE; i++) {
                this.letterEaselTab[i].isSelectedForSwap = false;
                this.letterEaselTab[i].isSelectedForManipulation = false;
            }
        }
    }

    ngOnInit(): void {
        this.playerService.updateLettersEasel(this.update.bind(this));
        this.update();
    }

    update(): void {
        this.letterEaselTab = this.playerService.getLettersEasel(INDEX_REAL_PLAYER);
    }

    onRightClick(event: MouseEvent, indexLetter: number) {
        event.preventDefault();
        this.handleSwapSelection(indexLetter);
    }

    onLeftClick(event: MouseEvent, indexLetter: number) {
        event.preventDefault();
        this.handleManipulationSelection(indexLetter);
    }

    handleSwapSelection(indexLetter: number) {
        // Unselect swap
        if (this.letterEaselTab[indexLetter].isSelectedForSwap) {
            this.letterEaselTab[indexLetter].isSelectedForSwap = false;
        } // Select to swap if the letter isn't selected for swap or manipulation
        else if (!this.letterEaselTab[indexLetter].isSelectedForManipulation) {
            this.letterEaselTab[indexLetter].isSelectedForSwap = true;
        }
    }

    handleManipulationSelection(indexLetter: number) {
        // Unselect manipulation
        if (this.letterEaselTab[indexLetter].isSelectedForManipulation) {
            this.letterEaselTab[indexLetter].isSelectedForManipulation = false;
        } // Select to manipulate if the letter isn't selected for swap or manipulation
        else if (!this.letterEaselTab[indexLetter].isSelectedForSwap) {
            this.letterEaselTab[indexLetter].isSelectedForManipulation = true;
        }
    }

    handleFontSizeEvent(fontSizeEvent: number) {
        this.fontSize = fontSizeEvent;
        this.playerService.updateFontSize(this.fontSize);
    }

    swap() {
        let lettersToSwap = '';
        for (let i = 0; i < EASEL_SIZE; i++) {
            if (this.letterEaselTab[i].isSelectedForSwap) {
                lettersToSwap += this.letterEaselTab[i].value.toLowerCase();
                this.swapLetterService.swap(i, INDEX_REAL_PLAYER);
                i--; // Update the current index after a swap because we removed a letter from easel
                // this.letterEaselTab[i].isSelectedForSwap = false; BUUUUUUG
            }
        }
        // Display the respective message into the chatBox
        const message = this.playerService.getPlayers()[INDEX_REAL_PLAYER].name + ' : !échanger ' + lettersToSwap;
        this.chatBoxService.displayMessageByType(message, 'player');
    }

    cancelSelection() {
        for (const letter of this.letterEaselTab) {
            letter.isSelectedForSwap = false;
            letter.isSelectedForManipulation = false;
        }
    }

    isSwapButtonActive(): boolean {
        let isButtonActive = false;
        // Desactivated if it is not your turn
        if (!this.turnService.getTour()) {
            return isButtonActive;
        }
        // Desactivated if there's less than 7 letters in the reserve
        if (this.letterService.getReserveSize() < EASEL_SIZE) {
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

    isCancelButtonActive() {
        // Activated if at least one letter is selected to swap or to manipulate
        for (const letter of this.letterEaselTab) {
            if (letter.isSelectedForSwap || letter.isSelectedForManipulation) {
                return true;
            }
        }
        return false;
    }
}
