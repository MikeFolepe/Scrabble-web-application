import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InitializeSoloGameRoutingModule } from './initialize-solo-game-routing.module';
import { FormComponent } from './form/form.component';


@NgModule({
  declarations: [
    FormComponent
  ],
  imports: [
    CommonModule,
    InitializeSoloGameRoutingModule
  ]
})
export class InitializeSoloGameModule { }
