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
    <div className="space-y-16">
      {/* En-tête / Bannière douce */}
      <div className="text-center max-w-2xl mx-auto space-y-5 py-8">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FFB6C1]/30 text-[#5A3E36] text-xs font-semibold tracking-wider uppercase border border-[#FFB6C1]/40">
          <span>✨</span> Pièces uniques & Sur-mesure
        </div>
        <h1 className="text-4xl sm:text-5xl font-serif font-bold text-[#4A3B32] tracking-tight leading-tight">
          L'art de personnaliser votre quotidien
        </h1>
        <p className="text-base sm:text-lg text-[#6B5B52] font-normal leading-relaxed">
          Stickers pour voitures, t-shirts, mugs et créations artisanales. Choisissez vos envies et commandez directement sur WhatsApp.
        </p>
      </div>

      {/* Grille des produits */}
      {products.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-[#EFECE6] shadow-xs max-w-md mx-auto">
          <span className="text-3xl">🌿</span>
          <p className="text-[#6B5B52] mt-4 font-medium">Bientôt de nouvelles créations par ici...</p>
          <p className="text-xs text-[#A3958E] mt-1">Connectez-vous à l'espace admin pour ajouter vos articles.</p>
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
