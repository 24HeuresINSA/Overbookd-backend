import { model, Schema } from "mongoose";

export interface IEquipment {
  _id?: string;
  name: string;
  amount: number;
  height?: number;
  width?: number;
  image?: string;
}

const EquipmentSchema = new Schema<IEquipment>(
  {
    name: { type: String, required: true },
  },
  { strict: false }
);

const EquipmentModel = model<Equipment>("Equipment", EquipmentSchema);

class Equipment implements IEquipment {
  amount = 1;

  constructor(public name: string) {}
}

export default EquipmentModel;
