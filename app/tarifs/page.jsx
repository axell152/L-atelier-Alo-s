import sql, { initDb } from '../../lib/db';
import Link from 'next/link';

export const revalidate = 0;

export default async function TarifsPage() {
  await initDb();
  const rows = await sql`SELECT * FROM pricing_items ORDER BY category, position, id`;

  const items = rows.map((r) => {
    let options = [];
    try {
      options = JSON.parse(r.options || '[]');
    } catch {
      options = [];
    }
    return { ...r, options };
  });

  const grouped = {};
  for (const item of items) {
    if (!grouped[item.category]) grouped[item.category] = [];
    grouped[item.category].push(item);
  }

  const categories = Object.entries(grouped);

  return (
    <div className="max-w-6xl mx-auto space-y-12 pb-20 px-4">
      <div className="text-center space-y-3">
        <h1 className="text-3xl md:text-4xl font-serif font-bold text-[#4A3B32]">Tarifs personnalisation</h1>
        <p className="text-[#6B5B52] max-w-xl mx-auto">
          Un aperçu de mes tarifs pour vos créations sur-mesure. Pour un devis précis adapté à votre projet, contactez-moi.
        </p>
      </div>

      {categories.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-[#EFECE6] text-[#6B5B52]">
          <p className="text-lg">Les tarifs seront bientôt disponibles.</p>
        </div>
      ) : (
        categories.map(([category, catItems]) => {
          // Colonnes = ensemble de tous les libellés utilisés dans la catégorie,
          // dans l'ordre où ils apparaissent. Un article sans ce tarif affiche un tiret.
          const columns = [];
          for (const item of catItems) {
            for (const o of item.options) {
              if (!columns.includes(o.label)) columns.push(o.label);
            }
          }

          return (
            <div key={category} className="space-y-4">
              <h2 className="text-xl font-serif font-bold text-[#4A3B32]">{category}</h2>
              <div className="bg-white rounded-3xl border border-[#EFECE6] shadow-xs overflow-hidden">
                <table className="w-full text-xs sm:text-sm table-fixed">
                  <thead>
                    <tr className="border-b border-[#EFECE6]">
                      <th className="text-left px-2 sm:px-3 py-2.5 text-[#6B5B52] font-medium">Article</th>
                      {columns.map((label, i) => (
                        <th key={i} className="text-center px-1.5 sm:px-2 py-2.5 text-[#6B5B52] font-medium leading-tight">
                          {label}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {catItems.map((item) => (
                      <tr key={item.id} className="border-b border-[#F7F4EE] last:border-0">
                        <td className="px-2 sm:px-3 py-2.5 font-semibold text-[#4A3B32]">{item.name}</td>
                        {columns.map((label, i) => {
                          const opt = item.options.find((o) => o.label === label);
                          return (
                            <td key={i} className="px-1.5 sm:px-2 py-2.5 text-center text-[#5A3E36] font-medium">
                              {opt ? `${Number(opt.price).toFixed(2)} €` : '—'}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          );
        })
      )}

      <div className="text-center bg-white rounded-3xl border border-[#EFECE6] shadow-xs py-10 px-6 space-y-4">
        <h3 className="text-xl font-serif font-bold text-[#4A3B32]">Un projet en tête ?</h3>
        <p className="text-[#6B5B52] max-w-md mx-auto">
          Ces tarifs sont indicatifs — contactez-moi pour un devis adapté à votre demande.
        </p>
        <Link
          href="/contact"
          className="inline-block bg-[#5A3E36] hover:bg-[#4A3B32] text-white font-bold px-8 py-3.5 rounded-2xl transition"
        >
          Demander un devis
        </Link>
      </div>
    </div>
  );
}
