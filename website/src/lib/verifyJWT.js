import { PrivyClient } from '@privy-io/server-auth'

export async function verifyJWT(token, appId, publicKey, appSecret) {
    try {
        const privyClient = new PrivyClient(appId, appSecret);

        let user = null

        try {
            const decoded = await privyClient.verifyAuthToken(token);
            user = await privyClient.getUser(decoded.userId);
        }
        catch (e) { console.log(e) }

        return user
    } catch (error) {
        console.error('Token verification failed:', error);
        return null
    }
};