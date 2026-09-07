import sql, { initDb } from '../../../lib/db';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export const revalidate = 0;

export default async function ProductDetailPage({ params }) {
  const { id } = params;

  await initDb();
  const products = await sql`SELECT * FROM products WHERE id = ${id} AND is_hidden = FALSE`;
  
  if (products.length === 0) {
    notFound();
  }

  const product = products[0];

  // Numéro WhatsApp (remplacez par le vôtre au format international sans le +)
  const whatsappNumber = '33600000000'; 
  const message = `Bonjour, je souhaite avoir plus d'informations ou commander un projet personnalisé basé sur votre article "${product.title}" (${Number(product.price).toFixed(2)} €).`;
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-8">
      <Link href="/" className="text-sm text-[#6B5B52] hover:underline inline-block">
        ← Retour au catalogue
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-white p-6 sm:p-8 rounded-3xl border border-[#EFECE6] shadow-xs">
        {/* Image du produit */}
        <div>
          {product.image_url ? (
            <img src={product.image_url} alt={product.title} className="w-full h-80 object-cover rounded-2xl" />
          ) : (
            <div className="w-full h-80 bg-[#F7F4EE] flex items-center justify-center text-[#A3958E] rounded-2xl">
              <span>Pas d'image</span>
            </div>
          )}
        </div>

        {/* Informations et actions */}
        <div className="flex flex-col justify-between space-y-6">
          <div className="space-y-3">
            {product.category && (
              <span className="text-xs font-semibold text-[#8C7A6B] uppercase tracking-wider">{product.category}</span>
            )}
            <h1 className="text-3xl font-serif font-bold text-[#4A3B32]">{product.title}</h1>
            <p className="text-2xl font-bold text-[#4A3B32]">{Number(product.price).toFixed(2)} €</p>
            <p className="text-sm text-[#6B5B52] leading-relaxed whitespace-pre-line">{product.description}</p>
          </div>

          <div className="space-y-3 pt-4 border-t border-[#EFECE6]">
            {/* Bouton Panier / Achat direct */}
            <button className="w-full bg-[#5A3E36] hover:bg-[#4A3B32] text-white font-semibold py-3.5 rounded-2xl transition shadow-sm">
              Ajouter au panier
            </button>

            {/* Bouton WhatsApp pour question / devis sur ce produit précis */}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-[#25D366] hover:bg-[#20ba5a] text-white font-semibold py-3.5 rounded-2xl transition shadow-sm flex items-center justify-center gap-2"
            >
              <span>Discuter / Devis sur WhatsApp</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
