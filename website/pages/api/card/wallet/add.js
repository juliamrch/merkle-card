const Web3 = require('web3')
const { ObjectId, cardsDB, websiteUsersDB } = require('@/lib/mongodb')
import { checkLogin } from '@/lib/user'

export default async function addCardWallet(req, res) {
    const user = await checkLogin(req, res)
    if (user === null) {
        return
    }

    const { cardId, address, signature } = req.body;

    if (!signature) {
        return res.status(401).json({ success: false, message: "Missing signature." });
    }

    const webuser = await websiteUsersDB.findOne({ address });
    if (!webuser) {
        return res.status(401).json({ success: false, message: "Missing message to sign." });
    }

    const web3 = new Web3();
    const recoveredAddress = web3.eth.accounts.recover(webuser.messageToSign, signature);

    if (web3.utils.toChecksumAddress(recoveredAddress) !== web3.utils.toChecksumAddress(address)) {
        return res.status(401).json({ success: false, message: "Signature verification failed" });
    }

    const filter = { _id: new ObjectId(cardId), mainWallet: user.wallet.address }
    const card = await cardsDB.findOne(filter)
    if (!card) {
        return res.status(401).json({ success: false, message: "Invalid card" });
    }

    if (!card.wallets) {
        card.wallets = []
    }
    if (card.wallets.indexOf(address) === -1) {
        card.wallets.push(address)
    }

    const result = await cardsDB.updateOne(filter, { $set: { wallets: card.wallets } })

    res.status(200).json({ success: true, result });
};