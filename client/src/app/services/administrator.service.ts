import { HttpErrorResponse } from '@angular/common/http';
import { ElementRef, Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ERROR_MESSAGE_DELAY, THREE_SECONDS_DELAY } from '@app/classes/constants';
import { JoinDialogComponent } from '@app/modules/initialize-solo-game/join-dialog/join-dialog.component';
import { CommunicationService } from '@app/services/communication.service';
import { AiPlayer, AiPlayerDB, AiType } from '@common/ai-name';
import { Dictionary } from '@common/dictionary';
import dictionarySchema from '@common/dictionarySchema.json';
import Ajv from 'ajv';

@Injectable({
    providedIn: 'root',
})
export class AdministratorService {
    beginnerNames: AiPlayerDB[];
    expertNames: AiPlayerDB[];
    dictionaries: Dictionary[] = [];
    currentDictionary: Dictionary;
    fileInput: ElementRef;
    file: File | null;
    uploadMessage: string;
    ajv = new Ajv();

    constructor(private communicationService: CommunicationService, public snackBar: MatSnackBar, public dialog: MatDialog) {
        this.file = null;
        this.uploadMessage = '';
    }

    initializeAiPlayers(): void {
        this.communicationService.getAiPlayers(AiType.beginner).subscribe(
            (aiBeginners: AiPlayerDB[]) => {
                this.beginnerNames = aiBeginners;
            },
            (error: HttpErrorResponse) => this.handleRequestError(error),
        );

        this.communicationService.getAiPlayers(AiType.expert).subscribe(
            (aiExperts: AiPlayerDB[]) => {
                this.expertNames = aiExperts;
            },
            (error: HttpErrorResponse) => this.handleRequestError(error),
        );
    }

    initializeDictionaries(): void {
        this.communicationService.getDictionaries().subscribe((dictionariesServer: Dictionary[]) => {
            this.dictionaries = dictionariesServer;
        });
    }

    addAiToDatabase(aiType: AiType, isNewAi: boolean, id: string = '', isDefault = false): void {
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
                this.addAiPlayer(aiPlayer, aiType);
            } else {
                this.upDateAiPlayer(id, aiPlayer, aiType);
            }
        });
    }

    deleteAiPlayer(aiPlayer: AiPlayerDB, aiType: AiType): void {
        if (aiPlayer.isDefault) {
            this.displayMessage('Vous ne pouvez pas supprimer un joueur par défaut!');
            return;
        }
        // JUSTIFICATION: Useful to make a direct correspondence with the _id in the database
        // eslint-disable-next-line no-underscore-dangle
        this.communicationService.deleteAiPlayer(aiPlayer._id, aiType).subscribe(
            (aiPlayers: AiPlayerDB[]) => {
                if (aiType) {
                    this.expertNames = aiPlayers;
                } else {
                    this.beginnerNames = aiPlayers;
                }
                this.displayMessage('Joueur supprimé');
            },
            (error: HttpErrorResponse) => {
                this.displayMessage(`Le joueur n'a pas été supprimé, erreur : ${error.message}`);
            },
        );
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
                if (typeof reader.result === 'string') this.currentDictionary = JSON.parse(reader.result);
                resolve(this.ajv.validate(dictionarySchema, this.currentDictionary));
            };
        });
    }

    async addDictionary() {
        if (this.isDictionaryNameUsed()) {
            this.displayUploadMessage('Il existe déjà un dictionnaire portant le même nom');
            return;
        }
        this.dictionaries.push({
            fileName: this.file?.name as string,
            title: this.currentDictionary.title,
            description: this.currentDictionary.description,
            isDefault: false,
        });
        let serverMessage;
        if (this.file) {
            serverMessage = await this.communicationService.uploadFile(this.file).toPromise();
            this.displayUploadMessage(serverMessage);
        }
    }

    // updateDictionary(dictionary: Dictionary): void {}

    deleteDictionary(dictionary: Dictionary): void {
        if (dictionary.isDefault) {
            this.displayMessage('Vous ne pouvez pas supprimer le dictionnaire par défaut');
            return;
        }
        this.communicationService.deleteDictionary(dictionary.fileName).subscribe((updatedDictionaries: Dictionary[]) => {
            this.dictionaries = updatedDictionaries;
            this.displayMessage('Dictionnaire supprimé');
        });
    }

    downloadDictionary(dictionary: Dictionary): void {
        this.communicationService.downloadDictionary(dictionary.fileName).subscribe();
    }

    private addAiPlayer(aiPlayer: AiPlayer, aiType: AiType): void {
        this.communicationService.addAiPlayer(aiPlayer, aiType).subscribe(
            (aiFromDB: AiPlayerDB) => {
                if (aiType) {
                    this.expertNames.push(aiFromDB);
                } else {
                    this.beginnerNames.push(aiFromDB);
                }
                this.displayMessage('Joueur ajouté');
            },
            (error: HttpErrorResponse) => {
                this.displayMessage(`Le joueur n'a pas été ajouté, erreur : ${error.message}`);
            },
        );
    }

    private upDateAiPlayer(id: string, aiPlayer: AiPlayer, aiType: AiType): void {
        this.communicationService.updateAiPlayer(id, aiPlayer, aiType).subscribe(
            (aiPlayers) => {
                if (aiType) {
                    this.expertNames = aiPlayers;
                } else {
                    this.beginnerNames = aiPlayers;
                }
                this.displayMessage('Joueur modifié');
            },
            (error: HttpErrorResponse) => {
                this.displayMessage(`Le joueur n'a pas été modifié, erreur : ${error.message}`);
            },
        );
    }

    private displayMessage(message: string): void {
        this.snackBar.open(message, 'OK', {
            duration: ERROR_MESSAGE_DELAY,
            horizontalPosition: 'center',
            verticalPosition: 'top',
        });
    }

    private isDictionaryNameUsed(): boolean {
        for (const dictionary of this.dictionaries) {
            if (this.currentDictionary.title === dictionary.title) return true;
        }
        return false;
    }

    private checkIfAlreadyExists(aiPlayerName: string): boolean {
        const aiBeginner = this.beginnerNames.find((aiBeginnerPlayer) => aiBeginnerPlayer.aiName === aiPlayerName);
        const aiExpert = this.expertNames.find((aiExpertPlayer) => aiExpertPlayer.aiName === aiPlayerName);

        return aiBeginner !== undefined || aiExpert !== undefined;
    }

    private handleRequestError(error: HttpErrorResponse): void {
        this.displayMessage(`Nous n'avons pas pu accéder au serveur, erreur : ${error.message}`);
    }

    private displayUploadMessage(uploadMessage: string) {
        if (this.uploadMessage.length) return; // There is already a message occuring
        this.uploadMessage = uploadMessage;
        this.file = null;

        setTimeout(() => {
            this.uploadMessage = '';
        }, THREE_SECONDS_DELAY);
    }
}
