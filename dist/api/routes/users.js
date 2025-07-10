"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const users_1 = require("../controllers/users");
exports.default = (0, express_1.Router)()
    .get('/', users_1.getUsers)
    .get('/:id', users_1.getUser)
    .post('/', users_1.createUser);
