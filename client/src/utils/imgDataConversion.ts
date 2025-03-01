export const base64ToImageData = (
  base64: string,
  callback: (imageData: ImageData | null) => void
) => {
  const img = new Image();
  img.src = base64;

  img.onload = () => {
    const tempCanvas = document.createElement("canvas");
    const tempCtx = tempCanvas.getContext("2d");

    if (!tempCtx) {
      console.error("Temporary canvas context is null");
      callback(null);
      return;
    }

    tempCanvas.width = img.width;
    tempCanvas.height = img.height;
    tempCtx.drawImage(img, 0, 0);

    const imageData = tempCtx.getImageData(
      0,
      0,
      tempCanvas.width,
      tempCanvas.height
    );
    callback(imageData);
  };

  img.onerror = () => {
    console.error("Failed to load image");
    callback(null);
  };
};
