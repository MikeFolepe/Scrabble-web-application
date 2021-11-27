// TODO: à tester
/* eslint-disable @typescript-eslint/no-magic-numbers */
import { MongoMemoryServer } from 'mongodb-memory-server-core';
import * as sinon from 'sinon';
import { DatabaseService } from './database.service';

describe('databaseService', () => {
    let service: DatabaseService;
    let mongoServer: MongoMemoryServer;
    // let fakeUrl: string;

    beforeEach(async () => {
        mongoServer = await MongoMemoryServer.create();
        // fakeUrl = mongoServer.getUri('fakedatabase');
    });

    afterEach(async () => {
        sinon.restore();
        await mongoServer.stop();
        await service.closeConnection();
    });

    // it('setDefault score should should call mongoose save method', () => {
    //     const saveSpy = fakeUrl;
    // });
});
