import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { DEFAULT_FONT_SIZE, FONT_SIZE_MAX, FONT_SIZE_MIN } from '@app/classes/constants';

@Component({
    selector: 'app-font-size',
    templateUrl: './font-size.component.html',
    styleUrls: ['./font-size.component.scss'],
})
export class FontSizeComponent implements OnInit {
    constructor() {}

    ngOnInit(): void {}

    @Input() fontSize: number = DEFAULT_FONT_SIZE;
    @Output() sizeChange = new EventEmitter<number>();

    decrement() {
        this.resize(-1);
    }
    increment() {
        this.resize(+1);
    }

    resize(delta: number) {
        this.fontSize = Math.min(FONT_SIZE_MAX, Math.max(FONT_SIZE_MIN, +this.fontSize + delta));
        this.sizeChange.emit(this.fontSize);
    }
}
