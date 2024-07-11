const magicNumbers = {
  ffd8ffe0: 'jpg', // JPEG (jpg)
  ffd8ffe1: 'jpg', // JPEG (jpg)
  ffd8ffe2: 'jpg', // JPEG (jpg)
  ffd8ffdb: 'jpg', // JPEG (jpg)
  '89504e47': 'png', // PNG (png)
  '47494638': 'gif', // GIF (gif)
  '25504446': 'pdf', // PDF (pdf)
  '504b0304': 'zip', // ZIP (zip)
  '49492a00': 'tif', // TIFF (tif)
  '424d': 'bmp', // BMP (bmp)
  '00000020': 'mp4', // MP4 (mp4)
  '1f8b': 'gz', // GZIP (gz)
};

export const getFileExtension = (buffer: Buffer) => {
  const magicNumber = buffer.readUInt32BE(0).toString(16);
  return magicNumbers[magicNumber] || 'unknown';
};
