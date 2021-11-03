import { ComponentFixture, TestBed } from '@angular/core/testing';
// import { ClientSocketService } from '@app/services/client-socket.service';
import { JoinRoomComponent } from './join-room.component';
import { MatDialog } from '@angular/material/dialog';
import { NO_ERRORS_SCHEMA } from '@angular/core';
// import { PageEvent } from '@angular/material/paginator';
import { RouterTestingModule } from '@angular/router/testing';

describe('JoinRoomComponent', () => {
    let component: JoinRoomComponent;
    let fixture: ComponentFixture<JoinRoomComponent>;
    // let clientSocketServiceSpyjob: jasmine.SpyObj<ClientSocketService>;

    // beforeEach(() => {
    //     clientSocketServiceSpyjob = jasmine.createSpyObj('ClientSocketService', ['route']);
    // });
    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [JoinRoomComponent],
            imports: [RouterTestingModule],
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
        fixture = TestBed.createComponent(JoinRoomComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should return the state of room is the state is waiting', () => {
        expect(component.computeRoomState(0)).toEqual('Indisponible');
    });

    it('should return the state of room is the state is Playing', () => {
        expect(component.computeRoomState(1)).toEqual('En attente');
    });

    // it('should update the page size after a PAgeEvent', () => {
    //     // const page: PageEvent = new PageEvent();
    //     // expect(component.onPageChange(page)).toHaveBeenCalled();
    // });
});
