import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PassTourComponent } from './pass-tour.component';

describe('PassTourComponent', () => {
    let component: PassTourComponent;
    let fixture: ComponentFixture<PassTourComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [PassTourComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(PassTourComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it("should write '!passer' when toogleTour() is called", () => {
        // eslint-disable-next-line dot-notation
        const writeMessageSpy = spyOn(component['passtourService'], 'writeMessage');
        component.toogleTour();
        expect(writeMessageSpy).toHaveBeenCalledOnceWith('!passer');
    });
});
