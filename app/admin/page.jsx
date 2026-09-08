import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import sql, { initDb } from '../../lib/db';
import { revalidatePath } from 'next/cache';
import { put, del } from '@vercel/blob';
import AddProductForm from '../../components/AddProductForm';
import AddPricingForm from '../../components/AddPricingForm';
import AddPortfolioForm from '../../components/AddPortfolioForm';

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
      if (mainImageFile && mainImageFile.size > 0) {
        const blob = await put(`products/${crypto.randomUUID()}-${mainImageFile.name}`, mainImageFile, {
          access: 'public',
        });
        mainImageUrl = blob.url;
      }

      const extraFiles = formData.getAll('extra_images');
      for (const file of extraFiles) {
        if (file && file.size > 0) {
          const blob = await put(`products/${crypto.randomUUID()}-${file.name}`, file, {
            access: 'public',
          });
          extraUrls.push(blob.url);
        }
      }
    } catch (e) {
      console.log("Erreur upload image:", e);
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

    try {
      const [product] = await sql`SELECT image_url, extra_images FROM products WHERE id = ${id}`;
      if (product) {
        let extras = [];
        try {
          extras = JSON.parse(product.extra_images || '[]');
        } catch {
          extras = [];
        }
        const urls = [product.image_url, ...extras].filter((u) => u && u.startsWith('http'));
        for (const url of urls) {
          await del(url).catch(() => {});
        }
      }
    } catch (e) {
      console.log('Erreur suppression images Blob:', e);
    }

    await sql`DELETE FROM products WHERE id = ${id}`;
    revalidatePath('/');
    revalidatePath('/admin');
  }

  async function addPricingItem(formData) {
    'use server';
    const category = formData.get('category');
    const name = formData.get('name');
    const labels = formData.getAll('option_label');
    const prices = formData.getAll('option_price');

    const options = labels
      .map((label, i) => ({ label: (label || '').toString().trim(), price: prices[i] }))
      .filter((o) => o.label && o.price !== '' && o.price !== null);

    await sql`
      INSERT INTO pricing_items (category, name, options)
      VALUES (${category}, ${name}, ${JSON.stringify(options)})
    `;

    revalidatePath('/tarifs');
    revalidatePath('/admin');
  }

  async function deletePricingItem(formData) {
    'use server';
    const id = formData.get('id');
    await sql`DELETE FROM pricing_items WHERE id = ${id}`;
    revalidatePath('/tarifs');
    revalidatePath('/admin');
  }

  async function addPortfolioItem(formData) {
    'use server';
    const caption = formData.get('caption');
    let imageUrl = '';

    try {
      const file = formData.get('image');
      if (file && file.size > 0) {
        const blob = await put(`portfolio/${crypto.randomUUID()}-${file.name}`, file, {
          access: 'public',
        });
        imageUrl = blob.url;
      }
    } catch (e) {
      console.log('Erreur upload portfolio:', e);
    }

    if (!imageUrl) return;

    await sql`INSERT INTO portfolio_items (image_url, caption) VALUES (${imageUrl}, ${caption})`;
    revalidatePath('/portfolio');
    revalidatePath('/admin');
  }

  async function deletePortfolioItem(formData) {
    'use server';
    const id = formData.get('id');

    try {
      const [item] = await sql`SELECT image_url FROM portfolio_items WHERE id = ${id}`;
      if (item?.image_url && item.image_url.startsWith('http')) {
        await del(item.image_url).catch(() => {});
      }
    } catch (e) {
      console.log('Erreur suppression image Blob portfolio:', e);
    }

    await sql`DELETE FROM portfolio_items WHERE id = ${id}`;
    revalidatePath('/portfolio');
    revalidatePath('/admin');
  }

  const products = await sql`SELECT * FROM products ORDER BY id DESC`;
  const pricingRows = await sql`SELECT * FROM pricing_items ORDER BY category, position, id`;
  const pricingItems = pricingRows.map((r) => {
    let options = [];
    try {
      options = JSON.parse(r.options || '[]');
    } catch {
      options = [];
    }
    return { ...r, options };
  });
  const portfolioItems = await sql`SELECT * FROM portfolio_items ORDER BY position, id DESC`;

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

      <div className="bg-white p-6 rounded-3xl border border-[#EFECE6] shadow-xs">
        <h2 className="text-xl font-serif font-bold text-[#4A3B32] mb-4">Ajouter un tarif de personnalisation</h2>
        <AddPricingForm action={addPricingItem} />
      </div>

      <div className="bg-white p-6 rounded-3xl border border-[#EFECE6] shadow-xs">
        <h2 className="text-xl font-serif font-bold text-[#4A3B32] mb-4">Mes tarifs ({pricingItems.length})</h2>
        {pricingItems.length === 0 ? (
          <p className="text-sm text-[#6B5B52]">Aucun tarif ajouté pour le moment.</p>
        ) : (
          <div className="divide-y divide-[#F7F4EE]">
            {pricingItems.map((item) => (
              <div key={item.id} className="py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="min-w-0">
                  <span className="text-xs font-semibold text-[#5A3E36] uppercase tracking-wider">{item.category}</span>
                  <h4 className="font-semibold text-[#4A3B32] break-words">{item.name}</h4>
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    {item.options.map((o, i) => (
                      <span key={i} className="text-xs bg-[#F7F4EE] text-[#6B5B52] px-2 py-0.5 rounded-full">
                        {o.label} — {Number(o.price).toFixed(2)} €
                      </span>
                    ))}
                  </div>
                </div>
                <form action={deletePricingItem}>
                  <input type="hidden" name="id" value={item.id} />
                  <button type="submit" className="px-3 py-1.5 text-xs font-medium rounded-xl bg-red-50 text-red-600 hover:bg-red-100 shrink-0">
                    Supprimer
                  </button>
                </form>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="bg-white p-6 rounded-3xl border border-[#EFECE6] shadow-xs">
        <h2 className="text-xl font-serif font-bold text-[#4A3B32] mb-4">Ajouter une photo au portfolio</h2>
        <AddPortfolioForm action={addPortfolioItem} />
      </div>

      <div className="bg-white p-6 rounded-3xl border border-[#EFECE6] shadow-xs">
        <h2 className="text-xl font-serif font-bold text-[#4A3B32] mb-4">Mon portfolio ({portfolioItems.length})</h2>
        {portfolioItems.length === 0 ? (
          <p className="text-sm text-[#6B5B52]">Aucune photo ajoutée pour le moment.</p>
        ) : (
          <div className="divide-y divide-[#F7F4EE]">
            {portfolioItems.map((item) => (
              <div key={item.id} className="py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="flex items-center gap-4 min-w-0">
                  <img src={item.image_url} alt="" className="w-12 h-12 rounded-xl object-cover shrink-0" />
                  <p className="font-semibold text-[#4A3B32] break-words">{item.caption || '(sans légende)'}</p>
                </div>
                <form action={deletePortfolioItem}>
                  <input type="hidden" name="id" value={item.id} />
                  <button type="submit" className="px-3 py-1.5 text-xs font-medium rounded-xl bg-red-50 text-red-600 hover:bg-red-100 shrink-0">
                    Supprimer
                  </button>
                </form>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
