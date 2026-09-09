'use client';
import { useState, useTransition } from 'react';

function makeOption(label = '', price = '') {
  return { id: (crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36)), label, price };
}

export default function PricingItemRow({ item, updateAction, deleteAction }) {
  const [editing, setEditing] = useState(false);
  const [options, setOptions] = useState(
    item.options.length > 0 ? item.options.map((o) => makeOption(o.label, o.price)) : [makeOption()]
  );
  const [isPending, startTransition] = useTransition();

  const addOption = () => setOptions((o) => [...o, makeOption()]);
  const removeOption = (id) => setOptions((o) => (o.length > 1 ? o.filter((opt) => opt.id !== id) : o));
  const updateOption = (id, field, value) =>
    setOptions((o) => o.map((opt) => (opt.id === id ? { ...opt, [field]: value } : opt)));

  const handleSubmit = (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    startTransition(async () => {
      await updateAction(formData);
      setEditing(false);
    });
  };

  if (!editing) {
    return (
      <div className="py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="min-w-0">
          <span className="text-xs font-semibold text-[#5A3E36] uppercase tracking-wider">{item.category}</span>
          <h4 className="font-semibold text-[#4A3B32] break-words">{item.name}</h4>
          <div className="flex flex-wrap gap-1.5 mt-1">
            {item.options.map((o, i) => (
              <span key={i} className="text-xs bg-[#F7F4EE] text-[#6B5B52] px-2 py-0.5 rounded-full">
                {o.label} — {isNaN(Number(o.price)) ? o.price : `${o.price} €`}
              </span>
            ))}
          </div>
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
            <input type="hidden" name="id" value={item.id} />
            <button type="submit" className="px-3 py-1.5 text-xs font-medium rounded-xl bg-red-50 text-red-600 hover:bg-red-100">
              Supprimer
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="py-4 space-y-3 bg-[#FCFAF6] -mx-6 px-6">
      <input type="hidden" name="id" value={item.id} />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <input
          required
          name="category"
          defaultValue={item.category}
          className="w-full border border-[#EFECE6] rounded-2xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#5A3E36]"
        />
        <input
          required
          name="name"
          defaultValue={item.name}
          className="w-full border border-[#EFECE6] rounded-2xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#5A3E36]"
        />
      </div>
      <div className="space-y-2">
        {options.map((opt) => (
          <div key={opt.id} className="flex gap-2">
            <input
              name="option_label"
              value={opt.label}
              onChange={(e) => updateOption(opt.id, 'label', e.target.value)}
              placeholder="Ex: 10x10 - 1 couleur"
              className="flex-1 border border-[#EFECE6] rounded-2xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#5A3E36]"
            />
            <input
  name="option_price"
  type="text"
  value={opt.price}
  onChange={(e) => updateOption(opt.id, 'price', e.target.value)}
  placeholder="Prix ou Sur devis"
  className="w-40 border border-[#EFECE6] rounded-2xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#5A3E36]"
/>
            <button
              type="button"
              onClick={() => removeOption(opt.id)}
              disabled={options.length === 1}
              className="px-3 rounded-2xl border border-[#EFECE6] text-[#6B5B52] hover:bg-[#F7F4EE] disabled:opacity-30"
              aria-label="Retirer ce tarif"
            >
              ✕
            </button>
          </div>
        ))}
        <button type="button" onClick={addOption} className="text-sm font-medium text-[#5A3E36] hover:text-[#4A3B32]">
          + Ajouter un tarif
        </button>
      </div>
      <div className="flex gap-2">
        <button
          type="submit"
          disabled={isPending}
          className="flex-1 bg-[#5A3E36] hover:bg-[#4A3B32] disabled:opacity-60 text-white font-semibold py-2.5 rounded-2xl transition"
        >
          {isPending ? 'Enregistrement...' : 'Enregistrer les modifications'}
        </button>
        <button
          type="button"
          onClick={() => setEditing(false)}
          className="px-4 py-2.5 rounded-2xl border border-[#EFECE6] text-[#6B5B52] hover:bg-[#F7F4EE] transition"
        >
          Annuler
        </button>
      </div>
    </form>
  );
}
