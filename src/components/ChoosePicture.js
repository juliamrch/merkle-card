import React, { useState, useEffect } from 'react';
import { usePrivy } from '@privy-io/react-auth';
import Gallery from './Gallery';

const ChoosePicture = () => {
  const { authenticated, getAccessToken } = usePrivy();
  const [nfts, setNfts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showGallery, setShowGallery] = useState(false);

  const fetchUserData = async () => {
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
      const formattedNFTs = !data.cards || data.cards.length === 0 || !data.cards[0].nfts ? [] : data.cards[0].nfts.map(asset => ({
        id: '',
        name: asset.name,
        description: '',
        imageUrl: asset.image,
        permalink: asset.link
      }));
      setNfts(formattedNFTs);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch user data', error);
    }
  };

  useEffect(() => {
    if (authenticated) {
      fetchUserData();
    }
  }, [authenticated]);

  const handleSelectNFT = (nft) => {
    console.log('Selected NFT:', nft);
    setShowGallery(false);
  };

  return (
    <div>
      <button onClick={() => setShowGallery(true)}>Choose Picture</button>
      {showGallery && !loading && <Gallery nfts={nfts} onSelect={handleSelectNFT} />}
      {showGallery && loading && <div>Loading...</div>}
    </div>
  );
};

export default ChoosePicture;