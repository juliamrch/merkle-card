require('../libs/env')
const express = require('express');
const cors = require('cors');
const { v4 } = require('uuid')
const Web3 = require('web3')

const verifyJWT = require('../libs/verifyJWT')
const { ObjectId, cardsDB, portfoliosDB, tokensDB, websiteUsersDB } = require('../libs/mongodb')

async function checkLogin(req, res) {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({ error: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];

    const user = await verifyJWT(token, process.env.PRIVY_APP_ID, process.env.PRIVY_PUBLIC_KEY, process.env.PRIVY_SECRET_KEY)

    if (user === null) {
        res.status(401).json({ error: 'Invalid token' });
    }

    return user
}

async function logged(req, res) {
    const user = await checkLogin(req, res)
    if (user === null) {
        return
    }

    const cards = await cardsDB.find({ mainWallet: user.wallet.address }).toArray()

    res.json({ user, cards });
};

async function createCard(req, res) {
    const user = await checkLogin(req, res)
    if (user === null) {
        return
    }

    const { name } = req.body

    const card = await cardsDB.insertOne({
        mainWallet: user.wallet.address,
        name,
    })

    res.json({ card });
};

function generateMessage(address, nonce) {
    const issuanceTime = new Date().toISOString();

    return `${address}

By signing, you are proving you own this wallet. This does not initiate a transaction or cost any fees.

Nonce: ${nonce}
Issued At: ${issuanceTime}`;
}

async function getWalletSignatureMessage(req, res) {
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

async function addCardWallet(req, res) {
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

const app = express();

app.use(express.json());
const corsOptions = {
    origin: ['http://localhost:3000', 'https://yourdomain.com'],
    optionsSuccessStatus: 200
}
app.use(cors(corsOptions));

// Use the logged function as middleware for this route
app.get('/api/user/logged', logged);
app.post('/api/card/create', createCard);
app.get('/api/card/getWalletSignatureMessage', getWalletSignatureMessage);
app.post('/api/card/addWallet', addCardWallet);

const port = 8080;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
})