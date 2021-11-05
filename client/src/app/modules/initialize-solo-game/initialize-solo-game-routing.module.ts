import { RouterModule, Routes } from '@angular/router';
import { FormComponent } from './form/form.component';
import { GameViewComponent } from '@app/modules/game-view/game-view/game-view.component';
import { NgModule } from '@angular/core';

const routes: Routes = [
    { path: '', component: FormComponent },
    { path: '/game', component: GameViewComponent },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class InitializeSoloGameRoutingModule {}
