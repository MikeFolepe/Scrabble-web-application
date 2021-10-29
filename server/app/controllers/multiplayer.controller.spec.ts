import { Application } from '@app/app';
import { WordValidationService } from '@app/services/word-validation.service';
import { StatusCodes } from 'http-status-codes';
import { createStubInstance, SinonStubbedInstance } from 'sinon';
import * as supertest from 'supertest';
import { Container } from 'typedi';

const HTTP_STATUS_OK = StatusCodes.OK;
// const HTTP_STATUS_CREATED = StatusCodes.CREATED;

describe('MultiPlayerController', () => {
    let wordValidationService: SinonStubbedInstance<WordValidationService>;
    let expressApp: Express.Application;

    beforeEach(async () => {
        wordValidationService = createStubInstance(WordValidationService);
        const app = Container.get(Application);
        // eslint-disable-next-line dot-notation
        Object.defineProperty(app['MultiPlayerController'], 'wordValidationService', { value: wordValidationService });
        expressApp = app.app;
    });

    it('should return the result of a validation from a valid post request from the client', async () => {
        return supertest(expressApp).post('/api/multiplayer/validateWords').expect(HTTP_STATUS_OK);
    });
});
