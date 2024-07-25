'use client';

import React, { useEffect, useState, useContext, useCallback } from 'react';

import { usePrivy } from '@privy-io/react-auth';
import LoginButton from '@/components/Login';
import Carousel from '@/components/Carousel';
import {
    Box,
    Container,
    Grid,
    Card,
    CardContent,
    Typography,
    TextField
} from '@mui/material';
import Image from 'next/image';
import { Button } from '@mui/material';
import WalletsList from '@/components/WalletsList';
import { CircularProgress } from '@mui/material';

export default function Home() {
    const [loading, setLoading] = useState(true)
    const { user, ready, authenticated, getAccessToken } = usePrivy();
    const [userData, setUserData] = useState({});
    const [cards, setCards] = useState([]);
    const [cardsMap, setCardsMap] = useState({});
    const [selectedCard, setSelectedCard] = useState(null)
    const [selectedNft, setSelectedNft] = useState(null)
    const [mainWallet, setMainWallet] = useState('')
    const [newCardName, setNewCardName] = React.useState('');

    const handleChange = (event) => {
        setNewCardName(event.target.value);
    };

    useEffect(() => {
        if (authenticated) {
            fetchUserData();
        }
    }, [authenticated]);

    function chooseNft(cardId, nft) {
        const card = cardsMap[cardId]
        if (!card) {
            return
        }

        setSelectedCard(cardId)
        setSelectedNft(nft)

        card.chosenNft = nft
    }

    const fetchUserData = async () => {
        if (!authenticated) {
            console.log('User not authenticated');
            return;
        }

        setLoading(true)

        try {
            const token = await getAccessToken();
            const response = await fetch(`${process.env.NEXT_PUBLIC_APP_API_BASE_URL}/api/user/logged`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch user data');
            }

            const data = await response.json();
            const walletAddress = data.user.wallet?.address;

            setMainWallet(walletAddress)
            setUserData(data.user)
            setCards(data.cards)
            setCardsMap(data.cards.reduce((all, v) => {
                all[v._id] = v
                return all
            }, {}))
        } catch (error) {
            console.error('Failed to fetch user data', error);
        }

        setLoading(false)
    };

    const updateCard = async (card) => {
        if (!authenticated) {
            console.log('User not authenticated');
            return;
        }

        setLoading(true)

        try {
            const token = await getAccessToken();
            const response = await fetch(`${process.env.NEXT_PUBLIC_APP_API_BASE_URL}/api/card/update`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    cardId: card._id,
                    chosenNft: card.chosenNft
                })
            });

            if (!response.ok) {
                throw new Error('Failed to update card');
            }

            const data = await response.json();
            console.log(data)
        } catch (error) {
            console.error('Failed to fetch user data', error);
        }

        setLoading(false)

        fetchUserData()
    };

    const createCard = async () => {
        if (!authenticated) {
            console.log('User not authenticated');
            return;
        }

        setLoading(true)

        try {
            const token = await getAccessToken();
            const response = await fetch(`${process.env.NEXT_PUBLIC_APP_API_BASE_URL}/api/card/create`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: newCardName,
                })
            });

            if (!response.ok) {
                throw new Error('Failed to create card');
            }

            const data = await response.json();
            console.log(data)
        } catch (error) {
            console.error('Failed to fetch user data', error);
        }

        setLoading(false)

        fetchUserData()
    };

    return <>
        <Image src="/logo.png" alt='Merkle Card' width="147" height="154" /> Merkle Card
        <LoginButton className="login-button" />

        {loading ? <CircularProgress /> : null}

        {ready && authenticated ? <>
            <Typography variant="h6">
                <span>Logged as</span>
            </Typography>
            <Typography variant="h7" component="div" gutterBottom>
                {mainWallet} <TextField
                    label="New Card Name"
                    variant="outlined"
                    value={newCardName}
                    onChange={handleChange}
                /> <Button onClick={createCard}>Create Card</Button>
            </Typography>

            <Container>
                <Grid container spacing={3}>
                    {cards.map((card) => (
                        <Grid item xs={12} sm={12} md={12} key={card._id}>
                            <Card>
                                <CardContent>
                                    <Card sx={{ display: 'flex', maxWidth: 600, margin: 'auto', borderRadius: 3 }}>
                                        <Grid container>
                                            <Grid item xs={4}>
                                                <Box
                                                    component="img"
                                                    sx={{
                                                        width: '100%',
                                                        height: '100%',
                                                        objectFit: 'cover',
                                                        borderTopLeftRadius: 3,
                                                        borderBottomLeftRadius: 3,
                                                    }}
                                                    src={card.chosenNft?.image}
                                                    alt={`${card.name}'s image`}
                                                />
                                            </Grid>
                                            <Grid item xs={8}>
                                                <CardContent>
                                                    <Typography variant="h5" component="div">
                                                        {card.name}
                                                    </Typography>
                                                    <Typography variant="body2" color="text.secondary">
                                                        Last Updated: {new Date(card.lastUpdated).toLocaleString()}
                                                    </Typography>
                                                    <Typography variant="body2" color="text.secondary">
                                                        Total PnL: {card.totalPnl}
                                                    </Typography>
                                                    <Typography variant="body2" color="text.secondary">
                                                        Total Value: {card.totalValue}
                                                    </Typography>
                                                </CardContent>
                                                <Button onClick={() => updateCard(card)}>Save</Button>
                                            </Grid>
                                        </Grid>
                                    </Card>

                                    <WalletsList cardId={card._id} portfolioWallets={card.wallets} reloadRequest={fetchUserData} />

                                    <Typography variant="h6">{card.name}</Typography>
                                    <Typography variant="body2">Last Updated: {new Date(card.lastUpdated).toLocaleString()}</Typography>
                                    <Typography variant="body2">Total PnL: {card.totalPnl}</Typography>
                                    <Typography variant="body2">Total Value: {card.totalValue}</Typography>
                                    <Typography variant="body2">NFTs: {card.nfts?.length}</Typography>
                                    <Typography variant="body2">Tokens: {card.tokens?.length}</Typography>
                                    <Typography variant="body2">Status: {card.status}</Typography>

                                    {card.nfts && card.nfts.length ? <Carousel carouselData={card.nfts} imageSelectHandler={(item) => chooseNft(card._id, item)} /> : null}
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Container>
        </> : null}
    </>
}