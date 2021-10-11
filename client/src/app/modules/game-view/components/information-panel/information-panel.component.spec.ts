// import { LetterService } from '@app/services/letter.service';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ONE_SECOND_TIME } from '@app/classes/constants';
import { GameSettings, StartingPlayer } from '@app/classes/game-settings';
// import { GameSettingsService } from '@app/services/game-settings.service';
// import { PassTurnService } from '@app/services/pass-turn.service';
// import { PlayerService } from '@app/services/player.service';
import { InformationPanelComponent } from './information-panel.component';

fdescribe('InformationPanelComponent', () => {
    // let letterServiceSpy: jasmine.SpyObj<LetterService>;
    let component: InformationPanelComponent;
    let fixture: ComponentFixture<InformationPanelComponent>;
    // let gameSettingsServiceSpy: jasmine.SpyObj<GameSettingsService>;
    // let playerServiceSpy: jasmine.SpyObj<PlayerService>;
    // let passTurnServiceSpy: jasmine.SpyObj<PassTurnService>;

    // beforeEach(() => {
    //     // letterServiceSpy = jasmine.createSpyObj('LetterService', ['getReserveSize', 'updateView', 'getRandomLetters', 'getReserveSize']);
    //     gameSettingsServiceSpy = jasmine.createSpyObj('GameSettingsService', ['gameSettings']);
    //     playerServiceSpy = jasmine.createSpyObj('PlayerService', ['addPlayer', 'clearPlayers']);
    //     passTurnServiceSpy = jasmine.createSpyObj('PassTurnService', ['startTimer']);
    // });

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [InformationPanelComponent],
            // providers: [
            //     { provide: GameSettingsService, useValue: gameSettingsServiceSpy },
            //     { provide: PlayerService, useValue: playerServiceSpy },
            //     { provide: PassTurnService, useValue: passTurnServiceSpy },
            // ],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(InformationPanelComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
        const playersName: string[] = ['player1', 'player2'];
        const startingPlayer: StartingPlayer = StartingPlayer.Player1;
        component.gameSettings = new GameSettings(playersName, startingPlayer, '01', '00', 'facile', false, 'dictionary.json');
    });

    // afterEach(() => {
    //     component.ngOnDestroy();
    // });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('initialization should initialize players', () => {
        // ngOnInit has made players initialization by calling initialize players.
        spyOn(component.playerService, 'addPlayer');
        component.initializePlayers();
        expect(component.playerService.addPlayer).toHaveBeenCalledTimes(2);
    });

    // it('initialization should initialize firstTurn', () => {
    //     // ngOnInit has made players initialization by calling initialize players.
    //     expect(passTurnServiceSpy.isTurn).toEqual()
    // });

    it('should call startTimer onInit', () => {
        // component.ngOnInit();
        spyOn(passTurnServiceSpy, 'startTimer');
        jasmine.clock().tick(ONE_SECOND_TIME + 1);
        expect(passTurnServiceSpy.startTimer).toHaveBeenCalled();
    });

    it('should call initializePlayers onInit', () => {
        // component.ngOnInit();
        spyOn(component, 'initializePlayers');
        expect(component.initializePlayers).toHaveBeenCalled();
    });

    it('should call initializeFirstTurn onInit', () => {
        // component.ngOnInit();
        spyOn(component, 'initializeFirstTurn');
        expect(component.initializeFirstTurn).toHaveBeenCalled();
    });

    it('should call clearPlayers on Destroy', () => {
        // component.ngOnDestroy();
        // spyOn(playerServiceSpy, 'clearPlayers');
        expect(playerServiceSpy.clearPlayers).toHaveBeenCalled();
    });
});
