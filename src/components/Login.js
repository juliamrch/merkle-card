import { usePrivy } from '@privy-io/react-auth';
import { useEffect, useState } from 'react';

function LoginButton() {
  const { 
    user, 
    ready, 
    authenticated, 
    login, 
    logout, 
    getAccessToken 
  } = usePrivy();
  console.log('Ready:', ready, 'Authenticated:', authenticated);
  const [cards, setCards] = useState([]);

  // Disable login when Privy is not ready
  const disableButton = !ready;

  const createNewCard = async (formData) => {
    if (!authenticated) {
      console.log('User not authenticated');
      return;
    }

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
      setCards(prevCards => [newCard, ...prevCards]); // Add the new card to the state at the top
    } catch (error) {
      console.error('Failed to create new card', error);
    }
  };

  const checkAndCreateCard = async () => {
    if (!authenticated) {
      await login();
    }

    try {
      const token = await getAccessToken();
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/card/getWalletSignatureMessage?address=${user.walletAddress}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch wallet signature message');
      }

      const data = await response.json();
      if (data.cards.length === 0) {
        await createNewCard({ name: "First Card", id: Date.now(), formData: {} });
      }
    } catch (error) {
      console.error('Failed to check wallet cards', error);
    }
  };

  const handleLogin = async () => {
    if (authenticated) {
      await logout();
    } else {
      await checkAndCreateCard();
    }
  };

  return (
    <div>
      <button
        className="login-button"
        disabled={disableButton}
        onClick={handleLogin}
      >
        {authenticated ? 'Log Out' : 'Log In'}
      </button>
    </div>
  );
}

export default LoginButton;