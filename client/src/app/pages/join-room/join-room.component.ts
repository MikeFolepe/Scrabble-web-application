/* eslint-disable @typescript-eslint/no-magic-numbers */
import { Component, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';

@Component({
    selector: 'app-join-room',
    templateUrl: './join-room.component.html',
    styleUrls: ['./join-room.component.scss'],
})
export class JoinRoomComponent implements OnInit {
    length = 30;
    pageSize = 10;

    // MatPaginator Output
    pageEvent: PageEvent;
    // eslint-disable-next-line @typescript-eslint/no-useless-constructor
    constructor() {
        // do nothing
    }

    ngOnInit(): void {
        return;
    }
}
