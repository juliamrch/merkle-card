import { MongoClient, ObjectId } from 'mongodb'

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
const websiteUsersDB = getDB().collection('users')

module.exports = {
    ObjectId, getDB, cardsDB, portfoliosDB, tokensDB, websiteUsersDB
}