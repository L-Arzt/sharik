'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { Star } from 'lucide-react';
import Link from 'next/link';
const products = [
  {
    id: 1,
    name: 'Набор "Гендер-пати"',
    description: 'Элегантная композиция из розовых или голубых шаров в коробке',
    price: 6500,
    oldPrice: 7000,
    rating: 5,
    reviews: 14,
    image: '/images/pic1.jpg',
    category: 'Гендер-пати',
    inStock: true,
    sku: 'BAL-001'
  },
  {
    id: 2,
    name: 'Набор "День рождения"',
    description: 'Яркие разноцветные шары для любого праздника',
    price: 15200,
    oldPrice: 16500,
    rating: 5,
    reviews: 23,
    image: '/images/pic2.jpg',
    category: 'День рождения',
    inStock: true,
    sku: 'BAL-002'
  },
  {
    id: 3,
    name: 'Набор "Детский"',
    description: 'Шары для детского праздника с любимыми персонажами',
    price: 9000,
    oldPrice: 10100,
    rating: 5,
    reviews: 19,
    image: '/images/pic3.jpg',
    category: 'Корпоратив',
    inStock: true,
    sku: 'BAL-003'
  },
  {
    id: 4,
    name: 'Набор "Свадьба"',
    description: 'Эксклюзивная композиция с новой фамилией молодожёнов',
    price: 5500,
    oldPrice: 6500,
    rating: 5,
    reviews: 34,
    image: '/images/pic4.jpg',
    category: 'Премиум',
    inStock: true,
    sku: 'BAL-004'
  }
];

const FeaturedProducts = () => {
  return (
    <section className="py-16 md:py-20 lg:py-24 bg-gradient-to-br from-primary-50 to-secondary-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-8xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12 md:mb-16"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Популярные товары
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">
            Наши самые востребованные композиции из воздушных шаров
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8 lg:gap-10">
          {products.map((product, index) => (
            <motion.article
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -8 }}
              className="bg-white rounded-2xl shadow-lg overflow-hidden group hover:shadow-xl transition-shadow duration-300"
              itemScope
              itemType="https://schema.org/Product"
            >
              {/* Product Image */}
              <div className="relative h-48 sm:h-56 lg:h-64 bg-gradient-to-br from-primary-100 to-secondary-100 overflow-hidden">
                <Image
                  src={product.image}
                  alt={`${product.name} - Воздушные шары в Ростове-на-Дону и Аксае с доставкой`}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-110"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                    -{Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)}%
                  </span>
                </div>
              </div>

              {/* Product Info */}
              <div className="p-4 sm:p-6">
                <meta itemProp="sku" content={product.sku} />
                <meta itemProp="category" content={product.category} />
                
                <h3 
                  className="text-lg sm:text-xl font-bold text-gray-800 mb-2 group-hover:text-primary-600 transition-colors duration-300"
                  itemProp="name"
                >
                  {product.name}
                </h3>
                
                <p 
                  className="text-gray-600 mb-4 text-sm leading-relaxed"
                  itemProp="description"
                >
                  {product.description}
                </p>

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

                {/* Aggregate Rating */}
                <div itemProp="aggregateRating" itemScope itemType="https://schema.org/AggregateRating" className="hidden">
                  <meta itemProp="ratingValue" content={product.rating.toString()} />
                  <meta itemProp="reviewCount" content={product.reviews.toString()} />
                  <meta itemProp="bestRating" content="5" />
                  <meta itemProp="worstRating" content="1" />
                </div>

                {/* Review */}
                <div itemProp="review" itemScope itemType="https://schema.org/Review" className="hidden">
                  <div itemProp="itemReviewed" itemScope itemType="https://schema.org/Product">
                    <meta itemProp="name" content={product.name} />
                  </div>
                  <div itemProp="reviewRating" itemScope itemType="https://schema.org/Rating">
                    <meta itemProp="ratingValue" content={product.rating.toString()} />
                    <meta itemProp="bestRating" content="5" />
                    <meta itemProp="worstRating" content="1" />
                  </div>
                  <div itemProp="author" itemScope itemType="https://schema.org/Person">
                    <meta itemProp="name" content="Клиент" />
                  </div>
                </div>

                {/* Price */}
                <div className="flex items-center justify-between">
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
                      <meta itemProp="priceValidUntil" content={new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]} />
                      {product.price.toLocaleString()} ₽
                    </span>
                    <span className="text-gray-400 line-through ml-2">
                      {product.oldPrice.toLocaleString()} ₽
                    </span>
                  </div>
                </div>
              </div>
            </motion.article>
          ))}
        </div>

        {/* Show More Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <Link href="/catalog">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex bg-gradient-to-r from-pink-500 to-purple-600 text-white px-8 py-4 rounded-full font-semibold text-lg hover:shadow-lg transition-shadow"
            >
              Смотреть все товары
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturedProducts; 