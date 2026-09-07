import sql, { initDb } from '@/lib/db';
import ProductCard from '@/components/ProductCard';

export const revalidate = 0; // Pas de cache pour voir les ajouts admin en direct

async function getPublicProducts() {
  try {
    await initDb();
    const products = await sql`SELECT * FROM products WHERE is_hidden = FALSE ORDER BY id DESC`;
    return products;
  } catch (error) {
    console.error("Erreur DB:", error);
    return [];
  }
}

export default async function Home() {
  const products = await getPublicProducts();

  return (
    <div>
      <div className="text-center max-w-2xl mx-auto mb-12">
        <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 mb-4">
          Créations & Personnalisations Sur-Mesure
        </h1>
        <p className="text-lg text-slate-600">
          Stickers pour voitures, t-shirts, mugs et prestations uniques réalisées à la Cricut. Choisissez vos articles et commandez directement par WhatsApp !
        </p>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-2xl border border-slate-200">
          <p className="text-slate-500">Aucun produit disponible pour le moment.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
