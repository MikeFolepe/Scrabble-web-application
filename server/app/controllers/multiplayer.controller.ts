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
         * /api/example:
         *   get:
         *     description: Return current time with hello world
         *     tags:
         *       - Example
         *     produces:
         *       - application/json
         *     responses:
         *       200:
         *         schema:
         *           $ref: '#/definitions/Message'
         *
         */
        this.router.post('/validateWords', async (req: Request, res: Response) => {
            await this.wordValidator.isValidInDictionary(req.body).then((validation: boolean) => {
                res.status(StatusCodes.OK).send(validation);
            });
        });
    }
}
