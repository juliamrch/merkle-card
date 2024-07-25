import { checkLogin } from '@/lib/user'
import { cardsDB } from '@/lib/mongodb'

export default async (req, res) => {
    const user = await checkLogin(req, res)
    if (user === null) {
        return
    }

    const cards = await cardsDB.find({ mainWallet: user.wallet.address }).toArray()

    res.json({ user, cards });
};
