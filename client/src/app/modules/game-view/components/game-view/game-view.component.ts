import { Component, OnInit } from '@angular/core';
import { ClientSocketService } from '@app/services/client-socket.service';

@Component({
    selector: 'app-game-view',
    templateUrl: './game-view.component.html',
    styleUrls: ['./game-view.component.scss'],
})
export class GameViewComponent implements OnInit {
    constructor(public clientSocketService: ClientSocketService) {}
    ngOnInit() {
        this.clientSocketService.delete();
        return;
    }
}
