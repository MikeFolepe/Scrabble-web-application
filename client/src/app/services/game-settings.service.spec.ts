import { TestBed } from '@angular/core/testing';
import { GameSettings, StartingPlayer } from '@app/classes/game-settings';
import { GameSettingsService } from './game-settings.service';

describe('GameSettingsService', () => {
    let service: GameSettingsService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(GameSettingsService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('settings initialization should emit game settings', () => {
        let settings: GameSettings = new GameSettings(
            ['player1','player2'],
            StartingPlayer.Player1,
            '00',
            '30',
            'facile',
            false,
            'français',
        ) 
        let emitGameSettingsSpy = spyOn<any>(service, 'emitGameSettings').and.callThrough(); 
        service.initializeSettings(settings);
        expect(emitGameSettingsSpy).toHaveBeenCalled();
    });
});
