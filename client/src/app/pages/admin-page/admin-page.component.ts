import { HttpErrorResponse } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatAccordion } from '@angular/material/expansion';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ERROR_MESSAGE_DELAY, THREE_SECONDS_DELAY } from '@app/classes/constants';
import { JoinDialogComponent } from '@app/modules/initialize-solo-game/join-dialog/join-dialog.component';
import { CommunicationService } from '@app/services/communication.service';
import { AiPlayer, AiPlayerDB } from '@common/ai-name';
import dictionarySchema from '@common/dictionarySchema.json';
import { Dictionary } from '@app/classes/dictionary';
import Ajv from 'ajv';

@Component({
    selector: 'app-admin-page',
    templateUrl: './admin-page.component.html',
    styleUrls: ['./admin-page.component.scss'],
})
export class AdminPageComponent implements OnInit {
    @ViewChild(MatAccordion) accordion: MatAccordion;
    @ViewChild('fileInput') fileInput: ElementRef;

    file: File | null;
    dictionary: Dictionary;
    uploadMessage: string;
    ajv = new Ajv();

    dictionaries: Dictionary[] = [
        { title: 'Dico #1', description: 'Dictionnaire par défaut', isDefault: true },
        { title: 'Dico #2', description: 'blabla blablabla #2', isDefault: false },
        { title: 'Dico #3', description: 'blabla blablabla #3', isDefault: false },
        { title: 'Dico #4', description: 'blabla blablabla #4', isDefault: false },
    ];
    beginnerNames: AiPlayerDB[];
    expertNames: AiPlayerDB[];
    constructor(private communicationService: CommunicationService, public dialog: MatDialog, public snackBar: MatSnackBar) {
        this.file = null;
        this.uploadMessage = '';
    }

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
            // TODO: JUSTIFICATION :
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

    onFileInput(files: FileList | null): void {
        if (files) {
            this.file = files.item(0);
        }
    }

    async onSubmit() {
        if (await this.isDictionaryValid()) {
            this.addDictionary();
        } else {
            this.displayUploadMessage("Le fichier n'est pas un dictionnaire");
        }
    }

    async isDictionaryValid(): Promise<boolean> {
        return new Promise((resolve) => {
            const reader = new FileReader();
            if (this.file) {
                // If the file is not a JSON
                if (this.file.type !== 'application/json') {
                    resolve(false);
                    return;
                }
                reader.readAsText(this.file);
            }
            reader.onloadend = () => {
                // Validate the dictionary with a schema
                if (typeof reader.result === 'string') this.dictionary = JSON.parse(reader.result);
                resolve(this.ajv.validate(dictionarySchema, this.dictionary));
            };
        });
    }

    async addDictionary() {
        if (this.isNameUsed()) {
            this.displayUploadMessage('Il existe déjà un dictionnaire portant le même nom');
            return;
        }
        this.dictionaries.push({
            title: this.dictionary.title,
            description: this.dictionary.description,
            isDefault: false,
        });
        let serverMessage;
        if (this.file) {
            serverMessage = await this.communicationService.uploadFile(this.file).toPromise();
            this.displayUploadMessage(serverMessage);
        }
    }

    isNameUsed(): boolean {
        for (const dictionary of this.dictionaries) {
            if (this.dictionary.title === dictionary.title) return true;
        }
        return false;
    }

    displayUploadMessage(uploadMessage: string) {
        if (this.uploadMessage.length) return; // There is already a message occuring
        this.uploadMessage = uploadMessage;
        this.file = null;
        this.fileInput.nativeElement.value = '';
        setTimeout(() => {
            this.uploadMessage = '';
        }, THREE_SECONDS_DELAY);
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
                this.upDateAiPlayer(id, aiPlayer, isBeginner);
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

    private upDateAiPlayer(id: string, aiPlayer: AiPlayer, isBeginner: boolean): void {
        if (isBeginner) {
            this.communicationService.updateAiBeginner(id, aiPlayer).subscribe(
                (aiBeginners) => {
                    this.beginnerNames = aiBeginners;
                    this.displayMessage('Joueur modifié');
                },
                (error: HttpErrorResponse) => {
                    this.displayMessage(`Le joueur n'a pas été modifié, erreur : ${error.message}`);
                },
            );
        } else {
            this.communicationService.updateAiExpert(id, aiPlayer).subscribe(
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
