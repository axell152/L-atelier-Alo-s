import './globals.css';
import Link from 'next/link';

export const metadata = {
  title: 'L\'Atelier de l\'Aloès | Créations Cricut & Sur-Mesure',
  description: 'Stickers, T-shirts, Mugs et personnalisations uniques faites main.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr" className="h-full">
      <body className="min-h-full flex flex-col bg-gradient-to-br from-slate-50 via-pink-50/20 to-indigo-50/30 text-slate-800 antialiased selection:bg-pink-500 selection:text-white">
        
        {/* Barre de navigation */}
        <header className="sticky top-0 z-50 backdrop-blur-md bg-white/80 border-b border-slate-100 shadow-xs">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 group">
              <span className="text-2xl">✨</span>
              <span className="font-bold text-xl tracking-tight bg-gradient-to-r from-indigo-600 to-pink-600 bg-clip-text text-transparent group-hover:opacity-90 transition">
                L'Atelier de l'Aloès
              </span>
            </Link>

            <nav className="flex items-center gap-3 sm:gap-6">
              <Link href="/" className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition">
                Catalogue
              </Link>
              <Link href="/panier" className="inline-flex items-center gap-2 text-sm font-semibold bg-slate-900 text-white px-4 py-2.5 rounded-full hover:bg-slate-800 shadow-sm transition transform active:scale-95">
                <span>🛒</span> Panier
              </Link>
              <Link href="/admin" className="text-xs font-medium text-slate-400 hover:text-slate-600 px-2 py-1 rounded">
                Admin
              </Link>
            </nav>
          </div>
        </header>

        {/* Contenu principal */}
        <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-10">
          {children}
        </main>

        {/* Pied de page */}
        <footer className="bg-white border-t border-slate-100 py-8 text-center text-sm text-slate-400">
          <p>© {new Date().getFullYear()} L'Atelier de l'Aloès — Confectionné avec amour & Cricut ✂️</p>
          <p className="mt-1 text-xs text-slate-300">Commandes personnalisées validées exclusivement via WhatsApp</p>
        </footer>
      </body>
    </html>
  );
}
