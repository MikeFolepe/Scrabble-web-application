/* eslint-disable max-lines */
/* eslint-disable no-underscore-dangle */
/* eslint-disable @typescript-eslint/no-magic-numbers */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable dot-notation */
import { HttpErrorResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { AiPlayerDB, AiType } from '@common/ai-name';
import { Dictionary } from '@common/dictionary';
import { Observable, of, throwError } from 'rxjs';
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

    afterEach(() => {
        jasmine.clock().uninstall();
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

    it('should display a message if upload dictionary encounters an error', () => {
        const errorResponse: HttpErrorResponse = new HttpErrorResponse({
            error: { code: 'some code', message: 'some message.' },
            status: 400,
            statusText: 'Bad Request',
        });
        const displayMessage = spyOn<any>(service, 'displayMessage');
        spyOn(service['communicationService'], 'uploadFile').and.returnValue(throwError(errorResponse));
        spyOn<any>(service, 'isDictionaryNameUsed').and.returnValue(false);
        service.currentDictionary = { fileName: 'test', title: 'Un dictionnaire', description: 'Une description', isDefault: false };
        service.file = new File([], 'test2', { type: 'application/json' });
        service.addDictionary();
        expect(displayMessage).toHaveBeenCalledWith(
            "Le dictionnaire n'a pas été téléversé, erreur : Http failure response for (unknown url): 400 Bad Request",
        );
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

    it('should reset all dictionaries', () => {
        const deleteDictionary = spyOn(service, 'deleteDictionary');

        const dictionary1: Dictionary = { fileName: 'test 1 name', title: 'test 1', description: 'test 1 descr', isDefault: true };
        const dictionary2: Dictionary = { fileName: 'test 2 name', title: 'test 2', description: 'test 2 descr', isDefault: false };
        const dictionary3: Dictionary = { fileName: 'test 3 name', title: 'test 3', description: 'test 3 descr', isDefault: false };

        service.dictionaries.push(dictionary1, dictionary2, dictionary3);

        service['resetDictionaries']();

        expect(deleteDictionary).toHaveBeenCalledTimes(2);
    });

    it('should reset all AI names', () => {
        const deletePlayer = spyOn<any>(service, 'deleteAiPlayer');

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

        service.beginnerNames.push(player4, player5);
        service.expertNames.push(player4, player5);

        service['resetAiPlayers']();

        expect(deletePlayer).toHaveBeenCalledTimes(2 + 2);
    });

    it('should reset all scores', () => {
        const resetScores = spyOn(service['communicationService'], 'deleteScores').and.returnValue(of());

        service['resetScores']();
        expect(resetScores).toHaveBeenCalledTimes(1);
    });

    it('should call the right functions when calling resetData', async () => {
        const resetPlayers = spyOn<any>(service, 'resetAiPlayers');
        const resetDictionaries = spyOn<any>(service, 'resetDictionaries');
        const resetScores = spyOn<any>(service, 'resetScores');
        const displayMessage = spyOn<any>(service, 'displayMessage');

        await service.resetData();

        expect(resetPlayers).toHaveBeenCalledTimes(1);
        expect(resetDictionaries).toHaveBeenCalledTimes(1);
        expect(resetScores).toHaveBeenCalledTimes(1);
        expect(displayMessage).toHaveBeenCalledOnceWith('La base de données à été réinitialisée');
    });

    it('should initialize AI players', () => {
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
        const getPlayers = spyOn(service['communicationService'], 'getAiPlayers').and.returnValue(of([player4, player5]));
        service.initializeAiPlayers();
        expect(getPlayers).toHaveBeenCalledTimes(2);
        expect(service.beginnerNames).toEqual([player4, player5]);
        expect(service.expertNames).toEqual([player4, player5]);
    });

    it('should call handleRequestError if returned players have an error', () => {
        const errorResponse = new HttpErrorResponse({
            error: { code: 'some code', message: 'some message.' },
            status: 400,
            statusText: 'Bad Request',
        });
        const getPlayers = spyOn(service['communicationService'], 'getAiPlayers').and.returnValue(throwError(errorResponse));
        const handleError = spyOn<any>(service, 'handleRequestError');
        service.initializeAiPlayers();
        expect(getPlayers).toHaveBeenCalledTimes(2);
        expect(handleError).toHaveBeenCalledTimes(2);
    });

    it('should initialize dictionaries', () => {
        const dictionary1: Dictionary = { fileName: 'test 1 name', title: 'test 1', description: 'test 1 descr', isDefault: true };
        const dictionary2: Dictionary = { fileName: 'test 2 name', title: 'test 2', description: 'test 2 descr', isDefault: false };
        const dictionary3: Dictionary = { fileName: 'test 3 name', title: 'test 3', description: 'test 3 descr', isDefault: false };

        const getPlayers = spyOn(service['communicationService'], 'getAiPlayers').and.returnValue(of([player4, player5]));
        service.initializeAiPlayers();
        expect(getPlayers).toHaveBeenCalledTimes(2);
        expect(service.dictionaries).toEqual([dictionary1, dictionary2, dictionary3]);
    });

    it('should call handleRequestError if returned dictionaries have an error', () => {
        const errorResponse = new HttpErrorResponse({
            error: { code: 'some code', message: 'some message.' },
            status: 400,
            statusText: 'Bad Request',
        });
        const getPlayers = spyOn(service['communicationService'], 'getAiPlayers').and.returnValue(throwError(errorResponse));
        const handleError = spyOn<any>(service, 'handleRequestError');
        service.initializeAiPlayers();
        expect(getPlayers).toHaveBeenCalledTimes(2);
        expect(handleError).toHaveBeenCalledTimes(2);
    });

    it('should not add IA to database if player added is default', () => {
        const addPlayer = spyOn<any>(service, 'addAiPlayer');
        const updatePlayer = spyOn<any>(service, 'updateAiPlayer');
        const displayMessage = spyOn<any>(service, 'displayMessage');

        service.addAiToDatabase(AiType.beginner, true, '5', true);
        expect(addPlayer).not.toHaveBeenCalled();
        expect(updatePlayer).not.toHaveBeenCalled();
        expect(displayMessage).toHaveBeenCalledOnceWith('Vous ne pouvez pas modifier un joueur par défaut!');
    });

    it('should not add IA to database if name is null', () => {
        const addPlayer = spyOn<any>(service, 'addAiPlayer');
        const updatePlayer = spyOn<any>(service, 'updateAiPlayer');
        const displayMessage = spyOn<any>(service, 'displayMessage');

        const matDialogRefMock = jasmine.createSpyObj('MatDialogRef', ['afterClosed']);
        matDialogRefMock.afterClosed.and.returnValue(of(null));
        const matDialogMock = jasmine.createSpyObj('MatDialog', ['open']);
        matDialogMock.open.and.returnValue(matDialogRefMock);
        service.dialog = matDialogMock;

        service.addAiToDatabase(AiType.beginner, true, '5');
        expect(addPlayer).not.toHaveBeenCalled();
        expect(updatePlayer).not.toHaveBeenCalled();
        expect(displayMessage).not.toHaveBeenCalled();
    });

    // it('should know if at least one of the arrays of players is undefined', () => {
    //     service.beginnerNames = [
    //         {
    //             _id: '4',
    //             aiName: 'Mister_Test',
    //             isDefault: false,
    //         },
    //     ];
    //     service.expertNames = undefined as unknown as AiPlayerDB[];

    //     expect(service['checkIfAlreadyExists']('test')).toBeFalse();
    // });

    it('should not add IA to database if name is already given', () => {
        const addPlayer = spyOn<any>(service, 'addAiPlayer');
        const updatePlayer = spyOn<any>(service, 'updateAiPlayer');
        const displayMessage = spyOn<any>(service, 'displayMessage');

        const playerBeginner: AiPlayerDB = {
            _id: '4',
            aiName: 'Mister_Test',
            isDefault: false,
        };
        const playerExpert: AiPlayerDB = {
            _id: '5',
            aiName: 'Miss_Test',
            isDefault: false,
        };

        service.beginnerNames.push(playerBeginner);
        service.expertNames.push(playerExpert);

        const matDialogRefMock = jasmine.createSpyObj('MatDialogRef', ['afterClosed']);
        matDialogRefMock.afterClosed.and.returnValues(of(playerBeginner.aiName), of(playerExpert.aiName));
        const matDialogMock = jasmine.createSpyObj('MatDialog', ['open']);
        matDialogMock.open.and.returnValue(matDialogRefMock);
        service.dialog = matDialogMock;

        service.addAiToDatabase(AiType.beginner, true, playerBeginner._id);
        expect(addPlayer).not.toHaveBeenCalled();
        expect(updatePlayer).not.toHaveBeenCalled();
        expect(displayMessage).toHaveBeenCalledTimes(1);

        service.addAiToDatabase(AiType.expert, true, playerExpert._id);
        expect(addPlayer).not.toHaveBeenCalled();
        expect(updatePlayer).not.toHaveBeenCalled();
        expect(displayMessage).toHaveBeenCalledTimes(2);
    });

    it('should add player IA to database', () => {
        const addPlayer = spyOn<any>(service, 'addAiPlayer').and.callThrough();
        const updatePlayer = spyOn<any>(service, 'updateAiPlayer').and.callThrough();
        spyOn(service['communicationService'], 'addAiPlayer').and.returnValues(
            of({ _id: '4', aiName: 'test1', isDefault: false }),
            of({ _id: '5', aiName: 'test2', isDefault: false }),
        );
        spyOn(service['communicationService'], 'updateAiPlayer').and.returnValues(
            of([player1, player2, player3, { _id: '4', aiName: 'test3', isDefault: false }]),
            of([player1, player2, player3, { _id: '5', aiName: 'test4', isDefault: false }]),
        );

        const matDialogRefMock = jasmine.createSpyObj('MatDialogRef', ['afterClosed']);
        matDialogRefMock.afterClosed.and.returnValues(of('test1'), of('test2'), of('test3'), of('test4'));
        const matDialogMock = jasmine.createSpyObj('MatDialog', ['open']);
        matDialogMock.open.and.returnValue(matDialogRefMock);
        service.dialog = matDialogMock;

        service.addAiToDatabase(AiType.beginner, true);
        expect(addPlayer).toHaveBeenCalledTimes(1);
        expect(updatePlayer).toHaveBeenCalledTimes(0);
        expect(service.beginnerNames).toContain({ _id: '4', aiName: 'test1', isDefault: false });

        service.addAiToDatabase(AiType.expert, true);
        expect(addPlayer).toHaveBeenCalledTimes(2);
        expect(updatePlayer).toHaveBeenCalledTimes(0);
        expect(service.expertNames).toContain({ _id: '5', aiName: 'test2', isDefault: false });

        service.addAiToDatabase(AiType.beginner, false, '4');
        expect(addPlayer).toHaveBeenCalledTimes(2);
        expect(updatePlayer).toHaveBeenCalledTimes(1);
        expect(service.beginnerNames).toContain({ _id: '4', aiName: 'test3', isDefault: false });

        service.addAiToDatabase(AiType.expert, false, '5');
        expect(addPlayer).toHaveBeenCalledTimes(2);
        expect(updatePlayer).toHaveBeenCalledTimes(2);
        expect(service.expertNames).toContain({ _id: '5', aiName: 'test4', isDefault: false });
    });
});
