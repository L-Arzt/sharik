'use client';

import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';

const testimonials = [
  {
    id: 1,
    name: 'Анна Петрова',
    role: 'Невеста',
    content: 'Заказала шары для свадьбы - просто сказка! Композиция была идеальной, все гости были в восторге. Доставка точно в срок, качество на высоте.',
    rating: 5,
    date: '2024-07-15',
    image: '/testimonial-1.jpg'
  },
  {
    id: 2,
    name: 'Михаил Соколов',
    role: 'Организатор мероприятий',
    content: 'Работаю с этой компанией продолжительное время. Всегда качественные шары, креативные идеи и профессиональный подход. Рекомендую всем!',
    rating: 5,
    date: '2024-07-10',
    image: '/testimonial-2.jpg'
  },
  {
    id: 3,
    name: 'Елена Козлова',
    role: 'Мама именинника',
    content: 'Заказала шары для дня рождения дочки. Ребенок был в полном восторге! Яркие цвета, красивые композиции. Обязательно закажу еще.',
    rating: 5,
    date: '2024-07-08',
    image: '/testimonial-3.jpg'
  },
  {
    id: 4,
    name: 'Дмитрий Волков',
    role: 'Директор компании',
    content: 'Отличные шары для корпоративного мероприятия. Создали праздничную атмосферу, все сотрудники были довольны. Спасибо за качество!',
    rating: 5,
    date: '2024-07-05',
    image: '/testimonial-4.jpg'
  }
];

const Testimonials = () => {
  return (
    <section className="py-16 md:py-20 bg-white">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12 md:mb-16"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Отзывы наших клиентов
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">
            Что говорят Категории довольные клиенты
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.article
              key={testimonial.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -5 }}
              className="bg-gradient-to-br from-pink-50 to-purple-50 rounded-2xl p-8 relative"
              itemScope
              itemType="https://schema.org/Review"
            >
              {/* Quote icon */}
              <div className="absolute top-6 right-6">
                <Quote className="w-8 h-8 text-purple-300" />
              </div>

              {/* Rating */}
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${
                      i < testimonial.rating
                        ? 'text-yellow-400 fill-current'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
                <meta itemProp="reviewRating" itemScope itemType="https://schema.org/Rating" />
                <meta itemProp="ratingValue" content={testimonial.rating.toString()} />
                <meta itemProp="bestRating" content="5" />
              </div>

              {/* Content */}
              <blockquote 
                className="text-gray-700 mb-6 text-lg leading-relaxed"
                itemProp="reviewBody"
              >
                &quot;{testimonial.content}&quot;
              </blockquote>

              {/* Author */}
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-r from-pink-400 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg mr-4">
                  {testimonial.name.charAt(0)}
                </div>
                <div>
                  <cite 
                    className="not-italic font-semibold text-gray-800"
                    itemProp="author"
                    itemScope
                    itemType="https://schema.org/Person"
                  >
                    <span itemProp="name">{testimonial.name}</span>
                  </cite>
                  <p className="text-gray-600 text-sm">{testimonial.role}</p>
                  <meta itemProp="datePublished" content={testimonial.date} />
                </div>
              </div>
            </motion.article>
          ))}
        </div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16"
        >
          <div className="text-center">
            <div className="text-4xl font-bold text-purple-600 mb-2">400+</div>
            <div className="text-gray-600">Довольных клиентов</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-pink-600 mb-2">550+</div>
            <div className="text-gray-600">Заказов выполнено</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-blue-600 mb-2">4.9</div>
            <div className="text-gray-600">Средний рейтинг</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-green-600 mb-2">24/7</div>
            <div className="text-gray-600">Поддержка клиентов</div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Testimonials;