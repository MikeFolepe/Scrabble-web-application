import { WordValidationService } from '@app/services/word-validation.service';
import { Request, Response, Router } from 'express';
import { StatusCodes } from 'http-status-codes';
import { Service } from 'typedi';

@Service()
export class MultiplayerController {
    router: Router;
    constructor(private wordValidator: WordValidationService) {
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
         * /api/multiplayer/uploadDictionary:
         *   post:
         *     description: upload a dictionary (json file) to server
         *     tags:
         *       - Multiplayer
         *     produces:
         *       - nothing for now
         *     responses:
         *       200
         */
        this.router.post('/validateWords', (req: Request, res: Response) => {
            const validation = this.wordValidator.isValidInDictionary(req.body);
            res.status(StatusCodes.OK).send(validation);
        });
    }
}
