'use client';
import { useState } from 'react';

export default function ProductCard({ product }) {
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
