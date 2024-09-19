module.exports = (sequelize, DataTypes) => {
  return sequelize.define(
    "user-rooms",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        unique: true,
        autoIncrement: true,
      },
      userId: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
      },
      roomId: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
      },
    },
    {
      timestamps: false,
    },
  );
};
