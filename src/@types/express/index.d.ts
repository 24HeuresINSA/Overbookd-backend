import { IUser } from "@entities/User";

declare module 'express' {
    export interface Request  {
        body: {
            _id?: string;
            name?: RegExp | string | QuerySelector<RegExp | string> | any;
            keycloakID?: string;
            value: string;
            key: string;
        };
    }
}
