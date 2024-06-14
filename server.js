const express = require('express')
const path = require('path')
const axios = require('axios')
const cors = require('cors')
const helmet = require('helmet')

const app = express()
const port = process.env.PORT || 5000

app.use(express.json())
app.use(cors())
app.use(helmet())

// Set Content Security Policy headers
app.use((req, res, next) => {
  res.setHeader(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; connect-src 'self' https://api.mymemory.translated.net"
  )
  next()
})

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'client/build')))

  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client/build', 'index.html'))
  })
}

const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[array[i], array[j]] = [array[j], array[i]]
  }
  return array
}

const swapAdjacentWords = (array) => {
  for (let i = 0; i < array.length - 1; i += 2) {
    ;[array[i], array[i + 1]] = [array[i + 1], array[i]]
  }
  return array
}

const generateIncorrectTranslation = (correctTranslation) => {
  let words = correctTranslation.split(' ')

  const strategy = Math.floor(Math.random() * 2)
  switch (strategy) {
    case 0:
      words = shuffleArray(words)
      break
    case 1:
      words = swapAdjacentWords(words)
      break
  }

  return words.join(' ')
}

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

    if (
      response.data.responseData &&
      response.data.responseData.translatedText
    ) {
      const correctTranslation = response.data.responseData.translatedText
      const incorrectTranslation =
        generateIncorrectTranslation(correctTranslation)

      res.send({ english: text, spanish: incorrectTranslation })
    } else {
      throw new Error('Invalid response structure')
    }
  } catch (error) {
    console.error(`Error during translation: ${error.message}`)
    res.status(500).send({ error: 'Translation failed' })
  }
})

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`)
})
