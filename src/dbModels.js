const {Sequelize} = require("sequelize");
const {sequelize} = require("./dbInit.js");

const Events = require("./models/Event.js")(sequelize, Sequelize.DataTypes);
const EventList = require("./models/EventList.js")(sequelize, Sequelize.DataTypes);

module.exports = {
    Events,
    EventList
}