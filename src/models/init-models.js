var DataTypes = require("sequelize").DataTypes;
var _hero = require("./hero");
var _match_detail = require("./match_detail");
var _match_result = require("./match_result");
var _player = require("./player");
var _school = require("./school");
var _team = require("./team");

function initModels(sequelize) {
  var hero = _hero(sequelize, DataTypes);
  var match_detail = _match_detail(sequelize, DataTypes);
  var match_result = _match_result(sequelize, DataTypes);
  var player = _player(sequelize, DataTypes);
  var school = _school(sequelize, DataTypes);
  var team = _team(sequelize, DataTypes);


  return {
    hero,
    match_detail,
    match_result,
    player,
    school,
    team,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
