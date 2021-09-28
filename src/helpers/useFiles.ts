import Compressor from 'compressorjs';
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
      const imgurResponse = upload(result).then(res => console.log(res));

      // if (imgurResponse) {
      //   if (imgurResponse!.status === 403) {
      //     return {
      //       accepted: false,
      //       message: 'Something went wrong. Please try again',
      //     };
      //   }

      //   return {
      //     accepted: true,
      //     message: 'Your image is correctly uploaded',
      //     file: imgurResponse!.data.data.link,
      //   };
      // }

      formData.append('file', result);
    },
    error(err) {
      console.log(err.message);
    },
  });
};

export const useFiles = () => {
  return {
    validateFile(fileToValidate: any, maxFileSize: number) {
      return validateFile(fileToValidate, maxFileSize);
    },
    compressAndUpload(file: any) {
      return compressImg(file);
    },
  };
};
