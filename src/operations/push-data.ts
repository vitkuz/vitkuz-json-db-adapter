import { JsonDbContext } from '../types';

export interface PushDataInput {
    dataPath: string;
    data: any;
    override?: boolean;
    reload?: boolean;
}

export const pushData =
    (context: JsonDbContext) =>
    async (input: PushDataInput): Promise<void> => {
        const { client, logger } = context;
        const { dataPath, data, override, reload } = input;

        logger?.debug('pushData:start', { data: { dataPath, reload } });

        try {
            if (reload) {
                await client.reload();
            }
            await client.push(dataPath, data, override ?? true);
            logger?.debug('pushData:success', { data: { dataPath } });
        } catch (error) {
            logger?.debug('pushData:error', { error });
            throw error;
        }
    };
