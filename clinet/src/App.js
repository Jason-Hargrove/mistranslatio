import React, { useState } from 'react'
import axios from 'axios'

function App() {
  const [text, setText] = useState('')
  const [translation, setTranslation] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    const response = await axios.post('http://localhost:5000/translate', {
      text,
    })
    setTranslation(response.data.spanish)
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter text in English"
        />
        <button type="submit">Translate</button>
      </form>
      <h3>Incorrect Translation: {translation}</h3>
    </div>
  )
}

export default App
