import sql, { initDb } from '../lib/db';
import Link from 'next/link';

export const revalidate = 0;

export default async function HomePage() {
  await initDb();

  // On récupère uniquement les produits non masqués pour le catalogue public
  const products = await sql`
    SELECT * FROM products 
    WHERE is_hidden = false OR is_hidden IS NULL 
    ORDER BY id DESC
  `;

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 space-y-12">
      {/* En-tête / Bannière */}
      <div className="text-center space-y-4 py-8 bg-white rounded-3xl border border-[#EFECE6] shadow-xs px-6">
        <span className="text-xs font-semibold tracking-wider uppercase bg-[#FFB6C1]/30 text-[#5A3E36] px-3 py-1 rounded-full">
          Créations artisanales & Cricut
        </span>
        <h1 className="text-4xl md:text-5xl font-serif font-bold text-[#4A3B32]">
          Bienvenue à L'Atelier Aloès
        </h1>
        <p className="text-[#6B5B52] max-w-xl mx-auto text-base">
          Découvrez mes créations personnalisées, objets uniques et petites merveilles réalisées avec amour.
        </p>
      </div>

      {/* Grille des produits */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-serif font-bold text-[#4A3B32]">Le Catalogue</h2>
          <span className="text-sm text-[#6B5B52]">{products.length} article{products.length > 1 ? 's' : ''} disponible{products.length > 1 ? 's' : ''}</span>
        </div>

        {products.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-[#EFECE6] text-[#6B5B52]">
            <p className="text-lg">Aucun article pour le moment.</p>
            <p className="text-sm mt-1">Revenez très vite pour découvrir les nouveautés !</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {products.map((p) => (
              <Link 
                key={p.id} 
                href={`/produit/${p.id}`}
                className="bg-white p-4 rounded-3xl border border-[#EFECE6] hover:shadow-md transition block group flex flex-col justify-between"
              >
                <div>
                  <div className="aspect-square rounded-2xl overflow-hidden bg-[#F7F4EE] mb-4 relative">
                    {p.image_url ? (
                      <img 
                        src={p.image_url} 
                        alt={p.title} 
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-300" 
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-xs text-[#6B5B52]">
                        Pas d'image
                      </div>
                    )}
                  </div>
                  {p.category && (
                    <span className="text-xs font-semibold text-[#5A3E36] uppercase tracking-wider">
                      {p.category}
                    </span>
                  )}
                  <h3 className="font-serif font-bold text-[#4A3B32] text-lg mt-1 group-hover:text-[#5A3E36] transition">
                    {p.title}
                  </h3>
                </div>
                <div className="mt-4 pt-3 border-t border-[#F7F4EE] flex items-center justify-between">
                  <span className="font-bold text-[#5A3E36] text-lg">
                    {Number(p.price).toFixed(2)} €
                  </span>
                  <span className="text-xs font-medium text-[#6B5B52] bg-[#F7F4EE] px-3 py-1.5 rounded-xl group-hover:bg-[#5A3E36] group-hover:text-white transition">
                    Voir le produit →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
