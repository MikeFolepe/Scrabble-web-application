import { Component, ElementRef, ViewChild } from '@angular/core';
import { MatAccordion } from '@angular/material/expansion';
import { CommunicationService } from '@app/services/communication.service';
import dictionarySchema from '@common/dictionarySchema.json';
import { Dictionary } from '@app/classes/dictionary';
import Ajv from 'ajv';
import { THREE_SECONDS_DELAY } from '@app/classes/constants';

@Component({
    selector: 'app-admin-page',
    templateUrl: './admin-page.component.html',
    styleUrls: ['./admin-page.component.scss'],
})
export class AdminPageComponent {
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
    beginnerNames = ['Name #1', 'Name #2', 'Name #3', 'Name #4'];
    expertNames = ['Name #1', 'Name #2', 'Name #3'];

    constructor(private communicationService: CommunicationService) {
        this.file = null;
        this.uploadMessage = '';
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
}
