import { NextResponse } from 'next/server'

const TELEGRAM_BOT_TOKEN = '8125343989:AAEoT5kUFJaziP1OIF9cDvuB_mcqY2oKuPQ'
const TELEGRAM_CHAT_ID = '-2627575551'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, email, phone, message } = body

    if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
      throw new Error('Telegram configuration is missing')
    }

    const text = `
New Contact Form Submission:
Name: ${name}
Email: ${email}
Phone: ${phone}
Message: ${message}
    `.trim()

    const response = await fetch(
      `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          chat_id: TELEGRAM_CHAT_ID,
          text,
          parse_mode: 'HTML'
        })
      }
    )

    if (!response.ok) {
      throw new Error('Failed to send message to Telegram')
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error sending message:', error)
    return NextResponse.json(
      { error: 'Failed to send message' },
      { status: 500 }
    )
  }
} 