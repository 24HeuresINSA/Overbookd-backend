import { Request, Response } from "express";
import StatusCodes from "http-status-codes";
import logger from "@shared/Logger";
import AssignmentModel, { IAssignment } from "@entities/Assignment";

export async function getAssignments(req: Request, res: Response) {
  try {
    const assignments = await AssignmentModel.find();
    res.status(StatusCodes.OK).json(assignments);
  } catch (error) {
    logger.info(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error);
  }
}

export async function createAssignment(req: Request, res: Response) {
  try {
    const assignment = new AssignmentModel(req.body);
    await assignment.save();
    res.status(StatusCodes.CREATED).json(assignment);
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error);
  }
}

export async function updateAssignment(req: Request, res: Response) {
  try {
  const assignment = await AssignmentModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(assignment);
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error);
  }
}

export async function getAssignmentsByUserId(req: Request, res: Response) {
  try {
    const assignment = await AssignmentModel.find({ userId: req.params.id });
    res.json(assignment);
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error);
  }
}

export async function getAssignmentsByFTId(req: Request, res: Response) {
  try {
    const assignment = await AssignmentModel.find({ FTId: req.params.id });
    res.json(assignment);
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error);
  }
}