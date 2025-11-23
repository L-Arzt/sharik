'use client';


import { useState, useEffect, useCallback, Suspense } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, Grid, List, X, ChevronDown, ChevronRight, ShoppingCart, Heart } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';


import { addToCart, addToFavorites, removeFromFavorites, isFavorite, getCartItem, updateCartQuantity, removeFromCart } from '@/lib/cart';
import { Minus, Plus } from 'lucide-react'; // Добавьте Minus и Plus к импортам


// --- Типы данных ---
interface Category {
  id: string;
  name: string;
  slug: string;
  parentId?: string | null;
  children?: Category[];
}


interface ProductImage {
  id: string;
  relativePath: string | null;
  localPath: string | null;
  filename: string | null;
  isPrimary: boolean;
}


interface Product {
  id: string;
  name: string;
  slug: string | null;
  price: string;
  priceNumeric: number | null;
  descriptionText?: string;
  images: ProductImage[];
  categories: Array<{
    category: {
      id: string;
      name: string;
      slug: string;
    };
  }>;
}


// --- Компонент карточки товара ---
const ProductCard = ({ product, viewMode }: { product: Product; viewMode: 'grid' | 'list' }) => {
  const [isInFavorites, setIsInFavorites] = useState(false);
  const [justAdded, setJustAdded] = useState(false);
  const [cartQuantity, setCartQuantity] = useState(0);


  useEffect(() => {
    setIsInFavorites(isFavorite(product.id));
    
    const cartItem = getCartItem(product.id);
    setCartQuantity(cartItem ? cartItem.quantity : 0);
  }, [product.id]);


  useEffect(() => {
    const handleCartUpdate = () => {
      const cartItem = getCartItem(product.id);
      setCartQuantity(cartItem ? cartItem.quantity : 0);
    };


    window.addEventListener('cartUpdated', handleCartUpdate);
    return () => window.removeEventListener('cartUpdated', handleCartUpdate);
  }, [product.id]);


  const getImageUrl = (product: Product): string => {
    if (product.images && product.images.length > 0) {
      const img = product.images[0];
      if (img.relativePath) {
        return `/api/images/${encodeURIComponent(img.relativePath.replace(/\\/g, '/'))}`;
      }
    }
    return '/images/pic1.jpg';
  };


  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const imageUrl = getImageUrl(product);
    addToCart({
      id: product.id,
      name: product.name,
      slug: product.slug || product.id,
      price: product.price,
      priceNumeric: product.priceNumeric || 0,
      image: imageUrl,
    }, 1);


    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1000);
  };


  const handleIncreaseQuantity = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    updateCartQuantity(product.id, cartQuantity + 1);
  };


  const handleDecreaseQuantity = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (cartQuantity > 1) {
      updateCartQuantity(product.id, cartQuantity - 1);
    } else {
      removeFromCart(product.id);
    }
  };


  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const imageUrl = getImageUrl(product);
    
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


  const imageUrl = getImageUrl(product);
  const isInCart = cartQuantity > 0;


  if (viewMode === 'list') {
    return (
      <Link href={`/product/${product.slug || product.id}`}>
        <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden border border-gray-100 flex group cursor-pointer">
          <div className="relative w-48 h-48 flex-shrink-0 overflow-hidden">
            <Image
              src={imageUrl}
              alt={product.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              onError={(e) => { (e.target as HTMLImageElement).src = '/images/pic1.jpg'; }}
            />
          </div>
          <div className="p-6 flex flex-col justify-between flex-grow">
            <div>
              <div className="text-sm text-blue-500 font-medium mb-2">
                {product.categories?.[0]?.category.name || 'Шары'}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">{product.name}</h3>
              <p className="text-gray-500 line-clamp-2 mb-4 text-sm">
                {product.descriptionText || 'Описание товара отсутствует'}
              </p>
            </div>
            <div className="flex items-center justify-between mt-4">
              <span className="text-2xl font-bold text-blue-600">{product.price}</span>
              <div className="flex gap-2 items-center">
                <button 
                  onClick={handleToggleFavorite}
                  className={`p-2 rounded-lg transition-all ${
                    isInFavorites 
                      ? 'bg-red-50 text-red-500' 
                      : 'bg-gray-100 text-gray-400 hover:bg-red-50 hover:text-red-500'
                  }`}
                >
                  <Heart size={20} className={isInFavorites ? 'fill-red-500' : ''} />
                </button>


                {/* Кнопки управления корзиной */}
                {isInCart && (
                  <button 
                    onClick={handleDecreaseQuantity}
                    className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-all"
                  >
                    <Minus size={20} />
                  </button>
                )}


                <button 
                  onClick={handleAddToCart}
                  className={`px-6 py-2 rounded-lg transition-all flex items-center gap-2 relative ${
                    isInCart
                      ? 'bg-green-600 text-white hover:bg-green-700'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  } ${justAdded ? 'scale-95' : ''}`}
                >
                  <ShoppingCart size={20} />
                  {isInCart ? `В корзине (${cartQuantity})` : 'В корзину'}
                </button>


                {isInCart && (
                  <button 
                    onClick={handleIncreaseQuantity}
                    className="p-2 rounded-lg bg-green-50 text-green-600 hover:bg-green-100 transition-all"
                  >
                    <Plus size={20} />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </Link>
    );
  }


  return (
    <Link href={`/product/${product.slug || product.id}`}>
      <div className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-100 group flex flex-col h-full cursor-pointer">
        <div className="relative h-64 overflow-hidden bg-gray-50">
          <Image
            src={imageUrl}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            onError={(e) => { (e.target as HTMLImageElement).src = '/images/pic1.jpg'; }}
          />
          <button 
            onClick={handleToggleFavorite}
            className={`absolute top-3 right-3 p-2 backdrop-blur-sm rounded-full transition-all shadow-sm ${
              isInFavorites 
                ? 'bg-red-500 text-white hover:bg-red-600' 
                : 'bg-white/80 hover:bg-white text-gray-400 hover:text-red-500'
            }`}
          >
            <Heart size={18} className={isInFavorites ? 'fill-white' : ''} />
          </button>
          
          {isInCart && (
            <div className="absolute top-3 left-3 px-2 py-1 bg-green-600 text-white text-xs font-bold rounded-full shadow-lg">
              В корзине: {cartQuantity}
            </div>
          )}
        </div>
        <div className="p-4 flex flex-col flex-grow">
          <div className="text-xs text-blue-500 font-medium mb-1 uppercase tracking-wider">
            {product.categories?.[0]?.category.name}
          </div>
          <h3 className="font-bold text-gray-900 mb-2 line-clamp-2 flex-grow group-hover:text-blue-600 transition-colors">
            {product.name}
          </h3>
          <div className="mt-auto pt-4 border-t border-gray-50 flex items-center justify-between">
            <span className="text-xl font-bold text-gray-900">{product.price}</span>
            
            {/* Блок с кнопками управления */}
            <div className="flex items-center gap-1">
              {isInCart && (
                <button 
                  onClick={handleDecreaseQuantity}
                  className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-all"
                >
                  <Minus size={16} />
                </button>
              )}


              <button 
                onClick={handleAddToCart}
                className={`p-2.5 rounded-lg transition-all duration-300 relative ${
                  isInCart
                    ? 'bg-green-600 text-white hover:bg-green-700'
                    : 'bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white'
                } ${justAdded ? 'scale-95' : ''}`}
              >
                <ShoppingCart size={20} />
                {isInCart && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-green-800 text-white text-xs font-bold rounded-full flex items-center justify-center">
                    {cartQuantity}
                  </span>
                )}
              </button>


              {isInCart && (
                <button 
                  onClick={handleIncreaseQuantity}
                  className="p-2 rounded-lg bg-green-50 text-green-600 hover:bg-green-100 transition-all"
                >
                  <Plus size={16} />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};


// --- РЕКУРСИВНЫЙ компонент элемента категории ---
const CategoryItem = ({ 
  category, 
  selectedCategory, 
  onSelect, 
  expanded, 
  toggleExpand,
  level = 0 
}: {
  category: Category;
  selectedCategory: string | null;
  onSelect: (id: string) => void;
  expanded: Record<string, boolean>;
  toggleExpand: (id: string, e: React.MouseEvent) => void;
  level?: number;
}) => {
  const hasChildren = category.children && category.children.length > 0;
  const isSelected = selectedCategory === category.id;
  const isExpanded = expanded[category.id];


  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelect(category.id);
    if (hasChildren) {
      toggleExpand(category.id, e);
    }
  };


  return (
    <div className="space-y-1">
      <button
        onClick={handleClick}
        className={`
          w-full flex items-center justify-between 
          px-3 py-2 rounded-lg transition-all
          border
          ${isSelected 
            ? 'bg-blue-50 text-blue-700 border-blue-200' 
            : 'text-gray-600 hover:bg-gray-50 border-transparent hover:border-gray-200'
          }
        `}
        style={{ paddingLeft: `${12 + level * 16}px` }}
      >
        <span className="flex-grow text-left text-sm font-medium">
          {category.name}
        </span>
        {hasChildren && (
          <span className="text-gray-400 ml-2">
            {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          </span>
        )}
      </button>


      <AnimatePresence>
        {isExpanded && hasChildren && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            {category.children!.map((child) => (
              <CategoryItem
                key={child.id}
                category={child}
                selectedCategory={selectedCategory}
                onSelect={onSelect}
                expanded={expanded}
                toggleExpand={toggleExpand}
                level={level + 1}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};


// --- Компонент дерева категорий ---
const CategoryTree = ({ 
  categories, 
  selectedCategory, 
  onSelect 
}: { 
  categories: Category[], 
  selectedCategory: string | null, 
  onSelect: (id: string | null) => void 
}) => {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});


  const toggleExpand = useCallback((id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpanded(prev => ({ ...prev, [id]: !prev[id] }));
  }, []);


  const findPathToCategory = useCallback((cats: Category[], targetId: string, path: string[] = []): string[] | null => {
    for (const cat of cats) {
      const currentPath = [...path, cat.id];
      if (cat.id === targetId) {
        return currentPath;
      }
      if (cat.children && cat.children.length > 0) {
        const found = findPathToCategory(cat.children, targetId, currentPath);
        if (found) return found;
      }
    }
    return null;
  }, []);


  useEffect(() => {
    if (selectedCategory && categories.length > 0) {
      const path = findPathToCategory(categories, selectedCategory);
      if (path) {
        setExpanded(prev => {
          const newExpanded = { ...prev };
          path.slice(0, -1).forEach(id => {
            newExpanded[id] = true;
          });
          return newExpanded;
        });
      }
    }
  }, [selectedCategory, categories, findPathToCategory]);


  return (
    <div className="space-y-1">
      <button
        onClick={() => onSelect(null)}
        className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
          selectedCategory === null 
            ? 'bg-blue-50 text-blue-700' 
            : 'text-gray-600 hover:bg-gray-50'
        }`}
      >
        Все товары
      </button>
      
      {categories.map((cat) => (
        <CategoryItem
          key={cat.id}
          category={cat}
          selectedCategory={selectedCategory}
          onSelect={onSelect}
          expanded={expanded}
          toggleExpand={toggleExpand}
          level={0}
        />
      ))}
    </div>
  );
};


// --- Основной контент каталога ---
function CatalogContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();


  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showMobileFilters, setShowMobileFilters] = useState(false);


  const currentCategory = searchParams.get('category');
  const searchQuery = searchParams.get('search') || '';
  const currentPage = Number(searchParams.get('page')) || 1;
  const currentSort = searchParams.get('sort') || 'name';
  const currentOrder = searchParams.get('order') || 'asc';


  const [totalPages, setTotalPages] = useState(1);


  const [minPrice, setMinPrice] = useState<string>(() => searchParams.get('minPrice') || '');
  const [maxPrice, setMaxPrice] = useState<string>(() => searchParams.get('maxPrice') || '');
    
  useEffect(() => {
    setMinPrice(searchParams.get('minPrice') || '');
    setMaxPrice(searchParams.get('maxPrice') || '');
  }, [searchParams]);


  useEffect(() => {
    const loadCategories = async () => {
      try {
        const res = await fetch('/api/categories');
        
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        
        const data = await res.json();
        
        if (!Array.isArray(data)) {
          console.error('API вернул не массив:', data);
          setCategories([]);
          return;
        }
        
        const buildTree = (cats: Category[]): Category[] => {
          if (!cats || cats.length === 0) {
            return [];
          }
          
          const map: Record<string, Category> = {};
          const roots: Category[] = [];
          
          cats.forEach(cat => {
            map[cat.id] = { ...cat, children: [] };
          });
          
          cats.forEach(cat => {
            if (cat.parentId && map[cat.parentId]) {
              map[cat.parentId].children!.push(map[cat.id]);
            } else if (!cat.parentId) {
              roots.push(map[cat.id]);
            }
          });
          
          return roots;
        };
        
        setCategories(buildTree(data));
      } catch (error) {
        console.error('Failed to load categories:', error);
        setCategories([]);
      }
    };
    loadCategories();
  }, []);


  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams({
          page: currentPage.toString(),
          limit: '12',
          sortBy: currentSort,
          sortOrder: currentOrder,
        });


        if (currentCategory) params.append('categoryId', currentCategory);
        if (searchQuery) params.append('search', searchQuery);
        
        const minPrice = searchParams.get('minPrice');
        const maxPrice = searchParams.get('maxPrice');
        if (minPrice) params.append('minPrice', minPrice);
        if (maxPrice) params.append('maxPrice', maxPrice);


        const res = await fetch(`/api/products?${params.toString()}`);
        const data = await res.json();
        
        setProducts(data.products);
        setTotalPages(data.pagination?.totalPages || 1);
      } catch (error) {
        console.error('Failed to load products:', error);
      } finally {
        setLoading(false);
      }
    };


    loadProducts();
  }, [currentCategory, searchQuery, currentPage, currentSort, currentOrder, searchParams]);


  const updateUrl = useCallback((params: Record<string, string | null>) => {
    const newParams = new URLSearchParams(searchParams.toString());
    
    Object.entries(params).forEach(([key, value]) => {
      if (value === null) {
        newParams.delete(key);
      } else {
        newParams.set(key, value);
      }
    });


    if (!params.page) {
      newParams.set('page', '1');
    }


    router.push(`${pathname}?${newParams.toString()}`, { scroll: false });
  }, [searchParams, pathname, router]);


// В CatalogContent, найдите и замените эту функцию:
  const handleCategorySelect = (categoryId: string | null) => {
    updateUrl({ category: categoryId, page: '1' });
    
    // Закрываем меню только на мобилке И только если категория выбрана (не просто раскрыта)
    // Проверяем: если категория изменилась - закрываем меню
    if (window.innerWidth < 1024 && categoryId !== currentCategory) {
      // Небольшая задержка чтобы пользователь увидел что категория выбрана
      setTimeout(() => {
        // Проверяем, есть ли у выбранной категории дети
        const findCategory = (cats: Category[], id: string): Category | null => {
          for (const cat of cats) {
            if (cat.id === id) return cat;
            if (cat.children) {
              const found = findCategory(cat.children, id);
              if (found) return found;
            }
          }
          return null;
        };
        
        if (categoryId === null) {
          // "Все товары" - закрываем сразу
          setShowMobileFilters(false);
        } else {
          const selectedCat = findCategory(categories, categoryId);
          // Закрываем только если нет подкатегорий
          if (selectedCat && (!selectedCat.children || selectedCat.children.length === 0)) {
            setShowMobileFilters(false);
          }
        }
      }, 150);
    }
  };



  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const query = formData.get('search') as string;
    updateUrl({ search: query || null, page: '1' });
  };


  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-8">
      <div className="container mx-auto px-4">
        
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Каталог шаров</h1>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Link href="/" className="hover:text-blue-600">Главная</Link>
            <ChevronRight size={16} />
            <span className="text-gray-900">Каталог</span>
          </div>
        </div>


        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* SIDEBAR */}
          <aside className={`
            fixed inset-0 z-50 bg-white lg:bg-transparent 
            lg:relative lg:inset-auto lg:z-0 lg:w-64 lg:block
            transition-transform duration-300 ease-in-out
            ${showMobileFilters ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          `}>
            <div className="h-full overflow-y-auto p-5 lg:p-0 bg-white lg:bg-transparent">
              <div className="flex items-center justify-between mb-6 lg:hidden">
                <h2 className="text-xl font-bold">Фильтры</h2>
                <button onClick={() => setShowMobileFilters(false)}>
                  <X size={24} />
                </button>
              </div>


              <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100 mb-6">
                <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Filter size={18} className="text-blue-600" />
                  Категории
                </h3>
                <CategoryTree 
                  categories={categories} 
                  selectedCategory={currentCategory} 
                  onSelect={handleCategorySelect} 
                />
              </div>


              <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
                <h3 className="font-bold text-gray-900 mb-4">Цена</h3>
                <form 
                  onSubmit={(e) => {
                    e.preventDefault();
                    const params = new URLSearchParams(searchParams.toString());
                    if (minPrice) params.set('minPrice', minPrice);
                    else params.delete('minPrice');
                    if (maxPrice) params.set('maxPrice', maxPrice);
                    else params.delete('maxPrice');
                    params.set('page', '1');
                    router.push(`${pathname}?${params.toString()}`);
                  }}
                >
                  <div className="flex items-center gap-2">
                    <input 
                      type="number" 
                      placeholder="От" 
                      className="w-full border rounded-md p-2 text-sm" 
                      value={minPrice}
                      onChange={(e) => setMinPrice(e.target.value)}
                    />
                    <span className="text-gray-400">-</span>
                    <input 
                      type="number" 
                      placeholder="До" 
                      className="w-full border rounded-md p-2 text-sm" 
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(e.target.value)}
                    />
                  </div>
                  <button
                    type="submit"
                    className="mt-3 w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition text-sm font-medium"
                  >
                    Применить
                  </button>
                </form>
              </div>
            </div>


            {showMobileFilters && (
              <div 
                className="fixed inset-0 bg-black/50 -z-1 lg:hidden" 
                onClick={() => setShowMobileFilters(false)}
              />
            )}
          </aside>


          {/* MAIN CONTENT */}
          <main className="flex-1">
            
            <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100 mb-6 flex flex-col sm:flex-row gap-4 items-center justify-between">
              
              <button 
                className="lg:hidden flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg w-full sm:w-auto"
                onClick={() => setShowMobileFilters(true)}
              >
                <Filter size={20} />
                Фильтры
              </button>


              <form onSubmit={handleSearch} className="relative w-full sm:max-w-md">
                <input 
                  name="search"
                  defaultValue={searchQuery}
                  placeholder="Поиск шаров..." 
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
                <Search className="absolute left-3 top-3 text-gray-400" size={20} />
              </form>


              <div className="flex items-center gap-4 w-full sm:w-auto justify-end">
                <select 
                  value={`${currentSort}-${currentOrder}`}
                  onChange={(e) => {
                    const [sort, order] = e.target.value.split('-');
                    updateUrl({ sort, order });
                  }}
                  className="border-none bg-gray-50 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 focus:ring-0 cursor-pointer hover:bg-gray-100"
                >
                  <option value="name-asc">По названию (А-Я)</option>
                  <option value="name-desc">По названию (Я-А)</option>
                  <option value="price-asc">По цене (дешевле)</option>
                  <option value="price-desc">По цене (дороже)</option>
                </select>


                <div className="flex bg-gray-50 rounded-lg p-1 border border-gray-200">
                  <button 
                    onClick={() => setViewMode('grid')}
                    className={`p-1.5 rounded-md transition-all ${viewMode === 'grid' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
                  >
                    <Grid size={20} />
                  </button>
                  <button 
                    onClick={() => setViewMode('list')}
                    className={`p-1.5 rounded-md transition-all ${viewMode === 'list' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
                  >
                    <List size={20} />
                  </button>
                </div>
              </div>
            </div>


            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="bg-white rounded-xl h-80 animate-pulse shadow-sm border border-gray-100">
                    <div className="h-48 bg-gray-200 rounded-t-xl" />
                    <div className="p-4 space-y-3">
                      <div className="h-4 bg-gray-200 rounded w-3/4" />
                      <div className="h-4 bg-gray-200 rounded w-1/2" />
                      <div className="h-8 bg-gray-200 rounded mt-4" />
                    </div>
                  </div>
                ))}
              </div>
            ) : products.length > 0 ? (
              <div className={viewMode === 'grid' 
                ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" 
                : "flex flex-col gap-4"
              }>
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} viewMode={viewMode} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-white rounded-xl border border-gray-100">
                <div className="bg-blue-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="text-blue-500" size={32} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Товары не найдены</h3>
                <p className="text-gray-500">Попробуйте изменить параметры фильтрации или поиска</p>
                <button 
                  onClick={() => updateUrl({ category: null, search: null, page: '1' })}
                  className="mt-6 text-blue-600 font-medium hover:underline"
                >
                  Сбросить все фильтры
                </button>
              </div>
            )}


            {!loading && totalPages > 1 && (
              <div className="mt-12 flex justify-center gap-2">
                <button
                  disabled={currentPage === 1}
                  onClick={() => updateUrl({ page: String(currentPage - 1) })}
                  className="px-4 py-2 border rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Назад
                </button>
                <span className="px-4 py-2 bg-blue-50 text-blue-600 font-bold rounded-lg border border-blue-100">
                  {currentPage} / {totalPages}
                </span>
                <button
                  disabled={currentPage === totalPages}
                  onClick={() => updateUrl({ page: String(currentPage + 1) })}
                  className="px-4 py-2 border rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Вперед
                </button>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}


export default function CatalogPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Загрузка каталога...</div>}>
      <CatalogContent />
    </Suspense>
  );
}
