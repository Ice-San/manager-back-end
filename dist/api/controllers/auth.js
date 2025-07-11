"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validation = exports.signIn = void 0;
const config_1 = __importDefault(require("../../db/config"));
const jwt_1 = require("../../helpers/jwt");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const { JWT } = process.env;
const signIn = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { email, password } = req.body;
    if (typeof email === "undefined" || typeof password === "undefined") {
        res.status(400).send({
            status: 400,
            message: "The values are undefined!"
        });
        return;
    }
    if (typeof email !== "string" && typeof password !== "string") {
        res.status(400).send({
            status: 400,
            message: "The values aren't strings!"
        });
        return;
    }
    try {
        const query = 'SELECT * FROM sign_in($1, $2)';
        const values = [email, password];
        const result = yield config_1.default.query(query, values);
        const userId = (_a = result.rows[0]) === null || _a === void 0 ? void 0 : _a.u_id;
        if (result.rows.length) {
            const token = (0, jwt_1.generateToken)({ userId });
            res.status(200).json({
                status: 200,
                message: 'Success SignIn!',
                data: {
                    success: true,
                    token
                }
            });
            return;
        }
        res.status(401).json({
            status: 401,
            message: 'Invalid credencials!',
            data: {
                success: false
            }
        });
    }
    catch (err) {
        console.log(err);
        res.status(500).send({
            status: 500,
            message: 'Error Code!'
        });
    }
    return;
});
exports.signIn = signIn;
const validation = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { token } = req.body;
    jsonwebtoken_1.default.verify(token, JWT, (err, payload) => __awaiter(void 0, void 0, void 0, function* () {
        if (err) {
            res.status(401).json({
                status: 401,
                message: 'Unauthorized!',
                data: {
                    success: false
                }
            });
            return;
        }
        const userId = payload === null || payload === void 0 ? void 0 : payload.userId;
        if (userId) {
            res.status(200).json({
                status: 200,
                message: 'Authorized!',
                data: {
                    success: true
                }
            });
            return;
        }
        res.status(401).json({
            status: 401,
            message: 'Unauthorized!',
            data: {
                success: false
            }
        });
    }));
});
exports.validation = validation;
