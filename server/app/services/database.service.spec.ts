/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable no-empty */
/* eslint-disable @typescript-eslint/no-require-imports */
/* eslint-disable dot-notation */
// import { AI_MODELS } from '@app/classes/database.schema';
import { AI_MODELS, DbModel } from '@app/classes/database.schema';
import { AiType } from '@common/ai-name';
import * as chai from 'chai';
import { expect } from 'chai';
import * as spies from 'chai-spies';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { DatabaseService } from './database.service';

describe('Database service', () => {
    let databaseService: DatabaseService;
    let mongoServer: MongoMemoryServer;
    let mongoUri: string;
    chai.use(spies);
    beforeEach(async () => {
        databaseService = new DatabaseService();
        mongoServer = await MongoMemoryServer.create();
        mongoUri = mongoServer.getUri();
    });
    afterEach(async () => {
        sinon.restore();
        await mongoServer.stop();
        await service.closeConnection();
    });

    it('start(): should connect to the database when start is called', async () => {
        await databaseService.start(mongoUri);
        expect(databaseService.database.connection.readyState).to.equal(1);
    });

    it('start(): should not connect to the database when start is called with wrong URL', async () => {
        try {
            await databaseService.start('WRONG URL');
        } catch {}
        expect(databaseService.database.connection.readyState).to.equal(0);
    });

    it('should set default data when starting', async () => {
        const model = AI_MODELS.get(AiType.beginner) as DbModel;
        chai.spy.on(model, 'deleteMany', () => {
            return model.find({});
        });

        await databaseService.start(mongoUri);
        await databaseService.setDefaultData(AiType.beginner);
        chai.spy.restore(model);
    });
});
