const express = require('express')
const router = express.Router()
const Match = require('../functions/MatchResult')

router.get('/', async (req, res) => {
  let results = await Match.getMatch()
  results = await Match.setMatch(results)
  res.status(200).send({
    status: 200,
    message: 'success',
    results
  })
})

router.get('/:matchId', [Match.checkError(true, false)], async (req, res) => {
  const { matchId } = req.params
  let results = await Match.getMatch(matchId)
  results = await Match.setMatch(results, true)
  res.status(200).send({
    status: 200,
    message: 'success',
    results
  })
})

router.post('/', Match.checkError(false, true), async (req, res) => {
  await Match.create(req)
  res.status(200).send({
    status: 200,
    message: 'success',
  })
})

router.put('/:matchId', Match.checkError(true, true), async (req, res) => {
  await Match.update(req)
  res.status(200).send({
    status: 200,
    message: 'success',
  })
})

router.delete('/:matchId', Match.checkError(true, false), async (req, res) => {
  const { matchId } = req.params
  await Match.destroy(matchId)
  res.status(200).send({
    status: 200,
    message: 'success',
  })
})

module.exports = router