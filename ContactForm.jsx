import React, { useState } from 'react'

export default function ContactForm({ developerName = 'Shivling' }) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState(null)

  const submit = (e) => {
    e.preventDefault()
    if (!name.trim() || !email.trim() || !message.trim()) {
      setStatus({ type: 'error', text: 'Please fill name, email and message.' })
      return
    }
    // Simulate sending — in a real app you'd POST to a server or email API
    setStatus({ type: 'loading', text: 'Sending...' })
    setTimeout(() => {
      setStatus({ type: 'success', text: `Thanks ${name.trim()} — your message was "sent" to ${developerName}.` })
      setName('')
      setEmail('')
      setMessage('')
    }, 900)
  }

  return (
    <form className="contactForm" onSubmit={submit} aria-label="Contact form">
      <div className="cfRow">
        <label>
          <span className="pLabel">Your name</span>
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" />
        </label>
        <label>
          <span className="pLabel">Email</span>
          <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
        </label>
      </div>

      <label>
        <span className="pLabel">Message</span>
        <textarea value={message} onChange={(e) => setMessage(e.target.value)} rows={5} placeholder={`Hi ${developerName}, ...`} />
      </label>

      <div className="pActions">
        <button type="submit">Send message</button>
      </div>

      {status && (
        <div className={`info ${status.type === 'error' ? 'error' : ''}`} style={{ marginTop: 10 }}>
          {status.text}
        </div>
      )}
    </form>
  )
}
