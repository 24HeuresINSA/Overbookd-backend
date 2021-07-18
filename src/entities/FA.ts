import {model, Schema} from "mongoose";

export interface IFA{
    name: string;
    FTs : Object[];
}

const FASchema = new Schema<IFA>({
    name: { type: String, required: true },
},{strict: false})

const FAModel = model<FA>('FA', FASchema);

class FA implements IFA {
    FTs = [];
    constructor(
        public name: string,
    ) {
    }
}

export default FAModel
