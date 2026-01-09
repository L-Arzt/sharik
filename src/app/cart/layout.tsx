import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Корзина | ШарикиРостов.рф',
  description: 'Корзина покупок. Проверьте выбранные товары перед оформлением заказа. Доставка воздушных шаров в Ростове и Аксае.',
  robots: {
    index: false,
    follow: true,
  },
  alternates: {
    canonical: 'https://xn--80atjc1ay.xn--p1ai/cart',
  },
};

export default function CartLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

