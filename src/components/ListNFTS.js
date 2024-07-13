import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Modal from './Modal';
import Gallery from './Gallery';
import LoadingSpinner from './Spinner';
import Card from './Card';

const ListNFTS = ({ userAddress }) => {
  const [nfts, setNfts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedNFT, setSelectedNFT] = useState(null);

  useEffect(() => {
    const fetchNFTs = async () => {
      if (!userAddress) return;

      try {
        const response = await axios.get('/api/nft/v1/byaddress', {
          headers: {
            "Authorization": `Bearer ${process.env.REACT_APP_API_TOKEN}`
          },
          params: {
            "chainIds": "1",
            "address": userAddress,
            "limit": "50",
            "offset": "0"
          }
        });
        setNfts(response.data.assets); // Update state with the assets array
      } catch (error) {
        console.error('Error fetching NFTs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNFTs();
  }, [userAddress]);

  const handleSelectNFT = (nft) => {
    setSelectedNFT(nft);
    setShowModal(false);
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div>
      <button onClick={() => setShowModal(true)}>Show NFTs</button>
      <Modal show={showModal} handleClose={() => setShowModal(false)}>
        <Gallery nfts={nfts} onSelect={handleSelectNFT} />
      </Modal>
      <Card image_src={selectedNFT ? selectedNFT.image_original_url : null} />
    </div>
  );
};

export default ListNFTS;