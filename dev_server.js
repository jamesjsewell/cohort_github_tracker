const express = require('express')

// runs express app and sets defined port
var app = express()
const PORT = 8080
// app.set("port", PORT)
app.use(express.static('public'))

app.get('*', (req, res) => {
  res.sendFile(`${__dirname}/public/index.html`)
})

// starts the app listening for requests
app.listen(PORT, function () {
  console.log(
    '\n\n===== listening for requests on port ' + PORT + ' =====\n\n'
  )
})
