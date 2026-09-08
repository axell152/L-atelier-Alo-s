'use client';
import { useState } from 'react';
import Link from 'next/link';

export default function AddToCartButton({ product }) {
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const decrease = () => setQuantity((q) => Math.max(1, q - 1));
  const increase = () => setQuantity((q) => q + 1);

  const addToCart = () => {
    const cart = JSON.parse(localStorage.getItem('cricut_cart') || '[]');
    const existingIndex = cart.findIndex((item) => item.id === product.id);

    if (existingIndex > -1) {
      cart[existingIndex].quantity += quantity;
    } else {
      cart.push({ ...product, quantity });
    }

    localStorage.setItem('cricut_cart', JSON.stringify(cart));
    setAdded(true);
    setQuantity(1);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <span className="text-sm font-medium text-[#6B5B52]">Quantité</span>
        <div className="flex items-center border border-[#EFECE6] rounded-xl overflow-hidden">
          <button
            type="button"
            onClick={decrease}
            aria-label="Diminuer la quantité"
            className="px-3.5 py-2 text-[#5A3E36] hover:bg-[#F7F4EE] transition text-lg leading-none"
          >
            −
          </button>
          <span className="px-4 text-sm font-semibold text-[#4A3B32] min-w-[2ch] text-center">
            {quantity}
          </span>
          <button
            type="button"
            onClick={increase}
            aria-label="Augmenter la quantité"
            className="px-3.5 py-2 text-[#5A3E36] hover:bg-[#F7F4EE] transition text-lg leading-none"
          >
            +
          </button>
        </div>
      </div>

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

