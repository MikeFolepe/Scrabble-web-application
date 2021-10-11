import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GameSettings, StartingPlayer } from '@app/classes/game-settings';
import { PassTurnService } from '@app/services/pass-turn.service';
import { InformationPanelComponent } from './information-panel.component';

describe('InformationPanelComponent', () => {
    let component: InformationPanelComponent;
    let fixture: ComponentFixture<InformationPanelComponent>;
    let passTurnSpy: unknown;

    beforeEach(() => {
        passTurnSpy = jasmine.createSpyObj('PassTurnService', ['startTimer']);
    });

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [InformationPanelComponent],
            providers: [{ provide: PassTurnService, useValue: passTurnSpy }],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(InformationPanelComponent);
        component = fixture.componentInstance;
        component.gameSettings = new GameSettings(['player1', 'player2'], StartingPlayer.Player1, '01', '00', 'facile', false, 'dictionary.json');
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should call clearPlayers on Destroy', () => {
        spyOn(component.playerService, 'clearPlayers');
        component.ngOnDestroy();
        expect(component.playerService.clearPlayers).toHaveBeenCalled();
    });
});
