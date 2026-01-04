import { JsonDB } from 'node-json-db';
import { Logger, JsonDbContext } from './types';

// Import operations directly to avoid circular dependency (if any, though here it's fine to use index if careful, but direct is safer)
import { pushData } from './operations/push-data';
import { getData } from './operations/get-data';
import { deleteData } from './operations/delete-data';
import { reloadDb } from './operations/reload-db';
import { listData } from './operations/list-data';
import { batchPushData } from './operations/batch-push';
import { batchGetData } from './operations/batch-get';
import { batchDeleteData } from './operations/batch-delete';

export interface AdapterConfig {
    client: JsonDB;
    logger?: Logger;
}

export const createAdapter = (config: AdapterConfig) => {
    const context: JsonDbContext = {
        client: config.client,
        logger: config.logger,
    };

    return {
        pushData: pushData(context),
        getData: getData(context),
        deleteData: deleteData(context),
        reloadDb: reloadDb(context),
        listData: listData(context),
        batchPushData: batchPushData(context),
        batchGetData: batchGetData(context),
        batchDeleteData: batchDeleteData(context),
    };
};
