const { Notification, SupportTicket, SupportTicketMessage, User } = require('../models');
const { apiSuccess, apiError } = require('../utils/apiResponse');
const { generateTicketNumber } = require('../utils/helpers');
const { Op } = require('sequelize');

/**
 * GET /api/notifications
 * Get user notifications
 */
async function getNotifications(req, res, next) {
  try {
    const userId = req.user.id;
    const { page = 1, limit = 20, unreadOnly = false } = req.query;

    const where = { userId };
    if (unreadOnly === 'true') {
      where.isRead = false;
    }

    const offset = (page - 1) * limit;

    const { count, rows: notifications } = await Notification.findAndCountAll({
      where,
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset,
    });

    const unreadCount = await Notification.count({ where: { userId, isRead: false } });

    return apiSuccess(res, {
      message: 'Notifications retrieved',
      data: notifications,
      meta: {
        unreadCount,
      },
      pagination: {
        page: parseInt(page),
        perPage: parseInt(limit),
        total: count,
        totalPages: Math.ceil(count / limit),
      },
    });
  } catch (error) {
    next(error);
  }
}

/**
 * PUT /api/notifications/:id/read
 * Mark notification as read
 */
async function markNotificationRead(req, res, next) {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const notification = await Notification.findOne({ where: { id, userId } });
    if (!notification) {
      return apiError(res, 'Notification not found', 404);
    }

    await notification.update({ isRead: true, readAt: new Date() });

    return apiSuccess(res, {
      message: 'Notification marked as read',
    });
  } catch (error) {
    next(error);
  }
}

/**
 * POST /api/support/ticket
 * Create support ticket
 */
async function createSupportTicket(req, res, next) {
  try {
    const userId = req.user.id;
    const { issueType, subject, message, attachments } = req.body;

    const ticketNumber = generateTicketNumber();

    const ticket = await SupportTicket.create({
      userId,
      ticketNumber,
      issueType,
      subject,
      message,
      attachments: attachments || [],
      status: 'open',
      priority: 'medium',
    });

    return apiSuccess(res, {
      message: 'Support ticket created successfully',
      data: ticket,
    }, 201);
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/support/tickets
 * Get user support tickets
 */
async function getSupportTickets(req, res, next) {
  try {
    const userId = req.user.id;
    const { status, page = 1, limit = 20 } = req.query;

    const where = { userId };
    if (status) where.status = status;

    const offset = (page - 1) * limit;

    const { count, rows: tickets } = await SupportTicket.findAndCountAll({
      where,
      include: [
        {
          model: SupportTicketMessage,
          as: 'messages',
          limit: 1,
          order: [['createdAt', 'DESC']],
        },
      ],
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset,
    });

    return apiSuccess(res, {
      message: 'Support tickets retrieved',
      data: tickets,
      pagination: {
        page: parseInt(page),
        perPage: parseInt(limit),
        total: count,
        totalPages: Math.ceil(count / limit),
      },
    });
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/support/tickets/:id
 * Get support ticket details
 */
async function getSupportTicketDetails(req, res, next) {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const ticket = await SupportTicket.findOne({
      where: { id, userId },
      include: [
        {
          model: SupportTicketMessage,
          as: 'messages',
          include: [{ model: User, as: 'user', attributes: ['id', 'firstName', 'lastName'] }],
          order: [['createdAt', 'ASC']],
        },
      ],
    });

    if (!ticket) {
      return apiError(res, 'Support ticket not found', 404);
    }

    return apiSuccess(res, {
      message: 'Ticket details retrieved',
      data: ticket,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * POST /api/support/tickets/:id/message
 * Add message to support ticket
 */
async function addTicketMessage(req, res, next) {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const { message, attachments } = req.body;

    const ticket = await SupportTicket.findOne({ where: { id, userId } });
    if (!ticket) {
      return apiError(res, 'Support ticket not found', 404);
    }

    const ticketMessage = await SupportTicketMessage.create({
      ticketId: id,
      userId,
      message,
      attachments: attachments || [],
      isStaffReply: false,
    });

    return apiSuccess(res, {
      message: 'Message added successfully',
      data: ticketMessage,
    }, 201);
  } catch (error) {
    next(error);
  }
}

/**
 * Internal function to create notification
 */
async function createNotification(userId, type, title, message, data = null) {
  return await Notification.create({
    userId,
    type,
    title,
    message,
    data,
    isRead: false,
  });
}

module.exports = {
  getNotifications,
  markNotificationRead,
  createSupportTicket,
  getSupportTickets,
  getSupportTicketDetails,
  addTicketMessage,
  createNotification,
};
