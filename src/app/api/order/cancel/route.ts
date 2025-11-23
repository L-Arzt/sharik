import { NextRequest, NextResponse } from 'next/server';

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

export async function POST(request: NextRequest) {
  try {
    if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
      console.error('Missing Telegram credentials');
      return NextResponse.json(
        { success: false, message: 'Настройки Telegram не найдены' },
        { status: 500 }
      );
    }

    const { order } = await request.json();

    let message = `❌ ОТМЕНА ЗАКАЗА\n\n`;
    message += `🆔 Номер заказа: ${order.orderId}\n`;
    message += `📅 Дата заказа: ${order.orderDate}\n\n`;
    message += `👤 Клиент: ${order.customer.name}\n`;
    message += `📞 Телефон: ${order.customer.phone}\n`;
    message += `📍 Адрес: ${order.customer.address}\n\n`;
    message += `⚠️ Клиент отменил заказ через корзину`;

    const telegramResponse = await fetch(
      `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: TELEGRAM_CHAT_ID,
          text: message,
        }),
      }
    );

    const telegramData = await telegramResponse.json();
    
    if (!telegramResponse.ok) {
      console.error('Telegram API error:', telegramData);
      throw new Error(`Telegram API error: ${JSON.stringify(telegramData)}`);
    }

    return NextResponse.json({
      success: true,
      message: 'Заказ отменен',
    });
  } catch (error) {
    console.error('Cancel order error:', error);
    return NextResponse.json(
      { success: false, message: 'Ошибка при отмене заказа' },
      { status: 500 }
    );
  }
}
