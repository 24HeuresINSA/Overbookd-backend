import { model, Schema } from "mongoose";

export interface ITimeframe {
  start: string;
  end: string;
}

class timeframe implements ITimeframe {
  constructor(public start: string, public end: string) {}
}

export interface IAvailabilities {
  _id?: string;
  name: string;
  description?: string;
  days: timeframe[];
}

const AvailabilitiesSchema = new Schema<IAvailabilities>(
  {
    name: { type: String, required: true },
    description: { type: String, required: false },
  },
  { strict: false }
);

const AvailabilitiesModel = model<Availabilities>(
  "Availabilities",
  AvailabilitiesSchema
);

class Availabilities implements IAvailabilities {
  days = [];

  constructor(public name: string) {}
}

export default AvailabilitiesModel;
