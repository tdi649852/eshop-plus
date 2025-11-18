const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/database');

class SupportTicketMessage extends Model {}

SupportTicketMessage.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    ticketId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: 'ticket_id',
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: 'user_id',
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    attachments: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    isStaffReply: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      field: 'is_staff_reply',
    },
  },
  {
    sequelize,
    modelName: 'SupportTicketMessage',
    tableName: 'support_ticket_messages',
  },
);

module.exports = SupportTicketMessage;
