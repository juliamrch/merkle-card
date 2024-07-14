import React, { useEffect, useState } from 'react';
import { usePrivy } from '@privy-io/react-auth';
import styled from 'styled-components';
import Modal from './Modal'; // Assuming you have a Modal component

const WalletsWrapper = styled.div`
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  margin-top: 20px;
`;

const WalletsHeading = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
  color: #333;
`;

const WalletsListStyled = styled.ul`
  list-style-type: none;
  padding: 0;
`;

const WalletItem = styled.li`
  padding: 10px;
  background-color: #fff;
  border: 1px solid #ddd;
  border-radius: 4px;
  margin-bottom: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const AddButton = styled.button`
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  font-size: 20px;
`;

const WalletsList = () => {
  const { authenticated, getAccessToken } = usePrivy();
  const [mainWallet, setMainWallet] = useState(null);
  const [currentWallet, setCurrentWallet] = useState(null);
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

  useEffect(() => {
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
    <WalletsWrapper>
        <WalletsHeading>
        <span>Logged as</span>
        </WalletsHeading>
        <WalletsListStyled>
        {mainWallet && (
          <WalletItem key="main">{mainWallet}</WalletItem>
        )}
      </WalletsListStyled>
        
      <WalletsHeading>
        <span>Linked Wallets</span>
        <AddButton onClick={() => setShowModal(true)}>+</AddButton>
      </WalletsHeading>
      <WalletsListStyled>
        {wallets.map((wallet, index) => (
          <WalletItem key={index}>{wallet}</WalletItem>
        ))}
      </WalletsListStyled>
      {showModal && <Modal show={showModal} handleClose={() => setShowModal(false)} />}
    </WalletsWrapper>
  );
};

export default WalletsList;