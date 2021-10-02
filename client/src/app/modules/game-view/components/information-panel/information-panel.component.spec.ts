import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LetterService } from '@app/services/letter.service';
// import { GameSettings, StartingPlayer } from '@app/classes/game-settings';
// import { GameSettingsService } from '@app/services/game-settings.service';
import { PlayerService } from '@app/services/player.service';
import { TourService } from '@app/services/tour.service';
import { InformationPanelComponent } from './information-panel.component';

describe('InformationPannelComponent', () => {
    let component: InformationPanelComponent;
    let fixture: ComponentFixture<InformationPanelComponent>;
    // let gameSettingsServiceSpy: jasmine.SpyObj<GameSettingsService>;
    let letterServiceSpy: jasmine.SpyObj<LetterService>;
    let playerServiceSpy: jasmine.SpyObj<PlayerService>;
    let tourServiceSpy: jasmine.SpyObj<TourService>;

    beforeEach(() => {
        // gameSettingsServiceSpy = jasmine.createSpyObj('GameSettingsService', ['getSettings']);
        letterServiceSpy = jasmine.createSpyObj('LetterService', ['getReserveSize', 'updateView', 'getRandomLetters', 'getReserveSize']);
        playerServiceSpy = jasmine.createSpyObj('PlayerService', ['getPlayers', 'addPlayer', 'getLettersEasel', 'getScore', 'clearPlayers']);
        tourServiceSpy = jasmine.createSpyObj('TourService', ['getTour', 'initializeTour']);
    });

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [InformationPanelComponent],
            providers: [
                /* { provide: GameSettingsService, useValue: gameSettingsServiceSpy },*/ { provide: LetterService, useValue: letterServiceSpy },
                { provide: PlayerService, useValue: playerServiceSpy },
                { provide: TourService, useValue: tourServiceSpy },
            ],
            // GameSettingsService, { provide: PlayerService, useValue: playerServiceSpy}]
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(InformationPanelComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    afterEach(() => {
        component.ngOnDestroy();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('initialization should initialize players, initialize tour and update view', () => {
        // ngOnInit has made players initialization by calling initialize players.
        expect(playerServiceSpy.addPlayer).toHaveBeenCalledTimes(2);
        expect(tourServiceSpy.initializeTour).toHaveBeenCalled();
        expect(letterServiceSpy.updateView).toHaveBeenCalled();
    });

    it('should switch tour value only if counter is null', () => {
        spyOn<any>(TourService, 'getTour').and.returnValue(true);
        // component.tour = true;
        const counter = 0;
        component.switchTour(counter);
        expect(component.tour).toEqual(false);
    });

    it('switch tour should switch tour value only if counter is null', () => {
        spyOn<any>(TourService, 'getTour').and.returnValue(false);
        const counter = 0;
        // component.tour =  false;
        component.switchTour(counter);
        expect(component.tour).toEqual(true);
    });

    it('switch tour should not switch tour value if counter is not null', () => {
        spyOn<any>(TourService, 'getTour').and.returnValue(true);
        const counter = 30;
        component.switchTour(counter);
        expect(component.tour).toEqual(true);
    });

    it('Updating view should use playerService to update each player letterEasel and each player score if message is --mise à jour--', () => {
        component.message = 'mise a jour';
        component.updateView();
        expect(playerServiceSpy.getLettersEasel).toHaveBeenCalledTimes(2);
        expect(playerServiceSpy.getScore).toHaveBeenCalledTimes(2);
    });

    it('Updating view should not do anything if message is not --mise à jour--', () => {
        component.message = 'mauvais message';
        component.updateView();
        expect(playerServiceSpy.getLettersEasel).not.toHaveBeenCalled();
        expect(playerServiceSpy.getScore).not.toHaveBeenCalled();
    });

    it('should clear players and unsubscribe on destroy', () => {
        spyOn<any>(component.viewSubscription, 'unsubscribe');
        component.ngOnDestroy;
        const clearPlayerSpy = spyOn<any>(PlayerService, 'clearPlayers');
        expect(clearPlayerSpy).toHaveBeenCalled();
        expect(component.viewSubscription).toHaveBeenCalled();
    });
});
