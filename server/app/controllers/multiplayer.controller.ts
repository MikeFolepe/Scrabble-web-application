import { Request, Response, Router } from 'express';
import { Service } from 'typedi';
import { StatusCodes } from 'http-status-codes';
import { WordValidationService } from '@app/services/word-validation.service';

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
        this.router.post('/validateWords', (req: Request, res: Response) => {
            const validation = this.wordValidator.isValidInDictionary(req.body);
            res.status(StatusCodes.OK).send(validation);
        });
    }
}
