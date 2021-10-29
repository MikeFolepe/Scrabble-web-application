import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ClientSocketService } from '@app/services/client-socket.service';
@Component({
    selector: 'app-game-view',
    templateUrl: './game-view.component.html',
    styleUrls: ['./game-view.component.scss'],
})
export class GameViewComponent implements OnInit {
    constructor(public clientSocketService: ClientSocketService, private router: Router) {}
    ngOnInit() {
        this.clientSocketService.socket.on('goToMainMenu', () => {
            this.router.navigate(['home']);
        });
    }
}
