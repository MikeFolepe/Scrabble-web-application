import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { GameSettingsService } from '@app/services/game-settings.service';
import { RandomBonusesService } from '@app/services/random-bonuses.service';

@Component({
    selector: 'app-random-bonus',
    templateUrl: './random-bonus.component.html',
    styleUrls: ['./random-bonus.component.scss'],
})
export class RandomBonusComponent implements OnInit {
    @Input() parentForm: FormGroup;
    randomBonusSelectionList: string[] = ['Désactiver', 'Activer'];
    private gameSettingsService: GameSettingsService;
    private randomBonusService: RandomBonusesService;

    ngOnInit(): void {
        // The random bonus state is required for form to submit
        this.parentForm.controls.randomBonus.setValidators([Validators.required]);
    }

    setRandomBonusesState(){
      if (this.gameSettingsService.gameSettings.randomBonus === 'Activer') this.randomBonusService.shuffleBonusesPositions();
    }
}
