import { verifyJWT } from '@/libs/verifyJWT';

export default async function logged(req, res) {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({ error: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];

    const user = await verifyJWT(token)

    if (user === null) {
        res.status(401).json({ error: 'Invalid token' });
    }

    res.json({ user });
};