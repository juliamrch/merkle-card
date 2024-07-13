const jwt = require('jsonwebtoken');
const fetch = require('node-fetch');

export async function verifyJWT(token) {
    try {
        // Fetch Privy's JWKS (JSON Web Key Set)
        const jwksResponse = await fetch('https://auth.privy.io/api/v1/jwks');
        const jwks = await jwksResponse.json();

        // Verify the token
        const decoded = jwt.verify(token, jwks.keys[0], { algorithms: ['ES256'] });

        return decoded
    } catch (error) {
        console.error('Token verification failed:', error);
        return null
    }
};