'async';
import sql, { initDb } from '@/lib/db';
import Link from 'next/link';

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

// Composant client pour gérer l'ajout au panier en localStorage
('use client');
import { useState } from 'react';

function ProductCard({ product }) {
  const [added, setAdded] = useState(false);

  const addToCart = () => {
    const cart = JSON.parse(localStorage.getItem('cricut_cart') || '[]');
    const existingIndex = cart.findIndex((item) => item.id === product.id);

    if (existingIndex > -1) {
      cart[existingIndex].quantity += 1;
    } else {
      cart.push({ ...product, quantity: 1 });
    }

    localStorage.setItem('cricut_cart', JSON.stringify(cart));
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden flex flex-col shadow-sm hover:shadow-md transition">
      {product.image_url ? (
        <img src={product.image_url} alt={product.title} className="w-full h-48 object-cover" />
      ) : (
        <div className="w-full h-48 bg-slate-100 flex items-center justify-center text-slate-400">Pas d'image</div>
      )}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <span className="text-xs font-semibold tracking-wider text-indigo-600 uppercase bg-indigo-50 px-2 py-1 rounded">
            {product.category || 'Prestation'}
          </span>
          <h3 className="font-bold text-lg text-slate-900 mt-2">{product.title}</h3>
        </div>
        <div className="mt-4 flex items-center justify-between">
          <span className="text-xl font-black text-slate-900">{Number(product.price).toFixed(2)} €</span>
          <button
            onClick={addToCart}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition ${
              added ? 'bg-emerald-600 text-white' : 'bg-slate-900 text-white hover:bg-slate-800'
            }`}
          >
            {added ? '✓ Ajouté !' : 'Ajouter au panier'}
          </button>
        </div>
      </div>
    </div>
  );
}
