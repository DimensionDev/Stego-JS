import * as NodeCanvas from 'canvas';

export function createDOMCanvas(width: number, height: number) {
  const canvas = document.createElement('canvas');

  canvas.width = width;
  canvas.height = height;
  return canvas;
}

export function createNodeCanvas(width: number, height: number) {
  return NodeCanvas.createCanvas(width, height);
}

export function url2Img(url: string) {
  return new Promise<ImageData>((resolve, reject) => {
    const image = new Image();

    image.onload = () => {
      const { width, height } = image;
      const ctx = createDOMCanvas(width, height).getContext('2d');

      ctx.drawImage(image, 0, 0, width, height);
      resolve(ctx.getImageData(0, 0, width, height));
    };
    image.onerror = err => reject(err);
    image.src = url;
  });
}

export async function img2Url(
  imgData: ImageData,
  width = imgData.width,
  height = imgData.height
) {
  return URL.createObjectURL(await img2Blob(imgData, width, height));
}

export function img2Blob(
  imgData: ImageData,
  width = imgData.width,
  height = imgData.height
) {
  const canvas = createDOMCanvas(width, height);
  const ctx = canvas.getContext('2d');

  ctx.putImageData(imgData, 0, 0, 0, 0, width, height);
  return new Promise<Blob>(resolve =>
    canvas.toBlob(blob => resolve(blob), 'image/png')
  );
}

export function blob2Img(imgBlob: Blob) {
  return url2Img(URL.createObjectURL(imgBlob));
}

export function buf2Img(imgBuf: Buffer) {
  return new Promise<ImageData>((resolve, reject) => {
    const image = new NodeCanvas.Image();

    image.onload = () => {
      const { width, height } = image;
      const ctx = createNodeCanvas(width, height).getContext('2d');

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
  const ctx = canvas.getContext('2d');

  ctx.putImageData(imgData, 0, 0, 0, 0, width, height);
  return canvas.toBuffer('image/png');
}
