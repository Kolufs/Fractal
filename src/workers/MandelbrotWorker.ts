import {Complex, point, range, range2D, resolution} from "../types";
import { scale } from "../utils";
import { colorBlueScale, ColorFn, colorFuncs, colorGrayscale, colorInvertedGrayscale, colorRedScale } from "./color";

const inSet = (point: point, maxIters: number): number => {
    let iter = 0; 
    const c = new Complex(point.x, point.y)
    let z = new Complex(0,0)
    do {
        z = z.square().add(c)
        iter++
    } while(iter<maxIters && z.real + z.img <= 2) 
    return iter
}

onmessage = (e) => {
    const range: range2D  = e.data[0]
    const yLines: range = e.data[1]
    const resolution: resolution = e.data[2]
    const sharedBufferView = new Uint8ClampedArray(e.data[3] as SharedArrayBuffer)
    const maxIters = e.data[4]
    let colorFunc: ColorFn = colorFuncs[e.data[5] as keyof typeof colorFuncs]
        for(let y = yLines.start; y<yLines.end; y++) {
            const yScaled = scale(y, resolution.height, range.y)
            for (let x = 0; x<resolution.width; x++) {
            let currPoint = {
                x: scale(x, resolution.width, range.x),
                y: yScaled
            }
            let iters = inSet(currPoint, maxIters)
            colorFunc(sharedBufferView,{x:x,y:y},resolution,iters,maxIters)
        }
    }
    postMessage(0)
}