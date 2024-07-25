import { verifyJWT } from '@/lib/verifyJWT';

export async function checkLogin(req, res) {
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
