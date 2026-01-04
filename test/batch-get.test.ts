import { createClient, createAdapter, Logger } from '../src/index';
import { logger, cleanDb } from './common';

const run = async () => {
    console.log('--- Testing Batch Get ---');

    const dbName = 'test/data/batch-get-db';
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
        items: items.map((item) => ({ dataPath: `/items/${item.id}`, data: item })),
    });

    // Test Batch Get
    const paths = items.map((item) => `/items/${item.id}`);
    const retrieved = await adapter.batchGetData({ dataPaths: paths });
    console.log('Batch Get retrieved:', retrieved);

    if (retrieved.length === 3 && retrieved[0].id === 1 && retrieved[2].val === 'c') {
        console.log('Assertion Passed: Retrieved correct items.');
    } else {
        console.error('Assertion Failed: Batch Get mismatch.');
        process.exit(1);
    }
};

run().catch((err) => console.error(err));
