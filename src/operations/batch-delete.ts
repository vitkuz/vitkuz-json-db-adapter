import { JsonDbContext } from '../types';

export interface BatchDeleteDataInput {
    dataPaths: string[];
    reload?: boolean;
}

export const batchDeleteData =
    (context: JsonDbContext) =>
    async (input: BatchDeleteDataInput): Promise<void> => {
        const { client, logger } = context;
        const { dataPaths, reload } = input;

        logger?.debug('batchDeleteData:start', { data: { count: dataPaths.length, reload } });

        // Store original saveOnPush setting
        // @ts-ignore
        const originalSaveOnPush = (client as any).config.saveOnPush;

        try {
            if (reload) {
                await client.reload();
            }

            // Disable saveOnPush for the batch
            (client as any).config.saveOnPush = false;

            for (const path of dataPaths) {
                await client.delete(path);
            }

            // Save once at the end
            await client.save();

            logger?.debug('batchDeleteData:success', { data: { count: dataPaths.length } });
        } catch (error) {
            logger?.debug('batchDeleteData:error', { error });
            throw error;
        } finally {
            // Restore configuration
            (client as any).config.saveOnPush = originalSaveOnPush;
        }
    };
