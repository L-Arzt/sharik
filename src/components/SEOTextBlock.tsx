'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

interface SEOTextBlockProps {
  title?: string;
  content: string | string[];
  className?: string;
  schemaType?: 'AboutPage' | 'Article' | 'WebPageElement';
}

export default function SEOTextBlock({ 
  title, 
  content, 
  className = '',
  schemaType = 'WebPageElement'
}: SEOTextBlockProps) {
  const paragraphs = Array.isArray(content) ? content : [content];
  const [expanded, setExpanded] = useState(false);
  const visibleParagraphs = expanded ? paragraphs : paragraphs.slice(0, 2); // ✅ Показываем 2 абзаца вместо 1

  // ✅ Добавляем Schema.org микроразметку
  const schemaData = {
    "@context": "https://schema.org",
    "@type": schemaType,
    "name": title || "О компании ШарикиРостов.рф",
    "description": paragraphs[0],
    "text": paragraphs.join(' '),
  };

  return (
    <>
      {/* Schema.org разметка */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
      />
      
      {/* ✅ Используем article вместо section для SEO */}
      <article 
        className={`relative overflow-hidden py-12 md:py-16 bg-gradient-to-br from-white via-blue-50/30 to-purple-50/30 ${className}`}
        itemScope 
        itemType="https://schema.org/AboutPage"
      >
        <div className="absolute inset-0 pointer-events-none opacity-30 bg-[radial-gradient(circle_at_20%_20%,rgba(59,130,246,0.1),transparent_35%)]" />
        
        <div className="container relative mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="bg-white/95 backdrop-blur-sm shadow-xl border border-gray-100 rounded-2xl px-6 sm:px-10 py-8 md:py-10"
          >
            {title && (
              <header className="mb-6 md:mb-8">
                {/* ✅ H2 для SEO - правильная иерархия заголовков */}
                <h2 
                  className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 leading-tight"
                  itemProp="name"
                >
                  {title}
                </h2>
                <div className="mt-4 h-1 w-20 rounded-full bg-gradient-to-r from-blue-500 to-purple-500" />
              </header>
            )}

            {/* ✅ Основной контент с правильной разметкой */}
            <div 
              className="relative space-y-4 md:space-y-5 text-gray-700 leading-relaxed"
              itemProp="articleBody"
            >
              {visibleParagraphs.map((paragraph, index) => (
                <p
                  key={index}
                  className={`text-base sm:text-lg ${
                    index === 0 ? 'text-lg sm:text-xl font-medium text-gray-900' : ''
                  }`}
                >
                  {paragraph}
                </p>
              ))}
              
              {/* Градиент для скрытого текста */}
              {!expanded && paragraphs.length > 2 && (
                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-white via-white/90 to-transparent" />
              )}
            </div>

            {/* Кнопка "Читать далее" */}
            {paragraphs.length > 2 && (
              <div className="mt-6 flex justify-center sm:justify-start">
                <button
                  type="button"
                  onClick={() => setExpanded(prev => !prev)}
                  aria-expanded={expanded}
                  aria-label={expanded ? 'Свернуть текст' : 'Читать далее'}
                  className="group inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-2.5 rounded-full font-semibold text-sm transition-all hover:shadow-lg"
                >
                  {expanded ? (
                    <>
                      Свернуть
                      <svg className="w-4 h-4 transform rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </>
                  ) : (
                    <>
                      Читать далее
                      <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </>
                  )}
                </button>
              </div>
            )}
          </motion.div>
        </div>
      </article>
    </>
  );
}
