import ReactCrop from 'react-image-crop';
import {
  Dispatch,
  FC,
  SetStateAction,
  useCallback,
  useRef,
  useState,
} from 'react';
import 'react-image-crop/dist/ReactCrop.css';
import {
  image64toCanvasRef,
  extractImageFileExtensionFromBase64,
  base64StringTtoFile,
} from '../../helpers/ImageFunctions';
import { useDropzone as useDropZone } from 'react-dropzone';
import Compressor from 'compressorjs';
interface CropProps {
  setMessage: Dispatch<SetStateAction<string>>;
}

const CropImage: FC<CropProps> = ({ setMessage }) => {
  const [aspect, setAspect] = useState({ aspect: 0 });
  const [imagePreview, setImagePreview] = useState('');
  const [croppedImagePV, setCroppedImagePV] = useState('');
  const [useCroppedImage, setUseCroppedImage] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);

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
      return false;
    }
    if (fileType.includes(fileTypes) || fileType.length <= 0) {
      setMessage('Invalid file type');
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

  const handleReverseFile = () => {
    // #TODO Choose between cropped and default image /some state to pass to function
    if (imagePreview) {
      const coppedData64 = canvasRef.current
        ?.toDataURL(`image/${croppedImagePV}`)
        .toString();

      if (coppedData64) setCroppedImagePV(coppedData64);

      const croppedData = base64StringTtoFile(
        imagePreview,
        `rikusetoImage.${coppedData64}`
      );

      compressImg(croppedData);
    }
  };

  const compressImg = (file: any) => {
    if (!file) return;

    new Compressor(file, {
      quality: 0.6,
      convertSize: 268000,
      success(result) {
        const formData = new FormData();

        formData.append('file', result);
        // upload(result);
      },
      error(err) {
        console.log(err.message);
      },
    });
  };

  const clearCrop = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    ctx!.clearRect(0, 0, canvas!?.width, canvas!?.height);

    setImagePreview('');
    setAspect({ aspect: 1 / 1 });
  };

  const handleRatio = (ratio: number = 0) => {
    setAspect({ aspect: ratio });
  };

  return (
    <div className="crop-image">
      {imagePreview!?.toString().length >= 1 ? (
        <div>
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

          <ReactCrop
            src={imagePreview}
            crop={aspect}
            onComplete={handleOnCropComplete}
            onChange={handleCropChange}
            ruleOfThirds={true}
          />

          <canvas
            className="crop-image__preview-canvas"
            ref={canvasRef}
          ></canvas>
          <div>
            <button onClick={clearCrop}>Add new photo</button>
            <button onClick={handleReverseFile}>Use Original Image</button>
            <button onClick={handleReverseFile}>Use Cropped Image</button>
          </div>
        </div>
      ) : (
        <section
          {...getRootProps({
            className: 'dropzone create-post__drag-drop',
          })}
        >
          <input {...getInputProps()} />
          <p className="create-post__text">
            Drag and Drop or{' '}
            <span className="create-post__pseudo-btn">Click</span>
          </p>
        </section>
      )}
    </div>
  );
};

export default CropImage;
