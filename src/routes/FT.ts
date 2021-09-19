import StatusCodes from 'http-status-codes';
import {Request, Response} from "express";
import FTModel, {IFT} from "@entities/FT";
import logger from "@shared/Logger";


export async function getAllFTs(req: Request, res: Response) {
    const mFTs = await FTModel.find({});
    res.json({data: mFTs})
}

export async function getFTByID(req: Request, res: Response) {
    const mFT = await FTModel.findById(req.params.FTID);
    res.json(mFT)
}


export async function createFT(req: Request, res: Response) {
    const mFT = <IFT> req.body;
    const FT = await FTModel.create(mFT);
    res.json(FT);
}

export async function updateFT(req: Request, res: Response) {
    const mFT = <IFT> req.body;
    if(mFT._id){
        await FTModel.findByIdAndUpdate(mFT._id, mFT);
        res.sendStatus(StatusCodes.OK)
    } else {
        res.sendStatus(StatusCodes.BAD_REQUEST)
    }
}

export async function unassign(req: Request, res: Response){
    // unassign a user from an FT
    const {FTID, _id} = req.body;
    let FT =  await FTModel.findById(FTID);
    if (FT){
        let mFT = <IFT> FT.toObject()
        mFT.schedules?.forEach(schedule => {
            if (schedule.assigned){
                schedule.assigned = schedule.assigned.filter(assign => assign._id !== _id);
            }
        })
        logger.info(`unassigning ${FTID}`)
        await FTModel.findByIdAndUpdate(FTID, {
            schedules: mFT.schedules
        });
    }
}

export async function deleteFT(req: Request, res: Response) {
    const mFT = <IFT> req.body;
    if(mFT._id){
        await FTModel.findByIdAndDelete(mFT._id);
        res.sendStatus(StatusCodes.OK)
    } else {
        res.sendStatus(StatusCodes.BAD_REQUEST)
    }
}

