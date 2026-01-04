import { createClient, createAdapter, Logger } from '../src/index';
import { logger, cleanDb } from './common';

const run = async () => {
    console.log('--- Testing reloadDb ---');

    const dbName = 'test/data/reload-db';
    cleanDb(dbName);
    const client = createClient({ filename: dbName });
    const adapter = createAdapter({ client, logger });

    try {
        await adapter.reloadDb();
        console.log('Reload successful.');
    } catch (error) {
        console.error('Reload failed:', error);
        process.exit(1);
    }
};

run().catch((err) => console.error(err));
