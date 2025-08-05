'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const faqs = [
  {
    id: 1,
    question: 'Как долго держатся воздушные шары?',
    answer: 'Наши воздушные шары держатся от 12 до 48 часов в зависимости от типа. Обработанные специальным составом шары летают дольше.'
  },
  {
    id: 2,
    question: 'Есть ли доставка по городу?',
    answer: 'Мы осуществляем доставку по городу Ростов-на-Дону. Доставка в день заказа. Стоимость доставки рассчитывается индивидуально.'
  },
  {
    id: 3,
    question: 'Можно ли заказать индивидуальный дизайн?',
    answer: 'Да, мы создаем индивидуальные композиции по вашим пожеланиям. Просто свяжитесь с нами, и мы создадим уникальную композицию специально для вашего праздника.'
  },
  {
    id: 4,
    question: 'Какие способы оплаты принимаете?',
    answer: 'Мы принимаем оплату наличными при получении, а также безналичным расчетом.'
  },
  {
    id: 5,
    question: 'Можно ли заказать шары срочно?',
    answer: 'Да, у нас есть услуга срочного заказа. Возможна доставка в течение 2-3 часов. Стоимость срочной доставки уточняйте.'
  },
  {
    id: 6,
    question: 'Есть ли гарантия на шары?',
    answer: 'Мы гарантируем качество всех наших шаров. Если шары пришли поврежденными или не соответствуют заказу, мы бесплатно заменим их или вернем деньги.'
  }
];

const FAQ = () => {
  const [openId, setOpenId] = useState<number | null>(null);

  const toggleFAQ = (id: number) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <section className="py-16 md:py-20 bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12 md:mb-16"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Часто задаваемые вопросы
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">
            Ответы на самые популярные вопросы наших клиентов
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          <div 
            itemScope 
            itemType="https://schema.org/FAQPage"
            className="space-y-4"
          >
            {faqs.map((faq, index) => (
              <motion.div
                key={faq.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-2xl shadow-lg overflow-hidden"
                itemScope
                itemType="https://schema.org/Question"
              >
                <button
                  onClick={() => toggleFAQ(faq.id)}
                  className="w-full px-8 py-6 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <h3 
                    className="text-lg font-semibold text-gray-800 pr-4"
                    itemProp="name"
                  >
                    {faq.question}
                  </h3>
                  <div className="flex-shrink-0">
                    {openId === faq.id ? (
                      <ChevronUp className="w-6 h-6 text-purple-600" />
                    ) : (
                      <ChevronDown className="w-6 h-6 text-gray-400" />
                    )}
                  </div>
                </button>

                <AnimatePresence>
                  {openId === faq.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div 
                        className="px-8 pb-6 text-gray-600 leading-relaxed"
                        itemScope
                        itemType="https://schema.org/Answer"
                      >
                        <div itemProp="text">
                          {faq.answer}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>

        {/* <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <p className="text-gray-600 mb-6">
            Не нашли ответ на свой вопрос?
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-8 py-4 rounded-full font-semibold text-lg hover:shadow-lg transition-shadow"
          >
            Связаться с нами
          </motion.button>
        </motion.div> */}
      </div>
    </section>
  );
};

export default FAQ; 