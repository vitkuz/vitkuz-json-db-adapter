import { Logger } from '../src/index';
import fs from 'fs';
import path from 'path';

export const logger: Logger = {
    debug: (msg: string, ctx?: any) => console.log(`[DEBUG] ${msg}`, ctx || ''),
    info: (msg: string, ctx?: any) => console.log(`[INFO] ${msg}`, ctx || ''),
    error: (msg: string, ctx?: any) => console.error(`[ERROR] ${msg}`, ctx || ''),
};

export const cleanDb = (filename: string) => {
    try {
        const filePath = path.resolve(process.cwd(), filename + '.json');
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
            console.log(`Cleaned up database: ${filePath}`);
        }
    } catch (error) {
        console.error(`Failed to clean database ${filename}:`, error);
    }
};
