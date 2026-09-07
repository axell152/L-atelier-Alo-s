import postgres from 'postgres';

const sql = postgres(process.env.DATABASE_URL, { ssl: 'require' });

export async function initDb() {
  await sql`
    CREATE TABLE IF NOT EXISTS products (
      id SERIAL PRIMARY KEY,
      title TEXT NOT NULL,
      price DECIMAL(10,2) NOT NULL,
      category TEXT,
      description TEXT,
      image_url TEXT,
      extra_images TEXT,
      is_hidden BOOLEAN DEFAULT false
    );
  `;
}

export default sql;
