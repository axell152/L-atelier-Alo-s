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
    <div className="group bg-white rounded-3xl border border-slate-100 overflow-hidden flex flex-col shadow-xs hover:shadow-xl transition-all duration-300">
      {/* Conteneur image */}
      <div className="relative w-full h-60 bg-slate-100 overflow-hidden">
        {product.image_url ? (
          <img 
            src={product.image_url} 
            alt={product.title} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-slate-400 text-sm font-medium">
            ✨ Création unique
          </div>
        )}
        {product.category && (
          <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-xs text-slate-800 text-xs font-semibold px-3 py-1 rounded-full shadow-xs">
            {product.category}
          </span>
        )}
      </div>

      {/* Informations */}
      <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
        <div>
          <h3 className="font-bold text-lg text-slate-900 group-hover:text-indigo-600 transition-colors">
            {product.title}
          </h3>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-slate-50">
          <div>
            <span className="text-xs text-slate-400 block">Prix</span>
            <span className="text-xl font-extrabold text-slate-900">
              {Number(product.price).toFixed(2)} €
            </span>
          </div>

          <button
            onClick={addToCart}
            className={`px-4 py-2.5 rounded-2xl text-sm font-semibold transition-all transform active:scale-95 shadow-xs ${
              added 
                ? 'bg-emerald-600 text-white shadow-emerald-600/20' 
                : 'bg-slate-900 text-white hover:bg-indigo-600 hover:shadow-indigo-600/20'
            }`}
          >
            {added ? '✓ Ajouté !' : '+ Ajouter'}
          </button>
        </div>
      </div>
    </div>
  );
}
