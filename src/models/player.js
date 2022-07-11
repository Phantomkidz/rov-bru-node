const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('player', {
    pId: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      field: 'p_id'
    },
    tId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 't_id'
    },
    pName: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'p_name'
    },
    pPosition: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'p_position'
    },
    pIngameName: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'p_ingame_name'
    }
  }, {
    sequelize,
    tableName: 'player',
    timestamps: false
  });
};
