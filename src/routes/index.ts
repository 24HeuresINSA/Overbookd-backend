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
import {keycloak} from "../keycloak";
import issueHandler from "./Issue";

const multer = require('multer');

function ping(req: Request, res: Response) {
    return res.send('pong')
}

// User-route
const userRouter = Router();
userRouter.get('/', getUsers);
userRouter.post('/', setUser);
userRouter.get('/all', getAllUsersName)
userRouter.get('/:keycloakID', getUserByKeycloakID)
userRouter.put('/:keycloakID', updateUserByKeycloakID)
userRouter.put('/notification/:lastname/:firstname', addNotificationByFullName)
userRouter.post('/broadcast', broadcastNotification)
userRouter.post('/friends', createFriendship)
userRouter.post('/transfer', transferMoney)

const imageUpload = multer({
    dest: 'images',
});

userRouter.post('/pp', imageUpload.array("files"), uploadPP);
userRouter.get('/pp/:filename', getPP)

// Config-route
const configRouter = Router();
configRouter.get('/', getConfig);
configRouter.put('/', setConfig);
configRouter.use(mCors);

// FA-routes
const FArouter = Router();
FArouter.get('/', getFAs);
FArouter.get('/:id', getFAByCount);
FArouter.post('/', createFA);
FArouter.put('/', setFA);

// FT-routes
const FTrouter = Router();
FTrouter.get('/', getAllFTs);
FTrouter.get('/:FTID', getFTByID);
FTrouter.post('/', createFT);
FTrouter.put('/', updateFT);
FTrouter.put('/unassign', unassign);
FTrouter.delete('/', deleteFT);

// Equipment-routes
const equipmentRouter = Router();
equipmentRouter.get('/', getEquipment);
equipmentRouter.put('/', setEquipment)

// Availabilities routes
const availabilitiesRouter = Router();
availabilitiesRouter.get('/', getAvailabilities)
availabilitiesRouter.post('/', setAvailabilities)
availabilitiesRouter.put('/', updateAvailabilities)

// Export the base-router
const baseRouter = Router();
baseRouter.use('/user', userRouter);
baseRouter.use('/config', configRouter);
baseRouter.use('/FA', FArouter);
baseRouter.use('/FT', FTrouter);
baseRouter.use('/equipment', equipmentRouter);
baseRouter.use('/availabilities', availabilitiesRouter);
baseRouter.post('/issue', issueHandler)

// ping
baseRouter.get('/ping',keycloak.protect(), ping);

baseRouter.use(mCors)

export default baseRouter;
