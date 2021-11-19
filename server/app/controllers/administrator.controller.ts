import { AdministratorService } from '@app/services/administrator.service';
import { AiPlayerDB } from '@common/ai-name';
import { Request, Response, Router } from 'express';
import { StatusCodes } from 'http-status-codes';
import { Service } from 'typedi';

@Service()
export class AdministratorController {
    router: Router;
    constructor(private administratorService: AdministratorService) {
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
        this.router.get('/aiBeginners', async (req: Request, res: Response) => {
            await this.administratorService
                .getAllAiBeginnerPlayers()
                .then((aiBeginners) => {
                    res.status(StatusCodes.OK).send(aiBeginners);
                })
                .catch((error: Error) => {
                    res.status(StatusCodes.NOT_FOUND).send('An error occurred while trying to get ai beginners ' + error.message);
                });
        });

        this.router.get('/aiExperts', async (req: Request, res: Response) => {
            await this.administratorService
                .getAllAiExpertPlayers()
                .then((aiExperts) => {
                    res.status(StatusCodes.OK).send(aiExperts);
                })
                .catch((error: Error) => {
                    res.status(StatusCodes.NOT_FOUND).send('An error occurred while trying to get ai experts ' + error.message);
                });
        });

        this.router.post('/aiBeginners', async (req: Request, res: Response) => {
            await this.administratorService
                .addBeginnerAi(req.body)
                .then((aiBeginner) => {
                    res.status(StatusCodes.OK).send(aiBeginner);
                })
                .catch((error: Error) => {
                    res.status(StatusCodes.NOT_ACCEPTABLE).send('An error occurred while saving the ai beginner ' + error.message);
                });
        });

        this.router.post('/aiExperts', async (req: Request, res: Response) => {
            await this.administratorService
                .addExpertAi(req.body)
                .then((aiExpert: AiPlayerDB) => {
                    res.status(StatusCodes.OK).send(aiExpert);
                })
                .catch((error: Error) => {
                    res.status(StatusCodes.NOT_ACCEPTABLE).send('An error occurred while saving the ai expert ' + error.message);
                });
        });

        this.router.delete('/aiBeginners/:id', async (req: Request, res: Response) => {
            await this.administratorService
                .deleteBeginnerAi(req.params.id)
                .then((aiBeginners) => {
                    res.status(StatusCodes.OK).send(aiBeginners);
                })
                .catch((error) => {
                    res.status(StatusCodes.NOT_MODIFIED).send('An error occurred while trying to delete then ai beginner ' + error.message);
                });
        });

        this.router.delete('/aiExperts/:id', async (req: Request, res: Response) => {
            await this.administratorService
                .deleteAiExpert(req.params.id)
                .then((aiExperts) => {
                    res.status(StatusCodes.OK).send(aiExperts);
                })
                .catch((error) => {
                    res.status(StatusCodes.NOT_MODIFIED).send('An error occurred while trying to delete then ai expert ' + error.message);
                });
        });

        this.router.put('/aiBeginners/:id', async (req: Request, res: Response) => {
            await this.administratorService
                .updateAiBeginner(req.params.id, req.body)
                .then((aiBeginners) => {
                    res.status(StatusCodes.OK).send(aiBeginners);
                })
                .catch((error) => {
                    res.status(StatusCodes.NOT_MODIFIED).send('An error occurred while modifying the ai beginner ' + error.message);
                });
        });

        this.router.put('/aiExperts/:id', async (req: Request, res: Response) => {
            await this.administratorService
                .updateAiExpert(req.params.id, req.body)
                .then((aiExperts) => {
                    res.status(StatusCodes.OK).send(aiExperts);
                })
                .catch((error) => {
                    res.status(StatusCodes.NOT_MODIFIED).send('An error occurred while modifying the ai beginner ' + error.message);
                });
        });
    }
}
