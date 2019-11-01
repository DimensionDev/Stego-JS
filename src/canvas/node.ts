import * as NodeCanvas from "canvas";

export function createNodeCanvas(width: number, height: number) {
  return NodeCanvas.createCanvas(width, height);
}

export function buf2Img(imgBuf: Buffer) {
  return new Promise<ImageData>((resolve, reject) => {
    const image = new NodeCanvas.Image();

    image.onload = () => {
      const { width, height } = image;
      const ctx = createNodeCanvas(width, height).getContext("2d");

      ctx.drawImage(image, 0, 0, width, height);
      resolve(ctx.getImageData(0, 0, width, height));
    };
    image.onerror = err => reject(err);
    image.dataMode = NodeCanvas.Image.MODE_IMAGE;
    image.src = imgBuf;
  });
}

export function img2Buf(
  imgData: ImageData,
  width = imgData.width,
  height = imgData.height
) {
  const canvas = createNodeCanvas(width, height);
  const ctx = canvas.getContext("2d");

  ctx.putImageData(imgData, 0, 0, 0, 0, width, height);
  return canvas.toBuffer("image/png");
}
