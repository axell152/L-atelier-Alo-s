'use client';
import { useState, useTransition } from 'react';

function uid() {
  return crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).slice(2);
}

function makeColumn(group = '', label = '') {
  return { id: uid(), group, label };
}

export default function PricingTableEditor({ action, initial, onDone }) {
  const [category, setCategory] = useState(initial?.category || '');
  const [title, setTitle] = useState(initial?.title || '');
  const [description, setDescription] = useState(initial?.description || '');
  const [wrapLabels, setWrapLabels] = useState(initial?.wrap_labels || false);

  const [columns, setColumns] = useState(
    initial?.columns?.length
      ? initial.columns.map((c) => makeColumn(c.group || '', c.label || ''))
      : [makeColumn('', '')]
  );

  const [rows, setRows] = useState(() => {
    if (initial?.rows?.length) {
      return initial.rows.map((r) => {
        const values = {};
        columns.forEach((c, i) => {
          values[c.id] = r.values?.[i] ?? '';
        });
        return { id: uid(), name: r.name || '', values };
      });
    }
    const values = {};
    columns.forEach((c) => {
      values[c.id] = '';
    });
    return [{ id: uid(), name: '', values }];
  });

  const [isPending, startTransition] = useTransition();

  const addColumn = () => {
    const col = makeColumn();
    setColumns((cols) => [...cols, col]);
    setRows((rs) => rs.map((r) => ({ ...r, values: { ...r.values, [col.id]: '' } })));
  };

  const removeColumn = (id) => {
    setColumns((cols) => cols.filter((c) => c.id !== id));
    setRows((rs) =>
      rs.map((r) => {
        const values = { ...r.values };
        delete values[id];
        return { ...r, values };
      })
    );
  };

  const updateColumn = (id, field, value) =>
    setColumns((cols) => cols.map((c) => (c.id === id ? { ...c, [field]: value } : c)));

  const addRow = () => {
    const values = {};
    columns.forEach((c) => {
      values[c.id] = '';
    });
    setRows((rs) => [...rs, { id: uid(), name: '', values }]);
  };

  const removeRow = (id) => setRows((rs) => rs.filter((r) => r.id !== id));
  const updateRowName = (id, value) =>
    setRows((rs) => rs.map((r) => (r.id === id ? { ...r, name: value } : r)));
  const updateCell = (rowId, colId, value) =>
    setRows((rs) =>
      rs.map((r) => (r.id === rowId ? { ...r, values: { ...r.values, [colId]: value } } : r))
    );

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    if (initial?.id) formData.set('id', initial.id);
    formData.set('category', category);
    formData.set('title', title);
    formData.set('description', description);
    formData.set('wrap_labels', wrapLabels ? 'on' : '');
    formData.set(
      'columns',
      JSON.stringify(columns.map((c) => ({ group: c.group.trim() || null, label: c.label.trim() })))
    );
    formData.set(
      'rows',
      JSON.stringify(
        rows
          .filter((r) => r.name.trim())
          .map((r) => ({ name: r.name.trim(), values: columns.map((c) => r.values[c.id] || '') }))
      )
    );

    startTransition(async () => {
      await action(formData);
      if (onDone) onDone();
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-[#6B5B52] mb-1">Catégorie</label>
          <input
            required
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="Ex: Vêtements, Objets, Voiture"
            className="w-full border border-[#EFECE6] rounded-2xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#5A3E36]"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-[#6B5B52] mb-1">Titre du tableau (optionnel)</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Ex: Manche de pull, Impression..."
            className="w-full border border-[#EFECE6] rounded-2xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#5A3E36]"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-[#6B5B52] mb-1">
          Description sous le titre de catégorie (optionnel, affichée une fois pour toute la catégorie)
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={2}
          placeholder="Ex: Tarifs pour un seul côté du vêtement."
          className="w-full border border-[#EFECE6] rounded-2xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#5A3E36]"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-[#6B5B52] mb-2">
          Colonnes (laisser vide pour une catégorie sans tableau, juste avec une description)
        </label>
        <div className="overflow-x-auto pb-2">
          <div className="flex gap-2 items-end min-w-max">
            {columns.map((c) => (
              <div key={c.id} className="w-36 shrink-0 space-y-1">
                <input
                  value={c.group}
                  onChange={(e) => updateColumn(c.id, 'group', e.target.value)}
                  placeholder="Groupe (opt.) ex: 10x10cm"
                  className="w-full border border-[#EFECE6] rounded-lg px-2 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-[#5A3E36]"
                />
                <div className="flex gap-1">
                  <input
                    value={c.label}
                    onChange={(e) => updateColumn(c.id, 'label', e.target.value)}
                    placeholder="Titre colonne"
                    className="w-full border border-[#EFECE6] rounded-lg px-2 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-[#5A3E36]"
                  />
                  <button
                    type="button"
                    onClick={() => removeColumn(c.id)}
                    className="px-1.5 rounded-lg border border-[#EFECE6] text-[#6B5B52] hover:bg-[#F7F4EE] text-xs"
                    aria-label="Retirer cette colonne"
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={addColumn}
              className="text-xs font-medium text-[#5A3E36] hover:text-[#4A3B32] whitespace-nowrap px-2 py-2"
            >
              + Colonne
            </button>
          </div>
        </div>
      </div>

      <label className="flex items-center gap-2 text-sm text-[#6B5B52]">
        <input
          type="checkbox"
          checked={wrapLabels}
          onChange={(e) => setWrapLabels(e.target.checked)}
          className="w-4 h-4 text-[#5A3E36] rounded border-[#EFECE6]"
        />
        Mettre chaque mot des libellés sur sa propre ligne (utile pour aligner plusieurs tableaux entre eux, comme Vêtements)
      </label>

      <div>
        <label className="block text-sm font-medium text-[#6B5B52] mb-2">Lignes (articles)</label>
        <div className="overflow-x-auto pb-2 space-y-2">
          {rows.map((r) => (
            <div key={r.id} className="flex gap-2 items-center min-w-max">
              <input
                value={r.name}
                onChange={(e) => updateRowName(r.id, e.target.value)}
                placeholder="Nom de l'article"
                className="w-40 shrink-0 border border-[#EFECE6] rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#5A3E36]"
              />
              {columns.map((c) => (
                <input
                  key={c.id}
                  value={r.values[c.id] ?? ''}
                  onChange={(e) => updateCell(r.id, c.id, e.target.value)}
                  placeholder="Prix / Devis / -"
                  className="w-36 shrink-0 border border-[#EFECE6] rounded-lg px-2 py-1.5 text-sm text-center focus:outline-none focus:ring-2 focus:ring-[#5A3E36]"
                />
              ))}
              <button
                type="button"
                onClick={() => removeRow(r.id)}
                className="px-2 py-1.5 rounded-lg border border-[#EFECE6] text-[#6B5B52] hover:bg-[#F7F4EE] text-xs shrink-0"
                aria-label="Retirer cette ligne"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
        <button type="button" onClick={addRow} className="mt-2 text-sm font-medium text-[#5A3E36] hover:text-[#4A3B32]">
          + Ajouter une ligne
        </button>
      </div>

      <div className="flex gap-2">
        <button
          type="submit"
          disabled={isPending}
          className="flex-1 bg-[#5A3E36] hover:bg-[#4A3B32] disabled:opacity-60 text-white font-bold py-3 rounded-2xl transition"
        >
          {isPending ? 'Enregistrement...' : initial ? 'Enregistrer les modifications' : 'Créer le tableau'}
        </button>
        {onDone && (
          <button
            type="button"
            onClick={onDone}
            className="px-5 py-3 rounded-2xl border border-[#EFECE6] text-[#6B5B52] hover:bg-[#F7F4EE] transition"
          >
            Annuler
          </button>
        )}
      </div>
    </form>
  );
}
