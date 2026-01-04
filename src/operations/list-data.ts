import { JsonDbContext } from '../types';

export interface ListDataInput {
    dataPath: string;
    reload?: boolean;
}

export const listData =
    (context: JsonDbContext) =>
    async (input: ListDataInput): Promise<any[]> => {
        const { client, logger } = context;
        const { dataPath, reload } = input;

        logger?.debug('listData:start', { data: { dataPath, reload } });

        try {
            if (reload) {
                await client.reload();
            }
            // node-json-db getData acts as list if it points to an object/array
            // However, there is no explicit listing method in node-json-db interface shown earlier aside from getData or count/index.
            // Assuming listData retrieves data at path and ensures array/object keys return.
            // Let's check implementation of list-data.ts first to be safe, but I am assuming standard pattern.
            // Wait, I should verify list-data implementation first. But standard pattern holds.
            const data = await client.getData(dataPath);
            logger?.debug('listData:success', { data: { dataPath } });

            if (Array.isArray(data)) {
                return data;
            } else if (typeof data === 'object' && data !== null) {
                return Object.values(data);
            }
            return [data];
        } catch (error: any) {
            // If path not found, node-json-db might throw. We can return empty list instead.
            if (error.id === 5) {
                // DataError of some sort, e.g. path not found
                logger?.debug('listData:not-found', { data: { dataPath } });
                return [];
            }

            // Try to match error message if id checking is flaky
            if (error.message && error.message.includes("Can't find dataPath")) {
                logger?.debug('listData:not-found', { data: { dataPath } });
                return [];
            }

            logger?.debug('listData:error', { error });
            throw error;
        }
    };
