import { JsonDbContext } from '../types';

export interface BatchPushDataInput {
    items: {
        dataPath: string;
        data: any;
        override?: boolean;
    }[];
    reload?: boolean;
}

export const batchPushData =
    (context: JsonDbContext) =>
    async (input: BatchPushDataInput): Promise<void> => {
        const { client, logger } = context;
        const { items, reload } = input;

        logger?.debug('batchPushData:start', { data: { count: items.length, reload } });

        // Store original saveOnPush setting
        // @ts-ignore - config is public in runtime but might be private in types depending on version, checking runtime earlier confirmed it is public.
        // However, to be safe with TypeScript, we might need to cast to any if the d.ts hides it.
        // Based on my previous `ls` the d.ts is available.
        // Let's assume standard access. If TS fails, I'll allow casting.
        const originalSaveOnPush = (client as any).config.saveOnPush;

        try {
            if (reload) {
                await client.reload();
            }

            // Disable saveOnPush for the batch
            (client as any).config.saveOnPush = false;

            for (const item of items) {
                await client.push(item.dataPath, item.data, item.override ?? true);
            }

            // Save once at the end
            await client.save();

            logger?.debug('batchPushData:success', { data: { count: items.length } });
        } catch (error) {
            logger?.debug('batchPushData:error', { error });
            throw error;
        } finally {
            // Restore configuration
            (client as any).config.saveOnPush = originalSaveOnPush;
        }
    };
