'use strict';
let uuid = require('uuid/v4');

module.exports = (sequelize, DataTypes) => {
  const file = sequelize.define('file', {
    id: {
      type: DataTypes.UUID,
      primaryKey: true
    },
    owner: {
      type: DataTypes.UUID
    },
    displayName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    urlName: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    }
  }, {
    freezeTableName: true,
    timestamps: true
  });
  file.beforeCreate(file => file.id = uuid());
  file.associate = function (models) {
    file.belongsTo(models.user, { foreignKey: 'owner' });
  };
  return file;
};
