module.exports = (sequelize, DataTypes) => {
    return sequelize.define('event-list', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            unique: true,
            autoIncrement: true
        },
        title: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false,
        },
        description: {
            type: DataTypes.TEXT,
            unique: false,
            allowNull: false,
        },
        banner: {
            type: DataTypes.STRING,
            unique: false,
            allowNull: false,
        },
    }, {
        timestamps: false,
    });
};