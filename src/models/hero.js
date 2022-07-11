const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('hero', {
    hId: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      field: 'h_id'
    },
    hName: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'h_name'
    }
  }, {
    sequelize,
    tableName: 'hero',
    timestamps: false
  });
};
