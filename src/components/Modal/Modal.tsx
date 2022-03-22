import { SyntheticEvent } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { closeModal, ModalType } from '../../features/modalSlice';
import { RootState } from '../../redux-store/store';
import SignIn from '../Auth/SignIn';
import PostActions from '../Post/PostActions';
import PostShareSocials from '../Post/PostShareSocials';
import { ModalContent, ModalWrapper } from './styled';

const scaleV = {
  hidden: {
    scale: 0,
  },
  visible: {
    scale: 1,
    opacity: 1,
    transition: {
      duration: 0.2,
    },
  },
  exit: {
    scale: 0,
  },
};

export const Modal = () => {
  const modal = useSelector((state: RootState) => state.modal);
  const dispatch = useDispatch();

  return modal.isOpen ? (
    <ModalWrapper
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={() => dispatch(closeModal())}
    >
      <ModalContent
        variants={scaleV}
        initial="hidden"
        animate="visible"
        exit="exit"
        onClick={(e: SyntheticEvent<HTMLDivElement>) => e.stopPropagation()}
      >
        {modal.type === ModalType.LOG_IN && <SignIn />}
        {modal.type === ModalType.POST_ACTIONS && (
          <PostActions id={modal.details.id} userId={modal.details.userId} />
        )}
        {modal.type === ModalType.POST_SHARE && (
          <PostShareSocials id={modal.details.id} />
        )}
      </ModalContent>
    </ModalWrapper>
  ) : null;
};
