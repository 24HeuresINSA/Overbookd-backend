import {model, Schema} from "mongoose";

export interface IFT {
  count?: number;
  schedules?: ISchedule[];
  _id?: string;
  general?: {
    name: string;
  }
}

interface ISchedule {
  date: string;
  start: Date;
  end: Date;
  needs: INeed[];
  assigned?: IAssign[];
}

interface INeed {
  role?: string;
  amount?: number;
}

interface IAssign {
  userID: string;
  _id: string;
  username?: string;
}

const FTSchema = new Schema<IFT>(
  {},
  {strict: false}
);

const FTModel = model<FT>("FT", FTSchema);

class FT implements IFT {
  constructor() {
  }
}

export default FTModel;
