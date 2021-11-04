import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule } from '@angular/material/dialog';
// import { PageEvent } from '@angular/material/paginator';
import { RouterTestingModule } from '@angular/router/testing';
import { State } from '../../../../../common/room';
import { JoinRoomComponent } from './join-room.component';

describe('JoinRoomComponent', () => {
    let component: JoinRoomComponent;
    let fixture: ComponentFixture<JoinRoomComponent>;
    let state: State.Playing;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [JoinRoomComponent],
            imports: [RouterTestingModule, HttpClientTestingModule, MatDialogModule],
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
        expect(component.computeRoomState(state)).toEqual('Indisponible');
    });

    it('should return the state of room is the state is Playing', () => {
        expect(component.computeRoomState(1)).toEqual('En attente');
    });

    // it('should update the page size after a PAgeEvent', () => {
    //     // const page: PageEvent = new PageEvent();
    //     // expect(component.onPageChange(page)).toHaveBeenCalled();
    // });
});
