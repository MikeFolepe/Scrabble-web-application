/* eslint-disable dot-notation */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GameViewComponent } from './game-view.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { Player } from '@app/models/player.model';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('GameViewComponent', () => {
    let component: GameViewComponent;
    let fixture: ComponentFixture<GameViewComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [GameViewComponent],
            imports: [RouterTestingModule, HttpClientTestingModule],
            schemas: [NO_ERRORS_SCHEMA],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(GameViewComponent);
        component = fixture.componentInstance;
        spyOn(component['playerService'], 'bindUpdateEasel');
        fixture.detectChanges();
        component['playerService'].addPlayer(new Player(1, 'Player 1', []));
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should update component fontSize and playerService fontSize with new fontSize', () => {
        spyOn(component['playerService'], 'updateFontSize');
        const fontSize = 10;
        component.handleFontSizeEvent(fontSize);
        expect(component.fontSize).toEqual(fontSize);
        expect(component['playerService'].updateFontSize).toHaveBeenCalled();
    });
});
