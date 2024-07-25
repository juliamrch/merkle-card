const path = require('path')
const dotenv = require('dotenv')
const envPath = path.resolve(__dirname, '..', '..', 'website', '.env')
dotenv.config({ path: envPath })