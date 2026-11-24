const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, 'pesadeals.db');
const db = new Database(dbPath);

// Enable WAL mode for high concurrency
db.pragma('journal_mode = WAL');

// Initialize schema
db.exec(`
  CREATE TABLE IF NOT EXISTS deals (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    category TEXT NOT NULL,
    summary TEXT NOT NULL,
    description TEXT NOT NULL,
    badge TEXT,
    payout_range TEXT NOT NULL,
    difficulty TEXT DEFAULT 'Easy',
    payment_method TEXT DEFAULT 'M-Pesa',
    requirements TEXT, -- JSON array
    steps TEXT, -- JSON array
    affiliate_url TEXT NOT NULL,
    is_featured INTEGER DEFAULT 0,
    is_meta_safe INTEGER DEFAULT 1,
    status TEXT DEFAULT 'active',
    click_count INTEGER DEFAULT 0,
    sort_order INTEGER DEFAULT 0,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS clicks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    deal_id INTEGER NOT NULL,
    deal_title TEXT,
    target_url TEXT NOT NULL,
    visitor_id TEXT,
    ip_address TEXT,
    user_agent TEXT,
    device_type TEXT,
    browser TEXT,
    os TEXT,
    referrer TEXT,
    utm_source TEXT,
    utm_medium TEXT,
    utm_campaign TEXT,
    utm_content TEXT,
    utm_term TEXT,
    created_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY(deal_id) REFERENCES deals(id) ON DELETE CASCADE
  );

  CREATE INDEX IF NOT EXISTS idx_clicks_deal_id ON clicks(deal_id);
  CREATE INDEX IF NOT EXISTS idx_clicks_created_at ON clicks(created_at);
  CREATE INDEX IF NOT EXISTS idx_clicks_utm_source ON clicks(utm_source);
  CREATE INDEX IF NOT EXISTS idx_deals_category ON deals(category);
  CREATE INDEX IF NOT EXISTS idx_deals_status ON deals(status);
`);

module.exports = db;
