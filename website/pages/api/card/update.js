import { ObjectId, cardsDB } from '@/lib/mongodb'
import { checkLogin } from '@/lib/user'

export default async function updateCard(req, res) {
    const user = await checkLogin(req, res)
    if (user === null) {
        return
    }

    // @TODO: validate chosenNft, chosenTokens
    const { cardId, chosenNft, chosenTokensIds } = req.body

    const nft = await cardsDB.findOne({})
    const card = await cardsDB.updateOne({ mainWallet: user.wallet.address, _id: new ObjectId(cardId) }, { $set: { chosenNft, chosenTokens: chosenTokensIds } });

    res.json({ card });
};