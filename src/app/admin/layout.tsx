'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { LogOut, Menu, X, Package, FolderTree, Home } from 'lucide-react';
import Image from 'next/image';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem('adminToken');
    if (!stored) {
      router.push('/auth/admin-login');
    } else {
      setToken(stored);
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    router.push('/auth/admin-login');
  };

  if (!token) return null;

  const navItems = [
    { href: '/admin/products', label: 'Товары', icon: Package },
    { href: '/admin/categories', label: 'Категории', icon: FolderTree },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-blue-50 to-purple-50 pt-16 lg:pt-20">
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 lg:hidden bg-black/50 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Сайдбар */}
      <div
        className={`${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } fixed top-16 lg:top-20 bottom-0 left-0 z-50 w-72 bg-white/95 backdrop-blur-md border-r border-gray-200 shadow-xl transition-transform lg:translate-x-0`}
      >
        {/* Логотип */}
        <div className="p-6 border-b border-gray-200">
          <Link href="/" className="flex items-center gap-3 mb-6 hover:opacity-80 transition-opacity">
            <div className="relative w-10 h-10">
              <Image
                src="/images/logo.jpg"
                alt="Логотип"
                fill
                className="object-contain rounded-lg"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Админ-панель
              </span>
              <span className="text-xs text-gray-500">Шары в Сердце</span>
            </div>
          </Link>
          
          <Link
            href="/"
            className="flex items-center gap-2 text-sm text-gray-600 hover:text-blue-600 transition-colors"
          >
            <Home size={16} />
            Вернуться на сайт
          </Link>
        </div>

        {/* Навигация */}
        <nav className="space-y-2 px-4 py-4">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/30'
                    : 'text-gray-700 hover:bg-blue-50 hover:text-blue-600'
                }`}
              >
                <Icon size={20} />
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Выход */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 bg-white/50 backdrop-blur-sm">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-xl transition-all shadow-md hover:shadow-lg"
          >
            <LogOut size={18} />
            <span className="font-medium">Выход</span>
          </button>
        </div>
      </div>

      {/* Основное содержимое */}
      <div className="lg:ml-72">
        {/* Мобильный хедер */}
        <div className="lg:hidden fixed top-16 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm p-4 flex items-center">
          <button 
            onClick={() => setIsOpen(!isOpen)} 
            className="p-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          <span className="ml-4 font-semibold text-gray-800">Админ-панель</span>
        </div>

        {/* Контент */}
        <main className="p-4 lg:p-6 pt-20 lg:pt-6 min-h-[calc(100vh-4rem)] lg:min-h-[calc(100vh-5rem)]">
          <div className="max-w-7xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
}
