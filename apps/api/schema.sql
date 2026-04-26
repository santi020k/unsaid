-- Run via: wrangler d1 execute unsaid-db --file=schema.sql

CREATE TABLE IF NOT EXISTS posts (
  id          TEXT     PRIMARY KEY,
  content     TEXT     NOT NULL,
  locale      TEXT     NOT NULL DEFAULT 'en',
  created_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_posts_locale ON posts (locale);
CREATE INDEX IF NOT EXISTS idx_posts_created_at ON posts (created_at DESC);
