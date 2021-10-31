import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
<<<<<<< HEAD
// import { GameSettingsService } from '@app/services/game-settings.service';
// import { RandomBonusesService } from '@app/services/random-bonuses.service';
=======
>>>>>>> b7bc76bb223ef4674011ed696c8d797922f78013

@Component({
    selector: 'app-random-bonus',
    templateUrl: './random-bonus.component.html',
    styleUrls: ['./random-bonus.component.scss'],
})
export class RandomBonusComponent implements OnInit {
    @Input() parentForm: FormGroup;
<<<<<<< HEAD
    randomBonusSelectionList: string[] = ['Désactiver', 'Activer'];

    ngOnInit(): void {
        // The random bonus state is required for form to submit
=======
    randomBonusSelectionList: string[] = ['Non', 'Oui'];

    ngOnInit(): void {
>>>>>>> b7bc76bb223ef4674011ed696c8d797922f78013
        this.parentForm.controls.randomBonus.setValidators([Validators.required]);
    }
}
