import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatAccordion } from '@angular/material/expansion';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ERROR_MESSAGE_DELAY } from '@app/classes/constants';
import { JoinDialogComponent } from '@app/modules/initialize-solo-game/join-dialog/join-dialog.component';
import { CommunicationService } from '@app/services/communication.service';
import { AiPlayer, AiPlayerDB } from '@common/ai-name';

interface Dictionnary {
    name: string;
    description: string;
    isDefault: boolean;
}

@Component({
    selector: 'app-admin-page',
    templateUrl: './admin-page.component.html',
    styleUrls: ['./admin-page.component.scss'],
})
export class AdminPageComponent implements OnInit {
    @ViewChild(MatAccordion) accordion: MatAccordion;

    dictionaries: Dictionnary[] = [
        { name: 'Dico #1', description: 'Dictionnaire par défaut', isDefault: true },
        { name: 'Dico #2', description: 'blabla blablabla #2', isDefault: false },
        { name: 'Dico #3', description: 'blabla blablabla #3', isDefault: false },
        { name: 'Dico #4', description: 'blabla blablabla #4', isDefault: false },
    ];
    beginnerNames: AiPlayerDB[];
    expertNames: AiPlayerDB[];
    isInDatabase: boolean;
    constructor(private communicationService: CommunicationService, public dialog: MatDialog, public snackBar: MatSnackBar) {}

    ngOnInit() {
        this.communicationService.getAiBeginners().subscribe(
            (aiBeginners: AiPlayerDB[]) => (this.beginnerNames = aiBeginners),
            (error: HttpErrorResponse) => this.handleRequestError(error),
        );
        this.communicationService.getAiExperts().subscribe(
            (aiExperts: AiPlayerDB[]) => (this.expertNames = aiExperts),
            (error: HttpErrorResponse) => this.handleRequestError(error),
        );
    }

    deleteAiPlayer(id: string, isBeginner: boolean, isDefault: boolean): void {
        if (isDefault) {
            this.displayMessage('Vous ne pouvez pas supprimer un joueur par défaut!');
            return;
        }
        if (isBeginner) {
            // JUSTIFICATION :
            // eslint-disable-next-line no-underscore-dangle
            this.beginnerNames.find((aiPlayer) => aiPlayer._id === id);
            this.communicationService.deleteAiBeginner(id).subscribe(
                (aiBeginners) => {
                    this.beginnerNames = aiBeginners;
                    this.displayMessage('Joueur supprimé');
                },
                (error: HttpErrorResponse) => {
                    this.displayMessage(`Le joueur n'a pas été supprimé, erreur : ${error.message}`);
                },
            );
        } else {
            this.communicationService.deleteAiExpert(id).subscribe(
                (aiExperts) => {
                    this.expertNames = aiExperts;
                    this.displayMessage('Joueur supprimé');
                },
                (error: HttpErrorResponse) => {
                    this.displayMessage(`Le joueur n'a pas été supprimé, erreur : ${error.message}`);
                },
            );
        }
    }

    // TODO n'affiche pas forcement les joueurs ajoutes dans le bon ordre
    addAiToDatabase(isBeginner: boolean, isNewAi: boolean, id: string = '', isDefault = false): void {
        if (isDefault) {
            this.displayMessage('Vous ne pouvez pas modifier un joueur par défaut!');
            return;
        }
        const nameDialog = this.dialog.open(JoinDialogComponent, { disableClose: true });
        nameDialog.afterClosed().subscribe((playerName: string) => {
            if (playerName == null) return;

            if (this.checkIfAlreadyExists(playerName)) {
                this.displayMessage('Ce nom de joueur virtuel est déjà dans la base de données. Veuillez réessayer.');
                return;
            }
            const aiPlayer: AiPlayer = {
                aiName: playerName,
                isDefault: false,
            };

            if (isNewAi) {
                this.addAiPlayer(aiPlayer, isBeginner);
            } else {
                this.updateAiPlayer(id, playerName, isBeginner);
            }
        });
    }

    private addAiPlayer(aiPlayer: AiPlayer, isBeginner: boolean): void {
        if (isBeginner) {
            this.communicationService.addAiBeginner(aiPlayer).subscribe(
                (aiBeginner) => {
                    this.beginnerNames.push(aiBeginner);
                    this.displayMessage('Joueur ajouté');
                },
                (error: HttpErrorResponse) => {
                    this.displayMessage(`Le joueur n'a pas été ajouté, erreur : ${error.message}`);
                },
            );
        } else {
            this.communicationService.addAiExpert(aiPlayer).subscribe(
                (aiExpert) => {
                    this.expertNames.push(aiExpert);
                    this.displayMessage('Joueur ajouté');
                },
                (error: HttpErrorResponse) => {
                    this.displayMessage(`Le joueur n'a pas été ajouté, erreur : ${error.message}`);
                },
            );
        }
    }

    private updateAiPlayer(id: string, playerName: string, isBeginner: boolean): void {
        if (isBeginner) {
            this.communicationService.updateAiBeginner(id, playerName).subscribe(
                (aiBeginners) => {
                    this.beginnerNames = aiBeginners;
                    this.displayMessage('Joueur modifié');
                },
                (error: HttpErrorResponse) => {
                    this.displayMessage(`Le joueur n'a pas été modifié, erreur : ${error.message}`);
                },
            );
        } else {
            this.communicationService.updateAiExpert(id, playerName).subscribe(
                (aiExperts) => {
                    this.expertNames = aiExperts;
                    this.displayMessage('Joueur modifié');
                },
                (error: HttpErrorResponse) => {
                    this.displayMessage(`Le joueur n'a pas été modifié, erreur : ${error.message}`);
                },
            );
        }
    }

    private checkIfAlreadyExists(aiPlayerName: string): boolean {
        const aiBeginner = this.beginnerNames.find((aiBeginnerPlayer) => aiBeginnerPlayer.aiName === aiPlayerName);
        const aiExpert = this.expertNames.find((aiExpertPlayer) => aiExpertPlayer.aiName === aiPlayerName);

        return aiBeginner !== undefined || aiExpert !== undefined;
    }

    private displayMessage(message: string): void {
        this.snackBar.open(message, 'OK', {
            duration: ERROR_MESSAGE_DELAY,
            horizontalPosition: 'center',
            verticalPosition: 'top',
        });
    }

    private handleRequestError(error: HttpErrorResponse): void {
        this.displayMessage(`Nous n'avons pas pu accéder au serveur, erreur : ${error.message}`);
    }
}
