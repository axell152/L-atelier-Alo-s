'use client';
import { useState } from 'react';
import Link from 'next/link';

export default function AddToCartButton({ product }) {
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
    <div className="space-y-3">
      <button
        onClick={addToCart}
        className={`w-full text-center py-3.5 rounded-2xl font-semibold transition shadow-sm transform active:scale-95 ${
          added ? 'bg-[#8FBC8F] text-white' : 'bg-[#5A3E36] text-white hover:bg-[#4A3B32]'
        }`}
      >
        {added ? '✓ Ajouté au panier' : 'Ajouter au panier'}
      </button>
      <Link
        href="/panier"
        className="block text-center text-sm font-medium text-[#6B5B52] hover:text-[#5A3E36] transition"
      >
        Voir mon panier →
      </Link>
    </div>
  );
}
