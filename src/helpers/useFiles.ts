import Compressor from 'compressorjs';
import { RefObject } from 'react';
import { base64StringTtoFile } from './ImageFunctions';
import { upload } from './UploadImg';

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

const compressImg = async (file: any) => {
  if (!file) return { accepted: false, message: 'Empty file' };

  new Compressor(file, {
    quality: 0.6,
    convertSize: 268000,
    success(result) {
      const formData = new FormData();

      (async () => {
        try {
          const fileData = await upload(result);
          console.log(`log from useFiles`);
          console.log(fileData);
          if (fileData!.status === 403) {
            return {
              accepted: false,
              message: 'Something went wrong. Please try again',
            };
          }

          return {
            accepted: true,
            message: 'Your image is correctly uploaded',
            file: fileData!.data.data.link,
          };
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

const uploadImage = async (
  canvas: RefObject<HTMLCanvasElement>,
  image: Blob
) => {
  const croppedData64 = canvas.current?.toDataURL(`image/${image}`).toString();
  if (croppedData64) {
    const croppedData = base64StringTtoFile(
      croppedData64,
      `rikusetoImage.${croppedData64}`
    );

    const uploadedImage = await compressImg(croppedData);
  }
};

export const useFiles = () => {
  return {
    validateFile(fileToValidate: File | null, maxFileSize: number) {
      return validateFile(fileToValidate, maxFileSize);
    },
    compressAndUpload(file: File | null) {
      return compressImg(file);
    },
    uploadImage(canvas: RefObject<HTMLCanvasElement>, image: Blob) {
      return uploadImage(canvas, image);
    },
  };
};
