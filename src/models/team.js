const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('team', {
    tId: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      field: 't_id'
    },
    sId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 's_id'
    },
    tName: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 't_name'
    }
  }, {
    sequelize,
    tableName: 'team',
    timestamps: false
  });
};
