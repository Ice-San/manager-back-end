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
exports.getUser = exports.getUsers = exports.createUser = void 0;
const config_1 = __importDefault(require("@/db/config"));
const createUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, email, password, confirmPassword } = req.body;
    if (!username || !email || !password || !confirmPassword) {
        res.status(400).send({
            status: 400,
            message: 'Missing required fields!'
        });
        return;
    }
    if (typeof username === 'undefined' || typeof email === 'undefined' || typeof password === 'undefined' || typeof confirmPassword === 'undefined') {
        res.status(400).send({
            status: 400,
            message: 'The values are undefined!'
        });
        return;
    }
    if (typeof username !== 'string' || typeof email !== 'string' || typeof password !== 'string' || typeof confirmPassword !== 'string') {
        res.status(400).send({
            status: 400,
            message: 'The values aren\'t strings!'
        });
        return;
    }
    if (password !== confirmPassword) {
        res.status(400).send({
            status: 400,
            message: 'Passwords don\'t matchs!'
        });
        return;
    }
    try {
        const queryUserExist = yield config_1.default.query(`SELECT user_exist('${email}')`);
        const { user_exist } = queryUserExist.rows[0];
        if (user_exist === 1) {
            res.status(409).send({
                status: 409,
                message: 'User already exists!'
            });
            return;
        }
        const query = `SELECT * FROM create_user($1, $2, '', '', '', $3, 'user', 3)`;
        const values = [
            username,
            email,
            password,
        ];
        const result = yield config_1.default.query(query, values);
        const userId = result.rows[0].user_id;
        res.status(201).send({
            status: 201,
            message: 'User Created Sucessfully!',
            data: {
                success: true,
                userId
            }
        });
    }
    catch (err) {
        console.log(err);
        res.status(500).send({
            status: 500,
            message: 'Error creating user...'
        });
    }
    return;
});
exports.createUser = createUser;
const getUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { career, location } = req.query;
    const query = career || location ? `SELECT * FROM users WHERE u_location = ${location} OR u_career = ${career};` : 'SELECT * FROM users';
    const result = yield config_1.default.query(query);
    const data = result.rows;
    if (!data)
        res.status(404).send({
            status: 404,
            message: 'Users not found... :(',
        });
    res.status(200).send({
        status: 200,
        message: 'Users Found!',
        data
    });
});
exports.getUsers = getUsers;
const getUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const query = `SELECT * FROM get_user('$1');`;
    const result = yield config_1.default.query(query, [id]);
    const data = result.rows[0];
    if (!data)
        res.status(404).send({
            status: 404,
            message: 'User not found... :(',
        });
    res.status(200).send({
        status: 200,
        message: 'User Found!',
        data
    });
});
exports.getUser = getUser;
