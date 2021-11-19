// import { Injectable } from '@angular/core';
// import { ClientSocketService } from '@app/services/client-socket.service';
// import { GameSettingsService } from './game-settings.service';
// import { PlayerService } from './player.service';
// import { SkipTurnService } from './skip-turn.service';
// // import { PlayerAI } from '@app/models/player-ai.model';
// // import { PlayerAIService } from './player-ia.service';

// @Injectable({
//     providedIn: 'root',
// })
// export class GiveUpHandlerService {
//     constructor(
//         public gameSettingsService: GameSettingsService,
//         private clientSocket: ClientSocketService,
//         public playerService: PlayerService,
//         public skipturnService: SkipTurnService, // private playerAIservice: PlayerAIService,
//     ) {
//         this.receiveEndGameByGiveUp();
//         // console.log('Jenvoie le signal');
//     }

//     receiveEndGameByGiveUp(): void {
//         this.clientSocket.socket.on('receiveEndGameByGiveUp', (isEndGameByGiveUp: boolean, winnerName: string) => {
//             // console.log('winner' + winnerName);
//             // console.log('Myclientname' + this.gameSettingsService.gameSettings.playersName[0]);
//             // this.isEndGameByGiveUp = isEndGameByGiveUp;
//             // this.winnerNameByGiveUp = winnerName;
//             this.gameSettingsService.gameSettings.playersName[1] = 'Miis_Betty';
//             this.playerService.players[1].name = 'Miss_Betty';
//             if (winnerName === this.gameSettingsService.gameSettings.playersName[0]) {
//                 this.gameSettingsService.isSoloMode = isEndGameByGiveUp;
//                 // console.log('Mon joeur restant est bien à lindece 0');
//                 // if (this.skipturnService.isTurn) return;
//                 // const playerAi = new PlayerAI(2, 'MIsse_Betty', this.playerService.players[1].letterTable, this.playerAIservice);
//                 // this.playerService.players[1] = playerAi;
//                 // this.gameSettingsService.gameSettings.playersName[1] = 'Miss_Betty';
//                 // console.log('Jessaie de faire jouer IA');
//                 // playerAi.play();
//             }
//         });
//     }
// }
