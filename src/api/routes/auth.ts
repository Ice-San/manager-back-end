import { Router } from "express";
import { signIn } from "../controllers/auth";

export default Router()
                    .post("/", signIn);