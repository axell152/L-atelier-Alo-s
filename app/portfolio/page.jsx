import sql, { initDb } from '../../lib/db';

export const revalidate = 0;

export default async function PortfolioPage() {
  await initDb();
  const items = await sql`SELECT * FROM portfolio_items ORDER BY position, id DESC`;

  return (
    <div className="max-w-5xl mx-auto space-y-10 pb-20 px-4">
      <div className="text-center space-y-3">
        <h1 className="text-3xl md:text-4xl font-serif font-bold text-[#4A3B32]">Portfolio</h1>
        <p className="text-[#6B5B52] max-w-xl mx-auto">
          Un aperçu de mes réalisations passées.
        </p>
      </div>

      {items.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-[#EFECE6] text-[#6B5B52]">
          <p className="text-lg">Le portfolio arrive bientôt.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-3xl border border-[#EFECE6] overflow-hidden shadow-xs group"
            >
              <div className="aspect-square overflow-hidden bg-[#F7F4EE]">
                <img
                  src={item.image_url}
                  alt={item.caption || 'Réalisation L\'Atelier Aloès'}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                />
              </div>
              {item.caption && (
                <p className="text-sm text-[#6B5B52] px-3 py-2 text-center">{item.caption}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
