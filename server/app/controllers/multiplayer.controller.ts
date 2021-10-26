import { WordValidationService } from '@app/services/word-validation.service';
import { Request, Response, Router } from 'express';
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
        this.router.post('/validateWords', (req: Request, res: Response) => {
            return res.send(this.wordValidator.isValidInDictionary(req.body));
        });
    }
}
