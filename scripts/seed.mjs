import fs from 'fs';
import path from 'path';
import Database from 'better-sqlite3';

const dbPath = path.resolve('./data/local.db');
const dir = path.dirname(dbPath);
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true });
}

const db = new Database(dbPath);
db.exec(`
  CREATE TABLE IF NOT EXISTS posts (
    id TEXT PRIMARY KEY,
    content TEXT
  )
`);
db.exec(`
  CREATE TABLE IF NOT EXISTS config (
    key TEXT PRIMARY KEY,
    value TEXT
  )
`);

const insertPost = db.prepare('INSERT OR REPLACE INTO posts (id, content) VALUES (?, ?)');
insertPost.run('hello-world.md', `---
title: "Hello World"
description: "My first post"
date: "2026-07-05T00:00:00.000Z"
draft: false
---

# Hello World

This is my first post in the database.
`);

console.log("Database seeded successfully with dummy post!");
db.close();
