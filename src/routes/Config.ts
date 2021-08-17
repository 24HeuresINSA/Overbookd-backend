import StatusCodes from 'http-status-codes';
import { Request, Response } from 'express';

import UserDao from '@daos/User/UserDao.mock';
import ConfigModel from "@entities/Config";
import logger from "@shared/Logger";
import {Config} from "../@types/express";

const userDao = new UserDao();
const { BAD_REQUEST, CREATED, OK } = StatusCodes;



/**
 * Get .
 *
 * @param req
 * @param res
 * @returns
 */
export async function getConfig(req: Request, res: Response) {
    logger.info('getting config ...');
    const config = await ConfigModel.find({})
    return res.status(OK).json(config);
}

export async function setConfig(req: Request, res: Response) {
    const {key, value} = <Config> req.body;
    logger.info(`setting new config ${key}`)
    const isExisting = await ConfigModel.exists({key})
    if(isExisting){
        await ConfigModel.replaceOne({key},
            {key, value})
    } else {
        const mConfig = new ConfigModel({key, value });
        await mConfig.save();
    }
    return res.sendStatus(OK);
}

