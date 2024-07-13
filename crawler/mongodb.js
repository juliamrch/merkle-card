const path = require('path')
const dotenv = require('dotenv')
const envPath = path.resolve(__dirname, '..', '.env')
dotenv.config({ path: envPath })

const { MongoClient } = require('mongodb')

let db

function getDB() {
    if (!db) {
        const dbSBB = new MongoClient(process.env.MONGODB_ADDON_URI)

        db = dbSBB.db(process.env.MONGODB_ADDON_DBNAME)
    }

    return db
}

const cardsDB = getDB().collection('cards')
const portfoliosDB = getDB().collection('portfolios')
const tokensDB = getDB().collection('tokens')

module.exports = {
    getDB, cardsDB, portfoliosDB, tokensDB
}