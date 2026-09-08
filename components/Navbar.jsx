import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="flex items-center justify-between py-6 px-4 max-w-6xl mx-auto">
      <Link href="/" className="font-serif font-bold text-xl text-[#4A3B32]">
        Mon Site de Créations
      </Link>
      
      <div className="flex items-center gap-6">
        <Link href="/" className="text-sm font-medium text-[#6B5B52] hover:text-[#4A3B32]">
          Catalogue
        </Link>
        <Link href="/contact" className="text-sm font-medium text-[#6B5B52] hover:text-[#4A3B32]">
          Contact / Devis
        </Link>
        {/* Votre icône ou lien vers le Panier */}
        <Link href="/cart" className="text-sm font-medium bg-[#5A3E36] text-white px-4 py-2 rounded-xl">
          Panier
        </Link>
      </div>
    </nav>
  );
}
