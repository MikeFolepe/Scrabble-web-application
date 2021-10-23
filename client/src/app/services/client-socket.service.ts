/* eslint-disable no-restricted-imports */
/* eslint-disable @typescript-eslint/no-explicit-any */
// Explication: Afin d'avoir le type any associé à la variable socket
import { Injectable } from '@angular/core';
import { io } from 'node_modules/socket.io-client/build/esm';
import { Room } from '../../../../server/app/classes/room';

@Injectable({
    providedIn: 'root',
})
export class ClientSocketService {
    socket: any;
    rooms: Room[] = [];
    private urlString: string;

    constructor() {
        this.urlString = `http://${window.location.hostname}:3000`;
        this.socket = io(this.urlString);
    }
}
