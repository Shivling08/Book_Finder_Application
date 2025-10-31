import React, { useEffect, useState } from 'react'
import BookCard from './BookCard'

const trendingSeeds = [
  'Pride and Prejudice',
  '1984',
  'To Kill a Mockingbird',
  'Harry Potter',
  'The Great Gatsby',
]

export default function Browse({ onSelect }) {
  const [data, setData] = useState({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false
    async function load() {
      setLoading(true)
      setError(null)
      try {
        const promises = trendingSeeds.map(async (title) => {
          const q = encodeURIComponent(title)
          const res = await fetch(`https://openlibrary.org/search.json?title=${q}&limit=6`)
          if (!res.ok) throw new Error(`Failed ${res.status}`)
          const json = await res.json()
          return { title, docs: json.docs || [] }
        })
        const results = await Promise.all(promises)
        if (cancelled) return
        const map = {}
        results.forEach((r) => (map[r.title] = r.docs))
        setData(map)
      } catch (err) {
        if (!cancelled) setError(err.message)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <section className="browse">
      <h2>Trending</h2>
      {loading && <div className="info">Loading trending books…</div>}
      {error && <div className="error">Error: {error}</div>}

      {trendingSeeds.map((seed) => (
        <div key={seed} className="trendingSection">
          <h3 className="trendingTitle">{seed}</h3>
          <div className="trendingRow">
            {(data[seed] || []).map((b) => (
              <button key={`${b.key}-${b.cover_i || 'nocover'}`} className="trendingItem" onClick={() => onSelect && onSelect(b.title)}>
                <BookCard book={b} />
              </button>
            ))}
          </div>
        </div>
      ))}
    </section>
  )
}
