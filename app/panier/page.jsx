'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function PanierPage() {
  const [cart, setCart] = useState([]);
  const [phone, setPhone] = useState('33600000000'); // Remplacez par votre numéro WhatsApp réel

  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem('cricut_cart') || '[]');
    setCart(savedCart);
  }, []);

  const updateQuantity = (id, delta) => {
    const updated = cart.map((item) => {
      if (item.id === id) {
        const newQty = item.quantity + delta;
        return newQty > 0 ? { ...item, quantity: newQty } : null;
      }
      return item;
    }).filter(Boolean);

    setCart(updated);
    localStorage.setItem('cricut_cart', JSON.stringify(updated));
  };

  const removeItem = (id) => {
    const updated = cart.filter((item) => item.id !== id);
    setCart(updated);
    localStorage.setItem('cricut_cart', JSON.stringify(updated));
  };

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const sendToWhatsApp = () => {
    if (cart.length === 0) return;

    let message = "Bonjour ! Je souhaite passer commande pour les articles suivants :\n\n";
    cart.forEach((item) => {
      message += `• ${item.quantity}x ${item.title} (${(item.price * item.quantity).toFixed(2)} €)\n`;
    });
    message += `\n*Total général : ${total.toFixed(2)} €*\n\nComment procède-t-on pour la suite ?`;

    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/${phone}?text=${encodedMessage}`, '_blank');
  };

  if (cart.length === 0) {
    return (
      <div className="text-center py-20 bg-white rounded-3xl border border-slate-100 shadow-xs max-w-lg mx-auto">
        <span className="text-5xl">🛒</span>
        <h2 className="text-2xl font-bold text-slate-900 mt-4">Votre panier est vide</h2>
        <p className="text-slate-500 mt-2 mb-8 text-sm">Explorez le catalogue pour y ajouter vos articles personnalisés.</p>
        <Link href="/" className="inline-block bg-indigo-600 text-white px-8 py-3 rounded-2xl font-semibold hover:bg-indigo-700 shadow-md shadow-indigo-600/20 transition">
          Découvrir le catalogue
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto bg-white rounded-3xl border border-slate-100 p-6 sm:p-10 shadow-sm space-y-8">
      <div className="border-b border-slate-100 pb-4">
        <h1 className="text-2xl font-black text-slate-900">Mon Panier</h1>
        <p className="text-xs text-slate-400 mt-1">Vérifiez vos articles avant de valider sur WhatsApp</p>
      </div>

      <div className="divide-y divide-slate-100">
        {cart.map((item) => (
          <div key={item.id} className="py-4 flex items-center justify-between gap-4">
            <div>
              <h3 className="font-bold text-slate-900 text-sm sm:text-base">{item.title}</h3>
              <p className="text-xs text-slate-400">{Number(item.price).toFixed(2)} € l'unité</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden bg-slate-50">
                <button onClick={() => updateQuantity(item.id, -1)} className="px-3 py-1 text-slate-600 hover:bg-slate-200 transition">-</button>
                <span className="px-3 text-xs font-bold">{item.quantity}</span>
                <button onClick={() => updateQuantity(item.id, 1)} className="px-3 py-1 text-slate-600 hover:bg-slate-200 transition">+</button>
              </div>
              <button onClick={() => removeItem(item.id)} className="text-rose-500 hover:text-rose-700 text-xs font-semibold">Suppr.</button>
            </div>
          </div>
        ))}
      </div>

      <div className="border-t border-slate-100 pt-6 flex items-center justify-between">
        <span className="text-base font-medium text-slate-500">Total estimé</span>
        <span className="text-2xl font-black text-slate-900">{total.toFixed(2)} €</span>
      </div>

      <div>
        <button
          onClick={sendToWhatsApp}
          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 rounded-2xl shadow-lg shadow-emerald-600/25 transition flex items-center justify-center gap-3 text-base transform active:scale-95"
        >
          <span className="text-xl">💬</span> Commander directement sur WhatsApp
        </button>
        <p className="text-xs text-center text-slate-400 mt-3">
          Un récapitulatif détaillé sera automatiquement généré dans votre application.
        </p>
      </div>
    </div>
  );
}
