const express = require('express')
const bodyParser = require('body-parser')
const db = require('./queries')
const app = express()
const port = 3000

app.use(bodyParser.json())
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
)

app.get('/', (request, response) => {
  response.json({ info: 'Our app is up and running' })
})

app.listen(port, () => {
  console.log(`App running on ${port}.`)
})

app.get("/messages", db.getMessages);
app.post("/messages", db.createMessage);