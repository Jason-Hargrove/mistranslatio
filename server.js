const express = require('express')
const axios = require('axios')
const cors = require('cors')
const app = express()
const port = process.env.PORT || 5000

app.use(express.json())
app.use(cors())

app.post('/translate', async (req, res) => {
  const { text } = req.body

  try {
    const response = await axios.get('https://transltr.org/api/translate', {
      params: {
        text: text,
        to: 'es',
      },
    })

    // Incorrect translation logic (simple example: reverse the translated text)
    let incorrectTranslation = response.data.translationText
      .split('')
      .reverse()
      .join('')

    res.send({ english: text, spanish: incorrectTranslation })
  } catch (error) {
    console.error('Error during translation:', error)
    res.status(500).send({ error: 'Translation failed' })
  }
})

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`)
})
