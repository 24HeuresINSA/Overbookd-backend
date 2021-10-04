import { model, Schema } from "mongoose";

export interface IFT {
  schedules?: ISchedule[];
  _id?: string;
  name: string;
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
  {
    name: { type: String, required: true },
  },
  { strict: false }
);

const FTModel = model<FT>("FT", FTSchema);

class FT implements IFT {
  constructor(public name: string) {}
}

export default FTModel;
