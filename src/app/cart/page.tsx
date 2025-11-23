'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ShoppingCart, Trash2, Minus, Plus, ChevronRight, ArrowLeft, X, Send, CheckCircle, AlertCircle } from 'lucide-react';
import { getCart, removeFromCart, updateCartQuantity, getCartTotal, clearCart, CartItem, setActiveOrder, getActiveOrder, clearActiveOrder, ActiveOrder } from '@/lib/cart';

export default function CartPage() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showOrderForm, setShowOrderForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [activeOrder, setActiveOrderState] = useState<ActiveOrder | null>(null);
  const [submitStatus, setSubmitStatus] = useState<{ type: 'success' | 'error' | null; message: string }>({ type: null, message: '' });

  const [formData, setFormData] = useState({
    name: '',
    phone: '+7 (',
    contactMethod: 'telegram',
    deliveryDate: '',
    deliveryTime: '',
    address: '',
    comment: ''
  });

  useEffect(() => {
    setCart(getCart());
    setActiveOrderState(getActiveOrder());
    setLoading(false);

    const handleCartUpdate = () => setCart(getCart());
    const handleOrderUpdate = () => setActiveOrderState(getActiveOrder());
    
    window.addEventListener('cartUpdated', handleCartUpdate);
    window.addEventListener('orderUpdated', handleOrderUpdate);
    
    return () => {
      window.removeEventListener('cartUpdated', handleCartUpdate);
      window.removeEventListener('orderUpdated', handleOrderUpdate);
    };
  }, []);

  // ИСПРАВЛЕНО: Сначала объявляем total, потом используем его
  const total = getCartTotal();
  
  // Константы для доставки
  const FREE_DELIVERY_THRESHOLD = 5000;
  const DELIVERY_COST = 450;
  
  // Вычисляем стоимость доставки
  const deliveryCost = total >= FREE_DELIVERY_THRESHOLD ? 0 : DELIVERY_COST;
  const finalTotal = total + deliveryCost;

  const formatPhoneNumber = (value: string) => {
    const numbers = value.replace(/[^\d+]/g, '');
    if (!numbers.startsWith('+7')) return '+7 (';
    const digits = numbers.slice(2).replace(/\D/g, '').slice(0, 10);
    let formattedValue = '+7 (';
    if (digits.length > 0) formattedValue += digits.slice(0, 3);
    if (digits.length > 3) formattedValue += `) ${digits.slice(3, 6)}`;
    if (digits.length > 6) formattedValue += `-${digits.slice(6, 8)}`;
    if (digits.length > 8) formattedValue += `-${digits.slice(8)}`;
    return formattedValue;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === 'phone') {
      if (value.length < 4) {
        setFormData(prev => ({ ...prev, phone: '+7 (' }));
        return;
      }
      const formattedValue = formatPhoneNumber(value);
      setFormData(prev => ({ ...prev, [name]: formattedValue }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const validatePhone = (phone: string) => {
    const numbers = phone.replace(/\D/g, '').slice(1);
    return numbers.length === 10;
  };

const handleSubmitOrder = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!validatePhone(formData.phone)) {
    setSubmitStatus({
      type: 'error',
      message: 'Пожалуйста, введите корректный номер телефона'
    });
    return;
  }

  setIsSubmitting(true);
  setSubmitStatus({ type: null, message: '' });

  try {
    const orderId = `ORD-${Date.now()}`;
    const orderDate = new Date().toLocaleString('ru-RU');
    
    // Вычисляем доставку
    const deliveryCost = total >= FREE_DELIVERY_THRESHOLD ? 0 : DELIVERY_COST;
    const finalTotal = total + deliveryCost;

    const response = await fetch('/api/order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        orderId,
        customer: formData,
        cart: cart,
        subtotal: total,
        deliveryCost: deliveryCost,
        total: finalTotal
      }),
    });

    const result = await response.json();

    if (result.success) {
      const order: ActiveOrder = {
        orderId,
        orderDate,
        customer: formData,
        cart: [...cart],
        total: finalTotal
      };
      setActiveOrder(order);
      
      setSubmitStatus({ 
        type: 'success', 
        message: 'Заказ успешно оформлен! Мы свяжемся с вами в ближайшее время.' 
      });
      setOrderSuccess(true);
      
      setFormData({
        name: '',
        phone: '+7 (',
        contactMethod: 'telegram',
        deliveryDate: '',
        deliveryTime: '',
        address: '',
        comment: ''
      });
    } else {
      setSubmitStatus({ type: 'error', message: result.message || 'Ошибка при оформлении заказа' });
    }
  } catch (error) {
    setSubmitStatus({ type: 'error', message: 'Ошибка при отправке заказа. Попробуйте позже.' });
  } finally {
    setIsSubmitting(false);
  }
};


  const handleCancelOrder = async () => {
    if (!activeOrder) return;
    
    if (!confirm('Вы действительно хотите отменить заказ?')) return;

    try {
      const response = await fetch('/api/order/cancel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ order: activeOrder }),
      });

      const result = await response.json();

      if (result.success) {
        clearActiveOrder();
        alert('Заказ отменен. Уведомление отправлено продавцу.');
      } else {
        alert('Ошибка при отмене заказа. Пожалуйста, позвоните нам.');
      }
    } catch (error) {
      alert('Ошибка при отмене заказа. Пожалуйста, позвоните нам.');
    }
  };

  const handleCloseOrderForm = () => {
    setShowOrderForm(false);
    setOrderSuccess(false);
    setSubmitStatus({ type: null, message: '' });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12">
      <div className="container mx-auto px-4">
        
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-8">
          <Link href="/" className="hover:text-blue-600">Главная</Link>
          <ChevronRight size={16} />
          <span className="text-gray-900">Корзина</span>
        </div>

        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <ShoppingCart size={32} className="text-blue-600" />
            Корзина
          </h1>
          <Link 
            href="/catalog"
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
          >
            <ArrowLeft size={20} />
            Продолжить покупки
          </Link>
        </div>

        {/* Уведомление об активном заказе */}
        {activeOrder && (
          <div className="bg-green-50 border-2 border-green-200 rounded-2xl p-6 mb-8">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                <CheckCircle className="text-white" size={24} />
              </div>
              <div className="flex-grow">
                <h3 className="text-xl font-bold text-green-900 mb-2">
                  Ваш заказ оформлен!
                </h3>
                <p className="text-green-800 mb-1">
                  <strong>Номер заказа:</strong> {activeOrder.orderId}
                </p>
                <p className="text-green-800 mb-1">
                  <strong>Дата оформления:</strong> {activeOrder.orderDate}
                </p>
                <p className="text-green-700 text-sm mb-4">
                  Мы свяжемся с вами по телефону {activeOrder.customer.phone} для подтверждения заказа.
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={handleCancelOrder}
                    className="px-6 py-2 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transition-all flex items-center gap-2"
                  >
                    <X size={18} />
                    Отменить заказ
                  </button>
                  <Link
                    href="/catalog"
                    className="px-6 py-2 bg-white border-2 border-green-500 text-green-700 rounded-lg font-medium hover:bg-green-50 transition-all"
                  >
                    Продолжить покупки
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

        {cart.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
            <div className="bg-blue-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingCart className="text-blue-600" size={48} />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Корзина пуста</h2>
            <p className="text-gray-500 mb-6">Добавьте товары из каталога</p>
            <Link 
              href="/catalog"
              className="inline-block bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/30"
            >
              Перейти в каталог
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            <div className="lg:col-span-2 space-y-4">
            {cart.map((item) => (
            <div key={item.id} className="bg-white rounded-2xl shadow-sm p-4 sm:p-6 border border-gray-100">
                <div className="flex gap-4 sm:gap-6 flex-wrap sm:flex-nowrap">
                <Link href={`/product/${item.slug}`} className="relative w-24 h-24 sm:w-32 sm:h-32 flex-shrink-0 bg-gray-50 rounded-xl overflow-hidden">
                    <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover"
                    onError={(e) => { (e.target as HTMLImageElement).src = '/images/pic1.jpg'; }}
                    />
                </Link>

                <div className="flex-grow min-w-0 w-full sm:w-auto">
                    <Link href={`/product/${item.slug}`}>
                    <h3 className="text-base sm:text-lg font-bold text-gray-900 hover:text-blue-600 mb-2">
                        {item.name}
                    </h3>
                    </Link>
                    
                    <div className="flex items-center gap-4 mb-4">
                    <span className="text-xl sm:text-2xl font-bold text-blue-600">{item.price}</span>
                    </div>

                    <div className="flex items-center justify-between flex-wrap gap-3">
                    <div className="flex items-center border-2 border-gray-200 rounded-lg overflow-hidden">
                        <button
                        onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                        className="p-2 hover:bg-gray-100 transition-colors"
                        >
                        <Minus size={18} />
                        </button>
                        <span className="px-4 py-2 font-bold text-gray-900 border-x-2 border-gray-200 min-w-[60px] text-center">
                        {item.quantity}
                        </span>
                        <button
                        onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                        className="p-2 hover:bg-gray-100 transition-colors"
                        >
                        <Plus size={18} />
                        </button>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="sm:hidden">
                        <p className="text-sm text-gray-500">Сумма</p>
                        <p className="text-lg font-bold text-gray-900">
                            {(item.priceNumeric * item.quantity).toLocaleString('ru-RU')} ₽
                        </p>
                        </div>

                        <button
                        onClick={() => removeFromCart(item.id)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        >
                        <Trash2 size={20} />
                        </button>
                    </div>
                    </div>
                </div>

                <div className="hidden sm:block text-right flex-shrink-0">
                    <p className="text-sm text-gray-500 mb-1">Сумма</p>
                    <p className="text-xl font-bold text-gray-900">
                    {(item.priceNumeric * item.quantity).toLocaleString('ru-RU')} ₽
                    </p>
                </div>
                </div>
            </div>
            ))}

            </div>

<div className="lg:col-span-1">
  <div className="bg-white rounded-2xl shadow-sm p-6 sticky top-24 border border-gray-100">
    <h2 className="text-xl font-bold text-gray-900 mb-6">Итого</h2>
    
    <div className="space-y-3 mb-6 pb-6 border-b border-gray-100">
      <div className="flex justify-between text-gray-600">
        <span>Товары ({cart.reduce((sum, item) => sum + item.quantity, 0)})</span>
        <span className="font-medium">{total.toLocaleString('ru-RU')} ₽</span>
      </div>
      <div className="flex justify-between text-gray-600">
        <span>Доставка</span>
        {deliveryCost === 0 ? (
          <span className="font-medium text-green-600">Бесплатно</span>
        ) : (
          <span className="font-medium">{deliveryCost} ₽</span>
        )}
      </div>
    </div>

    {/* Прогресс до бесплатной доставки */}
    {total < FREE_DELIVERY_THRESHOLD && (
      <div className="mb-6 p-3 bg-blue-50 rounded-lg border border-blue-200">
        <p className="text-sm text-blue-800 mb-2">
          🚚 До бесплатной доставки осталось:{' '}
          <span className="font-bold">
            {(FREE_DELIVERY_THRESHOLD - total).toLocaleString('ru-RU')} ₽
          </span>
        </p>
        <div className="w-full bg-blue-200 rounded-full h-2">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${Math.min((total / FREE_DELIVERY_THRESHOLD) * 100, 100)}%` }}
          />
        </div>
      </div>
    )}

    {/* Уведомление о бесплатной доставке */}
    {total >= FREE_DELIVERY_THRESHOLD && (
      <div className="mb-6 p-3 bg-green-50 rounded-lg border border-green-200">
        <p className="text-sm text-green-800 font-medium flex items-center gap-2">
          ✓ Вы получили бесплатную доставку!
        </p>
      </div>
    )}

    <div className="flex justify-between text-xl font-bold text-gray-900 mb-6">
      <span>Итого:</span>
      <span className="text-blue-600">{finalTotal.toLocaleString('ru-RU')} ₽</span>
    </div>

    {activeOrder ? (
      <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-4">
        <p className="text-green-800 text-sm text-center font-medium">
          ✓ Заказ оформлен
        </p>
      </div>
    ) : (
      <button 
        onClick={() => setShowOrderForm(true)}
        className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/30 mb-4"
      >
        Оформить заказ
      </button>
    )}

    <button
      onClick={() => {
        if (confirm('Очистить корзину?')) clearCart();
      }}
      className="w-full text-red-500 py-2 rounded-lg hover:bg-red-50 transition-colors text-sm font-medium"
    >
      Очистить корзину
    </button>

    <div className="mt-6 pt-6 border-t border-gray-100 space-y-3 text-sm text-gray-600">
      <p>🚚 Бесплатная доставка от 5000₽</p>
      <p>💳 Оплата при получении</p>
      <p>⏰ Доставка круглосуточно</p>
    </div>
  </div>
</div>
          </div>
        )}
      </div>

      {/* Модальное окно формы заказа */}
      {showOrderForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">
                {orderSuccess ? 'Заказ оформлен!' : 'Оформление заказа'}
              </h2>
              <button
                onClick={handleCloseOrderForm}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            {orderSuccess ? (
              // Экран успешного оформления
              <div className="p-12 text-center">
                <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="text-green-600" size={48} />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Ваш заказ успешно оформлен!
                </h3>
                <p className="text-gray-600 mb-2">
                  Мы свяжемся с вами в ближайшее время для подтверждения заказа.
                </p>
                {/* <p className="text-gray-600 mb-8">
                  Товары остались в корзине на случай, если вы захотите изменить заказ.
                </p> */}
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button
                    onClick={handleCloseOrderForm}
                    className="px-8 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/30"
                  >
                    Вернуться в корзину
                  </button>
                  <Link
                    href="/catalog"
                    className="px-8 py-3 border-2 border-gray-200 text-gray-700 rounded-xl font-bold hover:border-blue-600 hover:text-blue-600 transition-all"
                  >
                    Продолжить покупки
                  </Link>
                </div>
              </div>
            ) : (
              // Форма заказа
              <form onSubmit={handleSubmitOrder} className="p-6 space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Имя *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Ваше имя"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Телефон *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="+7 (999) 123-45-67"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Как с вами связаться? *
                  </label>
                  <select
                    name="contactMethod"
                    value={formData.contactMethod}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="telegram">Telegram</option>
                    <option value="whatsapp">WhatsApp</option>
                    <option value="phone">Позвонить по телефону</option>
                  </select>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Дата доставки *
                    </label>
                    <input
                      type="date"
                      name="deliveryDate"
                      value={formData.deliveryDate}
                      onChange={handleInputChange}
                      required
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Время доставки *
                    </label>
                    <input
                      type="time"
                      name="deliveryTime"
                      value={formData.deliveryTime}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Адрес доставки *
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Улица, дом, квартира"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Комментарий к заказу
                  </label>
                  <textarea
                    name="comment"
                    value={formData.comment}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    placeholder="Дополнительные пожелания..."
                  />
                </div>

                {submitStatus.type === 'error' && (
                  <div className="p-4 rounded-lg bg-red-100 text-red-700 border border-red-200">
                    {submitStatus.message}
                  </div>
                )}

            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                    <span className="text-gray-700">Товары:</span>
                    <span className="font-medium">{total.toLocaleString('ru-RU')} ₽</span>
                    </div>
                    <div className="flex justify-between text-sm">
                    <span className="text-gray-700">Доставка:</span>
                    {deliveryCost === 0 ? (
                        <span className="font-medium text-green-600">Бесплатно</span>
                    ) : (
                        <span className="font-medium">{deliveryCost} ₽</span>
                    )}
                    </div>
                    <div className="flex justify-between items-center text-lg font-bold pt-2 border-t border-blue-200">
                    <span>Итого к оплате:</span>
                    <span className="text-blue-600">{finalTotal.toLocaleString('ru-RU')} ₽</span>
                    </div>
                </div>
            <p className="text-sm text-gray-600 mt-2">Оплата при получении</p>
            </div>


                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30"
                >
                  <Send size={20} />
                  {isSubmitting ? 'Отправляем...' : 'Подтвердить заказ'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
