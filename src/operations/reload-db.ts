import { JsonDbContext } from '../types';

export const reloadDb = (context: JsonDbContext) => async (): Promise<void> => {
    const { client, logger } = context;

    logger?.debug('reloadDb:start');

    try {
        await client.reload();
        logger?.debug('reloadDb:success');
    } catch (error) {
        logger?.debug('reloadDb:error', { error });
        throw error;
    }
};
