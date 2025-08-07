'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Phone } from 'lucide-react';
import Link from 'next/link'; // Добавлен импорт Link

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };

  const navigation = [
    { name: 'Главная', action: () => scrollToSection('main-section') },
    { name: 'Категории', action: () => scrollToSection('categories') },
    { name: 'Контакты', action: () => scrollToSection('contact-section') },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center"
          >
            <Link 
              href="/" 
              className="text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent hover:from-blue-700 hover:to-purple-700 transition-all duration-300"
              aria-label="ШарикиРостов.рф - Главная страница"
            >
              ШарикиРостов.рф
            </Link>
          </motion.div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6 lg:space-x-8" role="navigation" aria-label="Главное меню">
            {navigation.map((item, index) => (
              <motion.button
                key={item.name}
                onClick={item.action}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200 text-sm lg:text-base px-3 py-2 rounded-lg hover:bg-blue-50"
                aria-label={`Перейти к разделу ${item.name}`}
              >
                {item.name}
              </motion.button>
            ))}
          </nav>

          {/* Desktop Actions */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="hidden md:flex items-center space-x-3 lg:space-x-4"
          >
            <motion.a
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              href="tel:+79951351323"
              className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-2.5 lg:px-6 lg:py-3 rounded-full font-semibold flex items-center gap-2 hover:shadow-lg transition-all duration-200 text-sm lg:text-base hover:scale-105"
              aria-label="Позвонить по телефону +7 (995) 135-13-23"
            >
              <Phone className="w-4 h-4" />
              <span className="hidden sm:inline">+7 (995) 135-13-23</span>
              <span className="sm:hidden">Позвонить</span>
            </motion.a>
          </motion.div>

          {/* Mobile menu button */}
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-gray-600 hover:text-blue-600 transition-colors"
            aria-label={isMenuOpen ? "Закрыть меню" : "Открыть меню"}
            aria-expanded={isMenuOpen}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </motion.button>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden border-t border-gray-200"
              role="navigation"
              aria-label="Мобильное меню"
            >
              <nav className="py-4 space-y-4">
                {navigation.map((item) => (
                  <button
                    key={item.name}
                    onClick={item.action}
                    className="block w-full text-left text-gray-700 hover:text-blue-600 font-medium transition-colors px-4 py-2 rounded-lg hover:bg-blue-50"
                    aria-label={`Перейти к разделу ${item.name}`}
                  >
                    {item.name}
                  </button>
                ))}
                
                <div className="pt-4 border-t border-gray-200">
                  <a
                    href="tel:+79951351323"
                    className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-full font-semibold flex items-center justify-center gap-2 hover:shadow-lg transition-all duration-200"
                    aria-label="Позвонить по телефону +7 (995) 135-13-23"
                  >
                    <Phone className="w-4 h-4" />
                    Позвонить
                  </a>
                </div>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
};

export default Header;