import React, { useEffect, useState } from 'react';
import { usePrivy, useWallets } from '@privy-io/react-auth';

import { Box, Typography, Button, List, ListItem } from '@mui/material';
import { CircularProgress } from '@mui/material';

const WalletsList = ({ cardId, portfolioWallets, reloadRequest }) => {
    const { ready, authenticated, getAccessToken } = usePrivy();
    const [currentWallet, setCurrentWallet] = useState(null);
    const [loading, setLoading] = useState(true)
    const { wallets } = useWallets();

    useEffect(() => {
        setLoading(false)
    }, []);

    useEffect(() => {
        console.log('wallets', wallets)
        if (wallets && wallets[0]) {
            setCurrentWallet(wallets[0].address);
        }
    }, [wallets]);

    async function sign() {
        const wallet = wallets[0];
        const address = wallet.address

        setLoading(true)

        try {
            const token = await getAccessToken();
            // Try dynamic value injection here just to feel something
            const response = await fetch(`${process.env.NEXT_PUBLIC_APP_API_BASE_URL}/api/card/getWalletSignatureMessage?address=${address}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            const data = await response.json();
            console.log('getWalletSignatureMessage', data)

            const signature = await wallet.sign(data.message)
            const response2 = await fetch(`${process.env.NEXT_PUBLIC_APP_API_BASE_URL}/api/card/wallet/add`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ cardId, address, signature })
            });
            const data2 = await response2.json();
            console.log('addWallet', data2)
        } catch (e) {
            console.error(e)
        }

        setLoading(false)

        reloadRequest()
    }

    async function removeWallet(wallet) {
        setLoading(true)

        try {
            const token = await getAccessToken();
            const response2 = await fetch(`${process.env.NEXT_PUBLIC_APP_API_BASE_URL}/api/card/wallet/remove`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ cardId, wallet })
            });
            const data2 = await response2.json();
            console.log('removeWallet', data2)
        } catch (e) {
            console.error(e)
        }

        setLoading(false)

        reloadRequest()
    }

    const shortenAddress = (address) => {
        return address
        return address.substring(0, 6) + '...' + address.substring(36, 42);
    };

    return (
        <Box>
            {loading ? <CircularProgress /> : null}
            <Box sx={{ zIndex: 2, mb: 3, border: '1px solid #ccc', p: 2, borderRadius: 2 }}>
                <Typography variant="h6">
                    <span>Current Wallet</span>
                    <Button onClick={() => sign()} sx={{ ml: 2 }} variant="contained">+</Button>
                </Typography>
                <List>
                    {currentWallet && (
                        <ListItem key="current">{shortenAddress(currentWallet)}</ListItem>
                    )}
                </List>

                <Typography variant="h6">
                    <span>Showing NFTs from:</span>
                </Typography>
                <List>
                    {Array.isArray(portfolioWallets) && portfolioWallets.map((wallet, index) => (
                        <ListItem key={index}>{shortenAddress(wallet)} <Button onClick={() => removeWallet(wallet)} variant="outlined" color="error">X</Button></ListItem>
                    ))}
                </List>
            </Box>
        </Box>
    );
}

export default WalletsList;