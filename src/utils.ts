import { range } from "./types";

export const scale = (n:number, nEnd:number, newRange:range): number => {
    return (n/nEnd) * (newRange.end - newRange.start) + newRange.start 
}

export const copy = (src: ArrayBuffer | SharedArrayBuffer) => {
    let buffa = new Uint8ClampedArray(src.byteLength)
    let buffacopy = new Uint8Array(src)
    buffa.set(buffacopy)
    return buffa
}