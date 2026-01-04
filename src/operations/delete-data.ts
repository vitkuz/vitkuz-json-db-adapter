import { JsonDbContext } from '../types';

export interface DeleteDataInput {
    dataPath: string;
    reload?: boolean;
}

export const deleteData =
    (context: JsonDbContext) =>
    async (input: DeleteDataInput): Promise<void> => {
        const { client, logger } = context;
        const { dataPath, reload } = input;

        logger?.debug('deleteData:start', { data: { dataPath, reload } });

        try {
            if (reload) {
                await client.reload();
            }
            await client.delete(dataPath);
            logger?.debug('deleteData:success', { data: { dataPath } });
        } catch (error) {
            logger?.debug('deleteData:error', { error });
            throw error;
        }
    };
