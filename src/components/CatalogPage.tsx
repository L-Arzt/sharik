'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, Grid, List, Star, ShoppingCart, Heart } from 'lucide-react';

const products = [
  {
    id: 1,
    name: 'Букет "Розовая мечта"',
    description: 'Элегантная композиция из розовых и белых шаров',
    price: 2500,
    oldPrice: 3000,
    rating: 4.8,
    reviews: 127,
    category: 'Свадьба',
    colors: ['Розовый', 'Белый'],
    inStock: true,
    sku: 'BAL-001'
  },
  {
    id: 2,
    name: 'Набор "День рождения"',
    description: 'Яркие разноцветные шары для детского праздника',
    price: 1800,
    oldPrice: 2200,
    rating: 4.9,
    reviews: 89,
    category: 'День рождения',
    colors: ['Красный', 'Синий', 'Желтый'],
    inStock: true,
    sku: 'BAL-002'
  },
  {
    id: 3,
    name: 'Композиция "Корпоратив"',
    description: 'Профессиональные шары для бизнес-мероприятий',
    price: 3200,
    oldPrice: 3800,
    rating: 4.7,
    reviews: 56,
    category: 'Корпоратив',
    colors: ['Синий', 'Белый'],
    inStock: true,
    sku: 'BAL-003'
  },
  {
    id: 4,
    name: 'Букет "Премиум"',
    description: 'Эксклюзивная композиция с золотыми элементами',
    price: 4500,
    oldPrice: 5200,
    rating: 5.0,
    reviews: 34,
    category: 'Премиум',
    colors: ['Золотой', 'Белый'],
    inStock: true,
    sku: 'BAL-004'
  },
  {
    id: 5,
    name: 'Набор "Детский праздник"',
    description: 'Веселые шары для детских мероприятий',
    price: 1500,
    oldPrice: 1800,
    rating: 4.6,
    reviews: 78,
    category: 'День рождения',
    colors: ['Радужный'],
    inStock: true,
    sku: 'BAL-005'
  },
  {
    id: 6,
    name: 'Композиция "Романтик"',
    description: 'Романтичные шары для свиданий',
    price: 2800,
    oldPrice: 3200,
    rating: 4.9,
    reviews: 45,
    category: 'Свадьба',
    colors: ['Красный', 'Розовый'],
    inStock: true,
    sku: 'BAL-006'
  }
];

const categories = ['Все', 'День рождения', 'Свадьба', 'Корпоратив', 'Праздники', 'Подарки', 'Премиум'];
const colors = ['Все', 'Красный', 'Розовый', 'Синий', 'Белый', 'Золотой', 'Желтый', 'Радужный'];

const CatalogPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Все');
  const [selectedColor, setSelectedColor] = useState('Все');
  const [priceRange, setPriceRange] = useState([0, 5000]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('popular');

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'Все' || product.category === selectedCategory;
    const matchesColor = selectedColor === 'Все' || product.colors.includes(selectedColor);
    const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];
    
    return matchesSearch && matchesCategory && matchesColor && matchesPrice;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'rating':
        return b.rating - a.rating;
      case 'popular':
      default:
        return b.reviews - a.reviews;
    }
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-blue-50 to-purple-50 pt-16">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Каталог воздушных шаров
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Найдите идеальные шары для вашего праздника
          </p>
        </motion.div>

        {/* Filters and Search */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Поиск товаров..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>

            {/* Color Filter */}
            <select
              value={selectedColor}
              onChange={(e) => setSelectedColor(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              {colors.map(color => (
                <option key={color} value={color}>{color}</option>
              ))}
            </select>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="popular">По популярности</option>
              <option value="price-low">По цене (возрастание)</option>
              <option value="price-high">По цене (убывание)</option>
              <option value="rating">По рейтингу</option>
            </select>
          </div>

          {/* Price Range */}
          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Цена: {priceRange[0]}₽ - {priceRange[1]}₽
            </label>
            <input
              type="range"
              min="0"
              max="5000"
              step="100"
              value={priceRange[1]}
              onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
            />
          </div>

          {/* View Mode */}
          <div className="mt-6 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Вид:</span>
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-purple-100 text-purple-600' : 'text-gray-400'}`}
              >
                <Grid className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-purple-100 text-purple-600' : 'text-gray-400'}`}
              >
                <List className="w-5 h-5" />
              </button>
            </div>
            <span className="text-sm text-gray-600">
              Найдено: {sortedProducts.length} товаров
            </span>
          </div>
        </div>

        {/* Products Grid */}
        <div className={`grid gap-6 ${
          viewMode === 'grid' 
            ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
            : 'grid-cols-1'
        }`}>
          {sortedProducts.map((product, index) => (
            <motion.article
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className={`bg-white rounded-2xl shadow-lg overflow-hidden ${
                viewMode === 'list' ? 'flex' : ''
              }`}
              itemScope
              itemType="https://schema.org/Product"
            >
              {/* Product Image */}
              <div className={`relative bg-gradient-to-br from-pink-100 to-purple-100 overflow-hidden ${
                viewMode === 'list' ? 'w-48 h-48' : 'h-64'
              }`}>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-32 h-40 bg-gradient-to-b from-pink-400 to-purple-600 rounded-full opacity-80" />
                </div>
                <div className="absolute top-4 right-4">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md hover:shadow-lg transition-shadow"
                  >
                    <Heart className="w-5 h-5 text-gray-600" />
                  </motion.button>
                </div>
                <div className="absolute top-4 left-4">
                  <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                    -{Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)}%
                  </span>
                </div>
              </div>

              {/* Product Info */}
              <div className={`p-6 ${viewMode === 'list' ? 'flex-1' : ''}`}>
                <meta itemProp="sku" content={product.sku} />
                <meta itemProp="category" content={product.category} />
                
                <h3 
                  className="text-xl font-bold text-gray-800 mb-2 group-hover:text-purple-600 transition-colors"
                  itemProp="name"
                >
                  {product.name}
                </h3>
                
                <p 
                  className="text-gray-600 mb-4 text-sm"
                  itemProp="description"
                >
                  {product.description}
                </p>

                {/* Colors */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {product.colors.map(color => (
                    <span key={color} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                      {color}
                    </span>
                  ))}
                </div>

                {/* Rating */}
                <div className="flex items-center mb-4">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < Math.floor(product.rating)
                            ? 'text-yellow-400 fill-current'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="ml-2 text-sm text-gray-600">
                    {product.rating} ({product.reviews})
                  </span>
                </div>

                {/* Price */}
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <span 
                      className="text-2xl font-bold text-gray-800"
                      itemProp="offers"
                      itemScope
                      itemType="https://schema.org/Offer"
                    >
                      <meta itemProp="priceCurrency" content="RUB" />
                      <meta itemProp="price" content={product.price.toString()} />
                      <meta itemProp="availability" content={product.inStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock"} />
                      {product.price.toLocaleString()} ₽
                    </span>
                    <span className="text-gray-400 line-through ml-2">
                      {product.oldPrice.toLocaleString()} ₽
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex-1 bg-gradient-to-r from-pink-500 to-purple-600 text-white py-3 rounded-lg font-semibold flex items-center justify-center gap-2 hover:shadow-lg transition-shadow"
                  >
                    <ShoppingCart className="w-5 h-5" />
                    В корзину
                  </motion.button>
                </div>
              </div>
            </motion.article>
          ))}
        </div>

        {/* No Results */}
        {sortedProducts.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="text-6xl mb-4">🎈</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">
              Товары не найдены
            </h3>
            <p className="text-gray-600">
              Попробуйте изменить параметры поиска или фильтры
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default CatalogPage; 