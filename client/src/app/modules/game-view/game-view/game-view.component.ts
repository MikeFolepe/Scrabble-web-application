import { Component /* OnInit*/ } from '@angular/core';
// import { ClientSocketService } from '@app/services/client-socket.service';
// import { SkipTurnService } from '@app/services/skip-turn.service';

@Component({
    selector: 'app-game-view',
    templateUrl: './game-view.component.html',
    styleUrls: ['./game-view.component.scss'],
})
export class GameViewComponent {
    // constructor(public clientSocketService: ClientSocketService, public skipTurn: SkipTurnService) {}
    // ngOnInit() {
    //     if (!this.skipTurn.gameSettingsService.isSoloMode) {
    //         setTimeout(() => {
    //             this.clientSocketService.socket.on('startTimer', () => {
    //                 this.skipTurn.startTimer();
    //             });
    //         }, 500);
    //     }
    // }
}
