require('../libs/env')
const express = require('express');
const cors = require('cors');

const verifyJWT = require('../libs/verifyJWT')
const { cardsDB, portfoliosDB, tokensDB } = require('../libs/mongodb')

async function logged(req, res) {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(200).json({ error: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];

    const user = await verifyJWT(token, process.env.PRIVY_APP_ID, process.env.PRIVY_PUBLIC_KEY, process.env.PRIVY_SECRET_KEY)

    if (user === null) {
        res.status(200).json({ error: 'Invalid token' });
    }

    const cards = await cardsDB.find({ mainWallet: user.wallet.address }).toArray()

    res.json({ user, cards });
};

const app = express();

const corsOptions = {
    origin: ['http://localhost:3000', 'https://yourdomain.com'],
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}
app.use(cors(corsOptions));

// Use the logged function as middleware for this route
app.use('/api/user/logged', logged);

const port = 5000;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
})