"use client"
import { useEffect, useRef, useState } from 'react'

type Msg = { role: 'user' | 'assistant'; content: string }

export default function ChatWidget() {
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState('')
  const [busy, setBusy] = useState(false)
  const [messages, setMessages] = useState<Msg[]>([
    { role: 'assistant' as const, content: 'Hi! I\'m TechBuilder Assistant. Ask me about products, shipping, or returns.' },
  ])
  const endRef = useRef<HTMLDivElement | null>(null)
  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages, open])

  async function send() {
    const text = input.trim()
    if (!text || busy) return
  const next: Msg[] = [...messages, { role: 'user', content: text }]
    setMessages(next)
    setInput('')
    setBusy(true)
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: next }),
      })
      const data = await res.json()
      const reply = (data && data.reply) || "Sorry, I couldn\'t process that."
      setMessages(m => [...m, { role: 'assistant', content: reply }])
    } catch (e) {
      setMessages(m => [...m, { role: 'assistant', content: 'Network error. Please try again.' }])
    } finally {
      setBusy(false)
    }
  }

  return (
    <>
      {/* Toggle button */}
      <button
        onClick={() => setOpen(!open)}
        aria-label="Open chat"
        className="fixed bottom-4 right-4 z-50 rounded-full bg-blue-600 text-white shadow-lg hover:bg-blue-700 transition-colors w-14 h-14 flex items-center justify-center"
      >
        {open ? '×' : '💬'}
      </button>

      {/* Panel */}
      {open && (
        <div className="fixed bottom-20 right-4 z-50 w-80 max-h-[70vh] bg-white dark:bg-gray-900 border rounded-lg shadow-xl flex flex-col">
          <div className="px-3 py-2 border-b font-semibold">TechBuilder Assistant</div>
          <div className="flex-1 overflow-y-auto p-3 space-y-2 text-sm">
            {messages.map((m, i) => (
              <div key={i} className={m.role === 'user' ? 'text-right' : 'text-left'}>
                <span className={
                  'inline-block px-3 py-2 rounded-lg ' +
                  (m.role === 'user' ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-50')
                }>
                  {m.content}
                </span>
              </div>
            ))}
            <div ref={endRef} />
          </div>
          <div className="p-2 border-t flex gap-2">
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && send()}
              placeholder="Ask anything..."
              className="flex-1 rounded border px-2 py-1 text-sm bg-white dark:bg-gray-900"
            />
            <button onClick={send} disabled={busy} className="px-3 py-1 rounded bg-blue-600 text-white text-sm disabled:opacity-50">
              Send
            </button>
          </div>
        </div>
      )}
    </>
  )
}
