/* eslint-disable @typescript-eslint/no-magic-numbers */
import { Component, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { Room } from '@app/classes/room';
import { ClientSocketService } from '@app/services/client-socket.service';

@Component({
    selector: 'app-join-room',
    templateUrl: './join-room.component.html',
    styleUrls: ['./join-room.component.scss'],
})
export class JoinRoomComponent implements OnInit {
    rooms: Room[] = [];
    length: number = 4;
    pageSize = 2;

    // MatPaginator Output
    pageEvent: PageEvent;
    // eslint-disable-next-line @typescript-eslint/no-useless-constructor
    constructor(public clientSocketService: ClientSocketService) {
        // do nothing
        // this.clientSocketService.socketHandler();
        // console.log(this.clientSocketService.roomsConfiguration);
        // this.length = this.clientSocketService.roomsConfiguration.length;
    }

    ngOnInit(): void {
        this.clientSocketService.socket.connect();
        setTimeout(() => {
            console.log(this.clientSocketService.socket.id);
            console.log(this.clientSocketService.socket.connected);
            this.clientSocketService.socket.on('roomConfiguration', (room: Room[]) => {
                this.rooms = room;
                this.length = room.length;
                console.log(this.rooms);
            });
            this.clientSocketService.socket.emit('getRoomsConfigurations');
        }, 1000);

        return;
    }
}
