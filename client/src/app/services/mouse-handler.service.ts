import { Injectable } from '@angular/core';
import { MouseButton } from '@app/classes/constants';
import { Vec2 } from '@app/classes/vec2';

@Injectable({
  providedIn: 'root'
})
export class MouseHandlerService {

  mousePosition: Vec2 = { x: 0, y: 0 };

  constructor() { }

  mouseHitDetect(event: MouseEvent) {
    if (event.button === MouseButton.Left) {
        this.mousePosition = { x: event.offsetX, y: event.offsetY };
    }
  }
}