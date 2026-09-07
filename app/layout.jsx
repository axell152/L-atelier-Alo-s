import './globals.css';
import Link from 'next/link';

export const metadata = {
  title: 'Créations Cricut & Personnalisations',
  description: 'Stickers, T-shirts, Mugs et prestations personnalisées sur-mesure.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body className="min-h-screen flex flex-col">
        <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
          <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
            <Link href="/" className="font-bold text-xl text-indigo-600">
              ✨ CricutAtelier
            </Link>
            <nav className="flex items-center gap-6">
              <Link href="/" className="text-sm font-medium hover:text-indigo-600">Catalogue</Link>
              <Link href="/panier" className="text-sm font-medium bg-indigo-50 text-indigo-700 px-4 py-2 rounded-full hover:bg-indigo-100 transition">
                🛒 Panier
              </Link>
              <Link href="/admin" className="text-xs text-slate-400 hover:text-slate-600">Admin</Link>
            </nav>
          </div>
        </header>

        <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-8">
          {children}
        </main>

        <footer className="bg-white border-t border-slate-200 py-6 text-center text-sm text-slate-500">
          © {new Date().getFullYear()} CricutAtelier - Commandes exclusives via WhatsApp.
        </footer>
      </body>
    </html>
  );
}
