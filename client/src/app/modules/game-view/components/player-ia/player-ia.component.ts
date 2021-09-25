import { Component, OnInit } from '@angular/core';
import { LetterService } from '@app/services/letter.service';

@Component({
    selector: 'app-player-ia',
    templateUrl: './player-ia.component.html',
    styleUrls: ['./player-ia.component.scss'],
})
export class PlayerIAComponent implements OnInit {
    constructor(public letterService: LetterService) {}

    ngOnInit(): void {}
}
