import { useEffect, useRef, useState } from 'react';
import { useCookies } from 'react-cookie';
import ReactCrop from 'react-image-crop';
import { image64toCanvasRef } from '../../helpers/ImageFunctions';
import { useFiles } from '../../helpers/useFiles';
import { CookieUser } from '../../interfaces/auth/authInterface';

const EditProfilePicture = ({ image }: { image: any; setImage: any }) => {
  const [message, setMessage] = useState('');
  const [imagePreview, setImagePreview] = useState<any>('');
  const [aspect, setAspect] = useState<any>({ aspect: 1 / 1 });
  const [cookies] = useCookies();
  const user: CookieUser = cookies['user'] ? { ...cookies['user'] } : undefined;
  const { validateFile, uploadProfileImage } = useFiles();
  const [img2, setImg] = useState('');

  const convertToBase = () => {
    const validate = validateFile(image[0], 1000000);
    setMessage(validate.message);
    if (validate.accepted) {
      const fileReader = new FileReader();

      fileReader.readAsDataURL(image[0]);
      fileReader.addEventListener(
        'load',
        () => {
          setImagePreview(fileReader!.result!?.toString());
          setMessage('');
        },
        false
      );
    }
  };

  useEffect(() => {
    convertToBase();
  }, []);

  const imageCropSize = 150;
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handelUpdateProfile = () => {
    uploadProfileImage(canvasRef, imagePreview, user._id);
  };

  return (
    <div>
      <ReactCrop
        src={imagePreview}
        crop={aspect}
        onChange={(newCrop: any) => {
          setAspect(newCrop);
        }}
        onComplete={(crop, pv) => {
          image64toCanvasRef(canvasRef.current, imagePreview, pv);
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
        minHeight={Math.floor(imageCropSize / 5)}
        minWidth={Math.floor(imageCropSize / 5)}
        maxWidth={imageCropSize}
        maxHeight={imageCropSize}
      />
      <canvas style={{ display: 'none' }} ref={canvasRef}></canvas>
      <button onClick={handelUpdateProfile}>ADD</button>
      <p>{message}</p>
    </div>
  );
};

export default EditProfilePicture;
