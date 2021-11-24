import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditDictionaryDialogComponent } from './edit-dictionary-dialog.component';

describe('EditDictionaryDialogComponent', () => {
    let component: EditDictionaryDialogComponent;
    let fixture: ComponentFixture<EditDictionaryDialogComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [EditDictionaryDialogComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(EditDictionaryDialogComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
