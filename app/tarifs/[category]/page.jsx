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

  // Regroupe les colonnes par "taille" à partir du libellé "Taille - Couleur".
  // Les colonnes consécutives partageant le même groupe sont fusionnées visuellement,
  // comme dans un tableur classique.
  const parsedColumns = columns.map((label) => {
    const idx = label.indexOf(' - ');
    if (idx === -1) return { group: null, sub: label, label };
    return { group: label.slice(0, idx).trim(), sub: label.slice(idx + 3).trim(), label };
  });

  const headerGroups = [];
  for (const col of parsedColumns) {
    const last = headerGroups[headerGroups.length - 1];
    if (last && col.group !== null && last.group === col.group) {
      last.cols.push(col);
    } else {
      headerGroups.push({ group: col.group, cols: [col] });
    }
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-20 px-4">
      <div>
        <Link href="/tarifs" className="text-sm font-medium text-[#6B5B52] hover:text-[#5A3E36] transition">
          ← Toutes les catégories
        </Link>
      </div>

      <h1 className="text-3xl font-serif font-bold text-[#4A3B32]">{category}</h1>

      <div className="bg-white rounded-3xl border border-[#EFECE6] shadow-xs overflow-x-auto">
        <table className="text-sm border-collapse">
          <thead>
            <tr>
              <th rowSpan={2} className="text-left px-3 py-3 text-[#6B5B52] font-medium border-b border-r border-[#EFECE6] align-bottom">
                Article
              </th>
              {headerGroups.map((g, gi) =>
                g.group !== null ? (
                  <th
                    key={gi}
                    colSpan={g.cols.length}
                    className="text-center px-2 py-2 text-[#4A3B32] font-semibold border-b border-r border-[#EFECE6] whitespace-nowrap"
                  >
                    {g.group}
                  </th>
                ) : (
                  <th
                    key={gi}
                    rowSpan={2}
                    className="text-center px-2 py-3 text-[#6B5B52] font-medium border-b border-r border-[#EFECE6] align-bottom whitespace-nowrap"
                  >
                    {g.cols[0].sub}
                  </th>
                )
              )}
            </tr>
            <tr>
              {headerGroups.flatMap((g, gi) =>
                g.group !== null
                  ? g.cols.map((c, ci) => (
                      <th
                        key={`${gi}-${ci}`}
                        className="text-center px-2 py-2 text-[#6B5B52] font-medium border-b border-r border-[#EFECE6] whitespace-nowrap"
                      >
                        {c.sub}
                      </th>
                    ))
                  : []
              )}
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id} className="border-b border-[#F7F4EE] last:border-0">
                <td className="px-3 py-3 font-semibold text-[#4A3B32] border-r border-[#EFECE6] whitespace-nowrap">
                  {item.name}
                </td>
                {columns.map((label, i) => {
                  const opt = item.options.find((o) => o.label === label);
                  return (
                    <td key={i} className="px-2 py-3 text-center text-[#5A3E36] font-medium border-r border-[#EFECE6] whitespace-nowrap">
                      {opt ? `${Number(opt.price).toFixed(2)} €` : '—'}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
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
