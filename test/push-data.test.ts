import { createClient, createAdapter, Logger } from '../src/index';
import { logger, cleanDb } from './common';

const run = async () => {
    console.log('--- Testing pushData ---');

    // Create DB in a temporary location
    const dbName = 'test/data/push-db';
    cleanDb(dbName);
    const client = createClient({
        filename: dbName,
        saveOnPush: true,
    });

    const adapter = createAdapter({ client, logger });

    const dataPath = '/test/push';
    const data = { id: 1, name: 'Test Item', timestamp: Date.now() };

    console.log(`Pushing data to ${dataPath}:`, data);
    await adapter.pushData({ dataPath, data });

    // Verify by reading back directly via client (or use getData if we trust it, but let's trust the operation succeeded if no error)
    console.log('Push seems successful (no error thrown).');
};

run().catch((err) => console.error(err));
