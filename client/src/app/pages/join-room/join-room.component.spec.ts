import { ComponentFixture, TestBed } from '@angular/core/testing';
import { JoinRoomComponent } from './join-room.component';
import { RouterTestingModule } from '@angular/router/testing';
import { MatDialog } from '@angular/material/dialog';

describe('JoinRoomComponent', () => {
    let component: JoinRoomComponent;
    let fixture: ComponentFixture<JoinRoomComponent>;

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
});
