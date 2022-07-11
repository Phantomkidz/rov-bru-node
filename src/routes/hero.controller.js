const express = require('express')
const router = express.Router()
const Hero = require('../functions/Hero')

router.get('/', async (req, res) => {
  let results = await Hero.getHero()
  results = await Hero.setHero(results)
  res.status(200).send({
    status: 200,
    message: 'success',
    results
  })
})

router.get('/:heroId', [Hero.checkError(true, false)], async (req, res) => {
  const { heroId } = req.params
  let results = await Hero.getHero(heroId)
  results = await Hero.setHero(results, true)
  res.status(200).send({
    status: 200,
    message: 'success',
    results
  })
})

router.post('/', Hero.checkError(false, true), async (req, res) => {
  await Hero.create(req)
  res.status(200).send({
    status: 200,
    message: 'success',
  })
})

router.put('/:heroId', Hero.checkError(true, true), async (req, res) => {
  await Hero.update(req)
  res.status(200).send({
    status: 200,
    message: 'success',
  })
})

router.delete('/:heroId', Hero.checkError(true, false), async (req, res) => {
  const { heroId } = req.params
  await Hero.destroy(heroId)
  res.status(200).send({
    status: 200,
    message: 'success',
  })
})

module.exports = router