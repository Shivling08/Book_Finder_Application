import React, { useState } from 'react'

export default function PersonaForm({ persona = { name: '', occupation: '', need: 'searching the book' }, onSave }) {
  const [name, setName] = useState(persona.name || '')
  const [occupation, setOccupation] = useState(persona.occupation || '')
  const [need, setNeed] = useState(persona.need || 'searching the book')

  const submit = (e) => {
    e.preventDefault()
    const p = { name: name.trim(), occupation: occupation.trim(), need: need.trim() }
    onSave && onSave(p)
  }

  const clear = () => {
    setName('')
    setOccupation('')
    setNeed('searching the book')
    onSave && onSave({ name: '', occupation: '', need: 'searching the book' })
  }

  return (
    <form className="personaForm" onSubmit={submit} aria-label="Persona form">
      <label>
        <span className="pLabel">Name</span>
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Alex" />
      </label>

      <label>
        <span className="pLabel">Occupation</span>
        <input value={occupation} onChange={(e) => setOccupation(e.target.value)} placeholder="e.g. College Student" />
      </label>

      <label className="needLabel">
        <span className="pLabel">Need</span>
        <input value={need} onChange={(e) => setNeed(e.target.value)} placeholder="What do they need?" />
      </label>

      <div className="pActions">
        <button type="submit">Save Persona</button>
        <button type="button" className="muted" onClick={clear}>Clear</button>
      </div>
    </form>
  )
}
