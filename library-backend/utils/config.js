const path = require('path')
const dotenv = require('dotenv')

dotenv.config({ path: path.resolve(__dirname, '..', '.env') })

const PORT = process.env.PORT || 3003
const MONGODB_URI = process.env.MONGODB_URI

if(!MONGODB_URI) {
    console.error(
        "Missing MongoDB URI"
    )
}

const JWT_SECRET = process.env.JWT_SECRET

module.exports = {
    MONGODB_URI,
    PORT,
    JWT_SECRET
}