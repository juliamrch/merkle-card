import React, { useEffect, useState } from 'react';
import { usePrivy } from '@privy-io/react-auth';
import styled from 'styled-components';
import Modal from './Modal'; // Assuming you have a Modal component

const WalletsWrapper = styled.div`
  padding: 20px;
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  margin-top: 20px;
  display: block;
  height: 100%;
  width: 40%;
`;

const WalletsHeading = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
  color: white;
  font-family: 'Poppins', sans-serif;
`;

const WalletsListStyled = styled.ul`
  list-style-type: none;
  padding: 0;
  font-family: 'Poppins', sans-serif;
`;

const WalletItem = styled.li`
  padding: 5px;
  background-color: transparent;
  border: 0px solid transparent;
  border-radius: 4px;
  margin-bottom: 10px;
  box-shadow: none;
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.8rem;
`;

const AddButton = styled.button`
  background-color: transparent;
  color: white;
  border-color: white;
  border-radius: 50%;
  width: 17px;
  height: 17px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  font-size: 20px;
`;

const WalletsList = () => {
  const { authenticated, getAccessToken } = usePrivy();
  const [mainWallet, setMainWallet] = useState(null);
  const [wallets, setWallets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const fetchUserWallets = async () => {
    if (!authenticated) {
      console.log('User not authenticated');
      return;
    }

    try {
      const token = await getAccessToken();
      const response = await fetch('http://localhost:8080/api/user/logged', {
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
      console.log(data);
      setWallets(data.cards[0].wallets);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch user data', error);
    }
  };

  const shortenAddress = (address) => {
    return address.substring(0, 6) + '...' + address.substring(36, 42);
  };

  useEffect(() => {
    if (authenticated) {
      fetchUserWallets();
    }
  }, [authenticated]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <WalletsWrapper>
      <WalletsHeading>
        <span>Logged as</span>
      </WalletsHeading>
      <WalletsListStyled>
        {mainWallet && (
          <WalletItem key="main">{shortenAddress(mainWallet)}</WalletItem>
        )}
      </WalletsListStyled>
        
      <WalletsHeading>
        <span>Linked Wallets</span>
        <AddButton onClick={() => setShowModal(true)}>+</AddButton>
      </WalletsHeading>
      <WalletsListStyled>
        {wallets.map((wallet, index) => (
          <WalletItem key={index}>{shortenAddress(wallet)}</WalletItem>
        ))}
      </WalletsListStyled>
      {showModal && <Modal show={showModal} handleClose={() => setShowModal(false)} />}
    </WalletsWrapper>
  );
};

export default WalletsList;