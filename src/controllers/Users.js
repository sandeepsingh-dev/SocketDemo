const { Router } = require("express");
const { UsersModel } = require("../models");
const bcrypt = require('bcrypt');
const saltRounds = 10;

class Users {
    static readAll = async (req, res) => {
        try {
            const data = await UsersModel.find({ password: 0 })
            res.send({ data, message: "all users" })
        } catch (err) {
            console.log("errr", err);
            res.send({ status: 500, message: 'Something went wrong' })
        }
    }

    static create = async (req, res) => {
        try {
            const data = req.body
            let hashPassword = ''
            bcrypt.hash(req.body.password, saltRounds, async function (err, hash) {
                console.log("hash", hash);
                hashPassword = hash
                console.log("hashPassword", hashPassword);
                const user = new UsersModel({ ...data, password: hashPassword })
                await user.save()
                res.send({ status: 200, message: "user should be created" })
            });

        } catch (err) {
            console.log("errr", err);
            res.send({ status: 500, message: err.message || 'Something went wrong' })
        }
    }
}

const User = Router()
User.post('/', Users.create)
User.get('/all', Users.readAll)

module.exports = User