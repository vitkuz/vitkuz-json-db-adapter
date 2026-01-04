import { createClient, createAdapter, Logger } from '../src/index';
import { logger, cleanDb } from './common';

const run = async () => {
    console.log('--- Testing listData ---');

    const dbName = 'test/data/list-db';
    cleanDb(dbName);
    const client = createClient({ filename: dbName });
    const adapter = createAdapter({ client, logger });

    // Setup data - push a map/object
    const dataPath = '/test/list';
    const items = {
        item1: { id: 1, name: 'Item 1' },
        item2: { id: 2, name: 'Item 2' },
        item3: { id: 3, name: 'Item 3' },
    };

    await adapter.pushData({ dataPath, data: items });
    console.log(`Pushed data to ${dataPath}`);

    // Test List
    const list = await adapter.listData({ dataPath });
    console.log('Retrieved list:', list);

    if (Array.isArray(list) && list.length === 3) {
        console.log('Assertion Passed: Retrieved data is an array of length 3.');
    } else {
        console.error('Assertion Failed: Data mismatch or not an array.');
        process.exit(1);
    }

    // Test empty/missing path
    const emptyList = await adapter.listData({ dataPath: '/non-existent' });
    console.log('Retrieved empty list for non-existent path:', emptyList);

    if (Array.isArray(emptyList) && emptyList.length === 0) {
        console.log('Assertion Passed: Non-existent path returned empty array.');
    } else {
        console.error('Assertion Failed: Non-existent path did not return empty array.');
        process.exit(1);
    }
};

run().catch((err) => console.error(err));
