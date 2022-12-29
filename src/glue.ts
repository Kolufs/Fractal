import { Mandelbrot, SinkingShip, fractals } from "./fractal"
import { point, rectangle } from "./types"
import { colorFuncs } from "./workers/color"

const canvas = document.getElementById("canvas") as HTMLCanvasElement
canvas.width = window.innerWidth
canvas.height = window.innerHeight
const fractalSelect = document.getElementById('fractalSelector') as HTMLSelectElement
const colorSelect = document.getElementById('colorSelector') as HTMLSelectElement

let fractal = new Mandelbrot(canvas)

Object.keys(fractals).forEach(key => {
  const option = document.createElement('option');
  option.value = key;
  option.textContent = key;
  fractalSelect.appendChild(option);
});

Object.keys(colorFuncs).forEach(key => {
  const option = document.createElement('option');
  option.value = key;
  option.textContent = key;
  colorSelect.appendChild(option);
});


const handleResize = () => {
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
    fractal.canvasCtxD.resolution.width = canvas.width
    fractal.canvasCtxD.resolution.height=  canvas.height
    fractal.render()
}

const handleFractalChange = (frac: keyof typeof fractals) => {
    fractal = new fractals[frac](canvas)
    fractal.render()
}

const handleColorChange = (color: keyof typeof colorFuncs) => {
  fractal.colorAlg = color 
  fractal.render()
}

const handleDrawClick = () => {
  fractal.render()
}

const handleIterChange = (iter: number) => {
  fractal.maxIters = iter 
}

const handleZoom = (rectangle: rectangle) => {
  fractal.zoom(rectangle)
}



handleResize()

window.addEventListener("resize", handleResize)
fractalSelect.addEventListener('change', event => {
    //@ts-ignore
    handleFractalChange(event.target.value);
});
colorSelect.addEventListener('change', event => {
  //@ts-
  handleColorChange(event.target.value)
})


// Rectangular selection sutff

const createSelectionDiv = (point: point) => {
  const div = document.createElement("div");
  div.setAttribute("id", "selection")
  div.style.position = "absolute";
  div.style.left = `${point.x}px`;
  div.style.top = `${point.y}px`;
  div.style.backgroundColor = "rgba(100, 100, 100, 0.8)";
  document.body.appendChild(div);
}

const updateSelectionDiv = (point: point) => {
  const div = document.getElementById("selection") as HTMLDivElement
  const width = (point.x - startX)
  const height = (point.y - startY)
  if (width<0) {
    div.style.left = `${point.x}px`
  }
  else if (height<0) {
    div.style.top = `${point.y}px`
  }
  div.style.width = `${Math.abs(width)}px`;
  div.style.height = `${Math.abs(height)}px`;
}
 
let isDrawing = false;
let startX = 0;
let startY = 0;
let endX = 0;
let endY = 0;



canvas.addEventListener("mousedown", (event) => {
  isDrawing = true;
  startX = event.clientX;
  startY = event.clientY;
  createSelectionDiv({
    x: startX,
    y: startY
  }
  )
});

canvas.addEventListener("mousemove", (event) => {
  if (isDrawing) {
    endX = event.clientX;
    endY = event.clientY;
    updateSelectionDiv({
      x: endX,
      y: endY
    })
  } 
});

canvas.addEventListener("mouseup", (event) => {
  const div = document.getElementById("selection") as HTMLDivElement
  div.remove()
  isDrawing = false;
  endX = event.clientX;
  endY = event.clientY;

  // Calculate top left and bottom right x,y coordinates
  const topLeftX = Math.min(startX, endX);
  const topLeftY = Math.min(startY, endY);
  const bottomRightX = Math.max(startX, endX);
  const bottomRightY = Math.max(startY, endY);
  const rec:rectangle = {
    ul: {
        x: topLeftX,
        y: topLeftY
    },
    dr: {
        x: bottomRightX,
        y: bottomRightY
    }
  }
  handleZoom(rec)
})