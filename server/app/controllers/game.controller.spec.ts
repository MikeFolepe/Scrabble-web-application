import { Application } from '@app/app';
import * as chai from 'chai';
import { expect } from 'chai';
import { Container } from 'typedi';
// import * as fileSystem from 'fs';
// eslint-disable-next-line @typescript-eslint/no-require-imports
import chaiHttp = require('chai-http');
import { StatusCodes } from 'http-status-codes';
// eslint-disable-next-line @typescript-eslint/no-require-imports
describe('GameController', () => {
    let expressApp: Express.Application;
    chai.use(chaiHttp);

    beforeEach(() => {
        const app = Container.get(Application);
        expressApp = app.app;
    });

    it('should return the result of a validation from a valid post request from the client', (done) => {
        const object = {
            words: ['mdmd'],
            dico: ['maman', 'sud'],
        };
        chai.request(expressApp)
            .post('/api/game/validateWords')
            .send(object)
            .end((err, response) => {
                expect(response.body).to.equal(false);
                done();
            });
    });

    it('should return the result of a validation from a valid post request from the client', (done) => {
        const object = {
            words: ['sud'],
            dico: ['maman', 'sud'],
        };
        chai.request(expressApp)
            .post('/api/game/validateWords')
            .send(object)
            .end((err, response) => {
                expect(response.body).to.equal(true);
                done();
            });
    });

    it('should return the dictionary asked by the client', (done) => {
        // const readFile: string[] = JSON.parse(fileSystem.readFile('./dictionaries/dictionary.json', 'utf8')).words;
        chai.request(expressApp)
            .get('/api/game/dictionary/dictionary.json')
            // eslint-disable-next-line no-unused-vars
            .end((err, response) => {
                // expect(response.body).to.equal(readFile);
                expect(response.status).to.equal(StatusCodes.OK);
                done();
            });
    });
});
