import { Router } from "express";
import { getActiveUsers, getKpi } from "../controllers/kpi";

export default Router()
                    .get("/", getKpi)
                    .get("/active", getActiveUsers);