import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import sql, { initDb } from '../../lib/db';
import { revalidatePath } from 'next/cache';

export const revalidate = 0;

export default async function AdminPage() {
  const cookieStore = cookies();
  const isAuthenticated = cookieStore.get('admin_auth');

  if (!isAuthenticated || isAuthenticated.value !== 'true') {
    redirect('/admin/login');
  }

  await initDb();

  async function addProduct(formData) {
    'use server';
    const title = formData.get('title');
    const price = formData.get('price');
    const category = formData.get('category');
    const description = formData.get('description');
    const is_hidden = formData.get('is_hidden') === 'on';

    let mainImageUrl = '';
    let extraUrls = [];

    try {
      // Miniature principale
      const mainImageFile = formData.get('main_image');
      if (mainImageFile && mainImageFile.size > 0) {
        const bytes = await mainImageFile.arrayBuffer();
        const buffer = Buffer.from(bytes);
        mainImageUrl = `data:${mainImageFile.type};base64,${buffer.toString('base64')}`;
      }

      // Photos supplémentaires
      const extraFiles = formData.getAll('extra_images');
      for (const file of extraFiles) {
        if (file && file.size > 0) {
          const bytes = await file.arrayBuffer();
          const buffer = Buffer.from(bytes);
          extraUrls.push(`data:${file.type};base64,${buffer.toString('base64')}`);
        }
      }
    } catch (err) {
      console.error("Erreur conversion image:", err);
    }

    await sql`
      INSERT INTO products (title, price, category, description, image_url, extra_images, is_hidden)
      VALUES (${title}, ${price}, ${category}, ${description}, ${mainImageUrl}, ${JSON.stringify(extraUrls)}, ${is_hidden})
    `;
    
    revalidatePath('/');
    revalidatePath('/admin');
  }

  async function toggleVisibility(formData) {
    'use server';
    const id = formData.get('id');
    const currentStatus = formData.get('currentStatus') === 'true';
    await sql`UPDATE products SET is_hidden = ${!currentStatus} WHERE id = ${id}`;
    revalidatePath('/');
    revalidatePath('/admin');
  }

  async function deleteProduct(formData) {
    'use server';
    const id = formData.get('id');
    await sql`DELETE FROM products WHERE id = ${id}`;
    revalidatePath('/');
    revalidatePath('/admin');
  }

  const products = await sql`SELECT * FROM products ORDER BY id DESC`;

  return (
    <div className="max-w-4xl mx-auto space-y-10 pb-20 px-4">
      <div>
        <h1 className="text-3xl font-serif font-bold text-[#4A3B32] mb-2">Espace Administration</h1>
        <p className="text-[#6B5B52]">Gérez vos créations, descriptions et photos.</p>
      </div>

      <div className="bg-white p-6 rounded-3xl border border-[#EFECE6] shadow-xs">
        <h2 className="text-xl font-serif font-bold text-[#4A3B32] mb-4">Ajouter un nouveau produit</h2>
        <form action={addProduct} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-[#6B5B52] mb-1">Titre de l'article</label>
            <input required type="text" name="title" placeholder="Ex: Mug personnalisé" className="w-full border border-[#EFECE6] rounded-2xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#5A3E36]" />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#6B5B52] mb-1">Prix (€)</label>
            <input required type="number" step="0.01" name="price" placeholder="15.00" className="w-full border border-[#EFECE6] rounded-2xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#5A3E36]" />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#6B5B52] mb-1">Catégorie</label>
            <input type="text" name="category" placeholder="Sticker, T-shirt, Mug..." className="w-full border border-[#EFECE6] rounded-2xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#5A3E36]" />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-[#6B5B52] mb-1">Description détaillée</label>
            <textarea name="description" rows="3" placeholder="Décrivez votre produit..." className="w-full border border-[#EFECE6] rounded-2xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#5A3E36]"></textarea>
          </div>
          <div>
            <label className="block text-sm font-medium text-[#6B5B52] mb-1">Photo Miniature (Catalogue)</label>
            <input type="file" name="main_image" accept="image/*" className="w-full text-sm text-[#6B5B52]" />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#6B5B52] mb-1">Photos supplémentaires</label>
            <input type="file" name="extra_images" multiple accept="image/*" className="w-full text-sm text-[#6B5B52]" />
          </div>
          <div className="md:col-span-2 flex items-center gap-3 py-2">
            <input type="checkbox" name="is_hidden" id="is_hidden" className="w-4 h-4 text-[#5A3E36] rounded border-[#EFECE6]" />
            <label htmlFor="is_hidden" className="text-sm font-medium text-[#6B5B52]">Masquer cet article du catalogue</label>
          </div>
          <div className="md:col-span-2">
            <button type="submit" className="w-full bg-[#5A3E36] hover:bg-[#4A3B32] text-white font-bold py-3 rounded-2xl transition">
              Enregistrer l'article
            </button>
          </div>
        </form>
      </div>

      <div className="bg-white p-6 rounded-3xl border border-[#EFECE6] shadow-xs">
        <h2 className="text-xl font-serif font-bold text-[#4A3B32] mb-4">Mes articles ({products.length})</h2>
        <div className="divide-y divide-[#F7F4EE]">
          {products.map((p) => (
            <div key={p.id} className="py-4 flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                {p.image_url && <img src={p.image_url} alt="" className="w-12 h-12 rounded-xl object-cover" />}
                <div>
                  <h4 className="font-semibold text-[#4A3B32]">{p.title}</h4>
                  <p className="text-sm text-[#6B5B52]">{Number(p.price).toFixed(2)} € • <span className={p.is_hidden ? "text-amber-600 font-medium" : "text-emerald-600 font-medium"}>{p.is_hidden ? "🔒 Masqué" : "🌍 Public"}</span></p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <form action={toggleVisibility}>
                  <input type="hidden" name="id" value={p.id} />
                  <input type="hidden" name="currentStatus" value={p.is_hidden.toString()} />
                  <button type="submit" className="px-3 py-1.5 text-xs font-medium rounded-xl border border-[#EFECE6] hover:bg-[#F7F4EE]">
                    {p.is_hidden ? "Rendre public" : "Masquer"}
                  </button>
                </form>
                <form action={deleteProduct}>
                  <input type="hidden" name="id" value={p.id} />
                  <button type="submit" className="px-3 py-1.5 text-xs font-medium rounded-xl bg-red-50 text-red-600 hover:bg-red-100">
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
