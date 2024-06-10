const express = require('express')
const mongoose = require('mongoose')
const axios = require('axios')
const app = express()
const port = process.env.PORT || 5000

app.use(express.json())

mongoose.connect('mongodb://localhost:27017/translationDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})

const translationSchema = new mongoose.Schema({
  english: String,
  spanish: String,
})

const Translation = mongoose.model('Translation', translationSchema)

app.post('/translate', async (req, res) => {
  const { text } = req.body

  // Incorrect translation logic
  let incorrectTranslation = text.split('').reverse().join('') // reverse the text

  // Save translation to database
  const translation = new Translation({
    english: text,
    spanish: incorrectTranslation,
  })
  await translation.save()

  res.send({ english: text, spanish: incorrectTranslation })
})

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`)
})
