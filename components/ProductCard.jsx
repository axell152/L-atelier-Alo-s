'use client';
import { useState } from 'react';

export default function ProductCard({ product }) {
  // Remplacez ce numéro par votre propre numéro WhatsApp (format international sans le + ni les espaces, ex: 33612345678)
  const whatsappNumber = '33750998315'; 
  
  const message = `Bonjour, je suis intéressé(e) par votre article "${product.title}" affiché à ${Number(product.price).toFixed(2)} €. J'aimerais en commander un exemplaire.`;
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;

  return (
    <div className="bg-white rounded-3xl border border-[#EFECE6] overflow-hidden shadow-xs flex flex-col justify-between">
      <div>
        {product.image_url ? (
          <img src={product.image_url} alt={product.title} className="w-full h-56 object-cover" />
        ) : (
          <div className="w-full h-56 bg-[#F7F4EE] flex items-center justify-center text-[#A3958E]">
            <span>Pas d'image</span>
          </div>
        )}
        <div className="p-5 space-y-2">
          {product.category && (
            <span className="text-xs font-semibold text-[#8C7A6B] uppercase tracking-wider">{product.category}</span>
          )}
          <h3 className="font-serif font-bold text-lg text-[#4A3B32]">{product.title}</h3>
          <p className="text-sm text-[#6B5B52] line-clamp-2">{product.description}</p>
        </div>
      </div>
      
      <div className="p-5 pt-0 flex items-center justify-between gap-4 mt-auto">
        <span className="font-bold text-lg text-[#4A3B32]">{Number(product.price).toFixed(2)} €</span>
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-[#25D366] hover:bg-[#20ba5a] text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition shadow-sm flex items-center gap-2"
        >
          Commander
        </a>
      </div>
    </div>
  );
}
