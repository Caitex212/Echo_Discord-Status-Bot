const Database = require('better-sqlite3');
const db = new Database('bot_data.db');

db.exec(`
  CREATE TABLE IF NOT EXISTS tracked_servers (
    message_id TEXT PRIMARY KEY,
    channel_id TEXT,
    author_id TEXT,
    server_type TEXT,
    ip TEXT,
    port INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

module.exports = db;