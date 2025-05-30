import { NextResponse } from 'next/server'

const TELEGRAM_BOT_TOKEN = '8125343989:AAEoT5kUFJaziP1OIF9cDvuB_mcqY2oKuPQ'
const TELEGRAM_CHAT_ID = '-2627575551'

export async function POST(request: Request) {
  // Добавляем CORS заголовки
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  }

  // Обработка preflight запроса
  if (request.method === 'OPTIONS') {
    return new NextResponse(null, { headers })
  }

  try {
    const body = await request.json()
    const { name, email, phone, message } = body

    const text = `
🆕 Новая заявка с сайта!

👤 Имя: ${name}
📧 Email: ${email}
📱 Телефон: ${phone}
💬 Сообщение: ${message}

⏰ ${new Date().toLocaleString('ru-RU')}
    `.trim()

    const telegramUrl = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`
    const telegramResponse = await fetch(telegramUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text: text,
        parse_mode: 'HTML',
        disable_web_page_preview: true
      })
    })

    const telegramData = await telegramResponse.json()

    if (!telegramResponse.ok) {
      console.error('Telegram API error:', telegramData)
      throw new Error('Failed to send message to Telegram')
    }

    return NextResponse.json({ success: true }, { headers })
  } catch (error) {
    console.error('Error sending message:', error)
    return NextResponse.json(
      { error: 'Failed to send message' },
      { status: 500, headers }
    )
  }
} 