// Type declarations to fix pdfjs-dist TypeScript errors
declare module 'pdfjs-dist' {
  export const GlobalWorkerOptions: {
    workerSrc: string;
  };
  
  export function getDocument(src: any): any;
  
  export const version: string;
}

// Fix for MapIterator
interface MapIterator<T> extends Iterator<T> {}

// Fix for ImageDataArray
type ImageDataArray = Uint8ClampedArray;

// Fix for generic typed arrays
interface Uint8Array<T = any> extends Uint8Array {}
interface Uint32Array<T = any> extends Uint32Array {}
interface Int32Array<T = any> extends Int32Array {}
interface Float32Array<T = any> extends Float32Array {}
interface Uint8ClampedArray<T = any> extends Uint8ClampedArray {}

