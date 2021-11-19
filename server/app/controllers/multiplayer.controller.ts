import { BestScoresService } from '@app/services/best-scores.service';
import { WordValidationService } from '@app/services/word-validation.service';
import { Request, Response, Router } from 'express';
import { StatusCodes } from 'http-status-codes';
import { Service } from 'typedi';

@Service()
export class MultiplayerController {
    router: Router;
    constructor(private wordValidator: WordValidationService, private bestScoresService: BestScoresService) {
        this.configureRouter();
    }

    private configureRouter(): void {
        this.router = Router();
        /**
         * @swagger
         *
         * /api/multiplayer/validateWords:
         *   post:
         *     description: return the validation result of a placed word
         *     tags:
         *       - Multiplayer
         *     produces:
         *       - a boolean that describe the result
         *     responses:
         *       200
         *
         */
        this.router.post('/validateWords', (req: Request, res: Response) => {
            const validation = this.wordValidator.isValidInDictionary(req.body);
            res.status(StatusCodes.OK).send(validation);
        });

        this.router.post('/best-scores', async (req: Request, res: Response) => {
            await this.bestScoresService.addPlayers(req.body);
            res.send(StatusCodes.OK);
        });

        this.router.get('/best-scores', async (req: Request, res: Response) => {
            await this.bestScoresService
                .getBestPlayers()
                .then((players) => {
                    res.status(StatusCodes.OK).send(players);
                })
                .catch((error: Error) => {
                    res.status(StatusCodes.NOT_FOUND).send('An error occurred while trying to get players scores ' + error.message);
                });
        });
    }
}
