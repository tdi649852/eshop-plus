const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/database');

class SupportTicket extends Model {}

SupportTicket.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: 'user_id',
    },
    ticketNumber: {
      type: DataTypes.STRING(20),
      allowNull: false,
      unique: true,
      field: 'ticket_number',
    },
    issueType: {
      type: DataTypes.ENUM('order', 'payment', 'product', 'account', 'technical', 'other'),
      allowNull: false,
      field: 'issue_type',
    },
    subject: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    attachments: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM('open', 'in_progress', 'resolved', 'closed'),
      defaultValue: 'open',
    },
    priority: {
      type: DataTypes.ENUM('low', 'medium', 'high', 'urgent'),
      defaultValue: 'medium',
    },
    assignedTo: {
      type: DataTypes.UUID,
      allowNull: true,
      field: 'assigned_to',
    },
    resolvedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'resolved_at',
    },
  },
  {
    sequelize,
    modelName: 'SupportTicket',
    tableName: 'support_tickets',
  },
);

module.exports = SupportTicket;
