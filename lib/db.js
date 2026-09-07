import postgres from 'postgres';

let sql;

if (!global._sql) {
  global._sql = postgres(process.env.DATABASE_URL, { ssl: 'require' });
}
sql = global._sql;

export async function initDb() {
  await sql`
    CREATE TABLE IF NOT EXISTS products (
      id SERIAL PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      price DECIMAL(10,2) NOT NULL,
      image_url TEXT,
      category VARCHAR(100),
      is_hidden BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;
}

export default sql;
