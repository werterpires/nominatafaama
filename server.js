const express = require('express')
const app = express()
const path = require('path')

const distFolder = path.join(__dirname, 'frontend/dist/frontend')

app.get(
  '*.*',
  express.static(distFolder, {
    maxAge: '1y',
  }),
)

app.get('*', (req, res) => {
  res.sendFile(`${distFolder}/index.html`)
})

const port = process.env.PORT || 5000

app.listen(port, (call) => {
  console.log('Aplicação rodando na porta', port)
  console.log('Servindo estáticos na pasta', distFolder)
})
