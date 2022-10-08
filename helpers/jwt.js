var { expressjwt: jwt } = require("express-jwt");

function authJwt() {
   const secret = process.env.secret
   const api = process.env.API_URL
   return jwt({
      secret,
      algorithms: ['HS256'],
      isRevoked: isRevoked
   }).unless({
      path: [
         { url: /\/api\/v1\/products(.*)/, methods: ['GET', 'OPTIONS'] },
         { url: /\/api\/v1\/categories(.*)/, methods: ['GET', 'OPTIONS'] },
         `${api}/users/login`,
         `${api}/users/register`

      ]
   })
}
//used regular expression for products one in order to get the products

//classifying the user
const isRevoked = async (req, payload, done) => {
   if (!payload.isAdmin) {
      done(null, true)
   }
   else
      done()
}

module.exports = authJwt;