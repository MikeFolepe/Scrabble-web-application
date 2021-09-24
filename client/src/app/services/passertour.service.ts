import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class PassertourService {
    text: string = '';

    setMessage(text: string) {
        this.text = text;
    }

    getmessage(): string {
        return this.text;
    }
}
