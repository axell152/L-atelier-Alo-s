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

  // Rattrape les colonnes manquantes si la table existait déjà avec un schéma plus ancien
  // (CREATE TABLE IF NOT EXISTS ne modifie jamais une table déjà existante).
  await sql`ALTER TABLE products ADD COLUMN IF NOT EXISTS category TEXT`;
  await sql`ALTER TABLE products ADD COLUMN IF NOT EXISTS description TEXT`;
  await sql`ALTER TABLE products ADD COLUMN IF NOT EXISTS image_url TEXT`;
  await sql`ALTER TABLE products ADD COLUMN IF NOT EXISTS extra_images TEXT`;
  await sql`ALTER TABLE products ADD COLUMN IF NOT EXISTS is_hidden BOOLEAN DEFAULT false`;
}

export default sql;
