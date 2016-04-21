import Filter from 'src/Filter.js';

const floodFillPos = { x: 100, y: 50 };
const tolerance = 50;

async function init() {
  const canvas = document.getElementById('canvas');
  const context = canvas.getContext('2d');

  const image = new Image();
  image.src = 'image.jpg';
  await new Promise(resolve => image.onload = resolve);

  canvas.width = image.width;
  canvas.height = image.height;

  context.drawImage(image, 0, 0);

  const filter = new Filter(canvas);

  await sleep(2000);

  context.beginPath();
  context.arc(floodFillPos.x, floodFillPos.y, 10, 0, Math.PI * 2, false);
  context.stroke();

  context.font = '20px Arial';
  context.lineWidth = 2;
  context.strokeStyle = 'white';
  context.strokeText('Floodfill here', 120, 55);
  context.fillStyle = 'black';
  context.fillText('Floodfill here', 120, 55);

  await sleep(2000);

  filter
    .floodfill(floodFillPos.x, floodFillPos.y, tolerance, {
      fillColor: { r: 0, g: 0, b: 0 },
      edgeColor: { r: 255, g: 0, b: 0 },
      backgroundColor: { r: 255, g: 255, b: 255 }
    })
    .apply();
}
init();

function sleep (time) {
	return new Promise(resolve => setTimeout(resolve, time));
}
