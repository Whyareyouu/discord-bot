module.exports = (sequelize, DataTypes) => {
    return sequelize.define('event', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            unique: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING,
            unique: false,
            allowNull: false,
        },
        players: {
            type: DataTypes.ARRAY(DataTypes.STRING),
            unique: false,
            allowNull: false,
        },
        playerBonus: {
            type: DataTypes.INTEGER,
            unique: false,
            allowNull: false,
        },
    }, {
        timestamps: true,
    });
};