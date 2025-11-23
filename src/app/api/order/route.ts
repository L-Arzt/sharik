import { NextRequest, NextResponse } from 'next/server';

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

export async function POST(request: NextRequest) {
  try {
    const { customer, cart, total } = await request.json();

    // Формируем текст сообщения
    let message = `🛒 *НОВЫЙ ЗАКАЗ*\n\n`;
    message += `👤 *Клиент:* ${customer.name}\n`;
    message += `📞 *Телефон:* ${customer.phone}\n`;
    message += `💬 *Связь:* ${customer.contactMethod === 'telegram' ? 'Telegram' : customer.contactMethod === 'whatsapp' ? 'WhatsApp' : 'Позвонить'}\n`;
    message += `📅 *Дата доставки:* ${customer.deliveryDate}\n`;
    message += `⏰ *Время доставки:* ${customer.deliveryTime}\n`;
    message += `📍 *Адрес:* ${customer.address}\n`;
    
    if (customer.comment) {
      message += `📝 *Комментарий:* ${customer.comment}\n`;
    }

    message += `\n🛍 *СОСТАВ ЗАКАЗА:*\n`;
    interface CartItem {
      name: string;
      price: string;
      quantity: number;
      priceNumeric: number;
    }

    cart.forEach((item: CartItem, index: number) => {
      message += `\n${index + 1}. ${item.name}\n`;
      message += `   Цена: ${item.price}\n`;
      message += `   Количество: ${item.quantity} шт.\n`;
      message += `   Сумма: ${(item.priceNumeric * item.quantity).toLocaleString('ru-RU')} ₽\n`;
    });

    message += `\n💰 *ИТОГО:* ${total.toLocaleString('ru-RU')} ₽`;

    // Отправляем в Telegram
    const telegramResponse = await fetch(
      `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chat_id: TELEGRAM_CHAT_ID,
          text: message,
          parse_mode: 'Markdown',
        }),
      }
    );

    if (!telegramResponse.ok) {
      throw new Error('Failed to send telegram message');
    }

    return NextResponse.json({
      success: true,
      message: 'Заказ успешно оформлен!',
    });
  } catch (error) {
    console.error('Order error:', error);
    return NextResponse.json(
      { success: false, message: 'Ошибка при оформлении заказа' },
      { status: 500 }
    );
  }
}
