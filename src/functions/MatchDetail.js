const { Op, models } = require('../db')
const matchDetailModel = models.match_detail
const playerModel = models.player
const heroModel = models.hero
const teamModel = models.team
const matchModel = models.match_result
const validator = require('validator')
const Hero = require('./Hero')

const self = (module.exports = {
  getMatchDetail: async (req, matchDetailId = '') => {
    const { matchId } = req.params

    matchDetailModel.hasOne(playerModel, { foreignKey: "pId", sourceKey: "pId" })
    matchDetailModel.hasOne(heroModel, { foreignKey: "hId", sourceKey: "hId" })
    matchDetailModel.hasOne(matchModel, { foreignKey: "mrId", sourceKey: "mrId" })
    playerModel.hasOne(teamModel, { foreignKey: "tId", sourceKey: "tId" })

    return matchDetailModel.findAll({
      include: [
        {
          model: playerModel,
          required: false,
          include: [
            {
              model: teamModel,
              required: true
            }
          ]
        },
        {
          model: heroModel,
          required: false
        },
        {
          model: matchModel,
          required: true
        }
      ],
      where: {
        [Op.and]: [
          matchId ? { mrId: matchId } : null,
          matchDetailId ? { mdId: matchDetailId } : null,
        ]
      }
    })
  },

  setMatchDetail: async (matchDetailList = [], setOneRow = false) => {
    let results = []
    await Promise.all(
      matchDetailList.map(data => {
        let row = {
          matchDetailId: data.mdId,
          matchId: data.mrId,
          matchRound: data.match_result.mrRound,
          matchGameName: data.match_result.mrGameName,
          matchDate: data.match_result.mrDate,
          playerId: data.pId ? data.pId : '',
          heroId: data.hId ? data.hId : '',
          playerName: data.player ? data.player.pName : '',
          playerIngameName: data.player ? data.player.pIngameName : '',
          playerPosition: data.player ? data.player.pPosition : '',
          heroName: data.hero ? data.hero.hName : '',
          teamName: data.player ? data.player.team.tName : '',
          makeDamage: data.mdMakeDamage,
          getDamage: data.mdGetDamage,
          teamFight: data.mdTeamFight,
          amountKill: data.mdKill,
          amountAssist: data.mdAssist,
          amountDead: data.mdDead,
          money: data.mdMoney,
          score: data.mdScore,
          teamType: data.mdTeamType
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
      let { matchDetailId } = req.params

      if(withParam && !errorMessage) {
        if(!validator.isInt(matchDetailId === undefined ? '' : matchDetailId)) {
          errorMessage = "Match detail ID must be number."
        } else {
          const checkDetail = await self.getMatchDetail(req, matchDetailId)

          if(!checkDetail[0]) {
            errorMessage = "Match detail ID is not found."
          }
        }
      }

      if(withBody) {
        const { heroId, makeDamage, getDamage, teamFight, amountKill, amountAssist, amountDead, money, score } = req.body

        if(!validator.isInt(heroId === undefined ? '' : heroId.toString())) {
          errorMessage = "Hero ID must be number."
        } else if(!validator.isInt(makeDamage === undefined ? '' : makeDamage.toString())) {
          errorMessage = "the damage field must be number."
        } else if(!validator.isInt(getDamage === undefined ? '' : getDamage.toString())) {
          errorMessage = "the get damage field must be number."
        } else if(!validator.isInt(teamFight === undefined ? '' : teamFight.toString())) {
          errorMessage = "the team fight field must be number."
        } else if(!validator.isInt(amountKill === undefined ? '' : amountKill.toString())) {
          errorMessage = "the kill field must be number."
        } else if(!validator.isInt(amountAssist === undefined ? '' : amountAssist.toString())) {
          errorMessage = "the assist field must be number."
        } else if(!validator.isInt(amountDead === undefined ? '' : amountDead.toString())) {
          errorMessage = "the dead field must be number."
        } else if(!validator.isInt(money === undefined ? '' : money.toString())) {
          errorMessage = "the money field must be number."
        } else if(validator.isEmpty(score === undefined ? '' : score.toString(), { ignore_whitespace: true })) {
          errorMessage = "the score field is require."
        }

        if(heroId) {
          const checkHero = await Hero.getHero(heroId)
          if(!checkHero[0]) {
            errorMessage = "Hero ID is not found."
          }
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

  update: req => {
    const { heroId, playerId, makeDamage, getDamage, teamFight, amountKill, amountAssist, amountDead, money, score } = req.body
    const { matchDetailId } = req.params
    return matchDetailModel.update({
      hId: heroId,
      pId: playerId,
      mdMakeDamage: makeDamage,
      mdGetDamage: getDamage,
      mdTeamFight: teamFight,
      mdKill: amountKill,
      mdAssist: amountAssist,
      mdDead: amountDead,
      mdMoney: money,
      mdScore: score
    }, {
      where: {
        mdId: matchDetailId
      }
    })
  },

})