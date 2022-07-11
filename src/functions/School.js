const { Op, models } = require('../db')
const schoolModel = models.school
const teamModel = models.team
const validator = require('validator')

const self = (module.exports = {
  getSchool: schoolId => {
    return schoolModel.findAll({
      where: {
        [Op.and]: [schoolId ? { sId: schoolId } : null]
      }
    })
  },

  setSchool: async (schoolList = [], setOneRow = false) => {
    let results = []
    await Promise.all(
      schoolList.map(data => {
        let row = {
          schoolId: data.sId,
          schoolName: data.sName ? data.sName : '',
          schoolCity: data.sCity ? data.sCity : ''
        }
        results.push(row)
      })
    )
    const resultOne = results[0] || []
    return setOneRow ? resultOne : results
  },

  checkError: (withParam, withBody) => {
    return async (req, res, next) => {
      let errorMessage = ""
      let { schoolId } = req.params
      let schoolData
      if(withParam && !errorMessage) {
        if(!validator.isInt(schoolId)) {
          errorMessage = "School ID must be number."
        } else {
          const checkSchool = await self.getSchool(schoolId)
          schoolData = checkSchool[0]
          if(!checkSchool[0]) {
            errorMessage = "School ID not found."
          }
        }
      }

      if(withBody) {
        let { schoolName, schoolCity } = req.body
        if(validator.isEmpty(schoolName === undefined ? '' : schoolName, { ignore_whitespace: true })) {
          errorMessage = "The school name field is require."
        } else if(validator.isEmpty(schoolCity === undefined ? '' : schoolCity, { ignore_whitespace: true })) {
          errorMessage = "The city field is require."
        }
        if(schoolName && schoolData) {
          let checkUnique = await schoolModel.findOne({
            where: {
              sName: schoolName,
              [Op.and]: [
                schoolId ? {
                  sId: {
                    [Op.ne]: schoolId
                  }
                } : null
              ]
            }
          })

          if(checkUnique) {
            errorMessage = "The school name field is already exits."
          }
        }
      }

      if(req.method === 'DELETE' && schoolId) {

        const checkTeam = await teamModel.findOne({
          where: {
            sId: schoolId
          }
        })

        if(checkTeam) {
          errorMessage = "This school can't delete."
        }
      }

      if(errorMessage) {
        res.status(400).send({
          status: 400,
          message: errorMessage
        })
      } else {
        next()
      }
    }
  },

  create: req => {
    const { schoolName, schoolCity } = req.body
    return schoolModel.create({
      sName: schoolName,
      sCity: schoolCity
    })
  },

  update: req => {
    const { schoolName, schoolCity } = req.body
    const { schoolId } = req.params
    return schoolModel.update({
      sName: schoolName,
      sCity: schoolCity
    }, {
      where: {
        sId: schoolId
      }
    })
  },

  destroy: schoolId => {
    return schoolModel.destroy({
      where: {
        sId: schoolId
      }
    })
  }
})