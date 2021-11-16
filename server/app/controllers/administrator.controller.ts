// import { AdministratorService } from '@app/services/administrator.service';
import { /* Request, Response,*/ Router } from 'express';
// import { StatusCodes } from 'http-status-codes';
import { Service } from 'typedi';

@Service()
export class AdministratorController {
    router: Router;
    constructor() {
        this.configureRouter();
    }

    private configureRouter(/* private administratorService: AdministratorService*/): void {
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
        // this.router.get('/aiNames', (req: Request, res: Response) => {
        //     this
        // });
    }
}
