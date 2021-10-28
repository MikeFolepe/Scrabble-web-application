import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from '@app/modules/app-routing.module';
import { AppMaterialModule } from '@app/modules/material.module';
import { AppComponent } from '@app/pages/app/app.component';
import { MainPageComponent } from '@app/pages/main-page/main-page.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { GameViewModule } from './modules/game-view/game-view.module';
import { InitializeSoloGameModule } from './modules/initialize-solo-game/initialize-solo-game.module';
import { SharedModule } from './modules/shared/shared/shared.module';
import { JoinRoomComponent } from './pages/join-room/join-room.component';
import { WaitingRoomComponent } from './pages/waiting-room/waiting-room.component';

/**
 * Main module that is used in main.ts.
 * All automatically generated components will appear in this module.
 * Please do not move this module in the module folder.
 * Otherwise Angular Cli will not know in which module to put new component
 */
@NgModule({
<<<<<<< HEAD
    declarations: [AppComponent, MainPageComponent, PageNotFoundComponent, WaitingRoomComponent, JoinRoomComponent],
=======
    declarations: [AppComponent, MainPageComponent, PageNotFoundComponent],
>>>>>>> 9fef5b9307a31a22229ab27da685083c2eef4485
    imports: [
        AppMaterialModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        BrowserModule,
        FormsModule,
        HttpClientModule,
        GameViewModule,
        InitializeSoloGameModule,
        SharedModule,
        MatProgressSpinnerModule,
        MatPaginatorModule,
        MatCardModule,
    ],
    providers: [],
    bootstrap: [AppComponent],
})
export class AppModule {}
