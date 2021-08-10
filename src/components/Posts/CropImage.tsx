import ReactCrop from 'react-image-crop';
import { FC, useRef, useState } from 'react';
import 'react-image-crop/dist/ReactCrop.css';
import { image64toCanvasRef } from '../../helpers/ImageFunctions';

interface CropProps {
  src?: string;
}

const CropImage: FC<CropProps> = ({ src }) => {
  const [aspect, setAspect] = useState();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleCropChange = (newCrop: any) => {
    // console.log(newCrop.unit);
    setAspect(newCrop);
  };

  const handleOnCropComplete = (crop: any, pixelCrop: any) => {
    // console.log(crop);
    console.log(pixelCrop);
    image64toCanvasRef(canvasRef.current, src, pixelCrop);
  };

  return (
    <div>
      {src && (
        <>
          <ReactCrop
            src={src}
            crop={aspect}
            onComplete={handleOnCropComplete}
            onChange={handleCropChange}
          />
          <p>Preview</p>

          <canvas ref={canvasRef}></canvas>
        </>
      )}
    </div>
  );
};

export default CropImage;
