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

let rows = 9;
let cols = 16;
let canvasWidth = 60*cols;
let canvasHeight = 60*rows;
let gridSize = 60;

let shapes = new Array(cols);
for (let i = 0; i < cols; i++) {
  shapes[i] = new Array(rows);
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
      neighbors.push(shapes[neighborX][neighborY]);
    }
  }

  shapes[x][y].update(neighbors);
  for (let i = 0; i < cols; i += 1) {
    for (let j = 0; j < rows; j += 1) {
      shapes[i][j].display();
    }
  }

  // if more than a certain number of shapes are the same, reset the grid
  let shapeCounts = {};
  for (let i = 0; i < cols; i += 1) {
    for (let j = 0; j < rows; j += 1) {
      let shape = shapes[i][j].shape;
      if (shape in shapeCounts) {
        shapeCounts[shape] += 1;
      } else {
        shapeCounts[shape] = 1;
      }
    }
  }
  let mostCommonShape = Object.keys(shapeCounts).reduce((a, b) => shapeCounts[a] > shapeCounts[b] ? a : b);
  if (shapeCounts[mostCommonShape] > 0.5 * cols * rows) {
    generateGridShapes();
  }
  // if more than a certain number of colors are the same, reset the grid
  let mostCommonColor = Object.keys(shapeCounts).reduce((a, b) => shapeCounts[a] > shapeCounts[b] ? a : b);
  if (shapeCounts[mostCommonColor] > 0.5 * cols * rows) {
    generateGridShapes();
  }
}

function generateGridShapes() {
  for (let x = 0; x < cols; x += 1) {
    for (let y = 0; y < rows; y += 1) {
      shapes[x][y] = new GridShape(x * gridSize, y * gridSize);
    }
  }
}

class GridShape {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.shape = random(['triangle', 'triangle', 'square', 'square', 'circle']);
    this.color = random(colors);
    this.rotation = random([0, HALF_PI, PI, PI + HALF_PI]);
  }

  update(neighbors) {
    // randomly decide to make a random a random change
    if (random() < 0.5) {
      // with a chance, change the shape
      if (random() < 0.2) {
        this.shape = random(['triangle', 'triangle', 'square', 'square', 'circle']);
      }
      // with a chance, change the color
      if (random() < 0.2) {
        this.color = random(colors);
      }
      // with a chance, change the rotation
      if (random() < 0.2) {
        this.rotation = random([0, HALF_PI, PI, PI + HALF_PI]);
      }
      return
    }

    // count the number of neighbors of each shape
    let neighborCounts = {
      'triangle': 0,
      'square': 0,
      'circle': 0,
    };
    for (let i = 0; i < neighbors.length; i += 1) {
      neighborCounts[neighbors[i].shape] += 1;
    }
    // count the number of neighbors of each color
    let colorCounts = {};
    for (let i = 0; i < neighbors.length; i += 1) {
      let color = neighbors[i].color;
      if (color in colorCounts) {
        colorCounts[color] += 1;
      } else {
        colorCounts[color] = 1;
      }
    }
    // update the color to the least common color among the neighbors
    let leastCommonColor = Object.keys(colorCounts).reduce((a, b) => colorCounts[a] < colorCounts[b] ? a : b);
    this.color = leastCommonColor;

    // update the shape to the least common shape among the neighbors
    let mostCommonShape = Object.keys(neighborCounts).reduce((a, b) => neighborCounts[a] < neighborCounts[b] ? a : b);
    this.shape = mostCommonShape;
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
    translate(gridSize / 2, gridSize / 2);
    rotate(rotation);
    triangle(-gridSize / 2, -gridSize / 2, gridSize / 2, -gridSize / 2, 0, gridSize / 16);
    pop();
  }

  drawSquare(color) {
    stroke(color);
    fill(color);
    rect(0, 0, gridSize, gridSize);
  }

  drawCircle(color) {
    stroke(color);
    fill(color);
    ellipse(gridSize / 2, gridSize / 2, gridSize * 7 / 5, gridSize * 7 / 5);
  }
}
