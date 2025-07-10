"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
require("dotenv/config");
const config_1 = __importDefault(require("./db/config"));
const users_1 = __importDefault(require("./api/routes/users"));
const auth_1 = __importDefault(require("./api/routes/auth"));
const app = (0, express_1.default)();
const port = process.env.PORT || 3000;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.get('/hello', (req, res) => {
    res.send('Hello Friend! :D');
});
app.use('/users', users_1.default);
app.use('/auth', auth_1.default);
app.listen(port, () => {
    config_1.default;
    console.log(`App is online at: http://localhost:${port}`);
});
