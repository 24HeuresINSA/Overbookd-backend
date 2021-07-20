import StatusCodes from 'http-status-codes';
import { Request, Response} from 'express';

import UserDao from '@daos/User/UserDao.mock';
import logger from "@shared/Logger";
import KcAdminClient from 'keycloak-admin';
import UserModel from "@entities/User";
import User from "@entities/User";

const userDao = new UserDao();
const { BAD_REQUEST, CREATED, OK } = StatusCodes;

const kcAdminClient = new KcAdminClient({
    baseUrl: (process.env.AUTH_URL || 'http://localhost:8080/'),
    realmName: 'project_a'
  });

/**
 * Add one user.
 * 
 * @param req 
 * @param res 
 * @returns 
 */
export async function setUser(req: Request, res: Response) {
    const mUser = req.body;
    // create user in keycloak
    // @ts-ignore
    mUser.keycloakID = await createUserInKeycloak(mUser);

    await saveUser(mUser);
    res.status(CREATED).end();
}

async function saveUser(user: any){
    await UserModel.create(user);
}

// @ts-ignore
async function createUserInKeycloak({firstname, lastname, password} ){
    logger.info('creating new user ' + lastname)
    await kcAdminClient.auth({
        username: process.env.ADMIN_USERNAME || 'admin',
        password: process.env.ADMIN_PASSWORD,
        grantType: 'password',
        clientId: 'admin-cli',
    });

    const res = await kcAdminClient.users.create({
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        username: firstname.toLowerCase() + '.' + lastname.toLowerCase(),
        enabled: true,
        credentials:[{
            type: 'password',
            value: password,
            temporary: false,
        }],
        realm: 'project_a',
    })
    logger.info(`user ${lastname} registred in keycloak as ${res.id}`)
    return res.id
}

export async function getUserByKeycloakID(req: Request, res: Response) {
    const keycloakID = req.params.keycloakID;
    logger.info('getting info for ' + keycloakID);
    const mUser = await UserModel.findOne({keycloakID})
    res.json(mUser)
}

export async function updateUserByKeycloakID(req: Request, res: Response) {
    // TODO check user role
    const keycloakID = req.params.keycloakID;
    logger.info('updating info for ' + keycloakID);
    const mUser = await UserModel.findOneAndUpdate({keycloakID}, req.body);
    res.json(mUser)
}


export async function getAllUsersName(req: Request, res: Response) {
    // TODO check role
    let users= await UserModel.find({});
    res.json(users.map(user => user.firstname + '.' +  user.lastname));
}


