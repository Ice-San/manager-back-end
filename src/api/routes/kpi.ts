import { Router } from "express";
import { getKpi } from "../controllers/kpi";

export default Router()
                    .get("/", getKpi);