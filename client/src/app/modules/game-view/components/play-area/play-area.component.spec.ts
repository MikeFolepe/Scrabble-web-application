/* eslint-disable dot-notation */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PlayAreaComponent } from '@app/modules/game-view/components/play-area/play-area.component';

describe('PlayAreaComponent', () => {
    let component: PlayAreaComponent;
    let fixture: ComponentFixture<PlayAreaComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [PlayAreaComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(PlayAreaComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('Pressing skip button should call sendPlayerMessage() from ChatBoxService to skip the turn', () => {
        spyOn(component['chatBoxService'], 'sendPlayerMessage');
        component.passButton();
        expect(component['chatBoxService'].sendPlayerMessage).toHaveBeenCalledWith('!passer');
    });

    it('Pressing play button should call confirmPlacement() from boardHandlerService', () => {
        spyOn(component['boardHandlerService'], 'confirmPlacement');
        component['boardHandlerService'].word = 'test';
        component.playButton();
        expect(component['boardHandlerService'].confirmPlacement).toHaveBeenCalled();
    });
});
