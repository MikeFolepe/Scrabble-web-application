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
        // setTimeout(() => {
        // console.log('roomId : ' + this.clientSocketService.roomId);
        // }, 1000);
        return;
    }
}
