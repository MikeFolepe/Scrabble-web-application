/* eslint-disable max-lines */
/* eslint-disable @typescript-eslint/no-magic-numbers */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable dot-notation */
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { OBJECTIVES } from '@app/classes/objectives';
import { Player } from '@app/models/player.model';
import { GameType } from '@common/game-type';
import { Socket } from 'socket.io-client';
import { ObjectivesService } from './objectives.service';

describe('ObjectivesService', () => {
    let service: ObjectivesService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule, RouterTestingModule],
        });
        service = TestBed.inject(ObjectivesService);

        for (const objective of OBJECTIVES) {
            objective.isCompleted = false;
        }
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should be cleaned after ngOnDestroyCall', () => {
        const newService = TestBed.inject(ObjectivesService);
        service.activeTimeRemaining = [100, 78];

        service.ngOnDestroy();
        expect(service).toEqual(newService);
    });

    it('initializeObjectives should fetch the right objectives', () => {
        service['gameSettingsService'].gameSettings.objectiveIds = [
            [0, 1],
            [2, 3],
        ];

        service.initializeObjectives();

        expect(service.objectives).toEqual([
            [OBJECTIVES[0], OBJECTIVES[1]],
            [OBJECTIVES[2], OBJECTIVES[3]],
        ]);
    });

    it('checkObjectivesCompletion should look at the right objectives', () => {
        service.objectives = [
            [OBJECTIVES[0], OBJECTIVES[1]],
            [OBJECTIVES[2], OBJECTIVES[3]],
        ];
        service.playerIndex = 1;
        service.objectives[0][0].isCompleted = true;
        const spyOnPublic1 = spyOn<any>(service.objectives[0][0], 'validate');
        const spyOnPublic2 = spyOn<any>(service.objectives[0][1], 'validate');
        const spyOnPrivate = spyOn<any>(service.objectives[1][1], 'validate');

        service['gameSettingsService'].gameType = GameType.Log2990;
        service.checkObjectivesCompletion();

        expect(spyOnPublic1).toHaveBeenCalledTimes(0);
        expect(spyOnPublic2).toHaveBeenCalledOnceWith(service);
        expect(spyOnPrivate).toHaveBeenCalledOnceWith(service);
    });

    it('checkObjectivesCompletion should only look at the public objectives if private is completed', () => {
        service.objectives = [
            [OBJECTIVES[0], OBJECTIVES[1]],
            [OBJECTIVES[2], OBJECTIVES[3]],
        ];
        service.playerIndex = 1;
        service.objectives[1][1].isCompleted = true;
        const spyOnPublic1 = spyOn<any>(service.objectives[0][0], 'validate');
        const spyOnPublic2 = spyOn<any>(service.objectives[0][1], 'validate');
        const spyOnPrivate = spyOn<any>(service.objectives[1][1], 'validate');

        service['gameSettingsService'].gameType = GameType.Log2990;
        service.checkObjectivesCompletion();

        expect(spyOnPrivate).toHaveBeenCalledTimes(0);
        expect(spyOnPublic1).toHaveBeenCalledOnceWith(service);
        expect(spyOnPublic2).toHaveBeenCalledOnceWith(service);
    });

    it('checkObjectivesCompletion should not look at the objectives when classic mode', () => {
        service.objectives = [
            [OBJECTIVES[0], OBJECTIVES[1]],
            [OBJECTIVES[2], OBJECTIVES[3]],
        ];

        service.playerIndex = 1;
        service['gameSettingsService'].gameType = GameType.Classic;
        const spyOnPublic1 = spyOn<any>(service.objectives[0][0], 'validate');
        const spyOnPublic2 = spyOn<any>(service.objectives[0][1], 'validate');
        const spyOnPrivate = spyOn<any>(service.objectives[1][1], 'validate');

        service.checkObjectivesCompletion();

        expect(spyOnPublic1).toHaveBeenCalledTimes(0);
        expect(spyOnPublic2).toHaveBeenCalledTimes(0);
        expect(spyOnPrivate).toHaveBeenCalledTimes(0);
    });

    it('findObjectiveById should return the right objective', () => {
        service.objectives = [
            [OBJECTIVES[0], OBJECTIVES[1]],
            [OBJECTIVES[2], OBJECTIVES[3]],
        ];

        expect(service['findObjectiveById'](2)).toBe(service.objectives[1][0]);
        expect(service['findObjectiveById'](8)).toEqual(undefined);
    });

    it('addObjectiveScore should return the right objective', () => {
        service.objectives = [
            [OBJECTIVES[0], OBJECTIVES[1]],
            [OBJECTIVES[2], OBJECTIVES[3]],
        ];
        const idToCheckForCompletion = 2;
        const spyOnAddScore = spyOn<any>(service['playerService'], 'addScore');
        const spyOnUpdateOpponentObjective = spyOn<any>(service, 'updateOpponentObjectives');

        service['addObjectiveScore'](idToCheckForCompletion);

        expect(spyOnAddScore).toHaveBeenCalledOnceWith(15, 0);
        expect(spyOnUpdateOpponentObjective).toHaveBeenCalledOnceWith(idToCheckForCompletion);
        expect(service.objectives[1][0].isCompleted).toEqual(true);
    });

    it('receiveObjectives should truetify the right objective', () => {
        service.objectives = [
            [OBJECTIVES[0], OBJECTIVES[1]],
            [OBJECTIVES[2], OBJECTIVES[3]],
        ];

        service['clientSocketService'].socket = {
            on: (eventName: string, callback: (id: number) => void) => {
                if (eventName === 'receiveObjectiveCompleted') {
                    callback(2);
                }
            },
        } as unknown as Socket;

        service.receiveObjectives();

        expect(service.objectives[1][0].isCompleted).toEqual(true);
    });

    it('updateOpponentObjectives should send the right objective', () => {
        const spyOnEmit = spyOn(service['clientSocketService'].socket, 'emit');
        const roomId = 'NoMatter';
        const idOfObjectiveAccomplished = 2;
        service['gameSettingsService'].isSoloMode = true;
        service['clientSocketService'].roomId = roomId;

        service.updateOpponentObjectives(idOfObjectiveAccomplished);
        expect(spyOnEmit).toHaveBeenCalledTimes(0);

        service['gameSettingsService'].isSoloMode = false;
        service.updateOpponentObjectives(idOfObjectiveAccomplished);
        expect(spyOnEmit).toHaveBeenCalledOnceWith('objectiveAccomplished', idOfObjectiveAccomplished, roomId);
    });

    it('OBJ#5 Placer un mot avec au moins 2 lettres parmi J,K,Q,W,X,Y,Z,*', () => {
        const lastPlayedWordsMap = new Map<string, string[]>();
        const spyOnObjectiveCompleted = spyOn<any>(service, 'addObjectiveScore');

        service['wordValidationService'].lastPlayedWords = lastPlayedWordsMap.set('jean', []);
        service['validateObjectiveFive'](4);
        lastPlayedWordsMap.clear();

        service['wordValidationService'].lastPlayedWords = lastPlayedWordsMap.set('jeanw', []);
        service['validateObjectiveFive'](4);
        lastPlayedWordsMap.clear();

        service['wordValidationService'].lastPlayedWords = lastPlayedWordsMap.set('jsssskq', []);
        service['validateObjectiveFive'](4);
        lastPlayedWordsMap.clear();

        service['wordValidationService'].lastPlayedWords = lastPlayedWordsMap.set('Zj', []);
        service['validateObjectiveFive'](4);

        expect(spyOnObjectiveCompleted).toHaveBeenCalledTimes(3);
    });

    it('OBJ#8 La première personne à toucher un des 4 coins de la grille obtient un bonus', () => {
        const lastPlayedWordsMap = new Map<string, string[]>();
        const spyOnObjectiveCompleted = spyOn<any>(service, 'addObjectiveScore');

        service['wordValidationService'].lastPlayedWords = lastPlayedWordsMap.set('abc', ['A1', 'A2', 'A3', 'A4']);
        service['validateObjectiveEight'](7);
        lastPlayedWordsMap.clear();

        service['wordValidationService'].lastPlayedWords = lastPlayedWordsMap.set('def', ['A13', 'A14', 'A15']);
        service['validateObjectiveEight'](7);
        lastPlayedWordsMap.clear();

        service['wordValidationService'].lastPlayedWords = lastPlayedWordsMap.set('ghilmn', ['O1', 'O2', 'O3', 'O4', 'O5', 'O6']);
        service['validateObjectiveEight'](7);
        lastPlayedWordsMap.clear();

        service['wordValidationService'].lastPlayedWords = lastPlayedWordsMap.set('klm', ['O13', 'O14', 'O15']);
        service['validateObjectiveEight'](7);
        lastPlayedWordsMap.clear();

        service['wordValidationService'].lastPlayedWords = lastPlayedWordsMap.set('opq', ['B1', 'B2', 'B3']);
        service['validateObjectiveEight'](7);
        lastPlayedWordsMap.clear();

        expect(spyOnObjectiveCompleted).toHaveBeenCalledTimes(4);
    });

    it('OBJ#7 Former un mot de plus de 7 lettres', () => {
        const lastPlayedWordsMap = new Map<string, string[]>();
        const spyOnObjectiveCompleted = spyOn<any>(service, 'addObjectiveScore');

        service['wordValidationService'].lastPlayedWords = lastPlayedWordsMap.set('superieur7', []);
        service['validateObjectiveSeven'](6);
        lastPlayedWordsMap.clear();

        service['wordValidationService'].lastPlayedWords = lastPlayedWordsMap.set('EgaleA7', []);
        service['validateObjectiveSeven'](6);
        lastPlayedWordsMap.clear();

        service['wordValidationService'].lastPlayedWords = lastPlayedWordsMap.set('infA7', []);
        service['validateObjectiveSeven'](6);
        lastPlayedWordsMap.clear();

        expect(spyOnObjectiveCompleted).toHaveBeenCalledTimes(1);
    });

    it('OBJ#4 Obtenir 60 points en une minute de jeu actif (incluant les bonus)', () => {
        const spyOnObjectiveCompleted = spyOn<any>(service, 'addObjectiveScore');
        const player = new Player(0, 'no matter', []);
        service['playerService'].players[0] = player;

        service.activeTimeRemaining = [59, 0];
        player.score = 59;
        service['validateObjectiveFour'](3);

        service.activeTimeRemaining = [1, 0];
        player.score = 65;
        service['validateObjectiveFour'](3);

        service.activeTimeRemaining = [0, 0];
        player.score = 100;
        service['validateObjectiveFour'](3);

        expect(spyOnObjectiveCompleted).toHaveBeenCalledTimes(1);
    });

    it("OBJ#2 Former un mot d'au moins 4 lettres identique à un mot déjà placé", () => {
        const lastPlayedWordsMap = new Map<string, string[]>();
        const playedWords = new Map<string, string[]>();
        const spyOnObjectiveCompleted = spyOn<any>(service, 'addObjectiveScore');

        service['wordValidationService'].lastPlayedWords = lastPlayedWordsMap.set('abcd', ['A1', 'A2', 'A3', 'A4']);
        service['wordValidationService'].playedWords = playedWords.set('abcd', ['A1', 'A2', 'A3', 'A4', 'C1', 'C2', 'C3', 'C4']);
        service['validateObjectiveTwo'](1);
        lastPlayedWordsMap.clear();

        service['wordValidationService'].lastPlayedWords = lastPlayedWordsMap.set('efg', ['A13', 'A14', 'A15']);
        service['wordValidationService'].playedWords = playedWords.set('efg', ['A13', 'A14', 'A15', 'H8', 'H9', 'H10']);
        service['validateObjectiveTwo'](1);
        lastPlayedWordsMap.clear();

        service['wordValidationService'].lastPlayedWords = lastPlayedWordsMap.set('hij', ['B13', 'B14', 'B15']);
        service['wordValidationService'].playedWords = playedWords.set('hij', ['B13', 'B14', 'B15']);
        service['validateObjectiveTwo'](1);
        lastPlayedWordsMap.clear();

        expect(spyOnObjectiveCompleted).toHaveBeenCalledTimes(1);
    });

    it("OBJ#1 Former un mot d'au moins 4 lettres sur 3 tours consécutifs sample1", () => {
        const spyOnObjectiveCompleted = spyOn<any>(service, 'addObjectiveScore');
        const lastPlayedWordsMap = new Map<string, string[]>();

        // Moi
        service['endGameService'].actionsLog.push('placerSucces');
        service['wordValidationService'].lastPlayedWords = lastPlayedWordsMap.set('abcd', []);
        service['validateObjectiveOne'](0);

        service['endGameService'].actionsLog.push('placerSucces');

        // Moi
        service['endGameService'].actionsLog.push('placerSucces');
        service['wordValidationService'].lastPlayedWords = lastPlayedWordsMap.set('abc', []);
        service['validateObjectiveOne'](0);

        service['endGameService'].actionsLog.push('Echanger');

        // Moi
        service['endGameService'].actionsLog.push('Passer');

        service['endGameService'].actionsLog.push('passer');

        // Moi
        service['endGameService'].actionsLog.push('echanger');

        service['endGameService'].actionsLog.push('placerSucces');

        // Moi
        service['endGameService'].actionsLog.push('placerSucces');
        service['wordValidationService'].lastPlayedWords = lastPlayedWordsMap.set('gjhbnm', []);
        service['validateObjectiveOne'](0);

        expect(spyOnObjectiveCompleted).toHaveBeenCalledTimes(0);
        expect(service['obj1Counter'][0]).toEqual(1);
    });

    it("OBJ#1 Former un mot d'au moins 4 lettres sur 3 tours consécutifs sample2", () => {
        const spyOnObjectiveCompleted = spyOn<any>(service, 'addObjectiveScore');
        const lastPlayedWordsMap = new Map<string, string[]>();

        // Moi
        service['endGameService'].actionsLog.push('passer');

        service['endGameService'].actionsLog.push('placerSucces');

        // Moi
        service['endGameService'].actionsLog.push('placerSucces');
        service['wordValidationService'].lastPlayedWords = lastPlayedWordsMap.set('abcdefghikls', []);
        service['validateObjectiveOne'](0);

        service['endGameService'].actionsLog.push('Echanger');

        // Moi
        service['endGameService'].actionsLog.push('Passer');

        service['endGameService'].actionsLog.push('passer');

        // Moi
        service['endGameService'].actionsLog.push('placerSucces');
        service['wordValidationService'].lastPlayedWords = lastPlayedWordsMap.set('abcd', []);
        service['validateObjectiveOne'](0);

        service['endGameService'].actionsLog.push('placerSucces');

        // Moi
        service['endGameService'].actionsLog.push('placerSucces');
        service['wordValidationService'].lastPlayedWords = lastPlayedWordsMap.set('gjhbnm', []);
        service['validateObjectiveOne'](0);

        expect(spyOnObjectiveCompleted).toHaveBeenCalledTimes(0);
        expect(service['obj1Counter'][0]).toEqual(2);
    });

    it("OBJ#1 Former un mot d'au moins 4 lettres sur 3 tours consécutifs sample3", () => {
        const spyOnObjectiveCompleted = spyOn<any>(service, 'addObjectiveScore');
        const lastPlayedWordsMap = new Map<string, string[]>();

        // Moi
        service['endGameService'].actionsLog.push('passer');

        service['endGameService'].actionsLog.push('placerSucces');

        // Moi
        service['endGameService'].actionsLog.push('placerSucces');
        service['wordValidationService'].lastPlayedWords = lastPlayedWordsMap.set('abcdefghikls', []);
        service['validateObjectiveOne'](0);
        expect(service['obj1Counter'][0]).toEqual(1);
        lastPlayedWordsMap.clear();

        service['endGameService'].actionsLog.push('Echanger');

        // Moi
        service['endGameService'].actionsLog.push('placerSucces');
        service['wordValidationService'].lastPlayedWords = lastPlayedWordsMap.set('abcd', []);
        service['validateObjectiveOne'](0);
        expect(service['obj1Counter'][0]).toEqual(2);
        lastPlayedWordsMap.clear();

        service['endGameService'].actionsLog.push('passer');

        // Moi
        service['endGameService'].actionsLog.push('echanger');

        service['endGameService'].actionsLog.push('placerSucces');

        // Moi
        service['endGameService'].actionsLog.push('placerSucces');
        service['wordValidationService'].lastPlayedWords = lastPlayedWordsMap.set('gjhbnm', []);
        service['validateObjectiveOne'](0);
        expect(service['obj1Counter'][0]).toEqual(1);
        lastPlayedWordsMap.clear();

        service['endGameService'].actionsLog.push('placerSucces');

        // Moi
        service['endGameService'].actionsLog.push('placerSucces');
        service['wordValidationService'].lastPlayedWords = lastPlayedWordsMap.set('uyghkjb', []);
        service['validateObjectiveOne'](0);
        expect(service['obj1Counter'][0]).toEqual(2);
        lastPlayedWordsMap.clear();

        service['endGameService'].actionsLog.push('echanger');

        // Moi
        service['endGameService'].actionsLog.push('placerSucces');
        service['wordValidationService'].lastPlayedWords = lastPlayedWordsMap.set('cfghnbvfrre', []);
        service['validateObjectiveOne'](0);
        expect(service['obj1Counter'][0]).toEqual(3);
        lastPlayedWordsMap.clear();

        expect(spyOnObjectiveCompleted).toHaveBeenCalledTimes(1);
    });

    it('OBJ#3 Former un mot qui coupe au moins deux mots déjà placés sample1', () => {
        const lastPlayedWordsMap = new Map<string, string[]>();
        const priorPlayedWordsMap = new Map<string, string[]>();
        const playedWordsMap = new Map<string, string[]>();
        const spyOnObjectiveCompleted = spyOn<any>(service, 'addObjectiveScore');

        service['wordValidationService'].lastPlayedWords = lastPlayedWordsMap.set('word1', ['C1', 'C2', 'C3', 'C4']);
        service['wordValidationService'].playedWords = playedWordsMap.set('word1', ['C1', 'C2', 'C3', 'C4']);
        service['validateObjectiveThree'](2);
        lastPlayedWordsMap.clear();

        service['wordValidationService'].lastPlayedWords = lastPlayedWordsMap.set('word2', ['E1', 'E2', 'E2']);
        service['wordValidationService'].playedWords = playedWordsMap.set('word2', ['E1', 'E2', 'E2']);
        service['wordValidationService'].priorPlayedWords = priorPlayedWordsMap.set('word1', ['C1', 'C2', 'C3', 'C4']);
        service['validateObjectiveThree'](2);
        lastPlayedWordsMap.clear();

        service['wordValidationService'].lastPlayedWords = lastPlayedWordsMap.set('word3', ['C2', 'D2', 'E2']);
        service['wordValidationService'].playedWords = playedWordsMap.set('word3', ['C2', 'D2', 'E2']);
        service['wordValidationService'].priorPlayedWords = priorPlayedWordsMap.set('word2', ['E1', 'E2', 'E3']);
        service['validateObjectiveThree'](2);
        lastPlayedWordsMap.clear();

        expect(spyOnObjectiveCompleted).toHaveBeenCalledTimes(1);
    });

    it('OBJ#3 Former un mot qui coupe au moins deux mots déjà placés sample2', () => {
        const lastPlayedWordsMap = new Map<string, string[]>();
        const priorPlayedWordsMap = new Map<string, string[]>();
        const playedWordsMap = new Map<string, string[]>();
        const spyOnObjectiveCompleted = spyOn<any>(service, 'addObjectiveScore');

        service['wordValidationService'].lastPlayedWords = lastPlayedWordsMap.set('word1', ['C1', 'C2', 'C3']);
        service['wordValidationService'].playedWords = playedWordsMap.set('word1', ['C1', 'C2', 'C3']);
        service['validateObjectiveThree'](2);
        lastPlayedWordsMap.clear();

        service['wordValidationService'].lastPlayedWords = lastPlayedWordsMap.set('word2', ['C1', 'C2', 'C3', 'C4']);
        service['wordValidationService'].playedWords = playedWordsMap.set('word2', ['C1', 'C2', 'C3', 'C4']);
        service['wordValidationService'].priorPlayedWords = priorPlayedWordsMap.set('word1', ['C1', 'C2', 'C3']);
        service['validateObjectiveThree'](2);
        lastPlayedWordsMap.clear();

        expect(spyOnObjectiveCompleted).toHaveBeenCalledTimes(0);
    });

    it("OBJ#6 Former un mot sur une case bonus à partir d'un mot déjà placé", () => {
        const spyOnObjectiveCompleted = spyOn<any>(service, 'addObjectiveScore');
        service['extendedWords'] = [];
        service['validateObjectiveSix'](5);
        expect(spyOnObjectiveCompleted).toHaveBeenCalledTimes(0);

        service['extendedWords'] = ['someWordExtended'];
        service['placementsService'].extendingPositions = ['F10', 'F11', 'F12'];
        service['validateObjectiveSix'](5);
        expect(spyOnObjectiveCompleted).toHaveBeenCalledTimes(1);

        service['extendedWords'] = ['someWordExtended'];
        service['placementsService'].extendingPositions = ['H9', 'H10', 'H11'];
        service['validateObjectiveSix'](5);
        expect(spyOnObjectiveCompleted).toHaveBeenCalledTimes(1);
    });
});
