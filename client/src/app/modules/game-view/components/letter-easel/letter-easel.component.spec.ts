import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LetterEaselComponent } from './letter-easel.component';
import { PlayerService } from '@app/services/player.service';

describe('LetterEaselComponent', () => {
    let component: LetterEaselComponent;
    let fixture: ComponentFixture<LetterEaselComponent>;
    let playerServiceSpy: jasmine.SpyObj<PlayerService>;

    beforeEach(() => {
        playerServiceSpy = jasmine.createSpyObj('PlayerService', ['updateLettersEasel', 'getLettersEasel']);
     });

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [LetterEaselComponent],
            providers: [{ provide: PlayerService, useValue: playerServiceSpy }]
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(LetterEaselComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('each initialization should update by calling by calling getLettersEasel of player service', () => {
        let updateSpy = spyOn<any>(component, 'update');
        component.ngOnInit();
        expect(updateSpy).toHaveBeenCalled();
        expect(playerServiceSpy.getLettersEasel).toHaveBeenCalled();
    });
});
