import { Component } from '@angular/core';
import { Player } from '@app/classes/player';
//import { Tour } from '@app/classes/tour';

@Component({
    selector: 'app-information-panel',
    templateUrl: './information-panel.component.html',
    styleUrls: ['./information-panel.component.scss'],
})
export class InformationPanelComponent {
    players: Player[] = [];
    constructor() {}

    //ngOnInit(): void {

   // }
}
