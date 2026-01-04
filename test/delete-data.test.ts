import { createClient, createAdapter, Logger } from '../src/index';
import { logger, cleanDb } from './common';

const run = async () => {
    console.log('--- Testing deleteData ---');

    const dbName = 'test/data/delete-db';
    cleanDb(dbName);
    const client = createClient({ filename: dbName });
    const adapter = createAdapter({ client, logger });

    // Setup data
    const dataPath = '/test/delete';
    await adapter.pushData({ dataPath, data: 'to be deleted' });
    console.log(`Pushed data to ${dataPath} `);

    // Verify it exists
    const before = await adapter.getData({ dataPath });
    console.log('Data before delete:', before);

    // Delete
    await adapter.deleteData({ dataPath });
    console.log('Deleted data.');

    // Verify it is gone
    try {
        await adapter.getData({ dataPath });
        console.error('Assertion Failed: Data should not exist.');
        process.exit(1);
    } catch (error) {
        console.log(
            'Assertion Passed: getData threw error as expected (simulating missing data behavior depending on node-json-db impl, or it returns catchable error)',
        );
        // node-json-db throws DataError if path doesn't exist
    }
};

run().catch((err) => console.error(err));
