import ReactCrop from 'react-image-crop';
import {
  Dispatch,
  FC,
  SetStateAction,
  useCallback,
  useRef,
  useState,
} from 'react';
import '../../helpers/ReactCrop.css';
import {
  image64toCanvasRef,
  extractImageFileExtensionFromBase64,
  base64StringTtoFile,
} from '../../helpers/ImageFunctions';
import { useDropzone as useDropZone } from 'react-dropzone';
import Compressor from 'compressorjs';
import { CreatePostI } from '../../interfaces/posts/postInterfaces';
import { upload } from '../../helpers/UploadImg';

interface CropProps {
  setMessage: Dispatch<SetStateAction<string>>;
  post: CreatePostI;
  setPost: Dispatch<SetStateAction<CreatePostI>>;
  setUserPickedImage: Dispatch<SetStateAction<boolean>>;
  setCorrectImage: Dispatch<SetStateAction<boolean>>;
  correctImage: boolean;
}

const CropImage: FC<CropProps> = ({
  setMessage,
  post,
  setPost,
  setUserPickedImage,
  setCorrectImage,
  correctImage,
}) => {
  const [aspect, setAspect] = useState({ aspect: 1 / 1 });
  const [imagePreview, setImagePreview] = useState('');
  const [croppedImagePV, setCroppedImagePV] = useState('');
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [openCrop, setOpenCrop] = useState(false);

  const maxFileSize = 5000000;
  const fileTypes = 'image/jpeg, image/jpg, image/png, image/gif';

  const validateFile = (fileToValidate: any) => {
    const fileSize = fileToValidate.size;
    const fileType = fileToValidate.type;

    if (fileSize >= maxFileSize) {
      setMessage(
        `File is to larger, ${(fileSize / 1000000).toFixed(
          2
        )}MB is to big. Max file size is ${(maxFileSize / 1000000).toFixed(
          2
        )}MB`
      );
      setCorrectImage(false);
      return false;
    }
    if (fileType.includes(fileTypes) || fileType.length <= 0) {
      setMessage('Invalid file type');
      setCorrectImage(false);
      return false;
    }

    return true;
  };

  const onDrop = useCallback((files, rejectedFiles) => {
    if (rejectedFiles && rejectedFiles.length >= 1) {
      validateFile(rejectedFiles[0].file);
    }

    if (files && files.length >= 1) {
      const file = files[0];
      const validate = validateFile(file);
      if (validate) {
        const fileReader = new FileReader();
        fileReader.addEventListener(
          'load',
          () => {
            setUserPickedImage(true);
            setImagePreview(fileReader!.result!?.toString());
            setCroppedImagePV(
              extractImageFileExtensionFromBase64(
                fileReader!.result!?.toString()
              )
            );
          },
          false
        );

        fileReader.readAsDataURL(file);
      }
    }
  }, []);

  const { getRootProps, getInputProps } = useDropZone({
    onDrop,
    maxFiles: 1,
    maxSize: maxFileSize,
    multiple: false,
    accept: fileTypes,
  });

  const handleCropChange = (newCrop: any) => {
    setAspect(newCrop);
  };

  const handleOnCropComplete = (crop: any, percentCrop: any) => {
    image64toCanvasRef(canvasRef.current, imagePreview, percentCrop);
  };

  const handleReverseFile = (useCropped: boolean = false) => {
    setMessage('Loading image');
    setCorrectImage(false);
    if (imagePreview) {
      if (useCropped) {
        const croppedData64 = canvasRef.current
          ?.toDataURL(`image/${croppedImagePV}`)
          .toString();
        if (croppedData64) {
          setCroppedImagePV(croppedData64);

          const croppedData = base64StringTtoFile(
            croppedData64,
            `rikusetoImage.${croppedData64}`
          );
          compressImg(croppedData);

          return;
        }
      } else {
        const croppedData = base64StringTtoFile(
          imagePreview,
          `rikusetoImage.${imagePreview}`
        );
        compressImg(croppedData);
      }
    }
  };

  const clearCrop = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    ctx!.clearRect(0, 0, canvas!?.width, canvas!?.height);

    setOpenCrop(false);
    setUserPickedImage(false);
    setCorrectImage(false);
    setCroppedImagePV('');
    setImagePreview('');
    setMessage('');
    setAspect({ aspect: 1 / 1 });
  };

  const handleRatio = (ratio: number = 0) => {
    setAspect({ aspect: ratio });
  };

  const compressImg = async (file: any) => {
    if (!file) return;

    new Compressor(file, {
      quality: 0.6,
      convertSize: 268000,
      success(result) {
        const formData = new FormData();
        const imgurResponse = upload(result);

        if (imgurResponse) {
          imgurResponse.then(res => {
            setUserPickedImage(true);
            // #FIXME Properly type response
            if (res!.status === 403) {
              setCorrectImage(false);
              setMessage('Something went wrong. Please try again');
              return;
            }
            setTimeout(() => {
              setPost({ ...post, file: res!.data.data.link });
            }, 1000);
            setCorrectImage(true);
            setMessage('Your image is correctly uploaded');
          });
        }

        formData.append('file', result);
      },
      error(err) {
        console.log(err.message);
      },
    });
  };

  return (
    <section className="crop-image">
      {imagePreview!?.toString().length >= 1 ? (
        <div>
          {openCrop && (
            <>
              <p className="crop-image__info">
                Crop it or leave it. &#40;Use your cursor to crop image&#41;
              </p>
              <div className="crop-image__controls-wrapper">
                <button
                  className="crop-image__aspect--action"
                  onClick={() => handleRatio(1 / 1)}
                >
                  1 : 1
                </button>
                <button
                  className="crop-image__aspect--action"
                  onClick={() => handleRatio(3 / 4)}
                >
                  3 : 4
                </button>
                <button
                  className="crop-image__aspect--action"
                  onClick={() => handleRatio(16 / 9)}
                >
                  16 : 9
                </button>
                <button
                  className="crop-image__aspect--action"
                  onClick={() => handleRatio()}
                >
                  Default
                </button>
              </div>
            </>
          )}
          <div className="crop-image__canvas" style={{ overflowY: 'hidden' }}>
            {!openCrop && (
              <button
                className="crop-image__open--crop"
                onClick={() => {
                  setOpenCrop(prevValue => !prevValue);
                }}
              >
                <i className="fas fa-crop-alt"></i>
              </button>
            )}
            <ReactCrop
              src={imagePreview}
              crop={aspect}
              onComplete={handleOnCropComplete}
              onChange={handleCropChange}
              ruleOfThirds={true}
              disabled={!openCrop}
            />

            <canvas
              className="crop-image__preview-canvas"
              ref={canvasRef}
            ></canvas>
          </div>
          <div className="crop-image__buttons">
            <button className="crop-image__btn" onClick={clearCrop}>
              Add new photo
            </button>
            {openCrop && (
              <button
                className="crop-image__btn"
                onClick={() => handleReverseFile(true)}
                disabled={correctImage}
              >
                Use Cropped Image
              </button>
            )}
            <button
              className=" crop-image__btn--full"
              onClick={() => handleReverseFile(false)}
              disabled={correctImage}
            >
              {openCrop ? 'Use Original Image' : 'Use This image'}
            </button>
          </div>
        </div>
      ) : (
        <section
          {...getRootProps({
            className: 'dropzone crop-image__drag-drop',
          })}
        >
          <input {...getInputProps()} />
          <p className="crop-image__text">
            Drag and Drop or{' '}
            <span className="crop-image__pseudo-btn">Click</span>
          </p>
        </section>
      )}
    </section>
  );
};

export default CropImage;
