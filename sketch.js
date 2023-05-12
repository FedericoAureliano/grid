let rows = 9;
let cols = 16;
let squareSize = 60;
let canvasWidth = squareSize*cols;
let canvasHeight = squareSize*rows;

let grid = new Array(cols);
for (let i = 0; i < cols; i++) {
  grid[i] = new Array(rows);
}

let colors = [
  '#EE1F60',
  '#ED4E33',
  '#00B0DA',
  '#00A598',
  '#46535E',
  '#B9D3B6',
  '#CFDD45',
  '#859438',
  '#584F29',
]

let shapes = [
  'triangle',
  'square',
  'circle',
]

function randomColor() {
  return random(colors);
}

function randomShape() {
  return random(['triangle', 'triangle', 'square', 'square', 'circle'])
}

function setup() {
  createCanvas(canvasWidth, canvasHeight);
  generateGridShapes();
  draw();
  frameRate(3);
}

function draw() {
  background(255);

  // pick a random shape and update it
  let x = floor(random(cols));
  let y = floor(random(rows));

  // find the neighbors of x, y including the wrap-around neighbors and the diagonal neighbors
  let neighbors = [];
  for (let i = -1; i <= 1; i += 1) {
    for (let j = -1; j <= 1; j += 1) {
      let neighborX = (x + i + cols) % cols;
      let neighborY = (y + j + rows) % rows;
      if (i === 0 && j === 0) {
        continue;
      }
      neighbors.push(grid[neighborX][neighborY]);
    }
  }

  grid[x][y].update(neighbors);
  for (let i = 0; i < cols; i += 1) {
    for (let j = 0; j < rows; j += 1) {
      grid[i][j].display();
    }
  }
}

function generateGridShapes() {
  for (let x = 0; x < cols; x += 1) {
    for (let y = 0; y < rows; y += 1) {
      grid[x][y] = new GridShape(x * squareSize, y * squareSize);
    }
  }
}

class GridShape {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.shape = randomShape();
    this.color = random(colors);
    this.rotation = random([0, HALF_PI, PI, PI + HALF_PI]);
  }

  update(neighbors) {
    // with a chance, change the shape
    if (random() < 0.2) {
      this.shape = randomShape();
    }
    // with a chance, change the color
    if (random() < 0.2) {
      this.color = random(colors);
    }
    // with a chance, change the rotation
    if (random() < 0.2) {
      this.rotation = random([0, HALF_PI, PI, PI + HALF_PI]);
    }
  }

  display() {
    push();
    translate(this.x, this.y);

    if (this.shape === 'triangle') {
      this.drawTriangle(this.color, this.rotation);
    } else if (this.shape === 'square') {
      this.drawSquare(this.color);
    } else if (this.shape === 'circle') {
      this.drawCircle(this.color);
    }

    pop();
  }

  drawTriangle(color, rotation) {
    stroke(color);
    fill(color);

    // draw a triangle facing into the middle of the grid
    push();
    translate(squareSize / 2, squareSize / 2);
    rotate(rotation);
    triangle(-squareSize / 2, -squareSize / 2, squareSize / 2, -squareSize / 2, 0, squareSize / 16);
    pop();
  }

  drawSquare(color) {
    stroke(color);
    fill(color);
    rect(0, 0, squareSize, squareSize);
  }

  drawCircle(color) {
    stroke(color);
    fill(color);
    ellipse(squareSize / 2, squareSize / 2, squareSize * 7 / 5, squareSize * 7 / 5);
  }
}
