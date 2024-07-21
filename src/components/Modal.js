import React from 'react';
import styled from 'styled-components';

const ModalWrapper = styled.div`
  display: ${({ show }) => (show ? 'block' : 'none')};
  position: fixed;
  z-index: 1000;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: rgba(0, 0, 0, 0.5);
`;

const ModalContent = styled.div`
  background-color: rgba(255, 255, 255, 0.6);
  margin: 5% auto;
  padding: 20px;
  border: 1px solid #888;
  width: 80%;
  max-width: 800px;
  border-radius: 8px;
  font-family: 'Poppins', sans-serif;
  font-weight: bold;
  font-size: 1rem;
  text-align: center;
`;

const CloseButton = styled.span`
  color: black;
  float: right;
  font-size: 28px;
  font-weight: bold;

  &:hover,
  &:focus {
    color: pink;
    text-decoration: none;
    cursor: pointer;
  }
`;

const Modal = ({ show, handleClose, children }) => {
  return (
    <ModalWrapper show={show}>
      <ModalContent>
        <CloseButton onClick={handleClose}>&times;</CloseButton>
        {children}
      </ModalContent>
    </ModalWrapper>
  );
};

export default Modal;