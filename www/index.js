import { Universe } from "wasm-wolfram";
import { memory } from "wasm-wolfram/wolfram_rust_bg.wasm";

const ROWS_PER_FRAME = 2;
const LIVE_RGB = [
  [244, 43, 3],
  [0, 95, 190],
  [0, 135, 36],
];

const getRule = () => {
  const rule_set = [
    30, 54, 60, 62, 90, 94, 102, 110, 122, 126, 150, 158, 182, 188, 220, 250,
  ];
  return rule_set[Math.floor(Math.random() * rule_set.length)];
};

const w = window.innerWidth;
const h = window.innerHeight;

const universe = Universe.new(w, h, getRule());
const canvas = document.getElementById("wolfram-canvas");
const ctx = canvas.getContext("2d");

canvas.width = w;
canvas.height = h;
ctx.imageSmoothingEnabled = false;

const changeColour = () => {
  const c = LIVE_RGB[Math.floor(Math.random() * LIVE_RGB.length)];
  ctx.fillStyle = `rgb(${c[0]},${c[1]},${c[2]})`;
};

let total_lines_processed = 0;
let current_line_number = 0;

const drawCells = () => {
  if (current_line_number >= h) {
    ctx.globalCompositeOperation = "copy";
    ctx.drawImage(ctx.canvas, 0, -ROWS_PER_FRAME);
    ctx.globalCompositeOperation = "source-over";
    current_line_number -= ROWS_PER_FRAME;
  }

  const rows = new Uint8Array(
    memory.buffer,
    universe.next_rows_ptr(),
    w * ROWS_PER_FRAME
  );

  for (let y = 0; y < ROWS_PER_FRAME; y++) {
    const row = rows.slice(y * w, y * w + w);

    for (let x = 0; x < w; x++) {
      if (row[x] === 1) {
        ctx.fillRect(x, y + current_line_number, 1, 1);
      }
    }
  }

  current_line_number += ROWS_PER_FRAME;
  total_lines_processed += ROWS_PER_FRAME;

  if (total_lines_processed % (h * 2) < ROWS_PER_FRAME) {
    changeColour();
    universe.set_rule(getRule());
  }
};

const container = document.getElementById("container");
let scale = 1;
let inc = 0.0003;

const zoom = () => {
  scale += inc;
  container.style.transform = `scale(${scale})`;
  if (scale > 1.5 || scale < 1) {
    inc *= -1;
  }
};

const renderLoop = () => {
  universe.tick(ROWS_PER_FRAME);
  drawCells();
  zoom();
  setTimeout(() => {
    requestAnimationFrame(renderLoop);
  }, 30);
};

changeColour();
requestAnimationFrame(renderLoop);
