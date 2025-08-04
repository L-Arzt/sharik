'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { ShoppingCart, Star, Truck, Shield } from 'lucide-react';

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden px-4 sm:px-6 lg:px-8">
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-50 via-blue-50 to-secondary-50">
        <motion.div
          className="absolute top-20 left-20 w-24 sm:w-32 h-24 sm:h-32 bg-primary-300 rounded-full opacity-20 animate-float"
        />
        <motion.div
          className="absolute top-40 right-20 sm:right-32 w-16 sm:w-24 h-16 sm:h-24 bg-blue-300 rounded-full opacity-20 animate-float"
          style={{ animationDelay: '1s' }}
        />
        <motion.div
          className="absolute bottom-32 left-1/4 w-16 sm:w-20 h-16 sm:h-20 bg-secondary-300 rounded-full opacity-20 animate-float"
          style={{ animationDelay: '2s' }}
        />
      </div>

      <div className="container mx-auto relative z-10 max-w-7xl">
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
               Воздушные шары в{' '}
               <span className="bg-gradient-to-r from-primary-500 to-secondary-600 bg-clip-text text-transparent animate-gradient">
                 Ростове-на-Дону
               </span>
             </motion.h1>
             
             <motion.p
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ duration: 0.8, delay: 0.4 }}
               className="text-lg sm:text-xl lg:text-2xl text-gray-600 mb-8 max-w-2xl mx-auto lg:mx-0 leading-relaxed"
             >
               Качественные воздушные шары для любого праздника! 
               Доставка по всему городу от 4000₽. Самовывоз в центре.
             </motion.p>

             <motion.div
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ duration: 0.8, delay: 0.6 }}
               className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-12"
             >
               <motion.button
                 whileHover={{ scale: 1.05 }}
                 whileTap={{ scale: 0.95 }}
                 className="bg-gradient-to-r from-primary-500 to-secondary-600 text-white px-6 py-4 sm:px-8 sm:py-4 rounded-full font-semibold text-base sm:text-lg flex items-center justify-center gap-2 hover:shadow-xl transition-all duration-300 hover:scale-105"
               >
                 Заказать шары
               </motion.button>
               
               <motion.button
                 whileHover={{ scale: 1.05 }}
                 whileTap={{ scale: 0.95 }}
                 className="border-2 border-secondary-500 text-secondary-600 px-6 py-4 sm:px-8 sm:py-4 rounded-full font-semibold text-base sm:text-lg hover:bg-secondary-50 transition-all duration-300 hover:scale-105"
               >
                 Написать в WhatsApp
               </motion.button>
             </motion.div>

             {/* Contact Block */}
             <motion.div
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ duration: 0.8, delay: 0.8 }}
               className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200"
             >
               <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">Свяжитесь с нами</h3>
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                 <motion.a
                   href="https://wa.me/79991234567"
                   target="_blank"
                   rel="noopener noreferrer"
                   whileHover={{ scale: 1.05 }}
                   whileTap={{ scale: 0.95 }}
                   className="bg-green-500 text-white px-6 py-3 rounded-full font-semibold flex items-center justify-center gap-2 hover:bg-green-600 transition-all duration-300"
                 >
                   <span className="text-xl">📱</span>
                   WhatsApp
                 </motion.a>
                 
                 <motion.a
                   href="https://t.me/sharikirostov"
                   target="_blank"
                   rel="noopener noreferrer"
                   whileHover={{ scale: 1.05 }}
                   whileTap={{ scale: 0.95 }}
                   className="bg-blue-500 text-white px-6 py-3 rounded-full font-semibold flex items-center justify-center gap-2 hover:bg-blue-600 transition-all duration-300"
                 >
                   <span className="text-xl">✈️</span>
                   Telegram
                 </motion.a>
               </div>
               <p className="text-sm text-gray-600 mt-4 text-center">
                 Доставка по всему Ростову-на-Дону от 4000₽
               </p>
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