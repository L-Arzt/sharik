'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { ShoppingCart, Star, Truck, Shield, MessageCircle, InstagramIcon } from 'lucide-react';
import Link from 'next/link';
const Hero = () => {
  const scrollToContact = () => {
    const contactSection = document.getElementById('contact-section');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="main-section" className="relative min-h-screen flex items-center justify-center overflow-hidden px-4 sm:px-6 lg:px-8">
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-50 via-blue-50 to-secondary-50">
        <motion.div
          className="absolute top-20 left-20 w-24 sm:w-32 h-24 sm:h-32 bg-primary-300 rounded-full opacity-20 animate-float"
        />
        <motion.div
          className="absolute bottom-32 left-1/4 w-16 sm:w-20 h-16 sm:h-20 bg-secondary-300 rounded-full opacity-20 animate-float"
          style={{ animationDelay: '2s' }}
        />
      </div>

      <div className="container mx-auto relative z-10 max-w-8xl">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          {/* Left content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center lg:text-left"
          >
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-gray-800 mb-6 leading-tight"
            >
              Воздушные шары <br />в{' '}
              <span className="bg-gradient-to-r from-pink-500 to-purple-600 from-primary-500 to-secondary-600 bg-clip-text text-transparent animate-gradient">
                Ростове-на-Дону и Аксае
              </span>

            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-lg sm:text-xl lg:text-2xl text-gray-600 mb-8 max-w-2xl mx-auto lg:mx-0 leading-relaxed"
            >
              Качественные воздушные шары для любого праздника!
              Доставка по всему городу 24/7.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex justify-center lg:justify-start mb-12"
            >
              <Link href="/catalog">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex flex-row items-center gap-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white px-12 py-4 rounded-full font-semibold text-lg hover:shadow-lg transition-shadow"
                >
                  <ShoppingCart className="w-5 h-5" />
                  Заказать шары
                </motion.button>
              </Link>
            </motion.div>


            {/* Social Media Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="flex flex-wrap gap-3 justify-center lg:justify-start"
            >
              <motion.a
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                href="https://t.me/cloudless_sky"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:shadow-lg transition-shadow"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Telegram</span>
              </motion.a>
              <motion.a
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                href="https://api.whatsapp.com/send?phone=79951351323"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-gradient-to-r from-green-600 to-green-700 text-white px-4 py-2 rounded-lg font-semibold hover:shadow-lg transition-shadow"
              >
                <span className="font-bold">WA</span>
                <span>WhatsApp</span>
              </motion.a>
              <motion.a
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                href="https://vk.com/cloudlessly_sky"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-2 rounded-lg font-semibold hover:shadow-lg transition-shadow"
              >
                <span className="font-bold">VK</span>
                <span>ВКонтакте</span>
              </motion.a>
              <motion.a
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                href="https://www.instagram.com/cloudlessly_sky"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white px-4 py-2 rounded-lg font-semibold hover:shadow-lg transition-shadow"
              >
                <InstagramIcon className="w-4 h-4" />
                <span>Instagram</span>
              </motion.a>


            </motion.div>

          </motion.div>

          {/* Right content - Balloon showcase */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative"
          >
            <div className="relative w-full h-96 lg:h-[500px]">
              {/* Floating balloons with strings */}
              <div className="absolute top-10 left-10">
                <motion.div
                  className="w-24 h-32 bg-gradient-to-b from-red-400 to-red-600 rounded-full relative z-10"
                  animate={{
                    y: [0, -20, 0],
                    rotate: [0, 5, 0],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
                {/* String attached to center bottom - positioned behind balloon */}
                <div className="absolute left-1/2 -bottom-9 w-0.5 h-20 bg-gray-400 transform -translate-x-1/2 z-0" />
              </div>

              <div className="absolute top-20 right-20">
                <motion.div
                  className="w-20 h-28 bg-gradient-to-b from-blue-400 to-blue-600 rounded-full relative z-10"
                  animate={{
                    y: [0, 15, 0],
                    rotate: [0, -5, 0],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 1
                  }}
                />
                {/* String attached to center bottom - positioned behind balloon */}
                <div className="absolute left-1/2 -bottom-9 w-0.5 h-16 bg-gray-400 transform -translate-x-1/2 z-0" />
              </div>

              <div className="absolute bottom-20 left-1/3">
                <motion.div
                  className="w-28 h-36 bg-gradient-to-b from-purple-400 to-purple-600 rounded-full relative z-10"
                  animate={{
                    y: [0, -10, 0],
                    rotate: [0, 3, 0],
                  }}
                  transition={{
                    duration: 3.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 2
                  }}
                />
                {/* String attached to center bottom - positioned behind balloon */}
                <div className="absolute left-1/2 -bottom-9 w-0.5 h-24 bg-gray-400 transform -translate-x-1/2 z-0" />
              </div>

              <div className="absolute bottom-10 right-1/3">
                <motion.div
                  className="w-16 h-24 bg-gradient-to-b from-pink-400 to-pink-600 rounded-full relative z-10"
                  animate={{
                    y: [0, 25, 0],
                    rotate: [0, -3, 0],
                  }}
                  transition={{
                    duration: 2.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 0.5
                  }}
                />
                {/* String attached to center bottom - positioned behind balloon */}
                <div className="absolute left-1/2 -bottom-9 w-0.5 h-12 bg-gray-400 transform -translate-x-1/2 z-0" />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero; 