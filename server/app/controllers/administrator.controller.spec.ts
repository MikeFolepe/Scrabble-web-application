/* eslint-disable @typescript-eslint/no-require-imports */
import { Application } from '@app/app';
import { AdministratorService } from '@app/services/administrator.service';
import { AiPlayerDB, AiType } from '@common/ai-name';
import * as chai from 'chai';
import { expect } from 'chai';
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

    

    // it('should return the result of a validation from a valid post request from the client', (done) => {
    //     const stubValidate = Sinon.stub(wordValidationService, 'isValidInDictionary').returns(true);
    //     chai.request(expressApp)
    //         .post('/api/game/validateWords/dictionary.json')
    //         .send(['sud', 'maman'])
    //         .end((err, response) => {
    //             expect(stubValidate.called).to.equal(true);
    //             expect(response.status).to.equal(StatusCodes.OK);
    //             expect(response.body).to.equal(true);
    //             stubValidate.restore();
    //             done();
    //         });
    // });

    // it('should return the dictionary asked by the client', (done) => {
    //     // fileSystem.readFileSync('./dictionaries/dictionary.json', 'utf8')).words;

    //     const jsonDictionary = `{
    //         "title": "Mon dictionnaire",
    //         "description": "Description de base",
    //         "words": [
    //             "aa",
    //             "aalenien",
    //             "aalenienne",
    //             "aaleniennes",
    //             "aaleniens"
    //         ]
    //     }`;
    //     const dictionary = JSON.parse(jsonDictionary);
    //     const stubOnParse = Sinon.stub(fileSystem, 'readFileSync').returns(jsonDictionary);

    //     chai.request(expressApp)
    //         .get('/api/game/dictionary/dictionary.json')
    //         .end((err, response) => {
    //             expect(stubOnParse.called).to.equal(true);
    //             expect(response.body).to.deep.equal(dictionary.words);
    //             expect(response.status).to.equal(StatusCodes.OK);
    //             stubOnParse.restore();
    //             done();
    //         });
    // });
});
