import { useRef, useState, useEffect } from 'react';
import { useCookies } from 'react-cookie';
import ReactCrop from 'react-image-crop';
import { image64toCanvasRef } from '../../helpers/imageFunctions';
import { useFiles } from '../../hooks/useFiles';
import { CookieUser } from '../../interfaces/auth/authInterface';
import { useCounter } from '../../store/sub';

const EditProfilePicture = ({
  image,
  closeModal,
}: {
  image: string;
  closeModal: () => void;
}) => {
  const [aspect, setAspect] = useState<ReactCrop.Crop>({
    aspect: 1 / 1,
  });
  const [disableBtn, setDisableBtn] = useState(false);

  const [cookies] = useCookies();
  const user: CookieUser = cookies['user'] ? { ...cookies['user'] } : undefined;
  const { uploadProfileImage } = useFiles();
  const [{ disabledModal }, { setDisabledModal }] = useCounter();

  const imageCropSize = 450;
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handelUpdateProfile = async () => {
    setDisableBtn(true);
    const t = await uploadProfileImage(canvasRef, image, user._id);
  };

  useEffect((): (() => void) => {
    return () => setDisabledModal(false);
  }, []);

  return (
    <section className="profile">
      <div className="profile__header">
        <h3 className="profile__title">Crop your new profile picture</h3>
        <button className="profile__btn--close" onClick={closeModal}>
          <i className="fas fa-times"></i>
        </button>
      </div>

      <ReactCrop
        src={image}
        crop={aspect}
        onChange={newCrop => {
          setDisabledModal(true);
          setAspect(newCrop);
        }}
        onComplete={(crop, pv) => {
          image64toCanvasRef(canvasRef.current, image, pv);
          setTimeout(() => {
            setDisabledModal(false);
          }, 500);
        }}
        circularCrop={true}
        onImageLoaded={({ height, width }) => {
          setAspect({
            width: width > imageCropSize ? imageCropSize : 0,
            height: height > imageCropSize ? imageCropSize : 0,
            x: width > imageCropSize ? width / 2 - imageCropSize / 2 : 0,
            y: height > imageCropSize ? height / 2 - imageCropSize / 2 : 0,
            aspect: 1,
          });
          return false;
        }}
      />
      <canvas style={{ display: 'none' }} ref={canvasRef}></canvas>

      <button
        onClick={handelUpdateProfile}
        className="profile__btn--update"
        disabled={disableBtn}
      >
        ADD
      </button>
    </section>
  );
};

export default EditProfilePicture;
