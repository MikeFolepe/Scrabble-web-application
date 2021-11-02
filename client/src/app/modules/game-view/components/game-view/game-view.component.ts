import { Component } from '@angular/core';
import { ClientSocketService } from '@app/services/client-socket.service';

@Component({
    selector: 'app-game-view',
    templateUrl: './game-view.component.html',
    styleUrls: ['./game-view.component.scss'],
})
export class GameViewComponent {
    constructor(private clientSocketService: ClientSocketService) {
        this.clientSocketService.route();
    }
}
