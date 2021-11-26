/* eslint-disable dot-notation */
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PlayAreaComponent } from '@app/modules/game-view/play-area/play-area.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

describe('PlayAreaComponent', () => {
    let component: PlayAreaComponent;
    let fixture: ComponentFixture<PlayAreaComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [PlayAreaComponent],
            imports: [HttpClientTestingModule, RouterTestingModule],
            schemas: [NO_ERRORS_SCHEMA],
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