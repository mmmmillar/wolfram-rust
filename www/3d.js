import * as THREE from "three";
import { Universe } from "wasm-wolfram";
import { memory } from "wasm-wolfram/wolfram_rust_bg.wasm";

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  5000
);
camera.position.set(0, -1000, 400);
camera.rotation.set(1.1, 0, 0);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(new THREE.Color("black"));
document.body.appendChild(renderer.domElement);

const horizonGeometry = new THREE.BoxGeometry(1000, 200, 100);
const horizonMaterial = new THREE.MeshBasicMaterial({
  color: new THREE.Color("red"),
});
const horizon = new THREE.Mesh(horizonGeometry, horizonMaterial);
horizon.position.set(0, 4700, 400);
horizon.name = "horizon";
scene.add(horizon);

const CELL_SIZE = 20;
const SPACING_FACTOR = 7;
const rule_set = [
  30, 54, 60, 62, 90, 94, 102, 110, 122, 126, 150, 158, 182, 188, 220, 250,
];

const getRule = () => {
  return rule_set[Math.floor(Math.random() * rule_set.length)];
};

const w = window.innerWidth / CELL_SIZE / 1.2;
const h = window.innerHeight / CELL_SIZE / 1.2;

const universe = Universe.new(w, h, 90);
let total_lines_processed = 0;

const drawCells = () => {
  const inputRow = new Uint8Array(memory.buffer, universe.last_row_ptr(), w);

  scene.children.forEach((child) => {
    if (child instanceof THREE.Mesh && child.name !== "horizon") {
      const cellCol = Math.round(
        (child.position.x + (w * CELL_SIZE) / 2) / CELL_SIZE
      );
      if (inputRow[cellCol] !== 1) scene.remove(child);
    }
  });

  for (let row = 0; row < h; row++) {
    for (let col = 0; col < w; col++) {
      if (inputRow[col] === 1) {
        const x = (col - w / 2) * CELL_SIZE * SPACING_FACTOR;
        const y = (h / 2 - row) * CELL_SIZE * SPACING_FACTOR;
        const z = 0;

        let block = scene.getObjectByName(`${col}_${row}`);
        if (!block) {
          block = new THREE.Mesh(
            new THREE.BoxGeometry(
              CELL_SIZE,
              CELL_SIZE,
              Math.floor(Math.random() * (80 - CELL_SIZE + 1)) + CELL_SIZE
            ),
            new THREE.MeshBasicMaterial({
              color: new THREE.Color(0, 1, 0),
              wireframe: true,
              wireframeLinewidth: 1,
            })
          );
          block.name = `${col}_${row}`;
          scene.add(block);
        }

        block.position.set(x, y, z);
      }
    }
  }

  total_lines_processed++;

  if (total_lines_processed % (h * 2) === 0) {
    universe.set_rule(getRule());
  }

  horizon.position.y -= 20;
};

const renderLoop = () => {
  universe.tick(1);
  drawCells();
  renderer.render(scene, camera);

  setTimeout(() => {
    requestAnimationFrame(renderLoop);
  }, 80);
};

requestAnimationFrame(renderLoop);
