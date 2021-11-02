import { Component } from '@angular/core';
import { EndGameService } from '@app/services/end-game.service';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
    selector: 'app-give-up-game-dialog',
    templateUrl: './give-up-game-dialog.component.html',
    styleUrls: ['./give-up-game-dialog.component.scss'],
})
export class GiveUpGameDialogComponent {
    constructor(public giveUpDialogref: MatDialogRef<GiveUpGameDialogComponent>, public router: Router, public endGameService: EndGameService) {}

    stayInGame() {
        this.giveUpDialogref.close(null);
    }
    exitGame() {
        this.giveUpDialogref.close(true);
        this.endGameService.clearAllData();
        this.router.navigate(['home']);
    }
}
