'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AlertCircle, LogIn } from 'lucide-react';
import Link from 'next/link';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('admin@example.com');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/admin/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || 'Ошибка входа');
        setLoading(false);
        return;
      }

      const { token } = await res.json();
      localStorage.setItem('adminToken', token);
      router.push('/admin/products');
    } catch {
      setError('Ошибка сети');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-blue-50 to-purple-50 flex items-center justify-center p-4 pt-20">
      <div className="w-full max-w-md">
        {/* Карточка логина */}
        <div className="bg-white/90 backdrop-blur-md border border-gray-200 rounded-2xl p-8 shadow-2xl">
          {/* Логотип */}
          <div className="text-center mb-8">
            <div className="text-6xl mb-4">🎈</div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Админ-панель
            </h1>
            <p className="text-gray-600 mt-2">Шары в Сердце</p>
          </div>

          {/* Ошибка */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex gap-3">
              <AlertCircle className="text-red-500 flex-shrink-0 mt-0.5" size={20} />
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          {/* Форма */}
          <form onSubmit={handleLogin} className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">Email</label>
              <input
                type="email"
                placeholder="admin@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                required
              />
            </div>

            {/* Пароль */}
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">Пароль</label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                required
              />
            </div>

            {/* Кнопка входа */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 mt-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
            >
              <LogIn size={20} />
              {loading ? 'Загрузка...' : 'Войти в панель'}
            </button>
          </form>

          {/* Информация */}
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
            <p className="text-blue-700 text-xs text-center">
              <span className="font-semibold">Demo:</span> admin@example.com / secure123
            </p>
          </div>

          {/* Ссылка на сайт */}
          <div className="mt-6 text-center">
            <Link href="/" className="text-gray-600 hover:text-blue-600 text-sm transition font-medium">
              ← Вернуться на сайт
            </Link>
          </div>
        </div>

        {/* Подвал */}
        <p className="text-center text-gray-500 text-xs mt-6">
          © 2025 Шары в Сердце. Все права защищены.
        </p>
      </div>
    </div>
  );
}
