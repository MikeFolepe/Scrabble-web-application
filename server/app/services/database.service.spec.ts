/* eslint-disable @typescript-eslint/no-require-imports */
/* eslint-disable dot-notation */
// import { AI_MODELS } from '@app/classes/database.schema';
import { AiType } from '@common/ai-name';
import { expect } from 'chai';
import { DatabaseService } from './database.service';
// import Sinon = require('sinon');
// import { MongoMemoryServer } from 'mongodb-memory-server';

describe('databaSeservice', () => {
    let databaseService: DatabaseService;

    beforeEach(async () => {
        databaseService = new DatabaseService();
    });

    afterEach(async () => {
        if (databaseService.database.connection.readyState) {
            await databaseService.closeConnection();
        }
    });

    it('start(): should connect to the database when start is called', async () => {
        await databaseService.start();
        expect(databaseService.database.connection.readyState).to.equal(1);
    });

    it('start(): should not connect to the database when start is called with wrong URL', async () => {
        databaseService.setDefaultData(AiType.beginner);
    });
});
