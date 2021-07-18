import { IUser } from "@entities/User";

declare module 'express' {
    export interface Request  {
        body: {
            name?: RegExp | string | QuerySelector<RegExp | string> | any;
            keycloakID?: string;
            value: string;
            key: string;
        };
    }
}
