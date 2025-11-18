const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/database');
const { USER_ROLES } = require('../utils/constants');

class User extends Model {
  toSafeJSON() {
    const values = { ...this.get() };
    delete values.password;
    delete values.resetToken;
    return values;
  }
}

User.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    firstName: {
      type: DataTypes.STRING(80),
      allowNull: false,
    },
    lastName: {
      type: DataTypes.STRING(80),
      allowNull: true,
    },
    email: {
      type: DataTypes.STRING(120),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    phone: {
      type: DataTypes.STRING(15),
      allowNull: true,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM(...Object.values(USER_ROLES)),
      defaultValue: USER_ROLES.CUSTOMER,
    },
    status: {
      type: DataTypes.ENUM('active', 'inactive', 'suspended'),
      defaultValue: 'active',
    },
    defaultCityId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true,
      field: 'default_city_id',
    },
    isEmailVerified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    lastLoginAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    resetToken: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: 'User',
    tableName: 'users',
    defaultScope: {
      attributes: {
        exclude: ['password', 'resetToken'],
      },
    },
    scopes: {
      withPassword: {
        attributes: { include: ['password'] },
      },
    },
  },
);

module.exports = User;


