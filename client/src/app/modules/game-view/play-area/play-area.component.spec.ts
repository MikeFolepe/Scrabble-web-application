/* eslint-disable dot-notation */
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { RouterTestingModule } from '@angular/router/testing';
import { PlayAreaComponent } from '@app/modules/game-view/play-area/play-area.component';
import { ClientSocketService } from '@app/services/client-socket.service';
import { of } from 'rxjs';

describe('PlayAreaComponent', () => {
    let component: PlayAreaComponent;
    let fixture: ComponentFixture<PlayAreaComponent>;
    let clientSocketServiceSpy: jasmine.SpyObj<ClientSocketService>;

    beforeEach(() => {
        clientSocketServiceSpy = jasmine.createSpyObj('ClientSocketService', ['']);
    });

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [PlayAreaComponent],
            imports: [HttpClientTestingModule, RouterTestingModule],
            providers: [
                {
                    provide: MatDialog,
                    useValue: {},
                },
                {
                    provide: ClientSocketService,
                    usevalue: clientSocketServiceSpy,
                },
            ],
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
    it('should emit an event if ecision if false ', () => {
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
        component.giveUpGame();
        // eslint-disable-next-line dot-notation
        expect(spyEmit).toHaveBeenCalled();
    });
    it('should  not emit an event if ecision if true ', () => {
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
        component.giveUpGame();
        // eslint-disable-next-line dot-notation
        expect(spyEmit).not.toHaveBeenCalled();
    });
});
