import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
// eslint-disable-next-line no-restricted-imports
import { GameViewComponent } from '../game-view/game-view/game-view.component';
import { FormComponent } from './form/form.component';

const routes: Routes = [
    { path: '', component: FormComponent },
    { path: '/game', component: GameViewComponent },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class InitializeSoloGameRoutingModule {}
