import { Transaction } from '@sentry/tracing';
import { Schema, model } from 'mongoose';
import { IUser } from './User';

interface IExpense {
    type: "expense"
    from: IUser["keycloakID"],
    to: null,
    amount: number,
    context: string,
    createdAt: Date,
    updatedAt: Date,
}

interface IDeposit {
    type: "deposit",
    from: IUser["keycloakID"],
    to: null,
    amount: number,
    context: null,
    createdAt: Date,
    updatedAt: Date,
}

interface ITransfer {
    type: "transfer"
    from: IUser["keycloakID"],
    to: IUser["keycloakID"],
    amount: number,
    context: string,
    createdAt: Date,
    updatedAt: Date,
}

export type ITransaction = IExpense | IDeposit | ITransfer

const TransactionSchema = new Schema<ITransaction>({
    type: { type: String, enum:["deposit", "transfer", "expense"], required: true },
    from: { type: String, required: true },
    to: { type: String },
    amount: {  type: Number, required: true },
    context: { type: String },
    },
    {
        timestamps: true,
        strict: true
    });

const TransactionModel = model("Transaction", TransactionSchema);
export default TransactionModel;

//TODO Do I need more ?