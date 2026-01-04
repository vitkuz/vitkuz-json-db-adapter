import { createClient, createAdapter } from '../src/index';
import { logger, cleanDb } from './common';

const run = async () => {
    console.log('=== Adapter Behavior Showcase ===\n');

    const dbName = 'test/data/behaviors-db';
    cleanDb(dbName);

    const client = createClient({
        filename: dbName,
        humanReadable: true, // Easy to inspect file if needed
    });
    const adapter = createAdapter({ client, logger }); // Logger will show debug operations

    // Helper to log section headers
    const section = (title: string) => console.log(`\n--- ${title} ---`);

    // 1. Basic Operations
    section('1. Basic Push & Get');
    await adapter.pushData({ dataPath: '/user', data: { name: 'Alice', age: 30 } });
    console.log('Pushed: { name: "Alice", age: 30 }');
    const user = await adapter.getData({ dataPath: '/user' });
    console.log('Retrieved:', user);

    // 2. Full Replacement
    section('2. Full Replacement (override: true)');
    console.log('Current state:', await adapter.getData({ dataPath: '/user' }));
    console.log('Pushing: { name: "Bob" } with override: true (Default)');
    await adapter.pushData({ dataPath: '/user', data: { name: 'Bob' }, override: true });
    const replacedUser = await adapter.getData({ dataPath: '/user' });
    console.log('Result (Age should be gone):', replacedUser);

    // 3. Object Merging
    section('3. Object Merging (override: false)');
    await adapter.pushData({ dataPath: '/config', data: { theme: 'dark', notifications: true } });
    console.log('Initial Config:', await adapter.getData({ dataPath: '/config' }));

    console.log('Pushing: { theme: "light", version: 1 } with override: false');
    await adapter.pushData({
        dataPath: '/config',
        data: { theme: 'light', version: 1 },
        override: false,
    });
    const mergedConfig = await adapter.getData({ dataPath: '/config' });
    console.log('Result (Merged):', mergedConfig);

    // 4. Array Merging
    section('4. Array Merging (override: false)');
    await adapter.pushData({ dataPath: '/tags', data: ['red', 'green'] });
    console.log('Initial Tags:', await adapter.getData({ dataPath: '/tags' }));

    console.log('Pushing: ["blue"] with override: false');
    await adapter.pushData({ dataPath: '/tags', data: ['blue'], override: false });
    const mergedTags = await adapter.getData({ dataPath: '/tags' });
    console.log('Result (Appended):', mergedTags);

    // 5. Batch Operations & Edge Cases
    section('5. Batch Operations & Edge Cases');

    // Batch Push
    console.log('Batch Pushing 3 items...');
    await adapter.batchPushData({
        items: [
            { dataPath: '/items/1', data: 'A' },
            { dataPath: '/items/2', data: 'B' },
            { dataPath: '/items/3', data: 'C' },
        ],
    });

    // Batch Get with Missing Item
    console.log('Batch Getting [/items/1, /items/999 (missing)]...');
    const batchRes = await adapter.batchGetData({ dataPaths: ['/items/1', '/items/999'] });
    console.log('Batch Get Result (Expect "A" and null):', batchRes);

    // Batch Delete with Missing Item
    console.log('Batch Deleting [/items/1, /items/888 (missing)]...');
    await adapter.batchDeleteData({ dataPaths: ['/items/1', '/items/888'] });

    // Verify Deletion
    const afterDelete = await adapter.batchGetData({ dataPaths: ['/items/1'] });
    console.log('Check /items/1 (Expect null):', afterDelete);

    console.log('\n=== Showcase Complete ===');
};

run().catch((err) => console.error(err));
