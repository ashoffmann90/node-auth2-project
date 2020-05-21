const router = require('express').Router()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const Users = require('../users/user-model')
const {isValid} = require('../users/user-service')

router.post('/register', (req, res) => {
    const credentials = req.body

    if(isValid(credentials)){
        const rounds = process.env.BCRYPT_ROUNDS || 8
        const hash = bcrypt.hashSync(credentials.password, rounds)
        credentials.password = hash
        Users.add(credentials)
        .then(user => {
            res.status(201).json({ data: user })
        })
        .catch(er => {
            res.status(500).json({ error: er.message })
        })
    } else {
        res.status(400).json({ message: 'Please provide username and password'})
    }
})

router.post('/login', (req, res) => {
    const {username, password} = req.body

    if(isValid(req.body)){
        Users.findBy({ username: username })
        .then(([user]) => {
            if(user && bcrypt.compareSync(password, user.password)){
                const token = createToken(user)
                res.status(200).json({ message: 'Logged In', token })
            } else {
                res.status(401).json({ message: 'Invalid credentials' })
            }
        })
        .catch(er => {
            res.status(500).json({ error: er.message })
        })
    } else {
        res.status(400).json({ message: 'Please provide username and password'})
    }
})

function createToken(user){
    const payload = {
        sub: user.id,
        username: user.username,
        department: user.department
    }
    const secret = process.env.JWT_SECRET || 'somethingsecret'
    const options = {
        expiresIn: '1d'
    }
    return jwt.sign(payload, secret, options)
}

router.get('/logout', (req, res) => {
  if(req.token){
      req.token.destroy(er => {
          if(er){
              res.status(500).json({ message: 'We could not log you out'})
          } else {
              res.status(204).end()
          }
      })
  } else {
      res.status(204).end()
  }
})

module.exports = router