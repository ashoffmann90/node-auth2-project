const router = require('express').Router()

const Users = require('./user-model')
const restricted = require('../auth/middleware')

router.use(restricted)

router.get('/', (req, res) => {
    Users.find()
    .then(users => {
        res.status(200).json(users)
    })
    .catch(er => {
        res.send(er)
    })
})

module.exports = router