// import { ScoreValidation } from './../../../client/src/app/classes/validation-score';
// import { WordValidationService } from '@app/services/word-validation.service';
// import { WordValidationService } from '@app/services/word-validation.service';
import { Request, Response, Router } from 'express';
// Request, Response,
import { Service } from 'typedi';

@Service()
export class WordValidationController {
    router: Router;
    // private wordValidationService: WordValidationService
    constructor() {
        this.configureRouter();
    }

    private configureRouter(): void {
        this.router = Router();
        /**
         * @swagger
         *
         * definitions:
         *   Message:
         *     type: object
         *     properties:
         *       title:
         *         type: string
         *       body:
         *         type: string
         */

        /**
         * @swagger
         * tags:
         *   - name: Example
         *     description: Default cadriciel endpoint
         *   - name: Message
         *     description: Messages functions
         */

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
        this.router.get('/:word', (req: Request, res: Response) => {
            //  Send the request to the service and send the response
            console.log(req.params.word);
            res.send();
        });
    }

    // postMan for testing routes
}
