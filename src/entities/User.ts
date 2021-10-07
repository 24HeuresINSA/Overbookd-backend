import { Schema, model } from "mongoose";
import * as Factory from "factory.ts";
import faker from "faker";

export interface IUser {
  password?: string;
  password2?: string;
  notifications?: any[];
  _id?: string;
  id?: number;
  firstname: string;
  lastname: string;
  nickname?: string;
  balance?: number;
  charisma?: number;
  phone?: number;
  picture?: number;
  keycloakID: string;
  email: string;
  team?: string[];
  hasDriverLicense?: boolean;
  birthday?: Date;
  friends?: string[];
  transactionHistory?: any;
}

// Mock interface for data generation

export const UserMock = Factory.Sync.makeFactory<IUser>({
  firstname: Factory.Sync.each(() => faker.name.firstName()),
  lastname: Factory.Sync.each(() => faker.name.lastName()),
  keycloakID: Factory.Sync.each(() => faker.datatype.uuid()),
  email: Factory.Sync.each(() => faker.internet.email()),
});

const UserSchema = new Schema<IUser>(
  {
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    nickname: { type: String, required: false },
    balance: { type: Number, required: false },
    charisma: { type: Number, required: false },
    phone: { type: Number, required: false },
    picture: { type: String, required: false },
    keycloakID: { type: String, required: true },
    email: { type: String, required: true },
    team: { type: Array, required: false },
    hasDriverLicense: { type: Boolean, required: false },
    birthday: { type: Date, required: false },
    friends: { type: Array, required: false },
  },
  { strict: false }
);

const UserModel = model<User>("User", UserSchema);

class User implements IUser {
  team: string[] = [];
  friends: string[] = [];
  balance = 0;
  birthday: Date;
  driverLicenseDate: Date;
  notifications = [] as any[];

  constructor(
    public id: number,
    public firstname: string,
    public lastname: string,
    public charisma: number,
    public phone: number,
    public picture: number,
    public keycloakID: string,
    public email: string,
    public hasDriverLicense: boolean,
    birthday: string,
    driverLicenseDate: string,
    public nickname?: string
  ) {
    this.birthday = new Date(birthday);
    this.driverLicenseDate = new Date(driverLicenseDate);
  }

  getUsername() {
    return this.firstname + "." + this.lastname;
  }

  transaction(amount: number) {
    this.balance += amount;
  }

  addCharisma(amount: number) {
    this.charisma += amount;
  }

  getINSAemail() {
    return this.firstname + "." + this.lastname + "@insa-lyon.fr";
  }

  isBalanceNegative() {
    return this.balance < 0;
  }

  addNotification(notification: any) {
    if (this.notifications === undefined) {
      this.notifications = [];
    }
    this.notifications.push(notification);
  }
}

export default UserModel;
