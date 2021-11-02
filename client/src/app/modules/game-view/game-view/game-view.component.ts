import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ClientSocketService } from '@app/services/client-socket.service';
import { GameSettingsService } from '@app/services/game-settings.service';
import { GridService } from '@app/services/grid.service';
@Component({
    selector: 'app-game-view',
    templateUrl: './game-view.component.html',
    styleUrls: ['./game-view.component.scss'],
})
export class GameViewComponent implements OnInit {
    constructor(
        public clientSocketService: ClientSocketService,
        private router: Router,
        private gridService: GridService,
        private gameSettingsService: GameSettingsService,
    ) {}
    ngOnInit() {
        let mapBonus = new Map<string, string>();
        JSON.parse(this.gameSettingsService.gameSettings.bonusPositions).map((element: Array<string>) => {
            mapBonus.set(element[0], element[1]);
        });
        this.gridService.bonusPositions = mapBonus;
        this.clientSocketService.socket.on('goToMainMenu', () => {
            this.router.navigate(['home']);
        });
    }
}
