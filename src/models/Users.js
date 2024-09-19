module.exports = (sequelize, DataTypes) => {
  return sequelize.define(
    "users",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        unique: true,
        autoIncrement: true,
      },
      userTag: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
      },
      userId: {
        type: DataTypes.TEXT,
        unique: true,
        allowNull: false,
      },
      balance: {
        type: DataTypes.INTEGER,
        unique: false,
        allowNull: false,
      },
    },
    {
      timestamps: false,
    },
  );
};
