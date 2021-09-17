import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
// eslint-disable-next-line no-restricted-imports
import { DifficultyService } from '../services/difficulty.service';

@Component({
    selector: 'app-level-field',
    templateUrl: './level-field.component.html',
    styleUrls: ['./level-field.component.scss'],
})
export class LevelFieldComponent implements OnInit {
    @Input() parentForm: FormGroup;
    difficultySelectionList: string[];
    // eslint-disable-next-line @typescript-eslint/no-useless-constructor
    constructor(private difficultyService_: DifficultyService) {
        // this.parentForm.addControl('playerName', new FormControl('', [Validators.required]));
        // do nothing
    }

    // eslint-disable-next-line @angular-eslint/no-empty-lifecycle-method
    ngOnInit(): void {
        // this.parentForm.addControl('level', new FormControl('', [Validators.required]));
        // eslint-disable-next-line no-underscore-dangle
        this.difficultySelectionList = this.difficultyService_.getLevel();
        this.parentForm.controls.levelInput.setValidators([Validators.required]);
    }
}
