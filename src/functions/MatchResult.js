const { Op, models } = require('../db')
const matchModel = models.match_result
const matchDetailModel = models.match_detail
const { fn } = require('../util')
const validator = require('validator')
const _ = require('lodash')
const Team = require('./Team')

const self = (module.exports = {
  getMatch: matchId => {
    return matchModel.findAll({
      where: {
        [Op.and]: [matchId ? { mrId: matchId } : null]
      }
    })
  },

  setMatch: async (matchList = [], setOneRow = false) => {
    let results = []
    await Promise.all(
      matchList.map(async data => {
        const [redTeamList, blueTeamList] = await await Promise.all([
          Team.getTeam(data.mrRedTeam),
          Team.getTeam(data.mrBlueTeam),
        ])

        const [redTeam, blueTeam] = await Promise.all([
          Team.setTeam(redTeamList, true),
          Team.setTeam(blueTeamList, true),
        ])
        let row = {
          matchId: data.mrId,
          matchDate: data.mrDate,
          matchGameName: data.mrGameName,
          matchRound: data.mrRound,
          redTeam,
          blueTeam,
          matchWinner: data.mrWinner,
          scoreRedTeam: data.mrScoreR,
          scoreBlueTeam: data.mrScoreB
        }
        results.push(row)
      })
    )
    const resultOne = results[0] || []
    return setOneRow ? resultOne : _.orderBy(results, ['matchDate'], ['asc'])
  },

  checkError: (withParam, withBody) => {
    return async (req, res, next) => {
      let errorMessage = ""
      let { matchId } = req.params

      if(withParam && !errorMessage) {
        if(!validator.isInt(matchId === undefined ? '' : matchId)) {
          errorMessage = "Match ID must be number."
        } else {
          const checkMatch = await self.getMatch(matchId)
          if(!checkMatch[0]) {
            errorMessage = "Match ID is not found."
          }
        }
      }

      if(withBody) {
        const { matchDate, matchGameName, matchRound, redTeam, blueTeam } = req.body
        if(validator.isEmpty(matchDate === undefined ? '' : matchDate, { ignore_whitespace: true })) {
          errorMessage = "The match date field is require."
        } else if(validator.isEmpty(matchGameName === undefined ? '' : matchGameName, { ignore_whitespace: true })) {
          errorMessage = "The match name field is require."
        } else if(validator.isEmpty(matchRound === undefined ? '' : matchRound, { ignore_whitespace: true })) {
          errorMessage = "The match round field is require."
        } else if(!validator.isInt(redTeam === undefined ? '' : redTeam.toString())) {
          errorMessage = "The red team field must be number."
        } else if(!validator.isInt(blueTeam === undefined ? '' : blueTeam.toString())) {
          errorMessage = "The blue team field must be number."
        } else if(parseInt(redTeam) === parseInt(blueTeam)) {
          errorMessage = "The red and blue team field must not be the same."
        }

        if(redTeam && blueTeam && parseInt(redTeam) !== parseInt(blueTeam)) {
          const [checkRedTeam, checkBlueTeam] = await Promise.all([
            Team.getTeam(redTeam),
            Team.getTeam(blueTeam),
          ])

          if(!checkRedTeam[0]) {
            errorMessage = "Red team is not found"
          }
          if(!checkBlueTeam[0]) {
            errorMessage = "Blue team is not found"
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

  create: req => {
    const { matchDate, matchGameName, matchRound, redTeam, blueTeam, matchWinner, scoreRedTeam, scoreBlueTeam } = req.body
    return matchModel.create({
      mrDate: matchDate,
      mrGameName: matchGameName,
      mrRound: matchRound,
      mrRedTeam: redTeam,
      mrBlueTeam: blueTeam,
      mrWinner: matchWinner,
      mrScoreR: scoreRedTeam,
      mrScoreB: scoreBlueTeam,
      createDate: fn.db2datetime(new Date())
    }).then(async result => {

      let defaultDetail = {
        mrId: result.mrId,
        mdMakeDamage: 0,
        mdGetDamage: 0,
        mdTeamFight: 0,
        mdKill: 0,
        mdAssist: 0,
        mdDead: 0,
        mdMoney: 0,
        mdScore: 0.0,
      }

      const matchDetailCreate = []

      for(let i = 1; i <= 10; i++) {
        if(i <= 5) {
          teamDefault.push({
            ...defaultDetail,
            mdTeamType: 'R'
          })
        } else {
          teamDefault.push({
            ...defaultDetail,
            mdTeamType: 'B'
          })
        }
      }

      await matchDetailModel.bulkCreate(matchDetailCreate)
    })
  },

  update: req => {
    const { matchDate, matchGameName, matchRound, redTeam, blueTeam, matchWinner, scoreRedTeam, scoreBlueTeam } = req.body
    const { matchId } = req.params
    return matchModel.update({
      mrDate: matchDate,
      mrGameName: matchGameName,
      mrRound: matchRound,
      mrRedTeam: redTeam,
      mrBlueTeam: blueTeam,
      mrWinner: matchWinner,
      mrScoreR: scoreRedTeam,
      mrScoreB: scoreBlueTeam,
      updateDate: fn.db2datetime(new Date())
    }, {
      where: {
        mrId: matchId
      }
    })
  },

  destroy: async matchId => {

    await matchDetailModel.destroy({
      where: { mrId: matchId }
    })

    return matchModel.destroy({
      where: {
        mrId: matchId
      }
    })
  }
})