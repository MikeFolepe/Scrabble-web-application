/* eslint-disable no-restricted-imports */
/* eslint-disable @typescript-eslint/no-magic-numbers */
import { Component, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { ClientSocketService } from '@app/services/client-socket.service';
import { Room, State } from '../../classes/room';

@Component({
    selector: 'app-join-room',
    templateUrl: './join-room.component.html',
    styleUrls: ['./join-room.component.scss'],
})
export class JoinRoomComponent implements OnInit {
    rooms: Room[] = [];
    pageSize: number;
    startIdx: number;

    constructor(private clientSocketService: ClientSocketService) {
        this.clientSocketService.socket.connect();
        this.clientSocketService.socket.emit('getRoomsConfigurations');
        this.clientSocketService.socket.on('roomConfiguration', (room: Room[]) => {
            this.rooms = room;
            console.log(this.rooms);
        });
        this.startIdx = 0;
        this.pageSize = 2;
    }

    onPageChange(event: PageEvent) {
        // offset in rooms[] since we're displaying 2rooms per page
        this.startIdx = event.pageSize * event.pageIndex;
    }

    computeRoomState(state: State): string {
        if (state === State.Waiting) {
            return 'En attente';
        }

        return 'Occupé';
    }

    ngOnInit(): void {
        return;
    }
}
