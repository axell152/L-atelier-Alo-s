import sql, { initDb } from '../../lib/db';
import { revalidatePath } from 'next/cache';

export const revalidate = 0;

export default async function AdminPage() {
  await initDb();

  // Action serveur pour ajouter un produit
  async function addProduct(formData) {
    'use server';
    const title = formData.get('title');
    const price = formData.get('price');
    const category = formData.get('category');
    const image_url = formData.get('image_url');
    const is_hidden = formData.get('is_hidden') === 'on';

    await sql`
      INSERT INTO products (title, price, category, image_url, is_hidden)
      VALUES (${title}, ${price}, ${category}, ${image_url}, ${is_hidden})
    `;
    revalidatePath('/');
    revalidatePath('/admin');
  }

  // Action serveur pour basculer la visibilité (Caché / Public)
  async function toggleVisibility(formData) {
    'use server';
    const id = formData.get('id');
    const currentStatus = formData.get('currentStatus') === 'true';

    await sql`UPDATE products SET is_hidden = ${!currentStatus} WHERE id = ${id}`;
    revalidatePath('/');
    revalidatePath('/admin');
  }

  // Action serveur pour supprimer un produit
  async function deleteProduct(formData) {
    'use server';
    const id = formData.get('id');
    await sql`DELETE FROM products WHERE id = ${id}`;
    revalidatePath('/');
    revalidatePath('/admin');
  }

  const products = await sql`SELECT * FROM products ORDER BY id DESC`;

  return (
    <div className="max-w-4xl mx-auto space-y-10">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 mb-2">Espace Administration</h1>
        <p className="text-slate-600">Gérez vos prestations, vos créations Cricut et contrôlez ce qui est visible ou non.</p>
      </div>

      {/* Formulaire d'ajout */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <h2 className="text-xl font-bold text-slate-900 mb-4">Ajouter un nouveau produit / prestation</h2>
        <form action={addProduct} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Titre de l'article</label>
            <input required type="text" name="title" placeholder="Ex: Mug personnalisé Prénom" className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Prix (€)</label>
            <input required type="number" step="0.01" name="price" placeholder="15.00" className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Catégorie</label>
            <input type="text" name="category" placeholder="Sticker, T-shirt, Mug..." className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Lien de l'image (URL)</label>
            <input type="url" name="image_url" placeholder="https://example.com/photo.jpg" className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          </div>
          <div className="md:col-span-2 flex items-center gap-3 py-2">
            <input type="checkbox" name="is_hidden" id="is_hidden" className="w-4 h-4 text-indigo-600 rounded border-slate-300" />
            <label htmlFor="is_hidden" className="text-sm font-medium text-slate-700">
              Masquer cet article du catalogue public (Visible uniquement par moi ou via lien direct si besoin)
            </label>
          </div>
          <div className="md:col-span-2">
            <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl transition">
              Enregistrer l'article
            </button>
          </div>
        </form>
      </div>

      {/* Liste des produits existants */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <h2 className="text-xl font-bold text-slate-900 mb-4">Tous mes articles ({products.length})</h2>
        <div className="divide-y divide-slate-100">
          {products.map((p) => (
            <div key={p.id} className="py-4 flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                {p.image_url && <img src={p.image_url} alt="" className="w-12 h-12 rounded-lg object-cover" />}
                <div>
                  <h4 className="font-semibold text-slate-900">{p.title}</h4>
                  <p className="text-sm text-slate-500">{Number(p.price).toFixed(2)} € • <span className={p.is_hidden ? "text-amber-600 font-medium" : "text-emerald-600 font-medium"}>{p.is_hidden ? "🔒 Masqué (Privé)" : "🌍 Public"}</span></p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <form action={toggleVisibility}>
                  <input type="hidden" name="id" value={p.id} />
                  <input type="hidden" name="currentStatus" value={p.is_hidden.toString()} />
                  <button type="submit" className="px-3 py-1.5 text-xs font-medium rounded-lg border border-slate-200 hover:bg-slate-50">
                    {p.is_hidden ? "Rendre public" : "Masquer"}
                  </button>
                </form>
                <form action={deleteProduct}>
                  <input type="hidden" name="id" value={p.id} />
                  <button type="submit" className="px-3 py-1.5 text-xs font-medium rounded-lg bg-red-50 text-red-600 hover:bg-red-100">
                    Supprimer
                  </button>
                </form>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
