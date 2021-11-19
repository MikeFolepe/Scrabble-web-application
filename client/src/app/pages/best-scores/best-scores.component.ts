// import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { CommunicationService } from '@app/services/communication.service';
// import { MatSnackBar } from '@angular/material/snack-bar';
// import { ERROR_MESSAGE_DELAY } from '@app/classes/constants';
import { PlayerScore } from '@common/player';

@Component({
    selector: 'app-best-scores',
    templateUrl: './best-scores.component.html',
    styleUrls: ['./best-scores.component.scss'],
})
export class BestScoresComponent implements OnInit {
    players: PlayerScore[];
    constructor(private communicationService: CommunicationService /* , public snackBar: MatSnackBar*/) {}

    ngOnInit(): void {
        this.communicationService.getBestPlayers().subscribe(
            (player: PlayerScore[]) => (this.players = player),
            // (error: HttpErrorResponse) => this.handleRequestError(error),
        );
    }

    // private displayMessage(message: string): void {
    //     this.snackBar.open(message, 'OK', {
    //         duration: ERROR_MESSAGE_DELAY,
    //         horizontalPosition: 'center',
    //         verticalPosition: 'top',
    //     });
    // }

    // private handleRequestError(error: HttpErrorResponse): void {
    //     this.displayMessage(`Nous n'avons pas pu accéder au serveur, erreur : ${error.message}`);
    // }
}
