const Web3 = require('web3')
const { ObjectId, cardsDB } = require('@/lib/mongodb')
import { checkLogin } from '@/lib/user'

export default async function removeCardWallet(req, res) {
    const user = await checkLogin(req, res)
    if (user === null) {
        return
    }

    const { cardId, wallet } = req.body;

    if (!wallet) {
        return res.status(401).json({ success: false, message: "Missing wallet." });
    }

    const filter = { _id: new ObjectId(cardId), mainWallet: user.wallet.address, wallets: wallet }
    const card = await cardsDB.findOne(filter)
    if (!card) {
        return res.status(401).json({ success: false, message: "Invalid wallet." });
    }

    if (!card.wallets) {
        card.wallets = []
    }
    const index = card.wallets.indexOf(wallet);
    if (index !== -1) {
        card.wallets.splice(index, 1);
    }

    const result = await cardsDB.updateOne(filter, { $set: { wallets: card.wallets } })

    res.status(200).json({ success: true, result });
};