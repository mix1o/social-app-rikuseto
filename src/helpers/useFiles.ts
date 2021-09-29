import Compressor from 'compressorjs';
import { RefObject } from 'react';
import { base64StringTtoFile } from './ImageFunctions';
import { upload } from './UploadImg';
import axios from 'axios';

const validateFile = (
  fileToValidate: any,
  maxFileSize: number
): { accepted: boolean; message: string } => {
  const fileSize = fileToValidate.size;
  const fileType = fileToValidate.type;

  const fileTypes = 'image/jpeg, image/jpg, image/png, image/gif';

  if (fileSize >= maxFileSize) {
    return {
      accepted: false,
      message: `File is to larger, ${(fileSize / 1000000).toFixed(
        2
      )}MB is to big. Max file size is ${(maxFileSize / 1000000).toFixed(2)}MB`,
    };
  }
  if (fileType.includes(fileTypes) || fileType.length <= 0) {
    return { accepted: false, message: 'Invalid file type' };
  }

  return { accepted: true, message: '' };
};

const compressImg = async (
  file: File | null,
  uploadImage: (file: any) => void
) => {
  if (!file) return { accepted: false, message: 'Empty file' };

  const compressor = new Compressor(file, {
    quality: 0.6,
    convertSize: 268000,

    success(result) {
      const formData = new FormData();

      (async () => {
        try {
          // const fileData = await upload(result);
          uploadImage('123');
        } catch (err) {
          console.log(err);
        }
      })();
      formData.append('file', result);
    },
    error(err) {
      console.log(err.message);
    },
  });
};

const uploadProfileImage = async (
  canvas: RefObject<HTMLCanvasElement>,
  image: Blob,
  id: string
) => {
  const imageData64 = canvas.current?.toDataURL(`image/${image}`).toString();
  if (imageData64) {
    const croppedData = base64StringTtoFile(
      imageData64,
      `rikusetoImage.${imageData64}`
    );

    const updateUserProfile = async (fileData: any) => {
      if (fileData!.status === 403) {
        return false;
      }

      const response = await axios.put(
        `${process.env.REACT_APP_API}/user/update-avatar`,
        {
          userId: id,
          avatar: fileData.data.data.link,
        }
      );
    };

    compressImg(croppedData, updateUserProfile);
  }
};

export const useFiles = () => {
  return {
    validateFile(fileToValidate: File | null, maxFileSize: number) {
      return validateFile(fileToValidate, maxFileSize);
    },
    compressAndUpload(file: File | null) {
      return compressImg(file, () => {
        console.log(123);
      });
    },
    uploadProfileImage(
      canvas: RefObject<HTMLCanvasElement>,
      image: Blob,
      id: string
    ) {
      return uploadProfileImage(canvas, image, id);
    },
  };
};
