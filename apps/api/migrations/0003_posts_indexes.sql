-- Feed and translation integrity indexes for existing D1 databases.
CREATE INDEX IF NOT EXISTS idx_posts_locale_created_at
  ON posts (locale, created_at DESC);

CREATE UNIQUE INDEX IF NOT EXISTS idx_posts_translation_locale_unique
  ON posts (translation_of, locale)
  WHERE translation_of IS NOT NULL;
