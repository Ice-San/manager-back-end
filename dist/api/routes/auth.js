"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../controllers/auth");
exports.default = (0, express_1.Router)()
    .post("/signin", auth_1.signIn)
    .post("/validation", auth_1.validation);
