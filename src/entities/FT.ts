import {model, Schema} from "mongoose";

export interface IFT{
    name: string;
}

const FTSchema = new Schema<IFT>({
    name: { type: String, required: true },
},{strict: false})

const FTModel = model<FT>('FT', FTSchema);

class FT implements IFT {
    constructor(
        public name: string,
    ) {
    }
}

export default FTModel
