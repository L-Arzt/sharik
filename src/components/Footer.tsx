'use client';

import { motion } from 'framer-motion';
import { Phone, Mail, MapPin, Clock, Heart, ShoppingCart, Star, Truck, Shield } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white" itemScope itemType="https://schema.org/Organization">
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold bg-gradient-to-r from-pink-400 to-purple-500 bg-clip-text text-transparent">
              ШарикиРостов.рф
            </h3>
                                    <p className="text-gray-300 leading-relaxed">
                          Качественные воздушные шары в Ростове-на-Дону! 
                          Доставка по всему городу от 4000₽. Самовывоз в центре.
                        </p>
            
            <div className="flex space-x-4">
              <motion.a
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                href="#"
                className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white hover:shadow-lg transition-shadow"
              >
                <span className="font-bold text-sm">VK</span>
              </motion.a>
              
              <motion.a
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                href="#"
                className="w-10 h-10 bg-gradient-to-r from-pink-500 to-pink-600 rounded-full flex items-center justify-center text-white hover:shadow-lg transition-shadow"
              >
                <span className="font-bold text-sm">TG</span>
              </motion.a>
              
              <motion.a
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                href="#"
                className="w-10 h-10 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center text-white hover:shadow-lg transition-shadow"
              >
                <span className="font-bold text-sm">WA</span>
              </motion.a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Быстрые ссылки</h4>
            <ul className="space-y-2">
              <li>
                <a href="/about" className="text-gray-300 hover:text-white transition-colors">
                  О компании
                </a>
              </li>
              <li>
                <a href="/contact" className="text-gray-300 hover:text-white transition-colors">
                  Контакты
                </a>
              </li>
              <li>
                <a href="/about" className="text-gray-300 hover:text-white transition-colors">
                  О компании
                </a>
              </li>
              <li>
                <a href="/delivery" className="text-gray-300 hover:text-white transition-colors">
                  Доставка и оплата
                </a>
              </li>
              <li>
                <a href="/contact" className="text-gray-300 hover:text-white transition-colors">
                  Контакты
                </a>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Категории</h4>
            <ul className="space-y-2">
              <li>
                <a href="/category/birthday" className="text-gray-300 hover:text-white transition-colors">
                  День рождения
                </a>
              </li>
              <li>
                <a href="/category/wedding" className="text-gray-300 hover:text-white transition-colors">
                  Свадьба
                </a>
              </li>
              <li>
                <a href="/category/corporate" className="text-gray-300 hover:text-white transition-colors">
                  Корпоратив
                </a>
              </li>
              <li>
                <a href="/category/holidays" className="text-gray-300 hover:text-white transition-colors">
                  Праздники
                </a>
              </li>
              <li>
                <a href="/category/gifts" className="text-gray-300 hover:text-white transition-colors">
                  Подарки
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Контакты</h4>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-purple-400 mt-0.5" />
                <div>
                  <p className="text-gray-300">+7 (999) 123-45-67</p>
                  <p className="text-gray-300">+7 (800) 555-35-35</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-purple-400 mt-0.5" />
                <div>
                  <p className="text-gray-300">info@sharik-sharik.ru</p>
                  <p className="text-gray-300">support@sharik-sharik.ru</p>
                </div>
              </div>
              
                                                       <div className="flex items-start gap-3">
                            <MapPin className="w-5 h-5 text-purple-400 mt-0.5" />
                            <div>
                              <p className="text-gray-300">г. Ростов-на-Дону</p>
                              <p className="text-gray-300">ТЦ "Центральный", 2 этаж</p>
                              <p className="text-gray-300">Доставка по всему городу от 4000₽</p>
                            </div>
                          </div>
              
              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-purple-400 mt-0.5" />
                <div>
                  <p className="text-gray-300">Пн-Пт: 9:00 - 20:00</p>
                  <p className="text-gray-300">Сб-Вс: 10:00 - 18:00</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12 pt-8 border-t border-gray-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center">
              <Star className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="font-semibold">Высокое качество</p>
              <p className="text-sm text-gray-400">Гарантия на все товары</p>
            </div>
          </div>
          
                       <div className="flex items-center gap-3">
               <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                 <Truck className="w-5 h-5 text-white" />
               </div>
                                       <div>
                          <p className="font-semibold">Доставка</p>
                          <p className="text-sm text-gray-400">По всему городу от 4000₽</p>
                        </div>
             </div>
          
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-teal-600 rounded-full flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="font-semibold">Безопасная оплата</p>
              <p className="text-sm text-gray-400">Защищенные платежи</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-full flex items-center justify-center">
              <Heart className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="font-semibold">24/7 поддержка</p>
              <p className="text-sm text-gray-400">Всегда на связи</p>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-8 border-t border-gray-700 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-400 text-sm">
            © {currentYear} ШарикиРостов.рф. Все права защищены.
          </p>
          
          <div className="flex space-x-6 text-sm">
            <a href="/privacy" className="text-gray-400 hover:text-white transition-colors">
              Политика конфиденциальности
            </a>
            <a href="/terms" className="text-gray-400 hover:text-white transition-colors">
              Условия использования
            </a>
            <a href="/sitemap" className="text-gray-400 hover:text-white transition-colors">
              Карта сайта
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 