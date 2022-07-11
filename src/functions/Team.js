const { Op, models } = require('../db')
const teamModel = models.team
const School = require('./School')
const schoolModel = models.school
const playerModel = models.player
const validator = require('validator')

const self = (module.exports = {
  getTeam: teamId => {
    teamModel.hasOne(schoolModel, { foreignKey: "sId", sourceKey: "sId" })
    teamModel.hasMany(playerModel, { foreignKey: "tId", sourceKey: "tId" })
    return teamModel.findAll({
      include: [
        {
          model: schoolModel,
          required: true
        },
        {
          model: playerModel,
          required: false
        }
      ],
      where: {
        [Op.and]: [teamId ? { tId: teamId } : null]
      }
    })
  },

  setTeam: async (teamList = [], setOneRow = false) => {
    let results = []
    await Promise.all(
      teamList.map(data => {

        let row = {
          teamId: data.tId,
          schoolId: data.sId,
          teamName: data.tName,
          schoolName: data.school.sName,
          schoolCity: data.school.sCity,
          players: data.players.map(item => {
            return {
              playerId: item.pId,
              playerName: item.pName,
              playerPosition: item.pPosition,
            }
          })

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
      let { teamId } = req.params
      let teamData
      if(withParam && !errorMessage) {
        if(!validator.isInt(teamId === undefined ? '' : teamId)) {
          errorMessage = "Team ID must be number."
        } else {
          const checkTeam = await self.getTeam(teamId)
          teamData = checkTeam[0]
          if(!checkTeam[0]) {
            errorMessage = "Team ID is not found."
          }
        }
      }

      if(withBody) {
        let { teamName, schoolId } = req.body
        if(validator.isEmpty(teamName === undefined ? '' : teamName, { ignore_whitespace: true })) {
          errorMessage = "The team name field is require."
        } else if(!validator.isInt(schoolId === undefined ? '' : schoolId.toString())) {
          errorMessage = "The school id field is require."
        }
        if(teamName) {
          let checkUnique = await teamModel.findOne({
            where: {
              tName: teamName,
              [Op.and]: [
                teamId && req.method == 'PUT' ? {
                  tId: {
                    [Op.ne]: teamId
                  }
                } : null
              ]
            }
          })

          if(checkUnique) {
            errorMessage = "The team name field is already exits."
          }
        }

        if(schoolId) {
          const checkSchool = await School.getSchool(schoolId)
          if(!checkSchool[0]) {
            errorMessage = "School ID is not found."
          }
        }
      }

      if(req.method === 'DELETE' && teamId) {

        const checkPlayer = await playerModel.findOne({
          where: {
            tId: teamId
          }
        })

        if(checkPlayer) {
          errorMessage = "This team can't delete."
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
    const { teamName, schoolId } = req.body
    return teamModel.create({
      tName: teamName,
      sId: schoolId
    })
  },

  update: req => {
    const { teamName, schoolId } = req.body
    const { teamId } = req.params
    return teamModel.update({
      tName: teamName,
      sId: schoolId
    }, {
      where: {
        tId: teamId
      }
    })
  },

  destroy: teamId => {
    return teamModel.destroy({
      where: {
        tId: teamId
      }
    })
  }
})