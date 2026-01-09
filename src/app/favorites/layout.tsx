import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Избранное | ШарикиРостов.рф',
  description: 'Избранные товары. Сохраните понравившиеся воздушные шары для быстрого доступа.',
  robots: {
    index: false,
    follow: true,
  },
  alternates: {
    canonical: 'https://xn--80atjc1ay.xn--p1ai/favorites',
  },
};

export default function FavoritesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

