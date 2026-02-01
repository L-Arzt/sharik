'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Phone, ShoppingCart, Heart } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getCartCount, getFavoritesCount } from '@/lib/cart';
import Image from 'next/image';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [favoritesCount, setFavoritesCount] = useState(0);
  const router = useRouter();

  useEffect(() => {
    setCartCount(getCartCount());
    setFavoritesCount(getFavoritesCount());

    const handleCartUpdate = () => setCartCount(getCartCount());
    const handleFavoritesUpdate = () => setFavoritesCount(getFavoritesCount());

    window.addEventListener('cartUpdated', handleCartUpdate);
    window.addEventListener('favoritesUpdated', handleFavoritesUpdate);

    return () => {
      window.removeEventListener('cartUpdated', handleCartUpdate);
      window.removeEventListener('favoritesUpdated', handleFavoritesUpdate);
    };
  }, []);

  const scrollToSection = (sectionId: string) => {
    if (window.location.pathname !== '/') {
      router.push(`/#${sectionId}`);
    } else {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
    setIsMenuOpen(false);
  };

  const navigation = [
    { name: 'Главная', action: () => scrollToSection('main-section'), href: '/' },
    { name: 'Каталог', action: undefined, href: '/catalog' },
    { name: 'Контакты', action: () => scrollToSection('contact-section'), href: undefined },
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
              className="flex items-center gap-3 hover:opacity-80 transition-opacity duration-300"
              aria-label="Шары в Сердце - Главная страница"
            >
              <div className="relative w-12 h-12 lg:w-14 lg:h-14">
                <Image
                  src="/images/logo.jpg"
                  alt="Логотип"
                  fill
                  sizes="(max-width: 1024px) 48px, 56px"
                  className="object-contain"
                />
              </div>
              
              <div className="flex flex-col">
                <span className="text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Шары в Сердце
                </span>
                <span className="text-xs text-gray-500 hidden sm:block">
                  Ростов-на-Дону | Аксай
                </span>
              </div>
            </Link>
          </motion.div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6 lg:space-x-8" role="navigation" aria-label="Главное меню">
            {navigation.map((item, index) => (
              item.href ? (
                <Link key={item.name} href={item.href}>
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200 text-sm lg:text-base px-3 py-2 rounded-lg hover:bg-blue-50 cursor-pointer"
                    aria-label={`Перейти к разделу ${item.name}`}
                  >
                    {item.name}
                  </motion.div>
                </Link>
              ) : (
                <motion.button
                  key={item.name}
                  onClick={item.action}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200 text-sm lg:text-base px-3 py-2 rounded-lg hover:bg-blue-50 outline-none focus:outline-none"
                  aria-label={`Перейти к разделу ${item.name}`}
                >
                  {item.name}
                </motion.button>
              )
            ))}
          </nav>

          {/* Desktop Actions */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="hidden md:flex items-center space-x-3 lg:space-x-4"
          >
            {/* Избранное */}
            <Link href="/favorites">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="relative p-2 text-gray-600 hover:text-red-500 transition-colors cursor-pointer"
                aria-label="Избранное"
              >
                <Heart className="w-6 h-6" />
                {favoritesCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {favoritesCount}
                  </span>
                )}
              </motion.div>
            </Link>

            {/* Корзина */}
            <Link href="/cart">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="relative p-2 text-gray-600 hover:text-blue-600 transition-colors cursor-pointer"
                aria-label="Корзина"
              >
                <ShoppingCart className="w-6 h-6" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </motion.div>
            </Link>

            {/* Телефон */}
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


        {/* Mobile: только Телефон + Бургер */}
          <div className="md:hidden flex items-center gap-2">
            {/* Кнопка звонка */}
            <motion.a
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              href="tel:+79951351323"
              className="bg-gradient-to-r from-pink-500 to-purple-600 text-white p-2.5 rounded-full shadow-md hover:shadow-lg transition-all duration-200"
              aria-label="Позвонить"
            >
              <Phone className="w-4 h-4" />
            </motion.a>

            {/* Mobile menu button */}
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 text-gray-600 hover:text-blue-600 transition-colors relative"
              aria-label={isMenuOpen ? "Закрыть меню" : "Открыть меню"}
              aria-expanded={isMenuOpen}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              {/* Индикатор непрочитанных */}
              {(cartCount > 0 || favoritesCount > 0) && !isMenuOpen && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              )}
            </motion.button>
          </div>

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
              <nav className="py-4 space-y-2">
                {/* Корзина и Избранное в верху меню */}
                <div className="grid grid-cols-2 gap-3 px-4 pb-4 border-b border-gray-200">
                  <Link
                    href="/cart"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center justify-center gap-2 bg-blue-50 text-blue-700 px-4 py-3 rounded-xl font-semibold hover:bg-blue-100 transition-colors relative"
                  >
                    <ShoppingCart className="w-5 h-5" />
                    <span>Корзина</span>
                    {cartCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                        {cartCount}
                      </span>
                    )}
                  </Link>

                  <Link
                    href="/favorites"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center justify-center gap-2 bg-red-50 text-red-700 px-4 py-3 rounded-xl font-semibold hover:bg-red-100 transition-colors relative"
                  >
                    <Heart className="w-5 h-5" />
                    <span>Избранное</span>
                    {favoritesCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                        {favoritesCount}
                      </span>
                    )}
                  </Link>
                </div>

                {/* Навигационные ссылки */}
                {navigation.map((item) => (
                  item.href ? (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => setIsMenuOpen(false)}
                      className="block w-full text-left text-gray-700 hover:text-blue-600 font-medium transition-colors px-4 py-3 rounded-lg hover:bg-blue-50"
                      aria-label={`Перейти к разделу ${item.name}`}
                    >
                      {item.name}
                    </Link>
                  ) : (
                    <button
                      key={item.name}
                      onClick={item.action}
                      className="block w-full text-left text-gray-700 hover:text-blue-600 font-medium transition-colors px-4 py-3 rounded-lg hover:bg-blue-50 outline-none focus:outline-none"
                      aria-label={`Перейти к разделу ${item.name}`}
                    >
                      {item.name}
                    </button>
                  )
                ))}
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
};

export default Header;
