export function base64StringtoFile(base64String: string, filename: string) {
  const arr = base64String.split(',');
  if (arr[0].length >= 0) {
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  }
}

// Download a Base64-encoded file

export function downloadBase64File(base64Data: string, filename: string) {
  var element = document.createElement('a');
  element.setAttribute('href', base64Data);
  element.setAttribute('download', filename);
  element.style.display = 'none';
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
}

// Extract an Base64 Image's File Extension
export function extractImageFileExtensionFromBase64(base64Data: string) {
  return base64Data.substring(
    'data:image/'.length,
    base64Data.indexOf(';base64')
  );
}

// Base64 Image to Canvas with a Crop
export const image64toCanvasRef = (
  canvasRef: any,
  image64: any,
  pixelCrop: any
) => {
  const canvas = canvasRef;
  const ctx = canvas.getContext('2d');
  const image = new Image();
  image.src = image64;

  canvas.width = image.width;
  canvas.height = image.height;

  image.onload = () => {
    ctx.drawImage(
      image,
      (pixelCrop.x * image.width) / 100,
      (pixelCrop.y * image.height) / 100,
      (pixelCrop.width * image.width) / 100,
      (pixelCrop.height * image.height) / 100,
      0,
      0,
      (pixelCrop.width * image.width) / 100,
      (pixelCrop.height * image.height) / 100
    );
  };
};
