import { Application } from '@app/app';
import * as chai from 'chai';
import { expect } from 'chai';
import { Container } from 'typedi';
// eslint-disable-next-line @typescript-eslint/no-require-imports
import chaiHttp = require('chai-http');
// eslint-disable-next-line @typescript-eslint/no-require-imports
describe('MultiPlayerController', () => {
    let expressApp: Express.Application;
    chai.use(chaiHttp);

    beforeEach(() => {
        const app = Container.get(Application);
        expressApp = app.app;
    });

    it('should return the result of a validation from a valid post request from the client', () => {
        chai.request(expressApp)
            .post('/api/multiplayer/validateWords')
            .send(new Array<string>('mdmd'))
            .end((err, response) => {
                expect(response.body).to.equal(false);
            });
    });

    it('should return the result of a validation from a valid post request from the client', () => {
        chai.request(expressApp)
            .post('/api/multiplayer/validateWords')
            .send(new Array<string>('sud'))
            .end((err, response) => {
                expect(response.body).to.equal(true);
            });
    });
});
