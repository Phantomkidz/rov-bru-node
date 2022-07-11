const express = require('express')
const router = express.Router()
const Player = require('../functions/Player')

router.get('/', async (req, res) => {
  let results = await Player.getPlayer(req,)
  results = await Player.setPlayer(results)
  res.status(200).send({
    status: 200,
    message: 'success',
    results
  })
})

router.get('/:playerId', [Player.checkError(true, false)], async (req, res) => {
  const { playerId } = req.params
  let results = await Player.getPlayer(req, playerId)
  results = await Player.setPlayer(results, true)
  res.status(200).send({
    status: 200,
    message: 'success',
    results
  })
})

router.post('/', Player.checkError(false, true), async (req, res) => {
  await Player.create(req)
  res.status(200).send({
    status: 200,
    message: 'success',
  })
})

router.put('/:playerId', Player.checkError(true, true), async (req, res) => {
  await Player.update(req)
  res.status(200).send({
    status: 200,
    message: 'success',
  })
})

router.delete('/:playerId', Player.checkError(true, false), async (req, res) => {
  const { playerId } = req.params
  await Player.destroy(playerId)
  res.status(200).send({
    status: 200,
    message: 'success',
  })
})

module.exports = router