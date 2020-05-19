const express = require('express')

const userRouter = require('./users/user-router')
const authRouter = require('./auth/auth-router')

const server = express()

server.use(express.json())
server.use('/api/users', userRouter)
server.use('/api/auth', authRouter)

server.get("/", (req, res) => {
    res.json({ api: "up" });
});

module.exports = server