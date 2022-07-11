const { Op, models } = require('../db')
const heroModel = models.hero
const matchDetailModel = models.match_detail
const validator = require('validator')

const self = (module.exports = {
  getHero: heroId => {

    return heroModel.findAll({
      where: {
        [Op.and]: [heroId ? { hId: heroId } : null]
      }
    })
  },

  setHero: async (heroList = [], setOneRow = false) => {
    let results = []
    await Promise.all(
      heroList.map(data => {
        let row = {
          heroId: data.hId,
          heroName: data.hName,
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
      let { heroId } = req.params
      let heroData
      if(withParam && !errorMessage) {
        if(!validator.isInt(heroId === undefined ? '' : heroId)) {
          errorMessage = "Hero ID must be number."
        } else {
          const checkHero = await self.getHero(heroId)
          heroData = checkHero[0]
          if(!checkHero[0]) {
            errorMessage = "Hero ID is not found."
          }
        }
      }

      if(withBody) {
        let { heroName } = req.body
        if(validator.isEmpty(heroName === undefined ? '' : heroName, { ignore_whitespace: true })) {
          errorMessage = "The team name field is require."
        }

        if(heroName && heroData) {
          let checkUnique = await heroModel.findOne({
            where: {
              hName: heroName,
              [Op.and]: [
                heroId ? {
                  hId: {
                    [Op.ne]: heroId
                  }
                } : null
              ]
            }
          })

          if(checkUnique) {
            errorMessage = "The hero name field is already exits."
          }
        }
      }

      if(req.method === 'DELETE' && heroId) {
        const checkDetail = await matchDetailModel.findOne({
          where: {
            hId: heroId
          }
        })

        if(checkDetail) {
          errorMessage = "This hero can't delete."
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
    const { heroName } = req.body
    return heroModel.create({
      hName: heroName
    })
  },

  update: req => {
    const { heroName } = req.body
    const { heroId } = req.params
    return heroModel.update({
      hName: heroName
    }, {
      where: {
        hId: heroId
      }
    })
  },

  destroy: heroId => {
    return heroModel.destroy({
      where: {
        hId: heroId
      }
    })
  }
})