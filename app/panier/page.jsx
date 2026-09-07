'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function PanierPage() {
  const [cart, setCart] = useState([]);
  const [phone, setPhone] = useState('33600000000'); // Remplacez par votre numéro WhatsApp (ex: 33612345678)

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
      message += `- ${item.quantity}x ${item.title} (${(item.price * item.quantity).toFixed(2)} €)\n`;
    });
    message += `\n*Total général : ${total.toFixed(2)} €*\n\nComment procède-t-on pour la suite ?`;

    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/${phone}?text=${encodedMessage}`, '_blank');
  };

  if (cart.length === 0) {
    return (
      <div className="text-center py-16 bg-white rounded-2xl border border-slate-200">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Votre panier est vide</h2>
        <p className="text-slate-500 mb-6">Explorez notre catalogue pour ajouter vos articles personnalisés.</p>
        <Link href="/" className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-indigo-700 transition">
          Voir le catalogue
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-2xl border border-slate-200 p-6 md:p-8 shadow-sm">
      <h1 className="text-2xl font-bold text-slate-900 mb-6">Mon Panier</h1>

      <div className="divide-y divide-slate-100">
        {cart.map((item) => (
          <div key={item.id} className="py-4 flex items-center justify-between gap-4">
            <div>
              <h3 className="font-semibold text-slate-900">{item.title}</h3>
              <p className="text-sm text-slate-500">{Number(item.price).toFixed(2)} € l'unité</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden">
                <button onClick={() => updateQuantity(item.id, -1)} className="px-3 py-1 bg-slate-50 hover:bg-slate-100 text-slate-600">-</button>
                <span className="px-3 text-sm font-medium">{item.quantity}</span>
                <button onClick={() => updateQuantity(item.id, 1)} className="px-3 py-1 bg-slate-50 hover:bg-slate-100 text-slate-600">+</button>
              </div>
              <button onClick={() => removeItem(item.id)} className="text-red-500 hover:text-red-700 text-sm font-medium">Suppr.</button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 border-t border-slate-200 pt-6 flex items-center justify-between">
        <span className="text-lg font-medium text-slate-600">Total estimé</span>
        <span className="text-2xl font-black text-slate-900">{total.toFixed(2)} €</span>
      </div>

      <div className="mt-8">
        <button
          onClick={sendToWhatsApp}
          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-emerald-600/20 transition flex items-center justify-center gap-2 text-lg"
        >
          📱 Valider et envoyer sur WhatsApp
        </button>
        <p className="text-xs text-center text-slate-400 mt-3">
          Cela ouvrira votre application WhatsApp avec le récapitulatif prêt à l'envoi.
        </p>
      </div>
    </div>
  );
}
