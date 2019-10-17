const express = require('express')
const bodyParser = require('body-parser')
const fs = require('fs')

const api = require('./api')
const middleware = require('./middleware')

const PORT = process.env.PORT || 1337

const app = express()

fs.existsSync('./data/') ? null : fs.mkdirSync('./data/')

app.use(bodyParser.json())

app.get('/health', api.getHealth)

app.route('/:studentID/*')
  .get(api.getStudentProperty)
  .put(api.putStudentProperty)
  .delete(api.deleteStudentProperty)
app.put('/:studentID', api.putStudentProperty)

app.use(middleware.handleError)
app.use(middleware.notFound)

const server = app.listen(PORT, () =>
  console.log(`Server listening on port ${PORT}`)
)

if (require.main !== module) {
  module.exports = server
}
