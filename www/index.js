import { Universe } from "wasm-wolfram";
import { memory } from "wasm-wolfram/wolfram_rust_bg";

const CELL_SIZE = 4;
const LIVE_RGBA = [244, 43, 3, 255];

const universe = Universe.new(
  window.innerWidth / CELL_SIZE,
  window.innerHeight / CELL_SIZE,
  105
);
const width = universe.width();
const height = universe.height();

const canvas = document.getElementById("wolfram-canvas");
canvas.width = width * CELL_SIZE;
canvas.height = height * CELL_SIZE;

const ctx = canvas.getContext("2d");

const drawCells = () => {
  const rows = universe.rows();
  const cells = new Uint8Array(
    memory.buffer,
    universe.cell_ptr(),
    rows * width
  );
  const cellRGB = new Uint8ClampedArray(
    cells.length * CELL_SIZE * CELL_SIZE * 4
  );

  for (let i = 0; i < cells.length; i++) {
    if (cells[i] === 1) {
      const row = Math.floor(i / width);
      const col = i % width;

      for (let dy = 0; dy < CELL_SIZE; dy++) {
        for (let dx = 0; dx < CELL_SIZE; dx++) {
          const baseIndex =
            ((row * CELL_SIZE + dy) * canvas.width + (col * CELL_SIZE + dx)) *
            4;

          cellRGB[baseIndex] = LIVE_RGBA[0];
          cellRGB[baseIndex + 1] = LIVE_RGBA[1];
          cellRGB[baseIndex + 2] = LIVE_RGBA[2];
          cellRGB[baseIndex + 3] = LIVE_RGBA[3];
        }
      }
    }
  }

  let imageData = new ImageData(cellRGB, canvas.width, rows * CELL_SIZE);
  ctx.putImageData(imageData, 0, 0);
};

const renderLoop = () => {
  universe.tick();
  drawCells();
  requestAnimationFrame(renderLoop);
};

requestAnimationFrame(renderLoop);
