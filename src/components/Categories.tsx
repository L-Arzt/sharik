'use client';

import { motion } from 'framer-motion';
import { Heart, Gift, Calendar, Sparkles, Package, Shapes, CircleDot, RectangleCircle, Users } from 'lucide-react';
import { useState, useEffect } from 'react';
import Link from 'next/link';

// Цвета для разных категорий
const colorSchemes = [
  { color: 'from-pink-400 to-red-500', bgColor: 'bg-pink-50', icon: Heart },
  { color: 'from-purple-400 to-pink-500', bgColor: 'bg-purple-50', icon: Sparkles },
  { color: 'from-blue-400 to-indigo-500', bgColor: 'bg-blue-50', icon: Users },
  { color: 'from-green-400 to-teal-500', bgColor: 'bg-green-50', icon: Calendar },
  { color: 'from-yellow-400 to-orange-500', bgColor: 'bg-yellow-50', icon: Gift },
  { color: 'from-indigo-400 to-purple-500', bgColor: 'bg-indigo-50', icon: RectangleCircle },
  { color: 'from-red-400 to-pink-500', bgColor: 'bg-red-50', icon: Package },
  { color: 'from-teal-400 to-green-500', bgColor: 'bg-teal-50', icon: Shapes },
  { color: 'from-orange-400 to-red-500', bgColor: 'bg-orange-50', icon: CircleDot },
];

interface Category {
  id: string;
  name: string;
  slug: string;
  color: string;
  bgColor: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}

interface FetchedCategory {
  id: string;
  name: string;
  slug: string;
  parentId?: string | null;
}

const Categories = () => {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const res = await fetch('/api/categories');
        const data = await res.json();
        
        // Берем только категории верхнего уровня
        const topLevel = data
          .filter((cat: FetchedCategory) => !cat.parentId)
          .slice(0, 6)
          .map((cat: FetchedCategory, index: number) => ({
            id: cat.id,
            name: cat.name,
            slug: cat.slug,
            ...colorSchemes[index % colorSchemes.length]
          }));
          
          setCategories(topLevel);
      } catch (error) {
        console.error('Failed to load categories:', error);
      }
    };
    loadCategories();
  }, []);

  return (
    <section id="categories" className="py-16 md:py-20 lg:py-24 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12 md:mb-16 lg:mb-20"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Категории шаров
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">
            Выберите подходящую категорию для вашего праздника в Ростове-на-Дону
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 lg:gap-10">
          {categories.map((category, index) => (
            <Link key={category.id} href={`/catalog?category=${category.id}`}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -8, scale: 1.02 }}
                className={`${category.bgColor} rounded-2xl p-6 sm:p-8 cursor-pointer transition-all duration-300 hover:shadow-xl hover:shadow-gray-200/50`}
              >
                <div className={`w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-r ${category.color} rounded-full flex items-center justify-center mb-6 mx-auto shadow-lg`}>
                  <category.icon className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
                </div>
                
                <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3 text-center">
                  {category.name}
                </h3>
                
                <p className="text-gray-600 text-center mb-6 text-sm sm:text-base leading-relaxed">
                  Широкий выбор шаров для любого случая
                </p>
                
                <div className="text-center">
                  <span className="inline-block bg-white px-4 py-2 rounded-full text-sm font-medium text-gray-700 shadow-md hover:shadow-lg transition-shadow duration-300">
                    Смотреть товары
                  </span>
                </div>
              </motion.div>
            </Link>
          ))}
        </div>

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
              Смотреть все категории
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default Categories;
