// import { Application } from '@app/app';
import * as chai from 'chai';
// import { StatusCodes } from 'http-status-codes';
// import { Container } from 'typedi';
// eslint-disable-next-line @typescript-eslint/no-require-imports
import chaiHttp = require('chai-http');
// const HTTP_STATUS_OK = StatusCodes.OK;
// eslint-disable-next-line @typescript-eslint/no-require-imports
describe('MultiPlayerController', () => {
    // let expressApp: Express.Application;
    chai.use(chaiHttp);

    beforeEach(async () => {
        // const app = Container.get(Application);
        // eslint-disable-next-line dot-notation
        // expressApp = app.app;
    });
    /*
    it('should return the result of a validation from a valid post request from the client', (done) => {
        chai.request(expressApp)
            .post('/api/multiplayer/validateWords')
            .end((err, response) => {
                response.should.have.status(HTTP_STATUS_OK);
                response.body.should.be.a('boolean');
                response.body.should.be.eq(true || false);
                done();
            });
    });
    */
});
