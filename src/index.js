require('dotenv').config()
const setupServer = require('./server')
const initMongoConnection = require('./db/initMongoConnection')

console.log('MONGODB_URL:', process.env.MONGODB_URL)
console.log('MONGODB_USER:', process.env.MONGODB_USER)
console.log('MONGODB_PASSWORD:', process.env.MONGODB_PASSWORD)
console.log('MONGODB_DB:', process.env.MONGODB_DB)
;(async () => {
  await initMongoConnection()
  setupServer()
})()
