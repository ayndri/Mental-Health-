const { neon } = require('@neondatabase/serverless');

const _sql = neon(process.env.DATABASE_URL);

// pg-compatible wrapper: pool.query(text, params) => { rows }
// Converts pg-style $1/$2 queries into neon tagged template calls
function query(text, params = []) {
  // Split on $1, $2, ... to build a fake TemplateStringsArray
  const parts = text.split(/\$\d+/g);
  const strings = Object.assign(parts, { raw: parts });
  return Promise.resolve(_sql(strings, ...params)).then(rows => ({ rows }));
}

const pool = { query };

async function initSchema() {
  await query(`
    CREATE TABLE IF NOT EXISTS users (
      id         SERIAL PRIMARY KEY,
      name       TEXT NOT NULL,
      email      TEXT UNIQUE NOT NULL,
      password   TEXT NOT NULL,
      bio        TEXT DEFAULT '',
      avatar_id  INTEGER DEFAULT 1,
      avatar_config TEXT DEFAULT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS journals (
      id         SERIAL PRIMARY KEY,
      user_id    INTEGER NOT NULL REFERENCES users(id),
      mood       TEXT NOT NULL,
      title      TEXT DEFAULT '',
      content    TEXT NOT NULL,
      date       DATE DEFAULT CURRENT_DATE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS chats (
      id               SERIAL PRIMARY KEY,
      user_id          INTEGER NOT NULL REFERENCES users(id),
      message          TEXT NOT NULL,
      emotion_result   TEXT,
      coping_strategy  TEXT,
      created_at       TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS highlights (
      id            SERIAL PRIMARY KEY,
      user_id       INTEGER NOT NULL REFERENCES users(id),
      chat_id       INTEGER,
      article_id    TEXT DEFAULT NULL,
      article_title TEXT DEFAULT NULL,
      text          TEXT NOT NULL,
      color         TEXT DEFAULT '#A78BFA',
      created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);
}

initSchema().catch(err => console.error('Schema init error:', err));

module.exports = pool;
