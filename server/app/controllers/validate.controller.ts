// import { ScoreValidation } from './../../../client/src/app/classes/validation-score';
// import { WordValidationService } from '@app/services/word-validation.service';
<<<<<<< HEAD
// import { WordValidationService } from '@app/services/word-validation.service';
=======
import { WordValidationService } from '@app/services/word-validation.service';
>>>>>>> b7bc76bb223ef4674011ed696c8d797922f78013
import { Request, Response, Router } from 'express';
// Request, Response,
import { Service } from 'typedi';

@Service()
export class WordValidationController {
    router: Router;
    // private wordValidationService: WordValidationService
<<<<<<< HEAD
    constructor() {
=======
    constructor(private wordValidator: WordValidationService) {
>>>>>>> b7bc76bb223ef4674011ed696c8d797922f78013
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
<<<<<<< HEAD
        this.router.get('/:word', (req: Request, res: Response) => {
            //  Send the request to the service and send the response
            res.send();
=======
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
>>>>>>> b7bc76bb223ef4674011ed696c8d797922f78013
        });
    }

    // postMan for testing routes
}
