const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('match_detail', {
    mdId: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      field: 'md_id'
    },
    pId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'p_id'
    },
    hId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'h_id'
    },
    mrId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'mr_id'
    },
    mdMakeDamage: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'md_make_damage'
    },
    mdGetDamage: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'md_get_damage'
    },
    mdTeamFight: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'md_team_fight'
    },
    mdKill: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'md_kill'
    },
    mdAssist: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'md_assist'
    },
    mdDead: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'md_dead'
    },
    mdMoney: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'md_money'
    },
    mdScore: {
      type: DataTypes.REAL,
      allowNull: true,
      field: 'md_score'
    },
    mdTeamType: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'md_team_type'
    }
  }, {
    sequelize,
    tableName: 'match_detail',
    timestamps: false
  });
};
