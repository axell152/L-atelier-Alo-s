import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import sql, { initDb } from '../../lib/db';
import { revalidatePath } from 'next/cache';
import { del } from '@vercel/blob';
import { put } from '@vercel/blob';
import AddPricingForm from '../../components/AddPricingForm';
import PricingItemRow from '../../components/PricingItemRow';
import AddPortfolioForm from '../../components/AddPortfolioForm';

export const revalidate = 0;

export default async function AdminPage() {
  const cookieStore = cookies();
  const isAuthenticated = cookieStore.get('admin_auth');

  if (!isAuthenticated || isAuthenticated.value !== 'true') {
    redirect('/admin/login');
  }

  await initDb();

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

  async function updatePricingItem(formData) {
    'use server';
    const id = formData.get('id');
    const category = formData.get('category');
    const name = formData.get('name');
    const labels = formData.getAll('option_label');
    const prices = formData.getAll('option_price');

    const options = labels
      .map((label, i) => ({ label: (label || '').toString().trim(), price: prices[i] }))
      .filter((o) => o.label && o.price !== '' && o.price !== null);

    await sql`
      UPDATE pricing_items
      SET category = ${category}, name = ${name}, options = ${JSON.stringify(options)}
      WHERE id = ${id}
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
    revalidatePath('/');
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
    revalidatePath('/');
    revalidatePath('/admin');
  }

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
        <p className="text-[#6B5B52]">Gérez vos tarifs et votre portfolio.</p>
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
              <PricingItemRow
                key={item.id}
                item={item}
                updateAction={updatePricingItem}
                deleteAction={deletePricingItem}
              />
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
