const { Op, models } = require('../db')
const playerModel = models.player
const schoolModel = models.school
const teamModel = models.team
const matchDetailModel = models.match_detail
const validator = require('validator')
const Team = require('./Team')

const self = (module.exports = {
  getPlayer: (req, playerId) => {
    playerModel.hasOne(teamModel, { foreignKey: "tId", sourceKey: "tId" })
    teamModel.hasOne(schoolModel, { foreignKey: "sId", sourceKey: "sId" })
    const { teamId } = req.query
    return playerModel.findAll({
      include: [
        {
          model: teamModel,
          required: true,
          include: [
            {
              model: schoolModel,
              required: true
            }
          ],
        }
      ],
      where: {
        [Op.and]: [
          playerId ? { pId: playerId } : null,
          teamId ? { tId: teamId } : null
        ]
      }
    })
  },

  setPlayer: async (playerList = [], setOneRow = false) => {
    let results = []
    await Promise.all(
      playerList.map(data => {
        let row = {
          playerId: data.pId,
          teamId: data.tId,
          schoolId: data.team.school.sId,
          playerName: data.pName,
          playerPosition: data.pPosition,
          playerIngameName: data.pIngameName ? data.pIngameName : '',
          teamName: data.team.tName,
          schoolName: data.team.school.sName,
          schoolCity: data.team.school.sCity,
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
      let { playerId } = req.params
      let playerData
      if(withParam && !errorMessage) {
        if(!validator.isInt(playerId === undefined ? '' : playerId)) {
          errorMessage = "PLayer ID must be number."
        } else {
          const checkPlayer = await self.getPlayer(req, playerId)
          playerData = checkPlayer[0]
          if(!checkPlayer[0]) {
            errorMessage = "Player ID is not found."
          }
        }
      }

      if(withBody) {
        let { teamId, playerName, playerPosition, playerIngameName } = req.body

        if(validator.isEmpty(playerName === undefined ? '' : playerName, { ignore_whitespace: true })) {
          errorMessage = "The player name field is require."
        } else if(validator.isEmpty(playerPosition === undefined ? '' : playerPosition, { ignore_whitespace: true })) {
          errorMessage = "The player position field is require."
        } else if(validator.isEmpty(playerIngameName === undefined ? '' : playerIngameName, { ignore_whitespace: true })) {
          errorMessage = "The player in game name field is require."
        } else if(!validator.isInt(teamId === undefined ? '' : teamId.toString())) {
          errorMessage = "The team field is require."
        }

        if(teamId) {
          const checkTeam = await Team.getTeam(teamId)

          if(!checkTeam[0]) {
            errorMessage = 'Team ID is not found.'
          }
        }

        if(playerIngameName) {
          let checkUnique = await playerModel.findOne({
            where: {
              pIngameName: playerIngameName,
              [Op.and]: [
                playerId && req.method == 'PUT' ? {
                  pId: {
                    [Op.ne]: playerId
                  }
                } : null
              ]
            }
          })

          if(checkUnique) {
            errorMessage = "The player in game name field is already exits."
          }
        }
      }

      if(req.method === 'DELETE' && playerId) {
        const checkDetail = await matchDetailModel.findOne({
          where: {
            pId: playerId
          }
        })

        if(checkDetail) {
          errorMessage = "This player can't delete."
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
    const { teamId, playerName, playerPosition, playerIngameName } = req.body
    return playerModel.create({
      pName: playerName,
      pPosition: playerPosition,
      pIngameName: playerIngameName,
      tId: teamId
    })
  },

  update: req => {
    const { teamId, playerName, playerPosition, playerIngameName } = req.body
    const { playerId } = req.params
    return playerModel.update({
      pName: playerName,
      pPosition: playerPosition,
      pIngameName: playerIngameName,
      tId: teamId
    }, {
      where: {
        pId: playerId
      }
    })
  },

  destroy: playerId => {
    return playerModel.destroy({
      where: {
        pId: playerId
      }
    })
  }
})