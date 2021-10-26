/* eslint-disable no-restricted-imports */
/* eslint-disable @typescript-eslint/no-magic-numbers */
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { DialogComponent } from '@app/modules/initialize-solo-game/dialog/dialog.component';
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
    isNameValid: boolean;

    constructor(private clientSocketService: ClientSocketService, public dialog: MatDialog) {
        this.isNameValid = true;
        this.clientSocketService.socket.connect();
        this.clientSocketService.socket.emit('getRoomsConfigurations');
        this.clientSocketService.socket.on('roomConfiguration', (room: Room[]) => {
            this.rooms = room;
            // console.log(this.rooms);
        });
        this.startIdx = 0;
        this.pageSize = 2;
        console.log(this.rooms);
        this.clientSocketService.route();
    }

    onPageChange(event: PageEvent) {
        // offset in rooms[] since we're displaying 2rooms per page
        this.startIdx = event.pageSize * event.pageIndex;
    }

    computeRoomState(state: State): string {
        if (state === State.Waiting) {
            return 'En attente';
        }

        return 'Indisponible';
    }

    join(room: Room) {
        console.log(this.dialog);
        const ref = this.dialog.open(DialogComponent, { disableClose: true });

        ref.afterClosed().subscribe((playerName: string) => {
            // if user closes the dialog box without input nothing
            if (playerName === null) return;
            // if name matches
            if (room.ownerName === playerName) {
                this.isNameValid = false;
                setTimeout(() => {
                    this.isNameValid = true;
                }, 4000);
                return;
            }
            this.clientSocketService.roomId = room.id;
            this.clientSocketService.socket.emit('newRoomCustomer', playerName, room.id);
        });
    }

    ngOnInit(): void {
        return;
    }
}
