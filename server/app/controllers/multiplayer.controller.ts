/* eslint-disable dot-notation */
// JUSTIFICATION : Because the files are added in runtime with npm express-fileupload on the 'request' (req),
//                 the Typescript compiler does not recognize them and it fails. So, they are referenced with dot notation
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

        this.router.post('/uploadDictionary', (req, res) => {
            let uploadedFile;
            if (!req['files']) return res.sendStatus(StatusCodes.NOT_FOUND).send(JSON.stringify('File not found'));

            if (Array.isArray(req['files'].file)) {
                // It must be an array of UploadedFile objects
                for (const fic of req['files'].file) {
                    fic.mv('./dictionaries' + fic.name, (err: boolean) => {
                        if (err) res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(JSON.stringify('Upload error'));
                    });
                }
            } else {
                // It must be a single UploadedFile object
                uploadedFile = req['files'].file;
                uploadedFile.mv('./dictionaries/' + uploadedFile.name, (err: boolean) => {
                    if (err) res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(JSON.stringify('Upload error'));
                });
            }
            return res.status(StatusCodes.OK).send(JSON.stringify('Uploaded'));
        });
    }
}
