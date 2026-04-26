-- Run via: wrangler d1 execute unsaid-db --local --file=schema.sql
-- Prefer versioned migrations in ./migrations/ (see package.json db:migrate).

CREATE TABLE IF NOT EXISTS posts (
  id               TEXT     PRIMARY KEY,
  content          TEXT     NOT NULL,
  locale           TEXT     NOT NULL DEFAULT 'en',
  translation_of   TEXT     REFERENCES posts (id),
  created_at       DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_posts_locale ON posts (locale);
CREATE INDEX IF NOT EXISTS idx_posts_created_at ON posts (created_at DESC);
