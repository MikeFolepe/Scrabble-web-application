/* eslint-disable dot-notation */
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { RouterTestingModule } from '@angular/router/testing';
import { Player } from '@app/models/player.model';
import { of } from 'rxjs';
import { GameViewComponent } from './game-view.component';

describe('GameViewComponent', () => {
    let component: GameViewComponent;
    let fixture: ComponentFixture<GameViewComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [GameViewComponent],
            imports: [RouterTestingModule, HttpClientTestingModule],
            providers: [
                {
                    provide: MatDialog,
                    useValue: {},
                },
            ],
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

    it('should emit an event if decision if false ', () => {
        const matDialogRefMock = jasmine.createSpyObj('MatDialogRef', ['afterClosed']);
        matDialogRefMock.afterClosed.and.callFake(() => {
            return of(true);
        });
        const matDialogMock = jasmine.createSpyObj('MatDialog', ['open']);
        matDialogMock.open.and.callFake(() => {
            return matDialogRefMock;
        });
        component.dialog = matDialogMock;
        const spyEmit = spyOn(component['clientSocketService'].socket, 'emit');
        const spyMessage = spyOn(component.sendMessageService, 'sendConversionMessage');
        component.giveUpGame();
        expect(spyMessage).toHaveBeenCalled();
        expect(spyEmit).toHaveBeenCalled();
    });

    it('should not emit an event if decision if true ', () => {
        const matDialogRefMock = jasmine.createSpyObj('MatDialogRef', ['afterClosed']);
        matDialogRefMock.afterClosed.and.callFake(() => {
            return of(false);
        });
        const matDialogMock = jasmine.createSpyObj('MatDialog', ['open']);
        matDialogMock.open.and.callFake(() => {
            return matDialogRefMock;
        });
        component.dialog = matDialogMock;
        const spyEmit = spyOn(component['clientSocketService'].socket, 'emit');
        const spyMessage = spyOn(component.sendMessageService, 'sendConversionMessage');
        component.giveUpGame();
        expect(spyEmit).not.toHaveBeenCalled();
        expect(spyMessage).not.toHaveBeenCalled();
    });
});
