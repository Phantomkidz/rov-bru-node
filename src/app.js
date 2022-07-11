const express = require('express')
const app = express()
const helmet = require('helmet')
const cors = require('cors')
const path = require('path')
const { fn } = require('./util')
const API_VERSION = '/api/'

const methodAccept = ['GET', 'PUT', 'POST', 'PATCH', 'DELETE']
const whitelist = ['http://localhost:1412']

// if(process.env.APP_ENV === "development") {
//   whitelist.push('http://localhost:1412')
// }

let corsOption = {
  methods: methodAccept,
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['Content-Length'],
  credentials: true,
  maxAge: 3600,
  origin: function(origin, callback) {
    if(whitelist.indexOf(origin) !== -1 || !origin) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  },
}

app.use(helmet())
app.use(cors(corsOption))
app.use(express.json({ limit: '50mb' }))

app.use(function(req, res, next) {
  if(methodAccept.includes(req.method)) {
    next()
  } else {
    res.status(405).send({
      status: 405,
      message: 'Method Not Allowed'
    })
  }
})

//set static folder
const dir = path.join(__dirname, 'public')
app.use(express.static(dir))

app.use(fn.verifyToken)

app.get(`${API_VERSION}hc`, (req, res) => {
  res.status(200).send({
    status: 200,
    message: 'Healthy'
  })
})

app.use(`${API_VERSION}admin`, require('./routes/admin.controller'))

app.use(`${API_VERSION}school`, require('./routes/school.controller'))
app.use(`${API_VERSION}team`, require('./routes/team.controller'))
app.use(`${API_VERSION}hero`, require('./routes/hero.controller'))
app.use(`${API_VERSION}player`, require('./routes/player.controller'))
app.use(`${API_VERSION}match-result`, require('./routes/match_result.controller'))
app.use(`${API_VERSION}match-detail`, require('./routes/match_detail.controller'))


methodAccept.map(data => {
  const method = data.toLowerCase()
  app[method]('*', (req, res) => {
    res.status(404).send({
      message: 'Page not found'
    })
  })
})

module.exports = app