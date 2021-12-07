import {model, Schema} from "mongoose";

export interface ILocation {
    name: string;
    latitude: number;
    longitude: number;
    neededBy: string[];
}
const LocationSchema = new Schema<ILocation>(
    {
        name: { type: String, required: true, unique: true },
        latitude: { type: Number, required: false },
        longitude: { type: Number, required: false },
        neededBy: { type: [String], required: true },
    }
);

const LocationModel = model<ILocation>("Location", LocationSchema);

export default LocationModel;