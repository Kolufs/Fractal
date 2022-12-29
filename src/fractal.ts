import { canvasCtxD, point, range2D, rectangle } from "./types";
import { copy, scale } from "./utils";
import { colorFuncs } from "./workers/color";



export abstract class escapeTimeFractal {
    public abstract range: range2D
    public workerFile: string = 'src/workers/MandelbrotWorker.ts'
    public maxIters: number = 2500
    public workers: Worker[]
    public canvasCtxD: canvasCtxD
    public colorAlg: keyof typeof colorFuncs = "redScale"

    constructor(canvas: HTMLCanvasElement) {
        this.canvasCtxD = {
            resolution: {
                width: canvas.width,
                height: canvas.height
            },
            canvasCtx: canvas.getContext("2d") as CanvasRenderingContext2D 
        }
        this.workers = this.getOptimalWorkers()
    }


    public zoom(rectangle: rectangle) {
        const width = rectangle.dr.x - rectangle.ul.x;
        const height = rectangle.dr.y - rectangle.ul.y;
        const aspectRatio = width / height;
        const canvasRatio = this.canvasCtxD.resolution.width/this.canvasCtxD.resolution.height
        if (aspectRatio > canvasRatio) {
            rectangle.dr.y = rectangle.ul.y + width * 9 / 16;            
        } else {
            rectangle.dr.x = rectangle.ul.x + height * 16 / 9;
        }
        const scaledUl: point = {
            x: scale(rectangle.ul.x, this.canvasCtxD.resolution.width, this.range.x),
            y: scale(rectangle.ul.y, this.canvasCtxD.resolution.height, this.range.y)
        }
        const scaledDr: point = {
            x: scale(rectangle.dr.x, this.canvasCtxD.resolution.width, this.range.x),
            y: scale(rectangle.dr.y, this.canvasCtxD.resolution.height, this.range.y)
        }
        this.range.x.start = scaledUl.x
        this.range.x.end = scaledDr.x 
        this.range.y.start = scaledUl.y 
        this.range.y.end = scaledDr.y
        this.render();
    }

    private getOptimalWorkers(): Worker[] {
        const workers: Worker[] = []
        for(let i =0; i<navigator.hardwareConcurrency; i++) {
            workers.push(new Worker(`${this.workerFile}`, {type:"module"}))
        }
        return workers 
    }

    public render() {
        let yOffset = 0 
        let section = Math.floor(this.canvasCtxD.resolution.height/this.workers.length)
        let start = performance.now()
        let sharedBuffer = new SharedArrayBuffer(this.canvasCtxD.resolution.height*this.canvasCtxD.resolution.width*4)
        let curr = 0
        for (let worker of this.workers) {
            worker.postMessage([this.range,{
                start: yOffset,
                end: yOffset+section
            }, this.canvasCtxD.resolution, sharedBuffer, this.maxIters, this.colorAlg]) 
            yOffset += section
            worker.onmessage = (e) => {
                curr++ 
                //putImageData does not like sharred buffers :(
                //This is a mess !
                if (curr==this.workers.length) {
                    let buffer = copy(sharedBuffer)
                    let imagedata = new ImageData(buffer, this.canvasCtxD.resolution.width,this.canvasCtxD.resolution.height)
                    console.log(performance.now()-start)
                    this.canvasCtxD.canvasCtx.putImageData(imagedata,0,0)
                }
            }
        }   

    }
}

export class Mandelbrot extends escapeTimeFractal {
    public range: range2D = {
        x: {
            start: -2,
            end: 2
        },
        y: {
            start: -1.125,
            end: 1.125
        }
    }

    constructor(canvas: HTMLCanvasElement) {
        super(canvas)
    }
}


export const fractals = {
    "mandelbrot": Mandelbrot,
}