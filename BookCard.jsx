import React from 'react'

function coverUrl(book) {
  if (book.cover_i) return `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`
  if (book.isbn && book.isbn.length) return `https://covers.openlibrary.org/b/isbn/${book.isbn[0]}-M.jpg`
  return null
}

export default function BookCard({ book }) {
  const cover = coverUrl(book)
  const title = book.title || 'Untitled'
  const authors = (book.author_name || []).join(', ')
  const year = book.first_publish_year || book.publish_year?.[0]
  const openUrl = `https://openlibrary.org${book.key}`

  return (
    <article className="card">
      <a className="coverLink" href={openUrl} target="_blank" rel="noreferrer">
        {cover ? (
          <img src={cover} alt={`${title} cover`} className="cover" />
        ) : (
          <div className="noCover">No cover</div>
        )}
      </a>
      <div className="meta">
        <h3 className="bookTitle">{title}</h3>
        <div className="bookAuthors">{authors}</div>
        <div className="bookYear">{year ? `First published ${year}` : ''}</div>
        <div className="bookExtras">Edition count: {book.edition_count || 0}</div>
        <a className="openLink" href={openUrl} target="_blank" rel="noreferrer">
          View on OpenLibrary
        </a>
      </div>
    </article>
  )
}
