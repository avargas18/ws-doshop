
const jwt = require('jsonwebtoken')

const utils = {
    decodedToken(token) {
        user = {}
        jwt.verify(token, process.env.SEED, (err, decoded) => {
            user = decoded.user
        })
        return user
    },
    objectResponse(params) {
        let  dataResponse = {
            code: params[0],
            status: params[1],
            message: params[2],
            response: params[3],
            extraParameters: params[4]
        }
        return dataResponse
    },
    async verify(token) {
        const ticket = await google.verifyIdToken({
            idToken: token,
            audience: process.env.CLIENT_ID_GOOGLE
        })
        const payload = ticket.getPayload()
        return {
            name: payload.name,
            email: payload.email,
            picture: payload.picture,
            provider: 'GOOGLE'
            // payload
        }
    }
}

module.exports = utils
