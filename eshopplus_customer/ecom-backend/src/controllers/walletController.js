const { User, WalletTransaction, WithdrawalRequest, sequelize } = require('../models');
const { apiSuccess, apiError } = require('../utils/apiResponse');
const { Op } = require('sequelize');

/**
 * GET /api/wallet/balance
 * Get wallet balance
 */
async function getWalletBalance(req, res, next) {
  try {
    const userId = req.user.id;

    const user = await User.findByPk(userId, {
      attributes: ['id', 'firstName', 'lastName', 'walletBalance'],
    });

    return apiSuccess(res, {
      message: 'Wallet balance retrieved',
      data: {
        balance: user.walletBalance,
        userId: user.id,
      },
    });
  } catch (error) {
    next(error);
  }
}

/**
 * POST /api/wallet/add-money
 * Add money to wallet (integrate with payment gateway)
 */
async function addMoney(req, res, next) {
  try {
    const userId = req.user.id;
    const { amount, paymentGatewayResponse } = req.body;

    if (amount <= 0) {
      return apiError(res, 'Invalid amount', 400);
    }

    const user = await User.findByPk(userId);

    const transaction = await sequelize.transaction(async (t) => {
      // Update wallet balance
      const newBalance = parseFloat(user.walletBalance) + parseFloat(amount);
      await user.update({ walletBalance: newBalance }, { transaction: t });

      // Create transaction record
      const walletTxn = await WalletTransaction.create({
        userId,
        type: 'credit',
        category: 'add_money',
        amount,
        balanceAfter: newBalance,
        message: `Added ₹${amount} to wallet`,
        status: 'completed',
        paymentGatewayResponse,
      }, { transaction: t });

      return { walletTxn, newBalance };
    });

    return apiSuccess(res, {
      message: 'Money added to wallet successfully',
      data: {
        transaction: transaction.walletTxn,
        newBalance: transaction.newBalance,
      },
    });
  } catch (error) {
    next(error);
  }
}

/**
 * POST /api/wallet/withdraw
 * Request withdrawal
 */
async function requestWithdrawal(req, res, next) {
  try {
    const userId = req.user.id;
    const { amount, bankName, accountNumber, ifscCode, accountHolderName } = req.body;

    if (amount <= 0) {
      return apiError(res, 'Invalid amount', 400);
    }

    const user = await User.findByPk(userId);

    if (parseFloat(user.walletBalance) < parseFloat(amount)) {
      return apiError(res, 'Insufficient wallet balance', 400);
    }

    const withdrawalRequest = await WithdrawalRequest.create({
      userId,
      amount,
      bankName,
      accountNumber,
      ifscCode,
      accountHolderName,
      status: 'pending',
    });

    return apiSuccess(res, {
      message: 'Withdrawal request submitted successfully',
      data: withdrawalRequest,
    }, 201);
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/wallet/transactions
 * Get wallet transactions
 */
async function getTransactions(req, res, next) {
  try {
    const userId = req.user.id;
    const { type, category, page = 1, limit = 20 } = req.query;

    const where = { userId };
    if (type) where.type = type;
    if (category) where.category = category;

    const offset = (page - 1) * limit;

    const { count, rows: transactions } = await WalletTransaction.findAndCountAll({
      where,
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset,
    });

    return apiSuccess(res, {
      message: 'Transactions retrieved',
      data: transactions,
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
 * Internal function to credit wallet
 */
async function creditWallet(userId, amount, category, message, referenceId = null, transaction = null) {
  const user = await User.findByPk(userId);
  const newBalance = parseFloat(user.walletBalance) + parseFloat(amount);

  await user.update({ walletBalance: newBalance }, transaction ? { transaction } : {});

  const walletTxn = await WalletTransaction.create({
    userId,
    type: 'credit',
    category,
    amount,
    balanceAfter: newBalance,
    referenceId,
    message,
    status: 'completed',
  }, transaction ? { transaction } : {});

  return walletTxn;
}

/**
 * Internal function to debit wallet
 */
async function debitWallet(userId, amount, category, message, referenceId = null, transaction = null) {
  const user = await User.findByPk(userId);

  if (parseFloat(user.walletBalance) < parseFloat(amount)) {
    throw new Error('Insufficient wallet balance');
  }

  const newBalance = parseFloat(user.walletBalance) - parseFloat(amount);

  await user.update({ walletBalance: newBalance }, transaction ? { transaction } : {});

  const walletTxn = await WalletTransaction.create({
    userId,
    type: 'debit',
    category,
    amount,
    balanceAfter: newBalance,
    referenceId,
    message,
    status: 'completed',
  }, transaction ? { transaction } : {});

  return walletTxn;
}

module.exports = {
  getWalletBalance,
  addMoney,
  requestWithdrawal,
  getTransactions,
  creditWallet,
  debitWallet,
};
