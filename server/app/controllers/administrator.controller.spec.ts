/* eslint-disable @typescript-eslint/no-require-imports */
import { Application } from '@app/app';
import { AdministratorService } from '@app/services/administrator.service';
import { AiPlayerDB, AiType } from '@common/ai-name';
import { Dictionary } from '@common/dictionary';
import * as chai from 'chai';
import { expect } from 'chai';
import * as fileSystem from 'fs';
import { StatusCodes } from 'http-status-codes';
import { Container } from 'typedi';
import chaiHttp = require('chai-http');
import Sinon = require('sinon');

describe.only('AdminController', () => {
    let expressApp: Express.Application;
    let administratorService: AdministratorService;
    chai.use(chaiHttp);
    const aiPlayers: AiPlayerDB[] = [
        {
            _id: '1',
            aiName: 'Mister_Bucky',
            isDefault: true,
        },
        {
            _id: '2',
            aiName: 'Miss_Betty',
            isDefault: true,
        },
        {
            _id: '3',
            aiName: 'Mister_Samy',
            isDefault: true,
        },
    ];

    const newPlayers: AiPlayerDB[] = [
        {
            _id: '2',
            aiName: 'Miss_Betty',
            isDefault: true,
        },
        {
            _id: '3',
            aiName: 'Mister_Samy',
            isDefault: true,
        },
    ];

    const dictionaries: Dictionary[] = [
        {
            fileName: 'dictionary.json',
            title: 'dictionaire',
            description: 'TestController',
            isDefault: false,
        },
        {
            fileName: 'test.json',
            title: 'manger',
            description: 'Controller',
            isDefault: false,
        },
    ];

    beforeEach(() => {
        const app = Container.get(Application);
        administratorService = Container.get<AdministratorService>(AdministratorService);
        expressApp = app.app;
    });

    it('should return the the beginner Ais', (done) => {
        const stubOnGet = Sinon.stub(administratorService, 'getAllAiPlayers').returns(Promise.resolve(aiPlayers));
        chai.request(expressApp)
            .get('/api/admin/aiBeginners')
            .end((err, response) => {
                expect(stubOnGet.called).to.equal(true);
                expect(response.status).to.equal(StatusCodes.OK);
                expect(response.body).to.deep.equal(aiPlayers);
                stubOnGet.restore();
                done();
            });
    });

    it('should return the the experts Ais', (done) => {
        const stubOnGet = Sinon.stub(administratorService, 'getAllAiPlayers').returns(Promise.resolve(aiPlayers));
        chai.request(expressApp)
            .get('/api/admin/aiExperts')
            .end((err, response) => {
                expect(stubOnGet.called).to.equal(true);
                expect(response.status).to.equal(StatusCodes.OK);
                expect(response.body).to.deep.equal(aiPlayers);
                stubOnGet.restore();
                done();
            });
    });

    it('should handle the error while getting the beginners ', (done) => {
        const stubOnGet = Sinon.stub(administratorService, 'getAllAiPlayers').returns(Promise.reject(new Error('fail')));
        chai.request(expressApp)
            .get('/api/admin/aiBeginners')
            .end((err, response) => {
                expect(stubOnGet.called).to.equal(true);
                expect(response.status).to.equal(StatusCodes.NOT_FOUND);
                stubOnGet.restore();
                done();
            });
    });

    it('should handle the error while getting the experts ', (done) => {
        const stubOnGet = Sinon.stub(administratorService, 'getAllAiPlayers').returns(Promise.reject(new Error('fail')));
        chai.request(expressApp)
            .get('/api/admin/aiExperts')
            .end((err, response) => {
                expect(stubOnGet.called).to.equal(true);
                expect(response.status).to.equal(StatusCodes.NOT_FOUND);
                stubOnGet.restore();
                done();
            });
    });

    it('should delete the ai beginners  ', (done) => {
        const stubOnDelete = Sinon.stub(administratorService, 'deleteAiPlayer').returns(Promise.resolve(newPlayers));
        chai.request(expressApp)
            .delete('/api/admin/aiBeginners/1')
            .end((err, response) => {
                expect(stubOnDelete.called).to.equal(true);
                expect(response.status).to.equal(StatusCodes.OK);
                expect(response.body).to.deep.equal(newPlayers);
                stubOnDelete.restore();
                done();
            });
    });

    it('should delete the ai experts  ', (done) => {
        const stubOnDelete = Sinon.stub(administratorService, 'deleteAiPlayer').returns(Promise.resolve(newPlayers));
        chai.request(expressApp)
            .delete('/api/admin/aiExperts/1')
            .end((err, response) => {
                expect(stubOnDelete.called).to.equal(true);
                expect(response.status).to.equal(StatusCodes.OK);
                expect(response.body).to.deep.equal(newPlayers);
                stubOnDelete.restore();
                done();
            });
    });

    it('should handle the error while deleting the beginners ', (done) => {
        const stubOnDelete = Sinon.stub(administratorService, 'deleteAiPlayer').returns(Promise.reject(new Error('fail')));
        chai.request(expressApp)
            .delete('/api/admin/aiBeginners/1')
            .end((err, response) => {
                expect(stubOnDelete.called).to.equal(true);
                expect(response.status).to.equal(StatusCodes.NOT_MODIFIED);
                stubOnDelete.restore();
                done();
            });
    });

    it('should handle the error while deleting the experts ', (done) => {
        const stubOnDelete = Sinon.stub(administratorService, 'deleteAiPlayer').returns(Promise.reject(new Error('fail')));
        chai.request(expressApp)
            .delete('/api/admin/aiExperts/1')
            .end((err, response) => {
                expect(stubOnDelete.called).to.equal(true);
                expect(response.status).to.equal(StatusCodes.NOT_MODIFIED);
                stubOnDelete.restore();
                done();
            });
    });

    it('should add the the Ai', (done) => {
        const aiPlayer = {
            aiName: 'Miss_Betty',
            isDefault: true,
        };
        const stubOnAdd = Sinon.stub(administratorService, 'addAiPlayer').returns(Promise.resolve(aiPlayers[1]));
        chai.request(expressApp)
            .post('/api/admin/aiPlayers')
            .send({
                aiPlayer,
                aiType: AiType.beginner,
            })
            .end((err, response) => {
                expect(stubOnAdd.called).to.equal(true);
                expect(response.status).to.equal(StatusCodes.OK);
                expect(response.body).to.deep.equal(aiPlayers[1]);
                stubOnAdd.restore();
                done();
            });
    });

    it('should handle an error while adding the Ai', (done) => {
        const aiPlayer = {
            aiName: 'Miss_Betty',
            isDefault: true,
        };
        const stubOnAdd = Sinon.stub(administratorService, 'addAiPlayer').returns(Promise.reject(new Error('fail')));
        chai.request(expressApp)
            .post('/api/admin/aiPlayers')
            .send({
                aiPlayer,
                aiType: AiType.beginner,
            })
            .end((err, response) => {
                expect(stubOnAdd.called).to.equal(true);
                expect(response.status).to.equal(StatusCodes.NOT_ACCEPTABLE);
                stubOnAdd.restore();
                done();
            });
    });

    it('should handle an error while resetting the scores', (done) => {
        const stubOnReset = Sinon.stub(administratorService, 'resetScores').returns(Promise.reject(new Error('fail')));
        chai.request(expressApp)
            .delete('/api/admin/scores/Classic')
            .end((err, response) => {
                expect(stubOnReset.called).to.equal(true);
                expect(response.status).to.equal(StatusCodes.NOT_MODIFIED);
                stubOnReset.restore();
                done();
            });
    });

    it('should handle an error while resetting the scores', (done) => {
        const stubOnReset = Sinon.stub(administratorService, 'resetScores').returns(Promise.reject(new Error('fail')));
        chai.request(expressApp)
            .delete('/api/admin/scores/Log2990')
            .end((err, response) => {
                expect(stubOnReset.called).to.equal(true);
                expect(response.status).to.equal(StatusCodes.NOT_MODIFIED);
                stubOnReset.restore();
                done();
            });
    });

    it('should update an ai player', (done) => {
        const aiPlayer = {
            aiName: 'Mike',
            isDefault: true,
        };

        const beginner = AiType.beginner;

        const stubOnUpdate = Sinon.stub(administratorService, 'updateAiPlayer').returns(Promise.resolve(aiPlayers));
        chai.request(expressApp)
            .put('/api/admin/aiPlayers/2')
            .send({ aiPlayer, beginner })
            .end((err, response) => {
                expect(stubOnUpdate.called).to.equal(true);
                expect(response.body).to.deep.equal(aiPlayers);
                expect(response.status).to.equal(StatusCodes.OK);
                stubOnUpdate.restore();
                done();
            });
    });

    it('should handle an error while updating the ai players', (done) => {
        const stubOnUpdate = Sinon.stub(administratorService, 'updateAiPlayer').returns(Promise.reject(new Error('fail')));
        chai.request(expressApp)
            .put('/api/admin/aiPlayers/2')
            .end((err, response) => {
                expect(stubOnUpdate.called).to.equal(true);
                expect(response.status).to.equal(StatusCodes.NOT_MODIFIED);
                stubOnUpdate.restore();
                done();
            });
    });

    it('should return the the dictionaries', (done) => {
        const stubOnGet = Sinon.stub(administratorService, 'getDictionaries').returns(dictionaries);
        chai.request(expressApp)
            .get('/api/admin/dictionaries')
            .end((err, response) => {
                expect(stubOnGet.called).to.equal(true);
                expect(response.status).to.equal(StatusCodes.OK);
                expect(response.body).to.deep.equal(dictionaries);
                stubOnGet.restore();
                done();
            });
    });

    it('should return the updated dictionaries', (done) => {
        const stubOnUpdate = Sinon.stub(administratorService, 'updateDictionary').returns(dictionaries);
        chai.request(expressApp)
            .put('/api/admin/dictionaries')
            .end((err, response) => {
                expect(stubOnUpdate.called).to.equal(true);
                expect(response.body).to.deep.equal(dictionaries);
                expect(response.status).to.equal(StatusCodes.OK);
                stubOnUpdate.restore();
                done();
            });
    });

    it('should return the new dictionaries', (done) => {
        const stubOnDelete = Sinon.stub(administratorService, 'deleteDictionary').returns(dictionaries);
        chai.request(expressApp)
            .delete('/api/admin/dictionaries/dictionary.json')
            .end((err, response) => {
                expect(stubOnDelete.called).to.equal(true);
                expect(response.body).to.deep.equal(dictionaries);
                expect(response.status).to.equal(StatusCodes.OK);
                stubOnDelete.restore();
                done();
            });
    });

    it('should return the asked dictionarie', (done) => {
        const stubOnDelete = Sinon.stub(fileSystem, 'readFileSync').returns('fichier');
        chai.request(expressApp)
            .get('/api/admin/download/dictionary.json')
            .end((err, response) => {
                expect(stubOnDelete.called).to.equal(true);
                // expect(response.body).to.deep.equal('fichier');
                expect(response.status).to.equal(StatusCodes.OK);
                stubOnDelete.restore();
                done();
            });
    });
});
