const moment = require('moment')
const trustUrl = ['http://localhost:1412']

// if(process.env.APP_ENV === "development") {
//   trustUrl.push('http://localhost:1412')
// }

module.exports = {
  verifyToken: (req, res, next) => {
    let authentication = req.headers.authorization
    let url
    try {
      let splitUrl = req.url.split('?')
      url = splitUrl[0]
    } catch(e) {
      url = req.url
    }
    let checkOrigin = true


    if(!req.headers['user-agent'].includes('PostmanRuntime') && !trustUrl.includes(req.headers['origin'])) {
      checkOrigin = false
    }

    if(!checkOrigin || url === 'hc') {
      res.status(400).send({
        message: "You don't have permission to access"
      })
    } else if(authentication === "" || typeof authentication === "undefined") {
      res.status(400).send({
        message: "Header authentication was not found."
      })
    } else {

      let accessToken = authentication.replace('Bearer ', '')
      if(accessToken === process.env.ACCESS_TOKEN) {
        next()
      } else {
        res.status(401).send({
          status: 401,
          message: "Unauthenticated"
        })
      }
    }
  },

  db2datetime: date => {
    return date ? moment(date).format('YYYY-MM-DD HH:mm:ss') : ""
  },

  db2date: date => {
    return date ? moment(date).format('YYYY-MM-DD') : ""
  }
}