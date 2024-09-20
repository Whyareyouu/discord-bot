const { Sequelize } = require("sequelize");
const { sequelize } = require("./dbInit.js");

const Event = require("./models/Event.js")(sequelize, Sequelize.DataTypes);
const EventList = require("./models/EventList.js")(
  sequelize,
  Sequelize.DataTypes,
);
const UserRooms = require("./models/UserRooms.js")(
  sequelize,
  Sequelize.DataTypes,
);
const Users = require("./models/Users.js")(sequelize, Sequelize.DataTypes);

module.exports = {
  Event,
  EventList,
  UserRooms,
  Users,
};
