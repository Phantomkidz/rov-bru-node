const express = require('express')
const router = express.Router()
const School = require('../functions/School')

router.get('/', async (req, res) => {
  let results = await School.getSchool()
  results = await School.setSchool(results)
  res.status(200).send({
    status: 200,
    message: 'success',
    results
  })
})

router.get('/:schoolId', [School.checkError(true, false)], async (req, res) => {
  const { schoolId } = req.params
  let results = await School.getSchool(schoolId)
  results = await School.setSchool(results, true)
  res.status(200).send({
    status: 200,
    message: 'success',
    results
  })
})

router.post('/', School.checkError(false, true), async (req, res) => {
  await School.create(req)
  res.status(200).send({
    status: 200,
    message: 'success',
  })
})

router.put('/:schoolId', School.checkError(true, true), async (req, res) => {
  await School.update(req)
  res.status(200).send({
    status: 200,
    message: 'success',
  })
})

router.delete('/:schoolId', School.checkError(true, false), async (req, res) => {
  const { schoolId } = req.params
  await School.destroy(schoolId)
  res.status(200).send({
    status: 200,
    message: 'success',
  })
})

module.exports = router