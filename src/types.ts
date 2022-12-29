export class Complex {
    real: number
    img: number

    constructor(real: number, img:number) {
        this.real = real; 
        this.img = img 
    }

    public add(other:Complex): Complex {
        this.real = this.real + other.real;
        this.img = this.img + other.img;
        return this 
    }

    public sub(other:Complex): Complex {
        this.real = this.real - other.real;
        this.img = this.img - other.img;
        return this 
    }

    public square(): Complex {
        let tempReal = (this.real**2-this.img**2)
        this.img = 2*this.real*this.img 
        this.real = tempReal
        return this 
    }

    public abs(): Complex {
        this.real = Math.abs(this.real)
        this.img = Math.abs(this.img)
        return this 
    }

}

export type point = {
    x: number,
    y: number, 
}

export type range = {
    start: number,
    end: number, 
}

export type resolution = {
    width: number, 
    height: number, 
}

export type range2D = {
    x: range, 
    y: range 
}

export type canvasCtxD = {
    resolution:resolution
    canvasCtx: CanvasRenderingContext2D
}

export type rectangle = {
    ul: point,
    dr: point
}

export type rgba =  {
    r: number, 
    g: number, 
    b: number,
    a: number, 
}

export type hsv = {
    h: number,
    s: number,
    v: number,
}

export type workerMessage = {
    range: range2D,
    yLines: range,
    resolution: resolution, 
    sharedBuffer: SharedArrayBuffer, 
    maxIters: number 
}