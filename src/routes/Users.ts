import StatusCodes from 'http-status-codes';
import { Request, Response} from 'express';

import UserDao from '@daos/User/UserDao.mock';
import logger from "@shared/Logger";
import KcAdminClient from 'keycloak-admin';
import UserModel from "@entities/User";

const userDao = new UserDao();
const { BAD_REQUEST, CREATED, OK } = StatusCodes;

const kcAdminClient = new KcAdminClient();


/**
 * Get all users.
 * 
 * @param req 
 * @param res 
 * @returns 
 */
export async function getAllUsers(req: Request, res: Response) {
    const users = await userDao.getAll();
    return res.status(OK).json({users});
}


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
    const URL = (process.env.AUTH_URL || 'http://localhost:8080/') +
        'auth/admin/realms/project_a/users'
    logger.info('creating new user ' + lastname)
    await kcAdminClient.auth({
        username: 'admin',
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