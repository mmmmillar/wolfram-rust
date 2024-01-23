import "./styles.css";

const background_images = [1, 2, 3, 4, 5, 6, 7];

background_images.forEach((i) => {
  const img = new Image();
  img.src = `assets/${i}.svg`;
});

const container = document.getElementById("container");

const changeBackgroundImage = () => {
  const image_num =
    background_images[Math.floor(Math.random() * background_images.length)];
  container.style.backgroundImage = `url("assets/${image_num}.svg")`;
};

const fadeIn = () => {
  container.classList.remove("fadeOut");
  container.classList.add("fadeIn");
};

const fadeOut = () => {
  container.classList.remove("fadeIn");
  container.classList.add("fadeOut");
};

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const renderLoop = async () => {
  fadeOut();
  await delay(500);
  changeBackgroundImage();
  fadeIn();
  await delay(500);
  setTimeout(() => {
    requestAnimationFrame(renderLoop);
  }, 8000);
};

requestAnimationFrame(renderLoop);
