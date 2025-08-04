import { NextRequest, NextResponse } from 'next/server';

const TELEGRAM_BOT_TOKEN = '8351042929:AAFb0fB6OwK5peG34Qr9tSkDrDz_ynptvP4';
const TELEGRAM_CHAT_ID = '7285683519'; // Временный Chat ID - замените на ваш

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, phone, email, eventType, message } = body;

    // Формируем сообщение для Telegram
    const telegramMessage = `
🎈 *Новая заявка с сайта ШарикиРостов.рф*

👤 *Имя:* ${name}
📱 *Телефон:* ${phone}
📧 *Email:* ${email || 'Не указан'}
🎉 *Тип мероприятия:* ${eventType || 'Не указан'}
💬 *Сообщение:* ${message || 'Не указано'}

⏰ *Время заявки:* ${new Date().toLocaleString('ru-RU')}
🌐 *Источник:* https://шарикиростов.рф
    `;

    // Отправляем сообщение в Telegram
    const telegramResponse = await fetch(
      `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chat_id: TELEGRAM_CHAT_ID,
          text: telegramMessage,
          parse_mode: 'Markdown',
        }),
      }
    );

    if (!telegramResponse.ok) {
      throw new Error('Failed to send message to Telegram');
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Заявка успешно отправлена!' 
    });

  } catch (error) {
    console.error('Error sending contact form:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Ошибка при отправке заявки. Попробуйте позже.' 
      },
      { status: 500 }
    );
  }
} 