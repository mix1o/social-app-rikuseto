export const base64StringTtoFile = (base64String: string, filename: string) => {
  const arr = base64String.split(',');

  const mime = arr[0].match(/:(.*?);/);

  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);

  if (!mime) return null;

  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename, { type: mime[1] });
};

export function extractImageFileExtensionFromBase64(base64Data: string) {
  return base64Data.substring(
    'data:image/'.length,
    base64Data.indexOf(';base64')
  );
}

export const image64toCanvasRef = (
  canvasRef: any,
  image64: string,
  percentCrop: any
) => {
  if (canvasRef !== null) {
    const canvas = canvasRef;
    const ctx = canvas.getContext('2d');
    const image = new Image();
    image.src = image64;

    canvas.width = (percentCrop.width * image.width) / 100;
    canvas.height = (percentCrop.height * image.height) / 100;

    image.onload = () => {
      if (ctx) {
        ctx.drawImage(
          image,
          (percentCrop.x * image.width) / 100,
          (percentCrop.y * image.height) / 100,
          (percentCrop.width * image.width) / 100,
          (percentCrop.height * image.height) / 100,
          0,
          0,
          (percentCrop.width * image.width) / 100,
          (percentCrop.height * image.height) / 100
        );
      }
    };
  }
};
