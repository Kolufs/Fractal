import { rgba, point, resolution, hsv} from "../types";
import { scale } from "../utils";

export type ColorFn = {
    (arr: Uint8ClampedArray, point: point, resolution: resolution, iters: number, maxIters: number): void;
}

const color = (arr:  Uint8ClampedArray, rgba: rgba, point: point, resolution:resolution) => {
    let pixel = (point.y*resolution.width+point.x)*4
    arr[pixel + 0] = rgba.r
    arr[pixel + 1] = rgba.g
    arr[pixel + 2] = rgba.b
    arr[pixel + 3] = rgba.a
}


export const colorBlueScale: ColorFn = (arr:  Uint8ClampedArray, point: point, resolution:resolution,iters:number,maxIters:number) => {
    const brightness = (iters / maxIters) * 255;
      if (iters === maxIters) {
      color(arr, {
        r: 0,
        g: 0,
        b: 0,
        a: 255,
      }, point, resolution);
    } else {
      color(arr, {
        r: 0,
        g: 0,
        b: brightness,
        a: 255,
      }, point, resolution);
    }
}
  

export const colorRedScale: ColorFn = (arr:  Uint8ClampedArray, point: point, resolution:resolution,iters:number,maxIters:number) => {
    const brightness = (iters / maxIters) * 255;
      if (iters === maxIters) {
      color(arr, {
        r: 0,
        g: 0,
        b: 0,
        a: 255,
      }, point, resolution);
    } else {
      color(arr, {
        r: brightness,
        g: 0,
        b: 0,
        a: 255,
      }, point, resolution);
    }
}
  

export const colorGrayscale: ColorFn = (arr:  Uint8ClampedArray, point: point, resolution:resolution,iters:number,maxIters:number) => {
    let brightness = (iters/maxIters)*255
    if (iters === maxIters) {
        color(arr, {
          r: 0,
          g: 0,
          b: 0,
          a: 255,
        }, point, resolution);
      } else {
        color(arr, {
          r: brightness,
          g: brightness,
          b: brightness,
          a: 255,
        }, point, resolution);
      }
}

export const colorInvertedGrayscale:ColorFn = (arr:  Uint8ClampedArray, point: point, resolution:resolution,iters:number,maxIters:number) => {
    const brightness = (iters/maxIters)*255
    if (iters != maxIters) {
        color(arr, {
          r: 0,
          g: 0,
          b: 0,
          a: 255,
        }, point, resolution);
      } else {
        color(arr, {
          r: brightness,
          g: brightness,
          b: brightness,
          a: 255,
        }, point, resolution);
      }
}




export const colorFuncs = {
  bluescale: colorBlueScale,
  redScale: colorRedScale,
  grayScale: colorGrayscale,
  invertedGrayScale: colorInvertedGrayscale,
}