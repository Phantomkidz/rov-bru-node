const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('match_result', {
    mrId: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      field: 'mr_id'
    },
    mrDate: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'mr_date'
    },
    mrGameName: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'mr_game_name'
    },
    mrRound: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'mr_round'
    },
    mrRedTeam: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'mr_red_team'
    },
    mrBlueTeam: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'mr_blue_team'
    },
    mrWinner: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'mr_winner'
    },
    mrScoreR: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'mr_score_r'
    },
    mrScoreB: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'mr_score_b'
    },
    createDate: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'create_date'
    },
    updateDate: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'update_date'
    }
  }, {
    sequelize,
    tableName: 'match_result',
    timestamps: false
  });
};
