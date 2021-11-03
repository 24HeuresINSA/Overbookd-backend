import logger from "@shared/Logger";
import {RequestHandler} from "express";
import TransactionModel, {ITransaction} from "../entities/transaction";
import UserModel from "../entities/User";

// GET

export const getAllTransactions: RequestHandler = async function (
  req,
  res,
  next
) {
  let data;
  try {
    data = await TransactionModel.find({}).sort({ createdAt: -1 }).lean();
  } catch (error) {
    logger.info(error);
    // handle the error
    res.status(500).end();
    next();
  }
  res.json(data);
};

export const getSgTransactions: RequestHandler = async function (req, res) {
  let data;
  try {
    data = await TransactionModel.find({
      $or: [{type: "deposit"}, {type: "expense"}],
    })
      .sort({ createdAt: -1 })
      .sort({createdAt: -1}).lean();
  } catch (error) {
    logger.info(error);
    // handle the error
    res.status(500).end();
  }
  res.json(data);
};

export const getSelfTransactions: RequestHandler = async function (
  req,
  res,
  next
) {
  let data;
  try {
    const user = res.locals.auth_user;
    data = await TransactionModel.find({
      $or: [{ from: user._id }, { to: user._id }],
    })
      .sort({ createdAt: -1 })
      .lean();
  } catch (error) {
    logger.info(error);
    // handle the error
    res.status(500).end();
    next(error);
  }
  res.json(data);
};

export const getUserTransactions: RequestHandler = async function (req, res) {
  const _id = req.params.userID;
  let data;
  try {
    const mUser = await UserModel.findOne({ _id });
    if (mUser) {
      data = await TransactionModel.find({
        $or: [{from: mUser._id}, {to: mUser._id }],
      })
        .sort({ createdAt: -1})
        .sort({createdAt: -1}).lean();
    } else {
      throw new Error();
    }
  } catch (error) {
    logger.info(error);
    // handle the error
    res.status(500).end();
  }
  res.json(data);
};

// POST

export const addSgTransactions: RequestHandler = async function (req, res) {
  const newTransactions: ITransaction[] = req.body;
  let data;
  try {
    data = await TransactionModel.create(newTransactions);
    await Promise.all(newTransactions.map(updateUsersBalance));
  } catch (error) {
    logger.info(error);
    // handle the error
    res.status(500).end();
  }
  res.json(data);
};

async function updateUserBalanceByID(
  _id: null | string,
  amount: number
): Promise<void> {
  if (_id) {
    const user = await UserModel.findOne({ _id });
    if (user) {
      if (user.balance === undefined) {
        user.balance = 0;
      }
      if (isNaN(user.balance + amount)) {
        logger.err(`can't update balance ${user.balance} by ${amount}`);
      }
      user.balance = user.balance + amount;
      user.save();
    }
  }
}

async function updateUsersBalance(transfer: ITransaction): Promise<void> {
  await updateUserBalanceByID(transfer.from, -transfer.amount);
  await updateUserBalanceByID(transfer.to, +transfer.amount);
}

export const addTransfer: RequestHandler = async function (req, res) {
  const transfer = req.body;
  const user = res.locals.auth_user;
  let data;
  try {
    // check type
    if (!transfer || transfer.type !== "transfer") {
      return res.status(403).send("wrong type");
    }

    if (user._id.toString() !== transfer.from) {
      // check user identity
      logger.info(`user ${user._id} not matching token ${transfer.from}`);
      return res.status(403).send("user not matching with token");
    }

    if (transfer.amount < 0) {
      // negative transaction
      return res.status(403).send("negative amounts are forbidden");
    }
    logger.info(
      `new transaction requested from ${transfer.from} to ${transfer.to} of ${transfer.amount}`
    );
    data = await TransactionModel.create(transfer);
    // update user balance
    await updateUsersBalance(transfer);
  } catch (error) {
    logger.info(error);
    // handle the error
    res.sendStatus(500).end();
  }
  res.json(data);
};

// DELETE

export const deleteTransaction: RequestHandler = async function (req, res) {
  const id = req.params.id;
  let data;
  try {
    data = await TransactionModel.findByIdAndUpdate(id);
    data.amount = -data.amount;
    await updateUsersBalance(data);
    data.amount = -data.amount;
    data.isValid = false;
    data.save();
    logger.info(`disabling transaction ${id}`);
  } catch (error) {
    logger.info(error);
    // handle the error
    res.status(500).end();
  }
  res.json(data);
};
