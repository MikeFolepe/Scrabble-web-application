import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InformationPanelComponent } from './information-panel.component';
import { SkipTurnService } from '@app/services/skip-turn.service';

describe('InformationPanelComponent', () => {
    let component: InformationPanelComponent;
    let fixture: ComponentFixture<InformationPanelComponent>;
    let skipTurnSpy: unknown;

    beforeEach(() => {
        skipTurnSpy = jasmine.createSpyObj('SkipTurnService', ['startTimer']);
    });

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [InformationPanelComponent],
            providers: [{ provide: SkipTurnService, useValue: skipTurnSpy }],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(InformationPanelComponent);
        component = fixture.componentInstance;
        // component.gameSettings = new GameSettings(['player1', 'player2'], StartingPlayer.Player1, '01', '00', 'facile', false, 'dictionary.json');
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
