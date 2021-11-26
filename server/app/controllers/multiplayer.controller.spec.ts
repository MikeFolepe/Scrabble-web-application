/* eslint-disable dot-notation */
/* eslint-disable @typescript-eslint/no-require-imports */
import { Application } from '@app/app';
// import { PlayerScore } from '@common/player';
import * as chai from 'chai';
import { expect } from 'chai';
// import { createStubInstance, SinonStubbedInstance } from 'sinon';
import { Container } from 'typedi';
// import { MultiplayerController } from './multiplayer.controller';
// eslint-disable-next-line @typescript-eslint/no-require-imports
import chaiHttp = require('chai-http');
// import Sinon = require('sinon');
// eslint-disable-next-line @typescript-eslint/no-require-imports
describe('MultiPlayerController', () => {
    let expressApp: Express.Application;
    // let bestScoresServiceStub: SinonStubbedInstance<BestScoresService>;
    // let service: MultiplayerController;
    chai.use(chaiHttp);

    beforeEach(() => {
        // bestScoresServiceStub = createStubInstance(BestScoresService);
        const app = Container.get(Application);
        expressApp = app.app;
    });

    it('should return the result of a validation from a valid post request from the client', (done) => {
        chai.request(expressApp)
            .post('/api/multiplayer/validateWords')
            .send(new Array<string>('mdmd'))
            .end((err, response) => {
                expect(response.body).to.equal(false);
                done();
            });
    });

    it('should return the result of a validation from a valid post request from the client', (done) => {
        chai.request(expressApp)
            .post('/api/multiplayer/validateWords')
            .send(new Array<string>('sud'))
            .end((err, response) => {
                expect(response.body).to.equal(true);
                done();
            });
    });

    // it('should call addPlayer of bestScoreService on a valid post request', async (done) => {
    //     // const addPlayerSpy = Sinon.spy(service['bestScoresService'], 'addPlayers');
    //     const players: PlayerScore[] = [{ score: 2, playerName: 'random', isDefault: false }];
    //     // await Sinon.stub(service['bestScoresService'], 'addPlayers')
    //     // await service['bestScoresService'].addPlayers(players, GameType.Classic).resolves();
    //     // .returns(null as unknown as Promise<void>);
    //     // await bestScoresServiceStub.addPlayers(players, GameType.Classic);
    //     bestScoresServiceStub.addPlayers.resolves().returns(null as unknown as Promise<void>);
    //     chai.request(expressApp)
    //         .post('/api/multiplayer/best-scores-classic')
    //         .send(players)
    //         .end((err, response) => {
    //             expect(response.statusType).to.equal(2);
    //             done();
    //         });
    // });
});
