// JUSTIFICATION : Because the files are added in runtime with npm express-fileupload on the 'request' (req),
//                 the Typescript compiler does not recognize them and it fails. So, they are referenced with dot notation
/* eslint-disable dot-notation */

import { BestScoresService } from '@app/services/best-scores.service';
import { WordValidationService } from '@app/services/word-validation.service';
import { GameType } from '@common/game-type';
import { Request, Response, Router } from 'express';
import * as fileSystem from 'fs';
import { StatusCodes } from 'http-status-codes';
import { Service } from 'typedi';

@Service()
export class GameController {
    router: Router;
    constructor(private wordValidator: WordValidationService, private bestScoresService: BestScoresService) {
        this.configureRouter();
    }
    private configureRouter(): void {
        this.router = Router();
        /**
         * @swagger
         *
         * /api/game/validateWords:
         *   post:
         *     description: return the validation result of a placed word
         *     tags:
         *       - Multiplayer
         *     produces:
         *       - a boolean that describe the result
         *     responses:
         *       200
         *
         * /api/game/uploadDictionary:
         *   post:
         *     description: upload a dictionary (json file) to server
         *     tags:
         *       - Multiplayer
         *     produces:
         *       - nothing for now
         *     responses:
         *       200
         */
        this.router.post('/validateWords/:fileName', (req: Request, res: Response) => {
            const validation = this.wordValidator.isValidInDictionary(req.body, req.params.fileName);
            res.status(StatusCodes.OK).send(validation);
        });

        this.router.get('/dictionary/:fileName', (req: Request, res: Response) => {
            const readFile = JSON.parse(fileSystem.readFileSync(`./dictionaries/${req.params.fileName}`, 'utf8'));
            const words = readFile.words;
            res.status(StatusCodes.OK).send(words);
        });

        this.router.post('/best-scores-classic', async (req: Request, res: Response) => {
            await this.bestScoresService.addPlayers(req.body, GameType.Classic);
            res.send(StatusCodes.OK);
        });

        this.router.post('/best-scores-log2990', async (req: Request, res: Response) => {
            await this.bestScoresService.addPlayers(req.body, GameType.Log2990);
            res.send(StatusCodes.OK);
        });

        this.router.get('/best-scores-classic', async (req: Request, res: Response) => {
            await this.bestScoresService
                .getBestPlayers(GameType.Classic)
                .then((players) => {
                    res.status(StatusCodes.OK).send(players);
                })
                .catch((error: Error) => {
                    res.status(StatusCodes.NOT_FOUND).send('An error occurred while trying to get players scores ' + error.message);
                });
        });

        this.router.get('/best-scores-log2990', async (req: Request, res: Response) => {
            await this.bestScoresService
                .getBestPlayers(GameType.Log2990)
                .then((players) => {
                    res.status(StatusCodes.OK).send(players);
                })
                .catch((error: Error) => {
                    res.status(StatusCodes.NOT_FOUND).send('An error occurred while trying to get players scores ' + error.message);
                });
        });

        // this.router.post('/uploadDictionary', (req, res) => {
        //     let uploadedFile;
        //     if (!req['files']) return res.sendStatus(StatusCodes.NOT_FOUND).send(JSON.stringify('File not found'));

        //     if (Array.isArray(req['files'].file)) {
        //         // It must be an array of UploadedFile objects
        //         for (const fic of req['files'].file) {
        //             fic.mv('./dictionaries' + fic.name, (err: boolean) => {
        //                 if (err) res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(JSON.stringify('Upload error'));
        //             });
        //         }
        //     } else {
        //         // It must be a single UploadedFile object
        //         uploadedFile = req['files'].file;
        //         uploadedFile.mv('./dictionaries/' + uploadedFile.name, (err: boolean) => {
        //             if (err) res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(JSON.stringify('Upload error'));
        //         });
        //     }
        //     return res.status(StatusCodes.OK).send(JSON.stringify('Uploaded'));
        // });
    }
}
