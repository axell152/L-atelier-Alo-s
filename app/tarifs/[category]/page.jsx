import sql, { initDb } from '../../../lib/db';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export const revalidate = 0;

export default async function CategoryTarifsPage({ params }) {
  await initDb();
  const category = decodeURIComponent(params.category);
  const rows = await sql`SELECT * FROM pricing_items WHERE category = ${category} ORDER BY position, id`;

  if (rows.length === 0) {
    notFound();
  }

  const items = rows.map((r) => {
    let options = [];
    try {
      options = JSON.parse(r.options || '[]');
    } catch {
      options = [];
    }
    return { ...r, options };
  });

  // Colonnes = ensemble de tous les libellés utilisés dans la catégorie,
  // dans l'ordre où ils apparaissent. Un article sans ce tarif affiche un tiret.
  const columns = [];
  for (const item of items) {
    for (const o of item.options) {
      if (!columns.includes(o.label)) columns.push(o.label);
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20 px-4">
      <div>
        <Link href="/tarifs" className="text-sm font-medium text-[#6B5B52] hover:text-[#5A3E36] transition">
          ← Toutes les catégories
        </Link>
      </div>

      <h1 className="text-3xl font-serif font-bold text-[#4A3B32]">{category}</h1>

      {/* Vue tableau — écrans larges */}
      <div className="hidden sm:block bg-white rounded-3xl border border-[#EFECE6] shadow-xs overflow-hidden">
        <table className="w-full text-sm table-fixed">
          <thead>
            <tr className="border-b border-[#EFECE6]">
              <th className="text-left px-3 py-3 text-[#6B5B52] font-medium">Article</th>
              {columns.map((label, i) => (
                <th key={i} className="text-center px-2 py-3 text-[#6B5B52] font-medium leading-tight">
                  {label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id} className="border-b border-[#F7F4EE] last:border-0">
                <td className="px-3 py-3 font-semibold text-[#4A3B32]">{item.name}</td>
                {columns.map((label, i) => {
                  const opt = item.options.find((o) => o.label === label);
                  return (
                    <td key={i} className="px-2 py-3 text-center text-[#5A3E36] font-medium">
                      {opt ? `${Number(opt.price).toFixed(2)} €` : '—'}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Vue carte — mobile, une carte par article avec libellé : valeur */}
      <div className="sm:hidden space-y-4">
        {items.map((item) => (
          <div key={item.id} className="bg-white rounded-2xl border border-[#EFECE6] shadow-xs p-4 space-y-1.5">
            <div className="flex text-sm">
              <span className="font-semibold text-[#4A3B32] w-28 shrink-0">Article</span>
              <span className="text-[#5A3E36]">: {item.name}</span>
            </div>
            {item.options.map((o, i) => (
              <div key={i} className="flex text-sm">
                <span className="font-semibold text-[#4A3B32] w-28 shrink-0">{o.label}</span>
                <span className="text-[#5A3E36]">: {Number(o.price).toFixed(2)} €</span>
              </div>
            ))}
          </div>
        ))}
      </div>

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
