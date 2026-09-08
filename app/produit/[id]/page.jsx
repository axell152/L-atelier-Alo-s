import sql, { initDb } from '../../../lib/db';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import AddToCartButton from '../../../components/AddToCartButton';
import ProductGallery from '../../../components/ProductGallery';

export const revalidate = 0;

export default async function ProductPage({ params }) {
  await initDb();
  const { id } = params;

  const result = await sql`SELECT * FROM products WHERE id = ${id}`;
  if (result.length === 0) {
    notFound();
  }

  const product = result[0];
  let extraImages = [];
  try {
    extraImages = product.extra_images ? JSON.parse(product.extra_images) : [];
  } catch (e) {
    extraImages = [];
  }

  // Toutes les images combinées pour la galerie
  const allImages = [product.image_url, ...extraImages].filter(Boolean);

  return (
    <div className="max-w-5xl mx-auto px-4 py-10 space-y-8">
      <Link href="/" className="text-sm font-medium text-[#6B5B52] hover:text-[#5A3E36] transition inline-flex items-center gap-2">
        ← Retour au catalogue
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Galerie photos */}
        <div>
          <ProductGallery images={allImages} title={product.title} />
        </div>

        {/* Informations produit */}
        <div className="space-y-6 flex flex-col justify-center">
          <div>
            <span className="text-xs font-semibold tracking-wider uppercase bg-[#FFB6C1]/30 text-[#5A3E36] px-3 py-1 rounded-full">
              {product.category || 'Création'}
            </span>
            <h1 className="text-3xl font-serif font-bold text-[#4A3B32] mt-3">{product.title}</h1>
            <p className="text-2xl font-bold text-[#5A3E36] mt-2">{Number(product.price).toFixed(2)} €</p>
          </div>

          <div className="border-t border-b border-[#EFECE6] py-4 text-[#6B5B52] text-sm leading-relaxed whitespace-pre-line">
            {product.description || "Aucune description pour le moment. Contactez l'atelier pour plus d'informations !"}
          </div>

          {/* Bouton d'achat / panier */}
          <div className="pt-4">
            <AddToCartButton
              product={{
                id: product.id,
                title: product.title,
                price: product.price,
                category: product.category,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
