import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PlayerNameFieldComponent } from './player-name-field.component';

describe('PlayerNameFieldComponent', () => {
    //let component: PlayerNameFieldComponent;
    let fixture: ComponentFixture<PlayerNameFieldComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [PlayerNameFieldComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(PlayerNameFieldComponent);
        //component = fixture.componentInstance;
        fixture.detectChanges();
    });
});
