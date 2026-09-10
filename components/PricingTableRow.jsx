'use client';
import { useState } from 'react';
import PricingTableEditor from './PricingTableEditor';

export default function PricingTableRow({ table, updateAction, deleteAction }) {
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
        <span className="text-xs font-semibold text-[#5A3E36] uppercase tracking-wider">{table.category}</span>
        <h4 className="font-semibold text-[#4A3B32] break-words">{table.title || '(tableau principal)'}</h4>
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
