'use client';
import { useState, useTransition } from 'react';

function makeOption() {
  return { id: (crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36)), label: '', price: '' };
}

export default function AddPricingForm({ action }) {
  const [options, setOptions] = useState([makeOption()]);
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
      await action(formData);
      form.reset();
      setOptions([makeOption()]);
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-[#6B5B52] mb-1">Catégorie</label>
          <input required name="category" placeholder="Ex: Vêtements, Objets, Voiture" className="w-full border border-[#EFECE6] rounded-2xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#5A3E36]" />
        </div>
        <div>
          <label className="block text-sm font-medium text-[#6B5B52] mb-1">Article</label>
          <input required name="name" placeholder="Ex: T-shirt, Tote bag..." className="w-full border border-[#EFECE6] rounded-2xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#5A3E36]" />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-[#6B5B52] mb-2">Tarifs</label>
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
                type="number"
                step="0.01"
                value={opt.price}
                onChange={(e) => updateOption(opt.id, 'price', e.target.value)}
                placeholder="Prix €"
                className="w-28 border border-[#EFECE6] rounded-2xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#5A3E36]"
              />
              <button
                type="button"
                onClick={() => removeOption(opt.id)}
                disabled={options.length === 1}
                className="px-3 rounded-2xl border border-[#EFECE6] text-[#6B5B52] hover:bg-[#F7F4EE] disabled:opacity-30 transition"
                aria-label="Retirer ce tarif"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={addOption}
          className="mt-2 text-sm font-medium text-[#5A3E36] hover:text-[#4A3B32] transition"
        >
          + Ajouter un tarif
        </button>
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="w-full bg-[#5A3E36] hover:bg-[#4A3B32] disabled:opacity-60 text-white font-bold py-3 rounded-2xl transition"
      >
        {isPending ? 'Enregistrement...' : "Ajouter l'article tarifé"}
      </button>
    </form>
  );
}
