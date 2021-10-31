// import { ScoreValidation } from './../../../client/src/app/classes/validation-score';
// import { WordValidationService } from '@app/services/word-validation.service';
import { Request, Response, Router } from 'express';
import { WordValidationService } from '@app/services/word-validation.service';
// Request, Response,
import { Service } from 'typedi';

@Service()
export class WordValidationController {
    router: Router;
    // private wordValidationService: WordValidationService
    constructor(private wordValidator: WordValidationService) {
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
        this.router.post('/words', (req: Request, res: Response) => {
            //  Send the request to the service and send the response
            // eslint-disable-next-line @typescript-eslint/prefer-for-of
            // for (let i = 0; i < req.body.length; i++) {
            //     if (!this.wordValidator.isValidInDictionary(req.body[i])) {
            //         res.send(false);
            //         return;
            //     }
            // }
            // res.send(true);

            res.send(this.wordValidator.isValidInDictionary(req.body));

            // console.log(req.body);
        });
    }

    // postMan for testing routes
}
