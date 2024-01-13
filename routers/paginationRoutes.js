import  express  from "express";
import {getPaginatedData, getPaginatedDataDirectlyFromDB} from '../controller/paginatedData.js';
const Router = express.Router();

Router.get('/paginatedData', getPaginatedData)
Router.get('/paginatedDataDirectlyFromDB', getPaginatedDataDirectlyFromDB)


export default Router;
