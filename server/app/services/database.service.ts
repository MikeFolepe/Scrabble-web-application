/* eslint-disable prettier/prettier */
import { Db } from 'mongodb';
import * as mongoose from 'mongoose';
// import 'reflect-metadata';
import { Service } from 'typedi';

@Service()
export class DatabaseService {
    private db: Db;
    // private client: MongoClient;
    // CHANGE the URL for your database information
    private readonly databaseUrl = 'mongodb+srv://Team107:xxtyU48kHQ4ZqDW@cluster0.i7hu4.mongodb.net/database1?retryWrites=true&w=majority';
    /// private readonly databaseName = 'database1';
    // private readonly databaseCollection = 'collection1';
    private options = {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    } as mongoose.ConnectOptions;

    private databaseClient: mongoose.Mongoose = mongoose;

    /* istanbul ignore next */
    async start(url: string = this.databaseUrl): Promise<void> {
        await this.databaseClient
            .connect(url, this.options)
            .then(() => {
                console.log('Connected successfully to Mongodb Atlas');
                // this.db = this.databaseClient;
            })
            .catch(() => {
                throw new Error('Distant database connection error');
            });
    }

    async closeConnection(): Promise<void> {
        await mongoose.connection.close();
    }

    async populateDB(): Promise<void> {
        // nothing for the moment
    }

    get database(): Db {
        return this.db;
    }
}
