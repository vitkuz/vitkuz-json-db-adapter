import { createClient, createAdapter, Logger } from '../src/index';
import { cleanDb } from './common'; // Keep cleanDb as it's used and not part of the new index import

const run = async () => {
    console.log('--- Testing getData ---');

    const dbName = 'test/data/get-db';
    cleanDb(dbName);
    const client = createClient({ filename: dbName });
    const adapter = createAdapter({ client, logger });

    // Setup data
    const dataPath = '/test/get';
    const originalData = { foo: 'bar', baz: 123 };
    await adapter.pushData({ dataPath, data: originalData });

    console.log(`Pushed data to ${dataPath} `);

    // Test Get
    const retrieved = await adapter.getData({ dataPath });
    console.log('Retrieved data:', retrieved);

    if (JSON.stringify(retrieved) === JSON.stringify(originalData)) {
        console.log('Assertion Passed: Retrieved data matches original.');
    } else {
        console.error('Assertion Failed: Data mismatch.');
        process.exit(1);
    }
};

run().catch((err) => console.error(err));
