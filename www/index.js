import { Universe } from "wasm-wolfram";
import { memory } from "wasm-wolfram/wolfram_rust_bg";

const CELL_SIZE = 1;
const LIVE_RGBA = [244, 43, 3, 255];
const RGBA_LEN = 4;

const universe = Universe.new(
  window.innerWidth / CELL_SIZE,
  window.innerHeight / CELL_SIZE,
  22
);
const width = universe.width();
const height = universe.height();

const canvas = document.getElementById("wolfram-canvas");
canvas.width = width * CELL_SIZE;
canvas.height = height * CELL_SIZE;

const ctx = canvas.getContext("2d");
const imageData = ctx.createImageData(canvas.width, canvas.height);
ctx.putImageData(imageData, 0, 0);

let idx = 0;

const drawCells = () => {
  const inputRow = new Uint8Array(
    memory.buffer,
    universe.last_row_ptr(),
    width
  );
  const canvasRow = new Uint8ClampedArray(
    width * CELL_SIZE * CELL_SIZE * RGBA_LEN
  );

  for (let i = 0; i < width; i++) {
    if (inputRow[i] === 1) {
      const colIndex = i % width;

      for (let d = 0; d < CELL_SIZE * CELL_SIZE; d++) {
        const dy = Math.floor(d / CELL_SIZE);
        const dx = d % CELL_SIZE;

        const baseIndex =
          dy * canvas.width + (colIndex * CELL_SIZE + dx) * RGBA_LEN;

        canvasRow.set(LIVE_RGBA, baseIndex);
      }
    }
  }

  if (idx === height) {
    ctx.globalCompositeOperation = "copy";
    ctx.drawImage(ctx.canvas, 0, -CELL_SIZE);
    ctx.globalCompositeOperation = "source-over";
    idx--;
  }

  ctx.putImageData(
    new ImageData(canvasRow, canvas.width, CELL_SIZE),
    0,
    CELL_SIZE * idx++
  );
};

const renderLoop = () => {
  universe.tick();
  drawCells();
  requestAnimationFrame(renderLoop);
};

requestAnimationFrame(renderLoop);
