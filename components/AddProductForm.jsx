'use client';
import { useState, useTransition } from 'react';

// Redimensionne et compresse une image côté navigateur avant l'envoi au serveur.
// Une photo de téléphone (souvent 3-8 Mo) devient ainsi un JPEG de quelques centaines de Ko.
async function compressImage(file, maxDim, quality) {
  try {
    const bitmap = await createImageBitmap(file);
    let { width, height } = bitmap;

    if (width > maxDim || height > maxDim) {
      const scale = maxDim / Math.max(width, height);
      width = Math.round(width * scale);
      height = Math.round(height * scale);
    }

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(bitmap, 0, 0, width, height);

    const blob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/jpeg', quality));
    if (!blob) return file;

    const newName = file.name.replace(/\.[^.]+$/, '') + '.jpg';
    return new File([blob], newName, { type: 'image/jpeg' });
  } catch (err) {
    console.error('Compression impossible, envoi du fichier original :', err);
    return file;
  }
}

export default function AddProductForm({ action }) {
  const [isPending, startTransition] = useTransition();
  const [status, setStatus] = useState('idle'); // idle | compressing | submitting

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    setStatus('compressing');

    const mainFile = formData.get('main_image');
    if (mainFile instanceof File && mainFile.size > 0) {
      formData.set('main_image', await compressImage(mainFile, 1600, 0.75));
    }

    const extraFiles = formData.getAll('extra_images').filter((f) => f instanceof File && f.size > 0);
    formData.delete('extra_images');
    for (const f of extraFiles) {
      formData.append('extra_images', await compressImage(f, 1200, 0.7));
    }

    setStatus('submitting');
    startTransition(async () => {
      await action(formData);
      form.reset();
      setStatus('idle');
    });
  };

  const busy = status !== 'idle';

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label className="block text-sm font-medium text-[#6B5B52] mb-1">Titre de l'article</label>
        <input required type="text" name="title" placeholder="Ex: Mug personnalisé" className="w-full border border-[#EFECE6] rounded-2xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#5A3E36]" />
      </div>
      <div>
        <label className="block text-sm font-medium text-[#6B5B52] mb-1">Prix (€)</label>
        <input required type="number" step="0.01" name="price" placeholder="15.00" className="w-full border border-[#EFECE6] rounded-2xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#5A3E36]" />
      </div>
      <div>
        <label className="block text-sm font-medium text-[#6B5B52] mb-1">Catégorie</label>
        <input type="text" name="category" placeholder="Sticker, T-shirt, Mug..." className="w-full border border-[#EFECE6] rounded-2xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#5A3E36]" />
      </div>
      <div className="md:col-span-2">
        <label className="block text-sm font-medium text-[#6B5B52] mb-1">Description détaillée</label>
        <textarea name="description" rows="3" placeholder="Décrivez votre produit..." className="w-full border border-[#EFECE6] rounded-2xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#5A3E36]"></textarea>
      </div>
      <div>
        <label className="block text-sm font-medium text-[#6B5B52] mb-1">Photo Miniature (Catalogue)</label>
        <input type="file" name="main_image" accept="image/*" className="w-full text-sm text-[#6B5B52]" />
      </div>
      <div>
        <label className="block text-sm font-medium text-[#6B5B52] mb-1">Photos supplémentaires</label>
        <input type="file" name="extra_images" multiple accept="image/*" className="w-full text-sm text-[#6B5B52]" />
      </div>
      <div className="md:col-span-2 flex items-center gap-3 py-2">
        <input type="checkbox" name="is_hidden" id="is_hidden" className="w-4 h-4 text-[#5A3E36] rounded border-[#EFECE6]" />
        <label htmlFor="is_hidden" className="text-sm font-medium text-[#6B5B52]">Masquer cet article du catalogue</label>
      </div>
      <div className="md:col-span-2">
        <button
          type="submit"
          disabled={busy}
          className="w-full bg-[#5A3E36] hover:bg-[#4A3B32] disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold py-3 rounded-2xl transition"
        >
          {status === 'compressing' && 'Compression des photos...'}
          {status === 'submitting' && 'Enregistrement...'}
          {status === 'idle' && "Enregistrer l'article"}
        </button>
      </div>
    </form>
  );
}
