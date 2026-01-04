import { createClient, createAdapter, Logger } from '../src/index';
import { logger, cleanDb } from './common';

const run = async () => {
    console.log('--- Testing Batch Delete ---');

    const dbName = 'test/data/batch-delete-db';
    cleanDb(dbName);

    const client = createClient({ filename: dbName });
    const adapter = createAdapter({ client, logger });

    // Setup data
    const items = [
        { id: 1, val: 'a' },
        { id: 2, val: 'b' },
        { id: 3, val: 'c' },
    ];
    await adapter.batchPushData({
        items: items.map((item) => ({ dataPath: `/ items / ${item.id} `, data: item })),
    });

    // Test Batch Delete
    const paths = items.map((item) => `/ items / ${item.id} `);
    await adapter.batchDeleteData({ dataPaths: paths });
    console.log('Batch Delete executed.');

    // Verify
    try {
        await adapter.getData({ dataPath: '/items/1' });
        console.error('Assertion Failed: Item 1 should be deleted.');
        process.exit(1);
    } catch (error) {
        console.log('Assertion Passed: Item 1 not found (deleted).');
    }
};

run().catch((err) => console.error(err));
