import { JsonDB } from 'node-json-db';

export interface Logger {
    debug: (message: string, context?: { error?: any; data?: any }) => void;
    [key: string]: any;
}

export interface JsonDbContext {
    client: JsonDB;
    logger?: Logger;
}
