import { Router } from 'express';
import { getConfig, setConfig} from "./Config";
import mCors from "../cors";
import {setUser, getUserByKeycloakID, updateUserByKeycloakID, getAllUsersName} from "./Users";
import {getFAByName, getFAs, setFA} from "./FA";
import {getEquipment, setEquipment} from "./Equipment";
import {getAvailabilities, setAvailabilities} from "./Avalabilities";

// User-route
const userRouter = Router();
userRouter.post('/', setUser);
userRouter.get('/all', getAllUsersName)
userRouter.get('/:keycloakID', getUserByKeycloakID)
userRouter.put('/:keycloakID', updateUserByKeycloakID)

// Config-route
const configRouter = Router();
configRouter.get('/', getConfig);
configRouter.put('/', setConfig);
configRouter.use(mCors);

// FA-routes
const FArouter = Router();
FArouter.get('/', getFAs);
FArouter.get('/:name', getFAByName);
FArouter.post('/', setFA);

// Equipment-routes
const equipmentRouter = Router();
equipmentRouter.get('/', getEquipment);
equipmentRouter.put('/', setEquipment)

// Availabilities routes
const availabilitiesRouter = Router();
availabilitiesRouter.get('/', getAvailabilities)
availabilitiesRouter.put('/', setAvailabilities)

// Export the base-router
const baseRouter = Router();
baseRouter.use('/user', userRouter);
baseRouter.use('/config', configRouter);
baseRouter.use('/FA', FArouter);
baseRouter.use('/equipment', equipmentRouter);
baseRouter.use('/availabilities', availabilitiesRouter);
baseRouter.use(mCors)

export default baseRouter;
