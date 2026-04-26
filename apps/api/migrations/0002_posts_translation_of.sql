-- Links machine-translated rows to the source post (null = authored in this locale).
ALTER TABLE posts ADD COLUMN translation_of TEXT REFERENCES posts (id);
