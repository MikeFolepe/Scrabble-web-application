import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { BackgroundComponent } from '@app/pages/background/background.component';
@NgModule({
    declarations: [BackgroundComponent],
    imports: [CommonModule],
    exports: [BackgroundComponent],
})
export class SharedModule {}
