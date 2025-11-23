'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Heart, ShoppingCart, Trash2, ChevronRight } from 'lucide-react';
import { getFavorites, removeFromFavorites, FavoriteItem } from '@/lib/cart';

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setFavorites(getFavorites());
    setLoading(false);

    const handleFavoritesUpdate = () => setFavorites(getFavorites());
    window.addEventListener('favoritesUpdated', handleFavoritesUpdate);
    return () => window.removeEventListener('favoritesUpdated', handleFavoritesUpdate);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12">
      <div className="container mx-auto px-4">
        
        {/* Хлебные крошки */}
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-8">
          <Link href="/" className="hover:text-blue-600">Главная</Link>
          <ChevronRight size={16} />
          <span className="text-gray-900">Избранное</span>
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-8 flex items-center gap-3">
          <Heart size={32} className="text-red-500 fill-red-500" />
          Избранное
        </h1>

        {favorites.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
            <div className="bg-red-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
              <Heart className="text-red-500" size={48} />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Список избранного пуст</h2>
            <p className="text-gray-500 mb-6">Добавьте товары, которые вам понравились</p>
            <Link 
              href="/catalog"
              className="inline-block bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/30"
            >
              Перейти в каталог
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {favorites.map((item) => (
              <div key={item.id} className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all overflow-hidden border border-gray-100 group flex flex-col">
                <Link href={`/product/${item.slug}`} className="relative h-64 overflow-hidden bg-gray-50">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => { (e.target as HTMLImageElement).src = '/images/pic1.jpg'; }}
                  />
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      removeFromFavorites(item.id);
                    }}
                    className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white text-red-500 transition-all shadow-sm"
                  >
                    <Trash2 size={18} />
                  </button>
                </Link>

                <div className="p-4 flex flex-col flex-grow">
                  <Link href={`/product/${item.slug}`}>
                    <h3 className="font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                      {item.name}
                    </h3>
                  </Link>

                  <div className="mt-auto pt-4 border-t border-gray-50 flex items-center justify-between">
                    <span className="text-xl font-bold text-gray-900">{item.price}</span>
                    <button 
                      onClick={() => {
                        // Логика добавления в корзину (реализуем позже)
                        alert('Добавлено в корзину');
                      }}
                      className="bg-blue-50 text-blue-600 p-2.5 rounded-lg hover:bg-blue-600 hover:text-white transition-all duration-300"
                    >
                      <ShoppingCart size={20} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
