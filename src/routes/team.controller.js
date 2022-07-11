const express = require('express')
const router = express.Router()
const Team = require('../functions/Team')

router.get('/', async (req, res) => {
  let results = await Team.getTeam()
  results = await Team.setTeam(results)
  res.status(200).send({
    status: 200,
    message: 'success',
    results
  })
})

router.get('/:teamId', [Team.checkError(true, false)], async (req, res) => {
  const { teamId } = req.params
  let results = await Team.getTeam(teamId)
  results = await Team.setTeam(results, true)
  res.status(200).send({
    status: 200,
    message: 'success',
    results
  })
})

router.post('/', Team.checkError(false, true), async (req, res) => {
  await Team.create(req)
  res.status(200).send({
    status: 200,
    message: 'success',
  })
})

router.put('/:teamId', Team.checkError(true, true), async (req, res) => {
  await Team.update(req)
  res.status(200).send({
    status: 200,
    message: 'success',
  })
})

router.delete('/:teamId', Team.checkError(true, false), async (req, res) => {
  const { teamId } = req.params
  await Team.destroy(teamId)
  res.status(200).send({
    status: 200,
    message: 'success',
  })
})

module.exports = router