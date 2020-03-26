
const jwt = require('jsonwebtoken')

let decodedToken = (token) => {
    user = {}
    jwt.verify(token, process.env.SEED, (err, decoded) => {
        user = decoded.user
    })
    return user
}

module.exports = { decodedToken }
