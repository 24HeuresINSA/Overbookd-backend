import {Request, Response, Router} from 'express';
import { getConfig, setConfig} from "./Config";
import mCors from "../cors";
import {
    setUser,
    getUserByKeycloakID,
    updateUserByKeycloakID,
    getAllUsersName,
    getUsers,
    broadcastNotification, addNotificationByFullName, getPP, uploadPP, createFriendship, transferMoney
} from "./Users";
import {createFA, getFAByCount, getFAs, setFA} from "./FA";
import {getEquipment, setEquipment} from "./Equipment";
import {getAvailabilities, setAvailabilities, updateAvailabilities} from "./Avalabilities";
import {createFT, deleteFT, getAllFTs, getFTByID, unassign, updateFT} from "./FT";
import * as TransactionHandlers from "./Transactions";
import {keycloak} from "../keycloak";
import issueHandler from "./Issue";

const multer = require('multer');

function ping(req: Request, res: Response) {
    return res.send('pong')
}

// User-route
const userRouter = Router();
userRouter.get('/',keycloak.protect(), getUsers);
userRouter.post('/', setUser);
userRouter.get('/all',keycloak.protect(), getAllUsersName)
userRouter.get('/:keycloakID',keycloak.protect(), getUserByKeycloakID)
userRouter.put('/:keycloakID',keycloak.protect(), updateUserByKeycloakID)
userRouter.put('/notification/:lastname/:firstname',keycloak.protect(), addNotificationByFullName)
userRouter.post('/broadcast',keycloak.protect(), broadcastNotification)
userRouter.post('/friends',keycloak.protect(), createFriendship)
userRouter.post('/transfer', keycloak.enforcer('user:profile', {response_mode: 'token'}), transferMoney)

const imageUpload = multer({
    dest: 'images',
});

userRouter.post('/pp', imageUpload.array("files"), uploadPP);
userRouter.get('/pp/:filename', getPP)

// Config-route
const configRouter = Router();
configRouter.get('/',getConfig);
configRouter.put('/',keycloak.protect(), setConfig);
configRouter.use(mCors);

// FA-routes
const FArouter = Router();
FArouter.get('/',keycloak.protect(), getFAs);
FArouter.get('/:id',keycloak.protect(), getFAByCount);
FArouter.post('/',keycloak.protect(), createFA);
FArouter.put('/',keycloak.protect(), setFA);

// FT-routes
const FTrouter = Router();
FTrouter.get('/',keycloak.protect(), getAllFTs);
FTrouter.get('/:FTID',keycloak.protect(), getFTByID);
FTrouter.post('/',keycloak.protect(), createFT);
FTrouter.put('/',keycloak.protect(), updateFT);
FTrouter.put('/unassign',keycloak.protect(), unassign);
FTrouter.delete('/',keycloak.protect(), deleteFT);

// Equipment-routes
const equipmentRouter = Router();
equipmentRouter.get('/',keycloak.protect(), getEquipment);
equipmentRouter.put('/',keycloak.protect(), setEquipment)

// Availabilities routes
const availabilitiesRouter = Router();
availabilitiesRouter.get('/',keycloak.protect(), getAvailabilities)
availabilitiesRouter.post('/',keycloak.protect(), setAvailabilities)
availabilitiesRouter.put('/',keycloak.protect(), updateAvailabilities)

// Transactions routes

const transactionRouter = Router();
transactionRouter.get('/', keycloak.protect(), TransactionHandlers.getAllTransactions)
transactionRouter.get('/sg', keycloak.protect(), TransactionHandlers.getSgTransactions)
transactionRouter.get('/user',keycloak.protect(), TransactionHandlers.getSelfTransactions)
transactionRouter.get('/user/:keycloakID', keycloak.protect(), TransactionHandlers.getUserTransactions)
transactionRouter.post('/sg', keycloak.protect(), TransactionHandlers.addSgTransactions)
transactionRouter.post('/transfer', keycloak.protect(), TransactionHandlers.addTransfer)
transactionRouter.put('/:id', keycloak.protect(), TransactionHandlers.updateTransaction)
transactionRouter.delete('/:id', keycloak.protect(), TransactionHandlers.deleteTransaction)


// Export the base-router
const baseRouter = Router();
baseRouter.use('/user', userRouter);
baseRouter.use('/config', configRouter);
baseRouter.use('/FA', FArouter);
baseRouter.use('/FT', FTrouter);
baseRouter.use('/equipment', equipmentRouter);
baseRouter.use('/availabilities', availabilitiesRouter);
baseRouter.use('/transaction', transactionRouter);
baseRouter.post('/issue', issueHandler)

// ping
baseRouter.get('/ping',keycloak.protect(), ping);

baseRouter.use(mCors)

export default baseRouter;
