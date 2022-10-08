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
async function isRevoked(req, token) {
   if (!token.payload.isAdmin) {
      return true;
   }
}

module.exports = authJwt;


// {
//     "orderItems":{
//         "quantity":3,
//         "product":"633f17b6afce589f71656c35"
//     },
//     "shippingAddress1":"Flowers Street 45",
//     "shippingAddress2":"obito mall",
//     "city":"Prague",
//     "zip":"00000",
//     "country":"chez-Republic",
//     "phone":"645345352",
//     "user":"6341340c430b849a8004a8f6"
// }