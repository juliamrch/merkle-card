import React from 'react';
import styled from 'styled-components';

const GalleryWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 16px;
  padding: 20px;
`;

const GalleryItem = styled.div`
  border: 1px solid #ddd;
  border-radius: 8px;
  overflow: hidden;
  text-align: center;
  background-color: #fff;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  cursor: pointer;
`;

const GalleryImage = styled.img`
  width: 100%;
  height: auto;
  border-bottom: 1px solid #ddd;
`;

const Gallery = ({ nfts, onSelect }) => {
  return (
    <GalleryWrapper>
      {nfts.map((nft, index) => (
        <GalleryItem key={index} onClick={() => onSelect(nft)}>
          <GalleryImage src={nft.imageUrl} alt={nft.name} />
          <h3>{nft.name}</h3>
          <p>{nft.description}</p>
        </GalleryItem>
      ))}
    </GalleryWrapper>
  );
};

export default Gallery;