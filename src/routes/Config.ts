import StatusCodes from 'http-status-codes';
import { Request, Response } from 'express';

import UserDao from '@daos/User/UserDao.mock';
import { paramMissingError } from '@shared/constants';
import {connect} from "mongoose";
import ConfigModel from "@entities/Config";
import logger from "@shared/Logger";

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
    await connect((process.env.DATABASE_URL || 'mongodb://localhost:27017/' )+ 'local' ,
        {useNewUrlParser: true, useUnifiedTopology: true});
    const config = await ConfigModel.find({})
    return res.status(OK).json(config);
}

export async function setConfig(req: Request, res: Response) {
    await connect((process.env.DATABASE_URL || 'mongodb://localhost:27017/' )+ 'local' ,
        {useNewUrlParser: true, useUnifiedTopology: true});
    logger.info(`setting new config ${req.body.key}`)
    const isExisting = await ConfigModel.exists({key : req.body.key})
    if(isExisting){
        await ConfigModel.replaceOne({key : req.body.key},
            {key : req.body.key, value: req.body.value})
    } else {
        const mConfig = new ConfigModel({key : req.body.key, value: req.body.value});
        await mConfig.save();
    }
    return res.sendStatus(OK);
}

