import { JsonDbContext } from '../types';

export interface BatchGetDataInput {
    dataPaths: string[];
    reload?: boolean;
}

export const batchGetData =
    (context: JsonDbContext) =>
    async (input: BatchGetDataInput): Promise<any[]> => {
        const { client, logger } = context;
        const { dataPaths, reload } = input;

        logger?.debug('batchGetData:start', { data: { count: dataPaths.length, reload } });

        try {
            if (reload) {
                await client.reload();
            }
            const results = await Promise.all(
                dataPaths.map((path) =>
                    client.getData(path).catch((err) => {
                        logger?.debug(`batchGetData:item_error`, { error: err, data: { path } });
                        return null; // Or throw? Usually batch operations might want partial success.
                        // But let's stick to standard behavior: if one fails, maybe we just return null or undefined for that one?
                        // node-json-db throws if path not found.
                        // Let's catch and return undefined/null to indicate missing.
                    }),
                ),
            );

            logger?.debug('batchGetData:success', { data: { count: dataPaths.length } });
            return results;
        } catch (error) {
            logger?.debug('batchGetData:error', { error });
            throw error;
        }
    };
