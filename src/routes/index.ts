import { Router } from 'express';
import { getConfig, setConfig} from "./Config";
import mCors from "../cors";
import {setUser , getUserByKeycloakID} from "./Users";
import {getFAByName, getFAs, setFA} from "./FA";
import {getEquipment, setEquipment} from "./Equipment";

// User-route
const userRouter = Router();
userRouter.post('/', setUser)
// userRouter.get('/', getUsers)
userRouter.get('/:keycloakID', getUserByKeycloakID)

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

// Export the base-router
const baseRouter = Router();
baseRouter.use('/user', userRouter);
baseRouter.use('/config', configRouter);
baseRouter.use('/FA', FArouter);
baseRouter.use('/equipment', equipmentRouter);
baseRouter.use(mCors)

export default baseRouter;
