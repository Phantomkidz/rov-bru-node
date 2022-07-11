require('dotenv').config()

const Sequelize = require('sequelize')
const Op = Sequelize.Op
const QueryTypes = Sequelize.QueryTypes
const initModels = require("./models/init-models")

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: './bru-rov.sqlite',
    dialect: 'sqlite',
    logging: false,
    additional: {
      timestamps: false,
    }
  }
)



const models = initModels(sequelize)

sequelize
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.')
  })
  .catch((err) => {
    console.error('Unable to connect to the database:', err)
  })

module.exports = { sequelize, models, Op, QueryTypes }