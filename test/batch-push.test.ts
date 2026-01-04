import { createClient, createAdapter, Logger } from '../src/index';
import { logger, cleanDb } from './common';

const run = async () => {
    console.log('--- Testing Batch Push ---');

    const dbName = 'test/data/batch-push-db';
    cleanDb(dbName);

    const client = createClient({ filename: dbName });
    const adapter = createAdapter({ client, logger });

    const items = [
        { id: 1, val: 'a' },
        { id: 2, val: 'b' },
        { id: 3, val: 'c' },
    ];

    console.log('Pushing items...');
    await adapter.batchPushData({
        items: items.map((item) => ({ dataPath: `/ items / ${item.id} `, data: item })),
    });

    // Verify
    const retrieved = await adapter.getData({ dataPath: '/items/1' });
    if (retrieved.val === 'a') {
        console.log('Assertion Passed: Batch push successfully saved data.');
    } else {
        console.error('Assertion Failed: Data not found after batch push.');
        process.exit(1);
    }
};

run().catch((err) => console.error(err));
