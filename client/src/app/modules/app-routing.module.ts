import { FormComponent } from './initialize-solo-game/form/form.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PageNotFoundComponent } from '@app/components/page-not-found/page-not-found.component';
import { MainPageComponent } from '@app/pages/main-page/main-page.component';
import { GameViewComponent } from './game-view/components/game-view/game-view.component';

const routes: Routes = [
    { path: '', redirectTo: '/home', pathMatch: 'full' },
    { path: 'home', component: MainPageComponent },
    { path: 'solo-game-ai', component: FormComponent },
    { path: 'game', component: GameViewComponent },
    { path: 'page-not-found', component: PageNotFoundComponent },
    { path: '**', redirectTo: '/page-not-found', pathMatch: 'full' },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
})
export class AppRoutingModule {}
