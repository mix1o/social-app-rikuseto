import { motion } from 'framer-motion';
import styled from 'styled-components';

export const ModalWrapper = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.8);
  z-index: 50;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const ModalContent = styled(motion.div)`
  background-color: ${props => props.theme.background700};
  max-width: fit-content;
  min-width: 80%;
  padding: 4rem;
`;
