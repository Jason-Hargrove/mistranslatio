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
    const response = await axios.get(
      'https://api.mymemory.translated.net/get',
      {
        params: {
          q: text,
          langpair: 'en|es',
        },
      }
    )

    console.log('API Response:', response.data) // Log the response data

    // Check if response is successful
    if (
      response.data.responseData &&
      response.data.responseData.translatedText
    ) {
      // Get the correct translation
      let correctTranslation = response.data.responseData.translatedText
      // Apply incorrect translation logic (simple example: reverse the translated text)
      let incorrectTranslation = correctTranslation.split('').reverse().join('')

      res.send({ english: text, spanish: incorrectTranslation })
    } else {
      throw new Error('Invalid response structure')
    }
  } catch (error) {
    console.error('Error during translation:', error.message)
    res.status(500).send({ error: 'Translation failed' })
  }
})

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`)
})
