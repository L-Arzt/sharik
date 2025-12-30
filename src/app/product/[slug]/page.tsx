'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import {
  ShoppingCart,
  Heart,
  ChevronRight,
  Minus,
  Plus,
  Truck,
  Shield,
  TimerIcon
} from 'lucide-react';
import { addToCart, addToFavorites, removeFromFavorites, isFavorite, getCartItem, updateCartQuantity } from '@/lib/cart';

interface ProductImage {
  id: string;
  relativePath: string | null;
  isPrimary: boolean;
}

interface Product {
  id: string;
  name: string;
  slug: string | null;
  price: string;
  priceNumeric: number | null;
  descriptionText?: string;
  searchText?: string;
  productCode?: string;
  inStock: boolean;
  images: ProductImage[];
  categories: Array<{
    category: {
      id: string;
      name: string;
      slug: string;
    };
  }>;
  descriptionItems?: string[] | null;
  compositionItems?: string[] | null;
  specifications?: Array<{ name: string; value: string }> | null;
}

export default function ProductPage() {
  const params = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'description' | 'composition'>('description');
  const [isInFavorites, setIsInFavorites] = useState(false);
  const [cartQuantity, setCartQuantity] = useState(0);

  useEffect(() => {
    const loadProduct = async () => {
      try {
        const res = await fetch(`/api/products/${params.slug}`);
        if (!res.ok) throw new Error('Product not found');
        const data = await res.json();
        setProduct(data);
        setIsInFavorites(isFavorite(data.id));
        
        const cartItem = getCartItem(data.id);
        if (cartItem) {
          setCartQuantity(cartItem.quantity);
          setQuantity(cartItem.quantity);
        }
      } catch (error) {
        console.error('Failed to load product:', error);
      } finally {
        setLoading(false);
      }
    };

    if (params.slug) {
      loadProduct();
    }
  }, [params.slug]);

  // Синхронизация с корзиной
  useEffect(() => {
    const handleCartUpdate = () => {
      if (product) {
        const cartItem = getCartItem(product.id);
        const newQuantity = cartItem ? cartItem.quantity : 0;
        setCartQuantity(newQuantity);
        
        if (newQuantity > 0) {
          setQuantity(newQuantity);
        } else {
          setQuantity(1);
        }
      }
    };

    window.addEventListener('cartUpdated', handleCartUpdate);
    return () => window.removeEventListener('cartUpdated', handleCartUpdate);
  }, [product]);

  const getImageUrl = (image: ProductImage): string => {
    if (image.relativePath) {
      // Нормализуем путь (заменяем обратные слеши на прямые)
      const normalizedPath = image.relativePath.replace(/\\/g, '/');
      // Разбиваем на сегменты и кодируем каждый отдельно
      const segments = normalizedPath.split('/').filter(s => s.length > 0);
      const encodedPath = segments.map(segment => encodeURIComponent(segment)).join('/');
      return `/api/images/${encodedPath}`;
    }
    return '/images/pic1.jpg';
  };

  const handleQuantityChange = (delta: number) => {
    const newQuantity = Math.max(1, quantity + delta);
    setQuantity(newQuantity);
    
    // Если товар уже в корзине, обновляем корзину сразу
    if (product && cartQuantity > 0) {
      updateCartQuantity(product.id, newQuantity);
    }
  };

  const handleAddToCart = () => {
    if (!product) return;
    
    const imageUrl = getImageUrl(product.images[0] || { id: '', relativePath: null, isPrimary: true });
    
    // Если товар уже в корзине, просто обновляем количество
    if (cartQuantity > 0) {
      updateCartQuantity(product.id, quantity);
    } else {
      // Если товара нет в корзине, добавляем
      addToCart({
        id: product.id,
        name: product.name,
        slug: product.slug || product.id,
        price: product.price,
        priceNumeric: product.priceNumeric || 0,
        image: imageUrl,
      }, quantity);
    }
  };

  const handleToggleFavorite = () => {
    if (!product) return;
    
    const imageUrl = getImageUrl(product.images[0] || { id: '', relativePath: null, isPrimary: true });
    
    if (isInFavorites) {
      removeFromFavorites(product.id);
      setIsInFavorites(false);
    } else {
      addToFavorites({
        id: product.id,
        name: product.name,
        slug: product.slug || product.id,
        price: product.price,
        priceNumeric: product.priceNumeric || 0,
        image: imageUrl,
      });
      setIsInFavorites(true);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Товар не найден</h2>
          <Link href="/catalog" className="text-blue-600 hover:underline">
            Вернуться в каталог
          </Link>
        </div>
      </div>
    );
  }

  const hasComposition = product.descriptionItems && product.descriptionItems.length > 0;
  const isInCart = cartQuantity > 0;

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-8">
      <div className="container mx-auto px-4">
        
        {/* Хлебные крошки */}
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-8">
          <Link href="/" className="hover:text-blue-600">Главная</Link>
          <ChevronRight size={16} />
          <Link href="/catalog" className="hover:text-blue-600">Каталог</Link>
          <ChevronRight size={16} />
          {product.categories[0] && (
            <>
              <Link 
                href={`/catalog?category=${product.categories[0].category.id}`}
                className="hover:text-blue-600"
              >
                {product.categories[0].category.name}
              </Link>
              <ChevronRight size={16} />
            </>
          )}
          <span className="text-gray-900">{product.name}</span>
        </div>

        {/* Выровненные блоки с items-start */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12 items-center">
          
          {/* Галерея изображений */}
          <div className=" top-24">
            <div className="bg-white rounded-2xl overflow-hidden shadow-lg mb-4 relative h-[500px]">
              <Image
                src={getImageUrl(product.images[selectedImage] || product.images[0])}
                alt={product.name}
                fill
                className="object-contain "
                onError={(e) => { (e.target as HTMLImageElement).src = '/images/pic1.jpg'; }}
              />
              <button 
                onClick={handleToggleFavorite}
                className={`absolute top-4 right-4 p-3 backdrop-blur-sm rounded-full transition-all shadow-lg ${
                  isInFavorites 
                    ? 'bg-red-500 text-white hover:bg-red-600' 
                    : 'bg-white/90 hover:bg-white text-gray-400 hover:text-red-500'
                }`}
              >
                <Heart size={24} className={isInFavorites ? 'fill-white' : ''} />
              </button>
            </div>

            {product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-4">
                {product.images.map((image, index) => (
                  <button
                    key={image.id}
                    onClick={() => setSelectedImage(index)}
                    className={`relative h-24 rounded-lg overflow-hidden border-2 transition-all ${
                      selectedImage === index 
                        ? 'border-blue-600 scale-105' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <Image
                      src={getImageUrl(image)}
                      alt={`${product.name} ${index + 1}`}
                      fill
                      className="object-cover"
                      onError={(e) => { (e.target as HTMLImageElement).src = '/images/pic1.jpg'; }}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Информация о товаре */}
          <div>
            <div className="bg-white rounded-2xl p-8 shadow-lg h-full">
              {product.productCode && (
                <p className="text-sm text-gray-500 mb-2">Артикул: {product.productCode}</p>
              )}
              
              <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.name}</h1>
              
              <div className="flex items-center gap-4 mb-6">
                <span className="text-4xl font-bold text-blue-600">{product.price}</span>
                {product.inStock ? (
                  <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                    В наличии
                  </span>
                ) : (
                  <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-medium">
                    Нет в наличии
                  </span>
                )}
              </div>

              {product.searchText && (
                <p className="text-gray-600 mb-6 leading-relaxed">
                  {product.searchText}
                </p>
              )}

              {/* Количество - синхронизировано с корзиной */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Количество
                </label>
                <div className="flex items-center gap-4">
                  <div className="flex items-center border-2 border-gray-200 rounded-lg overflow-hidden">
                    <button
                      onClick={() => handleQuantityChange(-1)}
                      className="p-3 hover:bg-gray-100 transition-colors"
                    >
                      <Minus size={20} />
                    </button>
                    <span className="px-6 py-3 font-bold text-lg border-x-2 border-gray-200">
                      {quantity}
                    </span>
                    <button
                      onClick={() => handleQuantityChange(1)}
                      className="p-3 hover:bg-gray-100 transition-colors"
                    >
                      <Plus size={20} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Кнопки - всегда синяя */}
              <div className="flex gap-4 mb-8">
                <button 
                  onClick={handleAddToCart}
                  disabled={!product.inStock}
                  className="flex-1 bg-blue-600 text-white py-4 px-6 rounded-xl font-bold text-lg hover:bg-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30"
                >
                  <ShoppingCart size={24} />
                  {isInCart ? 'Добавлено в корзину' : 'В корзину'}
                </button>
              </div>

              {/* Постоянное уведомление если товар в корзине */}
              {isInCart && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div className="flex-grow">
                    <p className="text-green-800 font-medium">Товар в корзине ({cartQuantity} шт.)</p>
                  </div>
                  <Link 
                    href="/cart"
                    className="text-green-600 hover:text-green-700 font-medium text-sm underline whitespace-nowrap"
                  >
                    Перейти в корзину →
                  </Link>
                </div>
              )}

              {/* Преимущества */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-50 rounded-lg">
                    <Truck className="text-blue-600" size={24} />
                  </div>
                  <div>
                    <p className="font-medium text-sm">Доставка</p>
                    <p className="text-xs text-gray-500">По Ростову-на-Дону и Аксаю</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-50 rounded-lg">
                    <Shield className="text-green-600" size={24} />
                  </div>
                  <div>
                    <p className="font-medium text-sm">Гарантия</p>
                    <p className="text-xs text-gray-500">Качество</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-50 rounded-lg">
                    <TimerIcon className="text-purple-600" size={24} />
                  </div>
                  <div>
                    <p className="font-medium text-sm">Время полёта</p>
                    <p className="text-xs text-gray-500">7 дней</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* НИЖНИЙ БЛОК: Табы */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          
          {/* Заголовки табов */}
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab('description')}
              className={`px-8 py-4 font-bold transition-all ${
                activeTab === 'description'
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-gray-500 hover:bg-gray-50'
              }`}
            >
              Описание
            </button>

            {hasComposition && (
              <button
                onClick={() => setActiveTab('composition')}
                className={`px-8 py-4 font-bold transition-all ${
                  activeTab === 'composition'
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-gray-500 hover:bg-gray-50'
                }`}
              >
                Состав
              </button>
            )}
          </div>

          {/* Контент табов */}
          <div className="p-8">
            {activeTab === 'description' && (
              <div className="prose max-w-none">
                {product.descriptionText ? (
                  <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                    {product.descriptionText}
                  </p>
                ) : (
                  <p className="text-gray-500 italic">Описание отсутствует</p>
                )}
              </div>
            )}

            {activeTab === 'composition' && hasComposition && (
              <div className="prose max-w-none">
                <ul className="space-y-2 list-disc pl-5">
                  {product.descriptionItems!.map((item, index) => (
                    <li key={index} className="text-gray-700">{item}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
