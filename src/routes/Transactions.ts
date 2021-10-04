import logger from "@shared/Logger";
import { Request, Response, NextFunction } from "express";
import TransactionModel, {ITransaction} from "../entities/Transaction";
import UserModel from "../entities/User";
import {keycloak} from "../keycloak";
import mapContaining = jasmine.mapContaining;

// GET

export async function getAllTransactions(req: Request, res: Response, next: NextFunction) {
    let data;
    try {
        data = await TransactionModel.find({}).lean();
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
        data = await TransactionModel.find({ $or: [{ type: "deposit" }, { type: "expense" }] }).lean();
    } catch (error) {
        logger.info(error);
        // handle the error
        res.status(500).end();
    }
    res.json(data);
}

export async function getSelfTransactions(req: Request, res: Response) {
    //TODO: Implement better way
    //@ts-ignore
    const username = req.kauth.grant.access_token.content.preferred_username;
    let [firstname, lastname] = username.split('.')
    let data;
    try {
        const mUser = await UserModel.findOne({ firstname, lastname  })
        if (mUser) {
            data = await TransactionModel.find({ $or: [
                {from: mUser.keycloakID},
                {to: mUser.keycloakID}
            ]}).lean();
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

export async function getUserTransactions(req: Request, res: Response) {
    const keycloakID = req.params.keycloakId;
    let data;
    try {
        const mUser = await UserModel.findOne({keycloakID})
        if (mUser) {
            data = await TransactionModel.find({ $or: [
                {from: mUser.keycloakID},
                {to: mUser.keycloakID}
            ]}).lean();
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
        await Promise.all(newTransactions.map(updateUsersBalance))
    } catch (error) {
        logger.info(error);
        // handle the error
        res.status(500).end();
    }
    res.json(data);
}

async function updateUserBalanceByKeycloakID(keycloakID: null | string, amount: number){
    if (keycloakID){
        let user = await UserModel.findOne({keycloakID: keycloakID})
        if (user){
            user.balance = +user.balance + amount;
            user.save()
        }
    }
}

async function updateUsersBalance(transfer: ITransaction){
    await updateUserBalanceByKeycloakID(transfer.from, -transfer.amount)
    await updateUserBalanceByKeycloakID(transfer.to, +transfer.amount)
}

export async function addTransfer(req: Request, res: Response) {
    let transfer = req.body;
    let data;
    try {
        // check type
        if (!transfer || transfer.type !== "transfer") {
            return res.status(403).send("wrong type")
        }
        //@ts-ignore
        const actualKeycloakID = req.kauth.grant.access_token.content.sub
        if (actualKeycloakID !== transfer.from){ // check user identity
            return res.status(403).send("user not matching with token")
        }

        if (transfer.amount < 0){ // negative transaction
            return res.status(403).send("negative amounts are forbidden")
        }
        logger.info(`new transaction requested from ${transfer.from} to ${transfer.to} of ${transfer.amount}`)
        data = await TransactionModel.create(transfer);
        // update user balance
        await updateUsersBalance(transfer)
        return res.send(data)

    } catch (error) {
        logger.info(error);
        // handle the error
        res.sendStatus(500);
    }
    res.json(data);
}

// PUT
export async function updateTransaction(req: Request, res: Response) {
    let id = req.params.id
    let update = req.body
    let data;
    try {
        data = await TransactionModel.updateOne({ _id: id }, update);
    } catch (error) {
        logger.info(error);
        // handle the error
        res.status(500).end();
    }
    res.json(data);
}

// DELETE

export async function deleteTransaction(req: Request, res: Response) {
    let id = req.params.id;
    let data;
    try {
        data = await TransactionModel.deleteOne({ _id: id });
    } catch (error) {
        logger.info(error);
        // handle the error
        res.status(500).end();
    }
    res.json(data);
}