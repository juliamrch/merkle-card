// pages/api/getMessageToSign.js

import { websiteUsersDB } from '@/libs/mongodb';
import { v4 as uuidv4 } from 'uuid';

export default async function getMessageToSign(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).end();
    }

    const { address } = req.body;
    if (!address) {
        return res.status(400).json({ error: "Address is required." });
    }

    // Generate a unique nonce for the user. Using UUID for simplicity, but in a real app, 
    // you might want to use something related to the user or the session.
    const nonce = uuidv4();

    // Store nonce along with the address in your database for verification later
    // (For now, we're skipping this step, but it's important!)

    const message = generateMessage(address, nonce);

    const user = await websiteUsersDB.findOne({ address });
    if (!user) {
        await websiteUsersDB.insertOne({ address, createdAt: new Date(), updatedAt: new Date(), messageToSign: message });
    } else {
        await websiteUsersDB.updateOne({ address }, { $set: { updatedAt: new Date(), messageToSign: message } });
    }

    return res.json({ message });
}

function generateMessage(address, nonce) {
    const issuanceTime = new Date().toISOString();

    return `${address}

By signing, you are proving you own this wallet. This does not initiate a transaction or cost any fees.

Domain: app-7cbb6ef4-d7fc-4fa6-854b-e4e2d8cae769.cleverapps.io
Version: 1
Chain ID: 1
Nonce: ${nonce}
Issued At: ${issuanceTime}
Resources:
- https://app-7cbb6ef4-d7fc-4fa6-854b-e4e2d8cae769.cleverapps.io/`;
}
