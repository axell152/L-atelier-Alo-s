import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import sql, { initDb } from '../../lib/db';
import { revalidatePath } from 'next/cache';
import AddProductForm from '../../components/AddProductForm';

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
      const mainImageFile = formData.get('main_image');
      if (mainImageFile && mainImageFile.size > 0 && mainImageFile.size < 5000000) {
        const bytes = await mainImageFile.arrayBuffer();
        const buffer = Buffer.from(bytes);
        mainImageUrl = `data:${mainImageFile.type};base64,${buffer.toString('base64')}`;
      }

      const extraFiles = formData.getAll('extra_images');
      for (const file of extraFiles) {
        if (file && file.size > 0 && file.size < 5000000) {
          const bytes = await file.arrayBuffer();
          const buffer = Buffer.from(bytes);
          extraUrls.push(`data:${file.type};base64,${buffer.toString('base64')}`);
        }
      }
    } catch (e) {
      console.log("Erreur conversion:", e);
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
        <p className="text-[#6B5B52]">Gérez vos créations et importez vos photos.</p>
      </div>

      <div className="bg-white p-6 rounded-3xl border border-[#EFECE6] shadow-xs">
        <h2 className="text-xl font-serif font-bold text-[#4A3B32] mb-4">Ajouter un nouveau produit</h2>
        <AddProductForm action={addProduct} />
      </div>

      <div className="bg-white p-6 rounded-3xl border border-[#EFECE6] shadow-xs">
        <h2 className="text-xl font-serif font-bold text-[#4A3B32] mb-4">Mes articles ({products.length})</h2>
        <div className="divide-y divide-[#F7F4EE]">
          {products.map((p) => (
            <div key={p.id} className="py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="flex items-center gap-4 min-w-0">
                {p.image_url && <img src={p.image_url} alt="" className="w-12 h-12 rounded-xl object-cover shrink-0" />}
                <div className="min-w-0">
                  <h4 className="font-semibold text-[#4A3B32] break-words">{p.title}</h4>
                  <p className="text-sm text-[#6B5B52]">{Number(p.price).toFixed(2)} € • <span className={p.is_hidden ? "text-amber-600 font-medium" : "text-emerald-600 font-medium"}>{p.is_hidden ? "🔒 Masqué" : "🌍 Public"}</span></p>
                </div>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
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
