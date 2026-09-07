import sql, { initDb } from '../lib/db';
import ProductCard from '../components/ProductCard';

export const revalidate = 0;

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
    <div className="space-y-12">
      {/* En-tête / Bannière de présentation */}
      <div className="text-center max-w-3xl mx-auto space-y-4 py-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-100/60 text-pink-700 text-xs font-semibold tracking-wide uppercase">
          <span>💖</span> Pièces uniques & Personnalisation sur-mesure
        </div>
        <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-slate-900 leading-tight">
          Donnez vie à vos envies créatives
        </h1>
        <p className="text-lg text-slate-600 font-normal">
          Découvrez mes stickers pour voitures, t-shirts, mugs et prestations artisanales. Choisissez vos articles et finalisez directement sur WhatsApp.
        </p>
      </div>

      {/* Grille des produits */}
      {products.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-slate-100 shadow-xs max-w-md mx-auto">
          <span className="text-4xl">📦</span>
          <p className="text-slate-500 mt-4 font-medium">Aucun produit disponible pour le moment.</p>
          <p className="text-xs text-slate-400 mt-1">Revenez très vite ou connectez-vous à l'admin pour en ajouter !</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
