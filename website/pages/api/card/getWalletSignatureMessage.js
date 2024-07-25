import { v4 } from 'uuid'
import { websiteUsersDB }  from '@/lib/mongodb'
import { checkLogin } from '@/lib/user'

export default async function getWalletSignatureMessage(req, res) {
    const user = await checkLogin(req, res)
    if (user === null) {
        return
    }

    const { address } = req.query
    // Generate a unique nonce for the user. Using UUID for simplicity, but in a real app, 
    // you might want to use something related to the user or the session.
    const nonce = v4();

    // Store nonce along with the address in your database for verification later
    // (For now, we're skipping this step, but it's important!)

    const message = generateMessage(address, nonce);

    const webuser = await websiteUsersDB.findOne({ address });
    if (!webuser) {
        await websiteUsersDB.insertOne({ address, createdAt: new Date(), updatedAt: new Date(), messageToSign: message });
    } else {
        await websiteUsersDB.updateOne({ address }, { $set: { updatedAt: new Date(), messageToSign: message } });
    }

    return res.json({ message });
};

function generateMessage(address, nonce) {
    const issuanceTime = new Date().toISOString();

    return `${address}

By signing, you are proving you own this wallet. This does not initiate a transaction or cost any fees.

Nonce: ${nonce}
Issued At: ${issuanceTime}`;
}