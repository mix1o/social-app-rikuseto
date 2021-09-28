import { useEffect, useState } from 'react';
import { useFiles } from '../../helpers/useFiles';

const EditProfilePicture = ({
  image,
  setImage,
}: {
  image: any;
  setImage: any;
}) => {
  const [message, setMessage] = useState('');
  const { validateFile } = useFiles();

  const convertToBase = () => {
    const validate = validateFile(image[0], 1000000);
    setMessage(validate.message);
    if (validate.accepted) {
      const fileReader = new FileReader();

      fileReader.readAsDataURL(image[0]);
      fileReader.addEventListener(
        'load',
        () => {
          console.log(fileReader!.result!?.toString());
          setMessage('');
        },
        false
      );
    }
  };

  useEffect(() => {
    convertToBase();
  }, []);

  return <div>{message}</div>;
};

export default EditProfilePicture;
