const express = require('express')
const router = express.Router()
const MatchDetail = require('../functions/MatchDetail')
const Match = require('../functions/MatchResult')

router.get('/', async (req, res) => {
  let results = await MatchDetail.getMatchDetail(req)
  results = await MatchDetail.setMatchDetail(results)
  res.status(200).send({
    status: 200,
    message: 'success',
    results
  })
})

router.get('/:matchId', [Match.checkError(true, false)], async (req, res) => {
  let results = await MatchDetail.getMatchDetail(req)
  results = await MatchDetail.setMatchDetail(results)
  res.status(200).send({
    status: 200,
    message: 'success',
    results
  })
})

router.get('/one/:matchDetailId', [MatchDetail.checkError(true, false)], async (req, res) => {
  const { matchDetailId } = req.params
  let results = await MatchDetail.getMatchDetail(req, matchDetailId)
  results = await MatchDetail.setMatchDetail(results, true)
  res.status(200).send({
    status: 200,
    message: 'success',
    results
  })
})

router.put('/:matchDetailId', MatchDetail.checkError(true, true), async (req, res) => {
  await MatchDetail.update(req)
  res.status(200).send({
    status: 200,
    message: 'success',
  })
})

module.exports = router