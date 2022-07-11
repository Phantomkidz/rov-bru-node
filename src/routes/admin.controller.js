const express = require('express')
const router = express.Router()
const fs = require('fs')
const path = require('path')

router.get('/', async (req, res) => {
  let mainDir = `./src/public`
  try {
    if(!fs.existsSync(mainDir)) {
      await fs.mkdirSync(mainDir)
    }
  } catch(e) {
    await fs.mkdirSync(mainDir)
  }


  const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname('bru-rov.sqlite')}`
  await fs.copyFileSync(path.join(__dirname, '../../bru-rov.sqlite'), `${mainDir}/${uniqueSuffix}`)
  let currentPath = path.join(__dirname, `../public/${uniqueSuffix}`)
  setTimeout(() => {
    fs.unlinkSync(currentPath)
  }, 300000)

  res.status(200).send({
    message: 'this link is available to download within 5 minutes',
    download: `${process.env.APP_STATIC_URL + uniqueSuffix}`
  })


})

module.exports = router