import Link from 'next/link';

export default function ProductCard({ product }) {
  // Supposons que vous utilisez une fonction ou un contexte pour ajouter au panier
  // (Adaptez cette partie selon la logique de panier que vous aviez initialement)
  return (
    <div className="bg-white rounded-3xl border border-[#EFECE6] overflow-hidden shadow-xs flex flex-col justify-between">
      <div>
        <Link href={`/product/${product.id}`}>
          {product.image_url ? (
            <img src={product.image_url} alt={product.title} className="w-full h-56 object-cover cursor-pointer hover:opacity-95 transition" />
          ) : (
            <div className="w-full h-56 bg-[#F7F4EE] flex items-center justify-center text-[#A3958E] cursor-pointer">
              <span>Pas d'image</span>
            </div>
          )}
        </Link>
        <div className="p-5 space-y-2">
          {product.category && (
            <span className="text-xs font-semibold text-[#8C7A6B] uppercase tracking-wider">{product.category}</span>
          )}
          <Link href={`/product/${product.id}`}>
            <h3 className="font-serif font-bold text-lg text-[#4A3B32] hover:underline">{product.title}</h3>
          </Link>
          <p className="text-sm text-[#6B5B52] line-clamp-2">{product.description}</p>
        </div>
      </div>
      
      <div className="p-5 pt-0 flex items-center justify-between gap-4 mt-auto">
        <span className="font-bold text-lg text-[#4A3B32]">{Number(product.price).toFixed(2)} €</span>
        {/* Remettez ici votre bouton "Ajouter au panier" initial */}
        <Link 
          href={`/product/${product.id}`}
          className="bg-[#5A3E36] hover:bg-[#4A3B32] text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition shadow-sm"
        >
          Voir le produit
        </Link>
      </div>
    </div>
  );
}
