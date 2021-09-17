import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormComponent } from './form/form.component';
import { InitializeSoloGameRoutingModule } from './initialize-solo-game-routing.module';
import { LevelFieldComponent } from './level-field/level-field.component';
import { PlayerNameFieldComponent } from './player-name-field/player-name-field.component';
import { TimerFieldComponent } from './timer-field/timer-field.component';

@NgModule({
    declarations: [FormComponent, PlayerNameFieldComponent, TimerFieldComponent, LevelFieldComponent],
    imports: [CommonModule, InitializeSoloGameRoutingModule],
})
export class InitializeSoloGameModule {}
