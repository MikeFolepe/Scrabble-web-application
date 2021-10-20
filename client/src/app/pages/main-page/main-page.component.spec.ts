import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MainPageComponent } from '@app/pages/main-page/main-page.component';

describe('MainPageComponent', () => {
    let component: MainPageComponent;
    let fixture: ComponentFixture<MainPageComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [HttpClientModule],
            declarations: [MainPageComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(MainPageComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should be able to reset radio buttons', () => {
        component.selectedMode = component.games[0];
        fixture.detectChanges();

        component.resetRadios();
        fixture.detectChanges();

        expect(component.selectedMode).toBeUndefined();
    });

    it('should disable buttons if nothing is selected', () => {
        const resetButton = fixture.debugElement.nativeElement.querySelector('#resetButton');
        const playButton = fixture.debugElement.nativeElement.querySelector('#playButton');

        component.selectedMode = component.modes[0];
        fixture.detectChanges();

        expect(resetButton.disabled).toBeFalsy();
        expect(playButton.disabled).toBeFalsy();

        component.resetRadios();
        fixture.detectChanges();

        expect(resetButton.disabled).toBeTruthy();
        expect(playButton.disabled).toBeTruthy();
    });
});
