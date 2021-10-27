import logger from "@shared/Logger";
import {NextFunction, Request, Response} from "express";
import TransactionModel, {ITransaction} from "../entities/transaction";
import UserModel from "../entities/User";

// GET

export async function getAllTransactions(
  req: Request,
  res: Response,
  next: NextFunction
) {
  let data;
  try {
    data = await TransactionModel.find({}).sort({createdAt: -1}).lean();
  } catch (error) {
    logger.info(error);
    // handle the error
    res.status(500).end();
    next();
  }
  res.json(data);
}

export async function getSgTransactions(req: Request, res: Response) {
  let data;
  try {
    data = await TransactionModel.find({
      $or: [{type: "deposit"}, {type: "expense"}],
    }).sort({createdAt: -1}).lean();
  } catch (error) {
    logger.info(error);
    // handle the error
    res.status(500).end();
  }
  res.json(data);
}

export async function getSelfTransactions(
  req: Request,
  res: Response,
  next: NextFunction
) {
  //@ts-ignore
  const keycloakID = req.kauth.grant.access_token.content.sub;
  let data;
  try {
    const mUser = await UserModel.findOne({ keycloakID });
    if (mUser) {
      data = await TransactionModel.find({
        $or: [{from: mUser.keycloakID}, {to: mUser.keycloakID}],
      }).sort({createdAt: -1}).lean();
    } else {
      throw new Error("No user match this username");
    }
  } catch (error) {
    logger.info(error);
    // handle the error
    res.status(500).end();
    next(error);
  }
  res.json(data);
}

export async function getUserTransactions(req: Request, res: Response) {
  const keycloakID = req.params.keycloakID;
  let data;
  try {
    const mUser = await UserModel.findOne({ keycloakID });
    if (mUser) {
      data = await TransactionModel.find({
        $or: [{from: mUser.keycloakID}, {to: mUser.keycloakID}],
      }).sort({createdAt: -1}).lean();
    } else {
      throw new Error();
    }
  } catch (error) {
    logger.info(error);
    // handle the error
    res.status(500).end();
  }
  res.json(data);
}

// POST

export async function addSgTransactions(req: Request, res: Response) {
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
}

async function updateUserBalanceByKeycloakID(
  keycloakID: null | string,
  amount: number
) {
  if (keycloakID) {
    const user = await UserModel.findOne({ keycloakID: keycloakID });
    if (user) {
      if (user.balance === undefined){
                user.balance = 0;
            }
            if (isNaN(+user.balance + amount)){
                logger.err(`can't update balance ${user.balance} by ${amount}`);
            }
            user.balance = +user.balance + amount;
            user.save();
    }
  }
}

async function updateUsersBalance(transfer: ITransaction) {
  await updateUserBalanceByKeycloakID(transfer.from, -transfer.amount);
  await updateUserBalanceByKeycloakID(transfer.to, +transfer.amount);
}

export async function addTransfer(req: Request, res: Response) {
  const transfer = req.body;
  let data;
  try {
    // check type
    if (!transfer || transfer.type !== "transfer") {
      return res.status(403).send("wrong type");
    }
    //@ts-ignore
    const actualKeycloakID = req.kauth.grant.access_token.content.sub;
    if (actualKeycloakID !== transfer.from) {
      // check user identity
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
    return res.send(data);
  } catch (error) {
    logger.info(error);
    // handle the error
    res.sendStatus(500);
  }
  res.json(data);
}

// PUT
export async function updateTransaction(req: Request, res: Response) {
  const id = req.params.id;
  const update = req.body;
  let data;
  try {
    data = await TransactionModel.findByIdAndUpdate(id);
    data.amount = -data.amount
    await updateUsersBalance(data)
    await updateUsersBalance(update)
    data.amount = -data.amount
    data.save();
  } catch (error) {
    logger.info(error);
    // handle the error
    res.status(500).end();
  }
  res.json(data);
}

// DELETE

export async function deleteTransaction(req: Request, res: Response) {
  const id = req.params.id;
  let data;
  try {
    data = await TransactionModel.findByIdAndUpdate(id);
    data.amount = -data.amount;
    await updateUsersBalance(data);
    data.amount = -data.amount;
    data.isValid = false;
    data.save();
    logger.info(`disabling transaction ${id}`)
  } catch (error) {
    logger.info(error);
    // handle the error
    res.status(500).end();
  }
  res.json(data);
}
