import {IConfig} from "@entities/Config";

declare module 'express' {
    export interface Request  {
        body: {
            _id?: string;
            name?: RegExp | string | QuerySelector<RegExp | string> | any;
            keycloakID?: string;

        } | friendRequest | Config;
    }
}
