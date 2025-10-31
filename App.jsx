import React, { useState, useEffect, useCallback } from 'react'
import SearchBar from './components/SearchBar'
import PersonaForm from './components/PersonaForm'
import BookCard from './components/BookCard'
import ContactForm from './components/ContactForm'
import Browse from './components/Browse'

export default function App() {
  const [query, setQuery] = useState('')
  const [author, setAuthor] = useState('')
  const [books, setBooks] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [page, setPage] = useState(1)
  const [numFound, setNumFound] = useState(0)
  const [persona, setPersona] = useState(() => {
    try {
      const raw = localStorage.getItem('persona')
      return raw ? JSON.parse(raw) : { name: '', occupation: '', need: 'searching the book' }
    } catch {
      return { name: '', occupation: '', need: 'searching the book' }
    }
  })
  const [view, setView] = useState('home')

  const pageSize = 20

  const fetchBooks = useCallback(async (q, a, p = 1) => {
    if (!q) {
      setBooks([])
      setNumFound(0)
      return
    }
    setLoading(true)
    setError(null)
    try {
      const titleParam = encodeURIComponent(q)
      const authorParam = a ? `&author=${encodeURIComponent(a)}` : ''
      const offset = (p - 1) * pageSize
      const url = `https://openlibrary.org/search.json?title=${titleParam}${authorParam}&limit=${pageSize}&offset=${offset}`
      const res = await fetch(url)
      if (!res.ok) throw new Error(`API error: ${res.status}`)
      const data = await res.json()
      setBooks(data.docs || [])
      setNumFound(data.numFound || 0)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    setPage(1)
    fetchBooks(query, author, 1)
  }, [query, author, fetchBooks])

  useEffect(() => {
    fetchBooks(query, author, page)
  }, [page, query, author, fetchBooks])

  const onSearch = (q, a) => {
    setQuery(q)
    setAuthor(a)
    setPage(1)
  }

  const onSavePersona = (p) => {
    setPersona(p)
    try {
      localStorage.setItem('persona', JSON.stringify(p))
    } catch (e) {
      // ignore storage errors
    }
    // Auto-fill the search title with the persona's need and reset to page 1
    if (p && p.need) {
      setQuery(p.need)
      setPage(1)
    }
  }

  const totalPages = Math.ceil(numFound / pageSize)

  return (
    <div className="app">
      <header className="header">
        <div className="appNameBar">
          <div className="appName">
              <svg className="logoSvg" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <defs>
                  <linearGradient id="g1" x1="0" x2="1">
                    <stop offset="0" stopColor="#60a5fa" />
                    <stop offset="1" stopColor="#7c3aed" />
                  </linearGradient>
                </defs>
                <path fill="url(#g1)" d="M3 5a2 2 0 0 1 2-2h12v14a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V5z" />
                <path fill="#fff" d="M5 6h10v1H5zM5 9h10v1H5zM5 12h7v1H5z" opacity="0.9" />
              </svg>
              <div>
                <h1>Book Finder</h1>
                <div className="appTag">Find books fast — powered by Open Library</div>
              </div>
            </div>
        </div>

        <div className="topRow">
          <nav className="nav">
            <button className={`navItem ${view === 'home' ? 'active' : ''}`} onClick={() => setView('home')}>Home</button>
            <button className={`navItem ${view === 'browse' ? 'active' : ''}`} onClick={() => setView('browse')}>Browse</button>
            <button className={`navItem ${view === 'about' ? 'active' : ''}`} onClick={() => setView('about')}>About</button>
          </nav>

          <div className="personaArea">
            <PersonaForm persona={persona} onSave={onSavePersona} />
            {persona && persona.name && (
              <div className="greeting">Hello <strong>{persona.name}</strong> — {persona.occupation} — Looking for: <em>{persona.need}</em></div>
            )}
          </div>
        </div>

        <p className="subtitle">Search books using Open Library. Try a title like "Pride and Prejudice"</p>
      </header>

      <main className="main">
        {view === 'home' && (
          <>
            <SearchBar onSearch={onSearch} initialTitle={query} initialAuthor={author} />

            {loading && <div className="info">Loading results…</div>}
            {error && <div className="error">Error: {error}</div>}

            {!loading && !error && books.length === 0 && query && (
              <div className="info">No results found for "{query}"</div>
            )}

            <div className="grid">
              {books.map((b) => (
                <BookCard key={`${b.key}-${b.cover_i || 'nocover'}`} book={b} />
              ))}
            </div>

            {numFound > 0 && (
              <footer className="pager">
                <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>
                  Previous
                </button>
                <span>
                  Page {page} of {totalPages || 1} — {numFound} results
                </span>
                <button onClick={() => setPage((p) => Math.min(totalPages || 1, p + 1))} disabled={page >= totalPages}>
                  Next
                </button>
              </footer>
            )}
          </>
        )}

        {view === 'browse' && (
          <Browse onSelect={(title) => {
            // when user selects an item from browse, go to home and search
            setView('home')
            setQuery(title)
            setPage(1)
          }} />
        )}

        {view === 'about' && (
          <section className="about">
            <h2>About</h2>
            <p className="muted">This simple Book Finder is built using the Open Library API. If you'd like to contact the developer, use the form below.</p>
            <div className="aboutGrid">
              <div className="aboutCard">
                <h3>Contact</h3>
                <ContactForm developerName="Shivling" />
              </div>
              <div className="aboutCard">
                <h3>Developer</h3>
                <p>Name: <strong>Shivling</strong></p>
                <p>Role: Website developer</p>
                <p className="muted">You can send a message via the contact form. This demo does not actually send emails.</p>
              </div>
            </div>
          </section>
        )}
      </main>

      <footer className="footer">
        <div className="siteFooter">
          <div className="devCredit">Website by <strong>Shivling</strong></div>
          <div className="footerLinks">
            <a href="https://openlibrary.org/" target="_blank" rel="noreferrer">Open Library</a>
            <a href="#" onClick={(e) => e.preventDefault()}>Privacy</a>
            <a href="#" onClick={(e) => e.preventDefault()}>Terms</a>
          </div>
        </div>
        <small style={{display:'block',marginTop:10,color:'var(--muted)'}}>
          Data from Open Library. Covers may be unavailable for some records.
        </small>
      </footer>
    </div>
  )
}
