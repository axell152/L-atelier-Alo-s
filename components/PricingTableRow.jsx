'use client';
import { useState } from 'react';
import PricingTableEditor from './PricingTableEditor';

export default function PricingTableRow({
  table,
  updateAction,
  deleteAction,
  moveCategoryAction,
  categoryIndex,
  categoryCount,
  showCategoryControls,
}) {
  const [editing, setEditing] = useState(false);

  if (editing) {
    return (
      <div className="py-5 bg-[#FCFAF6] -mx-6 px-6">
        <PricingTableEditor action={updateAction} initial={table} onDone={() => setEditing(false)} />
      </div>
    );
  }

  return (
    <div className="py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
      <div className="min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-semibold text-[#5A3E36] uppercase tracking-wider">
            {table.category}
          </span>

          {showCategoryControls && categoryCount > 1 && (
            <div className="flex items-center gap-1">
              <form action={moveCategoryAction}>
                <input type="hidden" name="category" value={table.category} />
                <input type="hidden" name="direction" value="up" />
                <button
                  type="submit"
                  disabled={categoryIndex === 0}
                  className="w-7 h-7 rounded-lg border border-[#EFECE6] text-[#6B5B52] hover:bg-[#F7F4EE] disabled:opacity-30 disabled:cursor-not-allowed transition"
                  aria-label={`Monter la catégorie ${table.category}`}
                  title="Monter"
                >
                  ↑
                </button>
              </form>

              <form action={moveCategoryAction}>
                <input type="hidden" name="category" value={table.category} />
                <input type="hidden" name="direction" value="down" />
                <button
                  type="submit"
                  disabled={categoryIndex === categoryCount - 1}
                  className="w-7 h-7 rounded-lg border border-[#EFECE6] text-[#6B5B52] hover:bg-[#F7F4EE] disabled:opacity-30 disabled:cursor-not-allowed transition"
                  aria-label={`Descendre la catégorie ${table.category}`}
                  title="Descendre"
                >
                  ↓
                </button>
              </form>
            </div>
          )}
        </div>

        <h4 className="font-semibold text-[#4A3B32] break-words">
          {table.title || '(tableau principal)'}
        </h4>
        <p className="text-xs text-[#6B5B52] mt-0.5">
          {table.rows.length} article{table.rows.length > 1 ? 's' : ''} · {table.columns.length} colonne
          {table.columns.length > 1 ? 's' : ''}
        </p>
      </div>

      <div className="flex items-center gap-2 flex-wrap shrink-0">
        <button
          type="button"
          onClick={() => setEditing(true)}
          className="px-3 py-1.5 text-xs font-medium rounded-xl border border-[#EFECE6] hover:bg-[#F7F4EE]"
        >
          Modifier
        </button>
        <form action={deleteAction}>
          <input type="hidden" name="id" value={table.id} />
          <button type="submit" className="px-3 py-1.5 text-xs font-medium rounded-xl bg-red-50 text-red-600 hover:bg-red-100">
            Supprimer
          </button>
        </form>
      </div>
    </div>
  );
}
