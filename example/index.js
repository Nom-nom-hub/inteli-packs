import express from 'express'
import moment from 'moment'
import _ from 'lodash'

const app = express()
const port = 3000

// Using moment for date formatting
const currentDate = moment().format('YYYY-MM-DD HH:mm:ss')
console.log(`Server started at: ${currentDate}`)

// Using lodash for array operations
const numbers = [1, 2, 3, 4, 5]
const { map: doubled } = _(numbers, (n) => n * 2)
console.log('Doubled numbers:', doubled)

app.get('/', (req, res) => {
  res.json({
    message: 'Hello from example project!',
    timestamp: currentDate,
    numbers: doubled,
  })
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
