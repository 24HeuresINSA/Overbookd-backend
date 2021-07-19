import StatusCodes from 'http-status-codes';
import {Request, Response} from "express";
import FTModel from "@entities/FT";


export async function getAllFTs(req: Request, res: Response) {
    const mFTs = await FTModel.find({});
    res.json(mFTs)
}

export async function getFTByID(req: Request, res: Response) {
    const mFT = await FTModel.findById(req.params.FTID);
    res.json(mFT)
}


export async function createFT(req: Request, res: Response) {
    const mFT = req.body;
    const FT = await FTModel.create(mFT);
    res.json(FT);
}

export async function updateFT(req: Request, res: Response) {
    const mFT = req.body;
    if(mFT._id){
        await FTModel.findByIdAndUpdate(mFT._id, mFT);
        res.sendStatus(StatusCodes.OK)
    } else {
        res.sendStatus(StatusCodes.BAD_REQUEST)
    }
}

export async function deleteFT(req: Request, res: Response) {
    const mFT = req.body;
    if(mFT._id){
        await FTModel.findByIdAndDelete(mFT._id);
        res.sendStatus(StatusCodes.OK)
    } else {
        res.sendStatus(StatusCodes.BAD_REQUEST)
    }
}

