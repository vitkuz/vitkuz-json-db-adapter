import { createClient, createAdapter, Logger } from '../src/index';
import { logger, cleanDb } from './common';

const run = async () => {
    console.log('--- Manual Script: Create Seed Data (Users, Books, Categories) ---');

    const dbName = 'test/data/manual-db';
    cleanDb(dbName);

    // Enable humanReadable for easier inspection
    const client = createClient({
        filename: dbName,
        humanReadable: true,
        saveOnPush: true,
    });
    const adapter = createAdapter({ client, logger });

    // --- Users ---
    const users = [
        { id: 'user_1', name: 'Alice', email: 'alice@example.com', role: 'admin' },
        { id: 'user_2', name: 'Bob', email: 'bob@example.com', role: 'user' },
        { id: 'user_3', name: 'Charlie', email: 'charlie@example.com', role: 'editor' },
    ];

    console.log('Creating users (batch)...');
    await adapter.batchPushData({
        items: users.map((user) => ({ dataPath: `/users/${user.id}`, data: user })),
    });

    // --- Books ---
    const books = [
        {
            id: 'book_1',
            title: 'The Great Gatsby',
            author: 'F. Scott Fitzgerald',
            categoryId: 'cat_1',
        },
        { id: 'book_2', title: '1984', author: 'George Orwell', categoryId: 'cat_2' },
        { id: 'book_3', title: 'The Hobbit', author: 'J.R.R. Tolkien', categoryId: 'cat_3' },
    ];

    console.log('Creating books (batch)...');
    await adapter.batchPushData({
        items: books.map((book) => ({ dataPath: `/books/${book.id}`, data: book })),
    });

    // --- Categories ---
    const categories = [
        { id: 'cat_1', name: 'Classic Literature' },
        { id: 'cat_2', name: 'Dystopian Fiction' },
        { id: 'cat_3', name: 'Fantasy' },
    ];

    console.log('Creating categories (batch)...');
    await adapter.batchPushData({
        items: categories.map((category) => ({
            dataPath: `/categories/${category.id}`,
            data: category,
        })),
    });

    console.log('All seed data created successfully.');

    // Read back full DB
    const fullDb = await adapter.getData({ dataPath: '/' });
    console.log('Full Database Content:', JSON.stringify(fullDb, null, 2));
};

run().catch((err) => console.error(err));
