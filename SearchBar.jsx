import React, { useState, useEffect } from 'react'

export default function SearchBar({ onSearch, initialTitle = '', initialAuthor = '' }) {
  const [title, setTitle] = useState(initialTitle)
  const [author, setAuthor] = useState(initialAuthor)

  useEffect(() => {
    setTitle(initialTitle)
  }, [initialTitle])

  useEffect(() => {
    setAuthor(initialAuthor)
  }, [initialAuthor])

  // Debounce local input to avoid too many requests while typing
  useEffect(() => {
    const t = setTimeout(() => {
      // do not auto-search empty
      if (title.trim()) onSearch(title.trim(), author.trim())
    }, 600)
    return () => clearTimeout(t)
  }, [title, author])

  const submit = (e) => {
    e.preventDefault()
    if (!title.trim()) return
    onSearch(title.trim(), author.trim())
  }

  return (
    <form className="search" onSubmit={submit} aria-label="Search books">
      <div className="fields">
        <label className="field">
          <span className="label">Title</span>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter book title..."
            aria-label="Book title"
          />
        </label>

        <label className="field">
          <span className="label">Author (optional)</span>
          <input
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            placeholder="Filter by author"
            aria-label="Author"
          />
        </label>

        <div className="actions">
          <button type="submit">Search</button>
        </div>
      </div>
    </form>
  )
}
