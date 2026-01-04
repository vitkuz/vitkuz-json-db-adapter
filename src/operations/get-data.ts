import { JsonDbContext } from '../types';

export interface GetDataInput {
    dataPath: string;
    reload?: boolean;
}

export const getData =
    (context: JsonDbContext) =>
    async (input: GetDataInput): Promise<any> => {
        const { client, logger } = context;
        const { dataPath, reload } = input;

        logger?.debug('getData:start', { data: { dataPath, reload } });

        try {
            if (reload) {
                await client.reload();
            }
            const data = await client.getData(dataPath);
            logger?.debug('getData:success', { data: { dataPath } });
            return data;
        } catch (error) {
            logger?.debug('getData:error', { error });
            throw error;
        }
    };
