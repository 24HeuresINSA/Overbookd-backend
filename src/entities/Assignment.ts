import { Schema, model, Types } from 'mongoose';

export interface IAssignment {
    name: string;
    userId: Types.ObjectId;
    FTId: Types.ObjectId;
    timeslotId: Types.ObjectId;
    by: Types.ObjectId;
}

const AssignmentSchema = new Schema<IAssignment>({
    name: { type: String, required: true },
    userId: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
    FTId: { type: Schema.Types.ObjectId, required: false, ref: 'FT' },
    timeslotId: { type: Schema.Types.ObjectId, required: true, ref: 'Timeslot' },
    by: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
});

const AssignmentModel = model<IAssignment>('Assignment', AssignmentSchema);

export default AssignmentModel;