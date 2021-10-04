import { model, Schema } from "mongoose";

export interface IFA {
  count: number;
  name: string;
  FTs: Record<string, unknown>[];
}

const FASchema = new Schema<IFA>(
  {
    name: { type: String, required: true },
  },
  { strict: false }
);

const FAModel = model<FA>("FA", FASchema);

class FA implements IFA {
  FTs = [];
  constructor(public name: string, public count: number) {}
}

export default FAModel;
