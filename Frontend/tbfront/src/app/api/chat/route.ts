import type { NextRequest } from 'next/server'

export const dynamic = 'force-dynamic'

type ChatMessage = { role: 'system' | 'user' | 'assistant'; content: string }

function fallbackReply(userText: string) {
  // Very simple, non-AI fallback so the UI stays usable when OPENAI_API_KEY is missing
  const lower = (userText || '').toLowerCase()
  if (!userText.trim()) return "Hi! Ask me about products, shipping, returns, or how to place an order."
  if (/(shipping|deliver|when|get)/.test(lower)) return "Shipping is free over $99 and typically arrives in 3–5 business days."
  if (/(return|refund)/.test(lower)) return "You can return items within 30 days in original condition. Need a label? I can guide you."
  if (/(warranty|guarantee)/.test(lower)) return "Most products include a 2-year warranty against defects."
  if (/(stock|available|availability)/.test(lower)) return "Stock updates hourly. Add to cart and proceed to checkout to reserve your item."
  return "I'm here to help with product questions, shipping, returns, and checkout."
}

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json()
    const OPENAI_API_KEY = process.env.OPENAI_API_KEY
    if (!OPENAI_API_KEY) {
      const last = (messages?.slice(-1)?.[0]?.content as string) || ''
      return Response.json({ reply: fallbackReply(last), provider: 'fallback' })
    }

    const sys: ChatMessage = {
      role: 'system',
      content:
        'You are a helpful ecommerce assistant for TechBuilder. Answer concisely. If asked about orders, explain you cannot access personal data. Do not make up inventory; be general if uncertain.',
    }
    const payload = {
      model: 'gpt-4o-mini',
      temperature: 0.4,
      messages: [sys, ...(Array.isArray(messages) ? messages : [])] as ChatMessage[],
    }

    const r = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify(payload),
    })
    if (!r.ok) {
      const text = await r.text()
      return Response.json({ reply: fallbackReply(''), error: text, provider: 'openai' }, { status: 200 })
    }
    const data = await r.json()
    const reply: string = data?.choices?.[0]?.message?.content || fallbackReply('')
    return Response.json({ reply, provider: 'openai' })
  } catch (e: any) {
    return Response.json({ reply: fallbackReply(''), error: String(e) }, { status: 200 })
  }
}
