# @vitkuz/vitkuz-json-db-adapter

A TypeScript adapter for `node-json-db`, providing a standardized functional interface for file-based JSON database operations.

## Installation

```bash
npm install @vitkuz/vitkuz-json-db-adapter
```

## Quick Start

```typescript
import { createClient, createAdapter } from '@vitkuz/vitkuz-json-db-adapter';

// 1. Create a client instance
const client = createClient({
  filename: 'my-database', // will create my-database.json
  saveOnPush: true,        // save to disk after every push
  humanReadable: true      // pretty print the JSON file
});

// 2. Create the adapter
const adapter = createAdapter({ client });

// 3. Use operations
const run = async () => {
  // Push data
  await adapter.pushData({ 
    dataPath: '/users/1', 
    data: { name: 'Alice', role: 'admin' } 
  });

  // Get data
  const user = await adapter.getData({ dataPath: '/users/1' });
  console.log(user); 
  // { name: 'Alice', role: 'admin' }
};

run();
```

## API Reference

### Configuration

#### `createClient(config: JsonDBClientConfig)`

Creates a `node-json-db` instance with the following options:

| Option          | Type      | Default | Description |
|-----------------|-----------|---------|-------------|
| `filename`      | `string`  | **Required** | The path/name of the database file (without .json extension). |
| `saveOnPush`    | `boolean` | `true`  | Write to disk after every push. |
| `humanReadable` | `boolean` | `false` | Pretty print the JSON file for better readability. |
| `separator`     | `string`  | `/`     | The separator for data paths. |
| `syncOnSave`    | `boolean` | `false` | Use synchronous file writing (blocks execution). |

#### `createAdapter(context: JsonDbContext)`

Creates the adapter object containing all operations.

- `client`: The `JsonDB` instance created by `createClient`.
- `logger`: Optional. An object with a `debug` method (e.g., `console` or a custom logger).

### Operations

All operations are methods on the object returned by `createAdapter`.

#### `pushData(input: PushDataInput)`
Writes data to a specific path.

- `dataPath`: Path in the JSON tree (e.g., `/users/1`).
- `data`: The data object to store.
- `override`: (Optional, default `true`) Whether to overwrite existing data at that path.
- `reload`: (Optional) If `true`, reloads the database from disk before pushing.

#### `batchPushData(input: BatchPushDataInput)`
Writes multiple data items in a single batch operation. This is more efficient as it saves the database to disk only once after all items are updated in memory.

- `items`: An array of objects containing `dataPath`, `data`, and optional `override`.
- `reload`: (Optional) If `true`, reloads the database from disk before pushing.

#### `getData(input: GetDataInput)`
Retrieves data from a specific path.

- `dataPath`: Path in the JSON tree.
- `reload`: (Optional) If `true`, reloads the database from disk before retrieving. Useful if the file might be changed by another process.

#### `batchGetData(input: BatchGetDataInput)`
Retrieves data from multiple paths in parallel.

- `dataPaths`: Array of paths in the JSON tree.
- `reload`: (Optional) If `true`, reloads the database from disk before retrieving.
- Returns: An array of results in the same order as items. If a path is not found, `null` is returned for that item.

#### `deleteData(input: DeleteDataInput)`
Removes data at a specific path.

- `dataPath`: Path in the JSON tree.
- `reload`: (Optional) If `true`, reloads the database from disk before deleting.

#### `batchDeleteData(input: BatchDeleteDataInput)`
Removes data from multiple paths in a single batch operation (saving only once).

- `dataPaths`: Array of paths in the JSON tree.
- `reload`: (Optional) If `true`, reloads the database from disk before deleting.

#### `listData(input: ListDataInput)`
Lists keys or array items at a specific path. Useful for retrieving collections.

- `dataPath`: Path in the JSON tree.
- `reload`: (Optional) If `true`, reloads the database from disk before retrieval.
- Returns: an array of items (if path points to array) or values (if path points to object).

#### `reloadDb()`
Reloads the database from the file system. Useful if the file was modified externally.

## Behaviors & Edge Cases

### 1. Get Non-Existent Item
- **Single `getData`**: Throws a `DataError` if the path does not exist.
- **Batch `batchGetData`**: Returns `null` for any path that does not exist. Does **not** throw unless there is a database corruption or permission issue.

### 2. Push Existing Item
- **Single `pushData`**: By default (`override: true`), it effectively **replaces** or **merges** depending on the structure, but logically updates the value. If you pass `override: false`, it merges the data.
- **Batch `batchPushData`**: Follows the same rules. It updates/overwrites the data at the path.

### 4. Replacement vs. Merging

#### Full Replacement (Default)
When you use `pushData` (or `batchPushData`) with `override: true` (which is the default), it performs a **full replacement** of the data at the specified path.

- OLD: `{ "a": 1, "b": 2 }`
- PUSH: `{ "a": 99 }`
- RESULT: `{ "a": 99 }` (Key "b" is gone)

#### Merging (`override: false`)

If you want to **merge** updates into an existing object without losing other keys, use `override: false`.

-   **Primitives**: The new value **replaces** the old one.
-   **Objects**: The merge is **recursive**.
    -   New keys are added.
    -   Existing keys with primitive values are updated.
    -   Nested objects are also merged recursively.
-   **Arrays**: The new array elements are **appended** to the existing array.
    -   Example: `[1, 2]` merged with `[3, 4]` results in `[1, 2, 3, 4]`.
    -   **Important**: This applies to arrays nested within objects as well. If you merge `{ tags: ['blue'] }` into `{ tags: ['red'] }`, you get `{ tags: ['red', 'blue'] }`.
    -   **Caveat**: If you try to merge an object `{ 0: 'a' }` into an array, it might be appended as an object element depending on the implementation details (Node-JSON-DB generally handles array merging by appending).





This package includes a manual test script that seeds the database with sample data (Users, Books, Categories).

```bash
npm run test:manual
```

The database file will be created at `test/data/manual-db.json`.
