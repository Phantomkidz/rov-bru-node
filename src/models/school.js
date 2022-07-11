const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('school', {
    sId: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      field: 's_id'
    },
    sName: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 's_name'
    },
    sCity: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 's_city'
    }
  }, {
    sequelize,
    tableName: 'school',
    timestamps: false
  });
};
