const { PrivyClient } = require('@privy-io/server-auth');

module.exports = async function verifyJWT(token, appId, publicKey, appSecret) {
    try {
        const privyClient = new PrivyClient(appId, appSecret);

        let user = null

        try {
            const decoded = await privyClient.verifyAuthToken(token);
            console.log(decoded)
            user = await privyClient.getUser(decoded.userId);
            console.log(user)
        }
        catch (e) { console.log(e) }

        return user
    } catch (error) {
        console.error('Token verification failed:', error);
        return null
    }
};