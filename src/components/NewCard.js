import React, { useState } from 'react';
import Modal from './Modal';
import { usePrivy, useWallets } from '@privy-io/react-auth';

const CreateNewCard = async (formData, getAccessToken, setCards) => {
  try {
    const token = await getAccessToken();
    const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/card/create`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ ...formData, wallets: [] })
    });

    if (!response.ok) {
      throw new Error('Failed to create new card');
    }

    const data = await response.json();
    const newCard = data.card;
    setCards(prevCards => [newCard, ...prevCards]);
  } catch (error) {
    console.error('Failed to create new card', error);
  }
};

const NewCardButton = () => {
  const { ready, authenticated, getAccessToken } = usePrivy();
  const [cards, setCards] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const handleCreateNewCard = () => {
    if (!authenticated) {
      console.log('User not authenticated');
      return;
    }
    CreateNewCard({ name: "create", id: Date.now(), formData: {} }, getAccessToken, setCards);
    setShowModal(true);
  };

  return (
    <>
         <button className="web3button" onClick={setShowModal}>New Card</button>
         {/* <button className="web3button" onClick={handleCreateNewCard}>New Card</button> */}
      <Modal show={showModal} handleClose={() => setShowModal(false)}>
        <p>sssshhhh... work in progress, come back later</p>
      </Modal>
    </>
  );
};

export default NewCardButton;