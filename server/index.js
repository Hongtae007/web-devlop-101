const express = require('express')
const bodyParser = require('body-parser')
const app = express()

// Sample bodyParser 
app.use(bodyParser.json())

// Sample book data
const books = [
  { id: 1, title: 'Book 1', author: 'Author 1' },
  { id: 2, title: 'Book 2', author: 'Author 2' },
  { id: 3, title: 'Book 3', author: 'Author 3' },
]


// Endpoint to get all books
app.get('/api/books', (req, res) => {
  res.json(books)
})

app.post('/user', (req, res) => {
  const textData = req.body
  res.send(textData)
})

const port = 8000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})