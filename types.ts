
export interface ImageData {
  base64: string;
  mimeType: string;
  name: string;
}

export interface PosterData {
  topic: string;
  title: string;
  details: string;
  contact: string;
  mainImage: ImageData | null;
  qrCode: ImageData | null;
}
