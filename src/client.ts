import { JsonDB, Config } from 'node-json-db';

export interface JsonDBClientConfig {
    filename: string;
    saveOnPush?: boolean;
    humanReadable?: boolean;
    separator?: string;
    syncOnSave?: boolean;
}

export const createClient = (config: JsonDBClientConfig): JsonDB => {
    return new JsonDB(
        new Config(
            config.filename,
            config.saveOnPush ?? true,
            config.humanReadable ?? false,
            config.separator ?? '/',
            config.syncOnSave ?? false,
        ),
    );
};
