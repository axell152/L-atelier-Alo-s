import './globals.css';
import Link from 'next/link';

export const metadata = {
  title: "L'Atelier de l'Aloès | Objets et vêtements personnalisés",
  description: 'Stickers, T-shirts, Mugs et personnalisations uniques faites main.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr" className="h-full">
      <body className="min-h-full flex flex-col bg-[#FDFBF7] text-[#4A3B32] antialiased selection:bg-[#E8A598] selection:text-white">
        
        {/* Barre de navigation */}
        <header className="sticky top-0 z-50 backdrop-blur-md bg-[#FDFBF7]/90 border-b border-[#EFECE6]">
  <div className="max-w-6xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between">
    <Link href="/" className="flex items-center gap-3 group">
  <img src="/logo.png" alt="L'Atelier de l'Aloès" className="h-16 w-auto object-cover rounded-xl shadow-xs" />
</Link>

    <nav className="flex items-center gap-4 sm:gap-6">
      <Link href="/" className="text-sm font-medium text-[#6B5B52] hover:text-[#5A3E36] transition">
        Catalogue
      </Link>
      <Link href="/panier" className="inline-flex items-center gap-2 text-sm font-medium bg-[#5A3E36] text-white px-4.5 py-2.5 rounded-full hover:bg-[#4A3B32] shadow-sm transition transform active:scale-95">
        <span>🛒</span> Panier
      </Link>
    </nav>
  </div>
</header>

        {/* Contenu principal */}
        <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-12">
          {children}
        </main>

        {/* Pied de page */}
        <footer className="bg-[#F7F4EE] border-t border-[#EFECE6] py-10 text-center text-xs text-[#8C7A70]">
          <p>© {new Date().getFullYear()} L'Atelier de l'Aloès — Confectionné avec amour ✂️</p>
          <p className="mt-1">Commandes personnalisées validées exclusivement via WhatsApp</p>
        </footer>
      </body>
    </html>
  );
}
