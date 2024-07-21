import styled from 'styled-components';

export const WalletsListContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  padding: 10px;
  position: sticky;
  top: 2rem; 

  @media (max-width: 768px) {
    gap: 10px;
    padding-bottom: 50px;
    position: static; // Remove sticky positioning on smaller screens
  }

  @media (max-width: 480px) {
    gap: 5px;
    padding-bottom: 70px;
    position: static; // Remove sticky positioning on very small screens
  }
`;

export const WalletsWrapper = styled.div`
  padding: 20px;
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  margin-top: 20px;
  display: block;
  width: 100%;
  max-width: 600px;
  justify-content: space-around;
  position: relative;
  z-index: ${({ zIndex }) => zIndex || 1};

  @media (max-width: 768px) {
    width: 90%;
    margin-top: 10px;
    margin-bottom: 10px;
  }

  @media (max-width: 480px) {
    width: 100%;
    padding: 10px;
    margin-bottom: 20px;
  }
`;

export const WalletsHeading = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
  color: white;
  font-family: 'Inter', sans-serif;
`;

export const WalletsListStyled = styled.ul`
  list-style-type: none;
  padding: 0;
  font-family: 'Poppins', sans-serif;
  font-weight: bold;
  font-size: 0.8rem;
`;

export const WalletItem = styled.li`
  padding: 5px;
  background-color: transparent;
  border: 0px solid transparent;
  border-radius: 4px;
  margin-bottom: 10px;
  box-shadow: none;
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.75rem;
`;

export const AddButton = styled.button`
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