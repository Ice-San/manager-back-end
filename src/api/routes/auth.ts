import { Router } from "express";
import { signIn, validation } from "../controllers/auth";

export default Router()
                    .post("/signin", signIn)
                    .post("/validation", validation);