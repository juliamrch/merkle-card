const { MongoClient } = require('mongodb')

let db

export function getDB() {
    if (!db) {
        const dbSBB = new MongoClient(process.env.MONGODB_ADDON_URI)

        db = dbSBB.db(process.env.MONGODB_ADDON_DBNAME)
    }

    return db
}

export const cardsDB = getDB().collection('cards')
export const portfoliosDB = getDB().collection('portfolios')
