import { Metadata } from 'next';
import CatalogPage from '@/components/CatalogPage';

export const metadata: Metadata = {
  title: 'Каталог воздушных шаров - Шарики-Шарики',
  description: 'Большой выбор воздушных шаров для любого праздника. Фильтры по категориям, ценам и цветам. Быстрая доставка по всей России.',
  keywords: 'каталог воздушных шаров, купить шары, фильтр шаров, поиск шаров',
  openGraph: {
    title: 'Каталог воздушных шаров - Шарики-Шарики',
    description: 'Большой выбор воздушных шаров для любого праздника',
    url: 'https://sharik-sharik.ru/catalog',
  },
};

export default function Catalog() {
  return <CatalogPage />;
} 