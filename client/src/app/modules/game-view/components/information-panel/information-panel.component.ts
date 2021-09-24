import { Component, OnDestroy, OnInit } from '@angular/core';
import { Player } from '@app/models/player.model';
import { GameSettingsService } from '@app/services/game-settings.service';
import { LetterService } from '@app/services/letter.service';
import { Subscription } from 'rxjs';
import { GameSettings } from '@app/classes/game-settings';
import { PlayerService } from '@app/services/player.service';
import { PLAYERS_NUMBER } from '@app/classes/constants';

@Component({
    selector: 'app-information-panel',
    templateUrl: './information-panel.component.html',
    styleUrls: ['./information-panel.component.scss'],
})
export class InformationPanelComponent implements OnInit, OnDestroy {
    players: Player[] = new Array<Player>();
    gameSettings: GameSettings;
    settingsSubscription: Subscription = new Subscription();
    playerSubscription: Subscription = new Subscription();
    constructor(private gameSettingsService: GameSettingsService, private letterService: LetterService, private playerService: PlayerService) {}
    ngOnInit(): void {
        this.initializePlayers();
    }

    initializePlayers() {
        this.settingsSubscription = this.gameSettingsService.gameSettingsSubject.subscribe((gameSettingsFromSubject: GameSettings) => {
            this.gameSettings = gameSettingsFromSubject;
        });
        this.gameSettingsService.emitGameSettings();
        let id = 0;
        for (let i = 0; i < PLAYERS_NUMBER; i++) {
            const player = new Player(id++, this.gameSettings.playersName[i], 0, this.letterService.getRandomLetters());
            this.playerService.addPlayer(player);
        }
        this.playerSubscription = this.playerService.playerSubject.subscribe((playersFromSubject: Player[]) => {
            this.players = playersFromSubject;
        });
        this.playerService.emitPlayers();
    }

    ngOnDestroy() {
        this.settingsSubscription.unsubscribe();
        this.playerSubscription.unsubscribe();
    }
}
