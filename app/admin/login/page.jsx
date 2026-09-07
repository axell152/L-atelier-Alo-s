'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLogin() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const router = useRouter();

  const handleLogin = (e) => {
    e.preventDefault();
    // Définissez ici votre mot de passe secret
    if (password === 'aloes2026') { 
      document.cookie = "admin_auth=true; path=/; max-age=31536000; SameSite=Strict";
      router.push('/admin');
      router.refresh();
    } else {
      setError(true);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 bg-white p-8 rounded-3xl border border-[#EFECE6] shadow-sm text-center space-y-6">
      <div className="w-12 h-12 bg-[#FFB6C1]/30 text-[#5A3E36] rounded-2xl mx-auto flex items-center justify-center text-xl font-bold">
        🔒
      </div>
      <h1 className="text-2xl font-serif font-bold text-[#4A3B32]">Espace Réservé</h1>
      <p className="text-sm text-[#6B5B52]">Entrez votre mot de passe pour accéder à la gestion de l'atelier.</p>
      
      <form onSubmit={handleLogin} className="space-y-4">
        <input
          type="password"
          placeholder="Mot de passe secret"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-3 rounded-2xl border border-[#EFECE6] focus:outline-none focus:ring-2 focus:ring-[#5A3E36] text-sm text-[#4A3B32]"
        />
        {error && <p className="text-xs text-red-500 font-medium">Mot de passe incorrect.</p>}
        <button
          type="submit"
          className="w-full py-3 bg-[#5A3E36] text-white rounded-2xl font-semibold text-sm hover:bg-[#4A3B32] transition"
        >
          Se connecter
        </button>
      </form>
    </div>
  );
}
