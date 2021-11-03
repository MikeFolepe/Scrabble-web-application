import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { DELAY_OF_LOGIN } from '@app/classes/constants';
import { DialogComponent } from '@app/modules/initialize-solo-game/dialog/dialog.component';
import { ClientSocketService } from '@app/services/client-socket.service';
import { PlayerIndex } from '@common/PlayerIndex';
import { Room, State } from '@common/room';

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
    isRoomStillAvailable: boolean;

    constructor(private clientSocketService: ClientSocketService, public dialog: MatDialog) {
        this.isNameValid = true;
        this.isRoomStillAvailable = true;
        this.startIdx = 0;
        this.pageSize = 2; // 2 rooms per page
        this.clientSocketService.socket.connect();
        this.clientSocketService.socket.emit('getRoomsConfiguration');
        this.clientSocketService.route();
    }

    ngOnInit(): void {
        this.clientSocketService.socket.on('roomConfiguration', (room: Room[]) => {
            this.rooms = room;
        });

        this.clientSocketService.socket.on('roomAlreadyToken', () => {
            this.isRoomStillAvailable = false;
            setTimeout(() => {
                this.isRoomStillAvailable = true;
            }, DELAY_OF_LOGIN);
            return;
        });
    }

    onPageChange(event: PageEvent) {
        // set the offset for the view
        this.startIdx = event.pageSize * event.pageIndex;
    }

    computeRoomState(state: State): string {
        if (state === State.Waiting) {
            return 'En attente';
        }

        return 'Indisponible';
    }

    join(room: Room) {
        const ref = this.dialog.open(DialogComponent, { disableClose: true });

        ref.afterClosed().subscribe((playerName: string) => {
            // if user closes the dialog box without input nothing
            if (playerName === null) return;
            // if names are equals
            if (room.gameSettings.playersName[PlayerIndex.OWNER] === playerName) {
                this.isNameValid = false;
                setTimeout(() => {
                    this.isNameValid = true;
                }, DELAY_OF_LOGIN);
                return;
            }
            this.clientSocketService.socket.emit('newRoomCustomer', playerName, room.id);
        });
    }
}
