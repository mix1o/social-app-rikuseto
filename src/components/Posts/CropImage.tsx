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
import { useCounter } from '../../store/sub';
import { useFiles } from '../../helpers/useFiles';

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
  const [aspect, setAspect] = useState({ aspect: 0 });
  const [imagePreview, setImagePreview] = useState('');
  const [croppedImagePV, setCroppedImagePV] = useState('');
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const cropRefWrapper = useRef<HTMLDivElement>(null);
  const cropRef = useRef<ReactCrop>(null);
  const [{ disabledModal }, { setDisabledModal }] = useCounter();

  const [openCrop, setOpenCrop] = useState(false);

  const maxFileSize = 5000000;
  const fileTypes = 'image/jpeg, image/jpg, image/png, image/gif';

  const { validateFile, compressAndUpload } = useFiles();

  const onDrop = useCallback((files, rejectedFiles) => {
    if (rejectedFiles && rejectedFiles.length >= 1) {
      const validate = validateFile(rejectedFiles[0].file, 5000000);
      setMessage(validate.message);
    }

    if (files && files.length >= 1) {
      const file = files[0];

      const validate = validateFile(file, 5000000);
      setMessage(validate.message);
      if (validate.accepted) {
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
    if (!disabledModal) setDisabledModal(true);

    setAspect(newCrop);
  };

  const handleOnCropComplete = (crop: any, percentCrop: any) => {
    image64toCanvasRef(canvasRef.current, imagePreview, percentCrop);
    setTimeout(() => {
      setDisabledModal(false);
    }, 200);
  };

  const handleReverseFile = async (useCropped: boolean = false) => {
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

          setUserPickedImage(true);
        }
      }
      const croppedData = base64StringTtoFile(
        imagePreview,
        `rikusetoImage.${imagePreview}`
      );

      compressImg(croppedData);
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
    setAspect({ aspect: 0 });
    setDisabledModal(false);
  };

  const handleRatio = (ratio: number = 0) => {
    setAspect({ aspect: ratio });
  };

  const compressImg = async (file: any) => {
    if (!file) return { accepted: false, message: 'Empty file' };

    new Compressor(file, {
      quality: 0.6,
      convertSize: 268000,
      success(result) {
        const formData = new FormData();

        const fileData = upload(result).then(res => {
          console.log(res);

          if (res!.status === 200) {
            setTimeout(() => {
              setPost({ ...post, file: res.data.link });
              setCorrectImage(true);
              setMessage('JAR JAR');
            }, 200);
            return false;
          }

          setCorrectImage(false);
          setMessage('Something went wrong. Please try again');
        });

        formData.append('file', result);
      },
      error(err) {
        console.log(err.message);
      },
    });
  };
  const checkHeight = () => {
    return {
      maxHeight: `${(window.innerHeight / 2).toString()}px`,
    };
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
          <div className="crop-image__canvas" ref={cropRefWrapper}>
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
              ref={cropRef}
            />

            {croppedImagePV && (
              <div style={checkHeight()} className="crop-image__canvas-wrapper">
                <canvas
                  className="crop-image__preview-canvas"
                  ref={canvasRef}
                ></canvas>
              </div>
            )}
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
