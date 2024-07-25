import { cardsDB } from '@/lib/mongodb'
import { checkLogin } from '@/lib/user'

export default async function createCard(req, res) {
    const user = await checkLogin(req, res);
    if (user === null) {
        return;
    }

    const { name } = req.body;

    const card = await cardsDB.insertOne({
        mainWallet: user.wallet.address,
        name,
        wallets: [],
        lastUpdated: 0,
        status: 'NEW'
    });

    res.json({ card });
}