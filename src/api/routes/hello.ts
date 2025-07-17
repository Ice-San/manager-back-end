import { Router } from "express";
import { hello } from "../controllers/hello";

export default Router()
                    .get("/", hello);