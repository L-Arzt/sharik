'use client';

import { motion } from 'framer-motion';
import { Heart, Gift, Users, Calendar, Star, Sparkles, Baby } from 'lucide-react';

const categories = [
  {
    id: 1,
    name: 'День рождения',
    description: 'Яркие шары для незабываемого праздника',
    icon: Heart,
    color: 'from-pink-400 to-red-500',
    bgColor: 'bg-pink-50',
    count: '50+ вариантов'
  },
  {
    id: 2,
    name: 'Свадьба',
    description: 'Элегантные композиции для особенного дня',
    icon: Sparkles,
    color: 'from-purple-400 to-pink-500',
    bgColor: 'bg-purple-50',
    count: '30+ вариантов'
  },
  {
    id: 3,
    name: 'Корпоратив',
    description: 'Профессиональные решения для бизнеса',
    icon: Users,
    color: 'from-blue-400 to-indigo-500',
    bgColor: 'bg-blue-50',
    count: '25+ вариантов'
  },
  {
    id: 4,
    name: 'Праздники',
    description: 'Тематические шары для всех праздников',
    icon: Calendar,
    color: 'from-green-400 to-teal-500',
    bgColor: 'bg-green-50',
    count: '40+ вариантов'
  },
  {
    id: 5,
    name: 'Подарки',
    description: 'Красивые букеты из воздушных шаров',
    icon: Gift,
    color: 'from-yellow-400 to-orange-500',
    bgColor: 'bg-yellow-50',
    count: '35+ вариантов'
  },
  {
    id: 6,
    name: 'Гендер-пати',
    description: 'Эксклюзивные дизайнерские решения',
    icon: Baby,
    color: 'from-indigo-400 to-purple-500',
    bgColor: 'bg-indigo-50',
    count: '20+ вариантов'
  }
];

const Categories = () => {
  return (
    <section id="main-section" className="py-16 md:py-20 lg:py-24 bg-white">
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
            <motion.div
              key={category.id}
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
                  {category.description}
                </p>
              
              <div className="text-center">
                <span className="inline-block bg-white px-4 py-2 rounded-full text-sm font-medium text-gray-700 shadow-md hover:shadow-lg transition-shadow duration-300">
                  {category.count}
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <motion.a
            href="https://t.me/cloudless_sky"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex bg-gradient-to-r from-pink-500 to-purple-600 text-white px-8 py-4 rounded-full font-semibold text-lg hover:shadow-lg transition-shadow"
          >
            Смотреть все категории
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
};

export default Categories; 