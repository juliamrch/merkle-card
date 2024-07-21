import React, { useEffect, useState } from 'react';
import {WalletsListContainer, WalletsWrapper, WalletsHeading, WalletsListStyled,WalletItem, AddButton } from '../styled/StyledWalletsList'
import { usePrivy,useWallets } from '@privy-io/react-auth';
import styled from 'styled-components';
import Modal from './Modal'; // Assuming you have a Modal component



const WalletsList = () => {
  const { ready, authenticated, getAccessToken } = usePrivy();
  const [mainWallet, setMainWallet] = useState(null);

  const [currentWallet, setCurrentWallet] = useState(null);
  const [portfolioWallets, setWallets] = useState([]);

  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const { wallets } = useWallets();

  
  async function sign() {
    const wallet = wallets[0]; // Replace this with your desired wallet
    const address = wallet.address

    const token = await getAccessToken();
    // Try dynamic value injection here just to feel something
    const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/card/getWalletSignatureMessage?address=${address}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    });
    const data = await response.json();
    console.log('getWalletSignatureMessage', data)

    const signature = await wallet.sign(data.message)
    const response2 = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/card/addWallet`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ cardId: '6692f9195728efd497c8785b', address, signature })
    });
    const data2 = await response2.json();
    console.log('addWallet', data2)

    fetchUserWallets()
}

  const fetchUserWallets = async () => {
    if (!authenticated) {
      console.log('User not authenticated');
      return;
    }

    try {
      const token = await getAccessToken();
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/user/logged`, {
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
      setMainWallet(data.user.wallet.address);
    //   console.log(data);
    if (data.cards.length) {
      setWallets(data.cards[0].wallets);
    }
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch user data', error);
    }
  };


  const shortenAddress = (address) => {
    return address.substring(0, 6) + '...' + address.substring(36, 42);
  };

  useEffect(() => {
    console.log('wallets',wallets)
    if (wallets&&wallets[0]) {
      setCurrentWallet(wallets[0].address);
    }
  }, [wallets]);


  useEffect(() => {
    if (authenticated) {
      fetchUserWallets();
    }
  }, [authenticated]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    ready && authenticated && (
    <WalletsListContainer>
      <WalletsWrapper zIndex={3}>
        <WalletsHeading>
          <span>Logged as</span>
        </WalletsHeading>
        <WalletsListStyled>
          {mainWallet && (
            <WalletItem key="main">{shortenAddress(mainWallet)}</WalletItem>
          )}
        </WalletsListStyled>
      </WalletsWrapper>

      <WalletsWrapper zIndex={2}>
        <WalletsHeading>
          <span>Current Wallet</span>
          <AddButton onClick={() => sign()}>+</AddButton>
        </WalletsHeading>
        <WalletsListStyled>
          {currentWallet && (
            <WalletItem key="main">{shortenAddress(currentWallet)}</WalletItem>
          )}
        </WalletsListStyled>
      </WalletsWrapper>

      <WalletsWrapper zIndex={1}>
        <WalletsHeading>
          <span>Showing NFTs from:</span>
        </WalletsHeading>
        <WalletsListStyled>
          {Array.isArray(portfolioWallets) && portfolioWallets.map((wallet, index) => (
            <WalletItem key={index}>{shortenAddress(wallet)}</WalletItem>
          ))}
        </WalletsListStyled>
        {showModal && <Modal show={showModal} handleClose={() => setShowModal(false)} />}
      </WalletsWrapper>
    </WalletsListContainer>
    )
  );
}

export default WalletsList;