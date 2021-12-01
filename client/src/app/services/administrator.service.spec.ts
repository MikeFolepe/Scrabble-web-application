/* eslint-disable prettier/prettier */
/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable dot-notation */
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { AiPlayerDB } from '@common/ai-name';
import { Dictionary } from '@common/dictionary';
import { Observable, of } from 'rxjs';
import { AdministratorService } from './administrator.service';

interface DictionaryTest {
    title: string;
    description: string;
    words: string[];
}

fdescribe('AdministratorService', () => {
    let service: AdministratorService;
    let player1: AiPlayerDB;
    let player2: AiPlayerDB;
    let player3: AiPlayerDB;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [HttpClientTestingModule, RouterTestingModule, MatSnackBarModule, MatDialogModule, BrowserAnimationsModule],
        }).compileComponents();
        service = TestBed.inject(AdministratorService);
        jasmine.clock().install();
        player1 = {
            _id: '1',
            aiName: 'Mister_Bucky',
            isDefault: true,
        };
        player2 = {
            _id: '2',
            aiName: 'Miss_Betty',
            isDefault: true,
        };
        player3 = {
            _id: '3',
            aiName: 'Mister_Samy',
            isDefault: true,
        };
        service.beginnerNames = [player1, player2, player3];
        service.expertNames = [player1, player2, player3];
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should select the respective file on file input', () => {
        const file: File = new File([], 'file.json');

        const fileList: FileList = {
            0: file,
            length: 1,
            item: () => {
                return file;
            },
        };
        service.onFileInput(fileList as FileList | null);
        expect(service.file).toEqual(fileList.item(0));
    });

    it('isDictionaryValid() should return false when the file is not a .json', async () => {
        service.file = new File([], 'file');
        const isValid: boolean = await service.isDictionaryValid();
        expect(isValid).toBeFalse();
    });

    it('isDictionaryValid() should return false on an invalid dictionary', async () => {
        const blob = new Blob([], { type: 'application/json' });
        service.file = new File([blob], 'file.json', { type: 'application/json' });
        const isValid: boolean = await service.isDictionaryValid();
        expect(isValid).toBeFalse();
    });

    it('isDictionaryValid() should return true on a valid dictionary', async () => {
        const dictionary: DictionaryTest = { title: 'Un dictionnaire', description: 'Une description', words: ['a', 'b', 'c'] };
        const jsn = JSON.stringify(dictionary);
        const blob = new Blob([jsn], { type: 'application/json' });
        service.file = new File([blob], 'file.json', { type: 'application/json' });
        const isValid: boolean = await service.isDictionaryValid();
        expect(isValid).toBeTrue();
    });

    it('adding a dictionary with a new name should be added to the dictionaries', () => {
        const message: Observable<string> = of('Uploaded');
        spyOn(service['communicationService'], 'uploadFile').and.returnValue(message);
        service.currentDictionary = { fileName: 'test', title: 'Un dictionnaire', description: 'Une description', isDefault: false };
        service.file = new File([], 'test', { type: 'application/json' });
        service.addDictionary();
        expect(service.dictionaries[0].fileName).toEqual('test');
    });

    it('adding a dictionary while its name already exist should not be possible', () => {
        spyOn<any>(service, 'displayUploadMessage').and.callThrough();
        const message: Observable<string> = of('Uploaded');
        spyOn(service['communicationService'], 'uploadFile').and.returnValue(message);
        service.currentDictionary = { fileName: 'test', title: 'Un dictionnaire', description: 'Une description', isDefault: false };
        service.file = new File([], 'test', { type: 'application/json' });
        service.dictionaries = [service.currentDictionary];
        service.addDictionary();
        jasmine.clock().tick(3000);
        expect(service['displayUploadMessage']).toHaveBeenCalledWith('Il existe déjà un dictionnaire portant le même nom');
    });

    it('submitting a valid dictionary should call addDictionary()', async () => {
        spyOn(service, 'isDictionaryValid').and.returnValue(Promise.resolve(true));
        spyOn(service, 'addDictionary');
        await service.onSubmit();
        expect(service.addDictionary).toHaveBeenCalled();
    });

    it('submitting a invalid dictionary should display the respective message', async () => {
        spyOn(service, 'isDictionaryValid').and.returnValue(Promise.resolve(false));
        spyOn<any>(service, 'displayUploadMessage');
        await service.onSubmit();
        expect(service['displayUploadMessage']).toHaveBeenCalledWith("Le fichier n'est pas un dictionnaire");
    });

    it('should return a random name of beginner Ai name', () => {
        service.getAiBeginnerName();
        expect(service.getAiBeginnerName()).not.toEqual('');
    });

    it('should reset all data (dictionaries, scores and AI names)', async () => {
        const resetScores = spyOn(service['communicationService'], 'deleteScores').and.returnValue(of());
        const player4: AiPlayerDB = {
            _id: '4',
            aiName: 'Mister_Test',
            isDefault: false,
        };
        const player5: AiPlayerDB = {
            _id: '5',
            aiName: 'Miss_Test',
            isDefault: false,
        };

        const dictionary1: Dictionary = { fileName: 'test 1 name', title: 'test 1', description: 'test 1 descr', isDefault: true };
        const dictionary2: Dictionary = { fileName: 'test 2 name', title: 'test 2', description: 'test 2 descr', isDefault: false };
        const dictionary3: Dictionary = { fileName: 'test 3 name', title: 'test 3', description: 'test 3 descr', isDefault: false };

        service.beginnerNames.push(player4, player5);
        service.expertNames.push(player4, player5);
        service.dictionaries.push(dictionary1, dictionary2, dictionary3);

        await service.resetData();

        expect(service.beginnerNames).toEqual([player1, player2, player3]);
        expect(service.expertNames).toEqual([player1, player2, player3]);
        expect(resetScores).toHaveBeenCalledTimes(1);
        expect(service.dictionaries).toEqual([dictionary1]);
    });
});
