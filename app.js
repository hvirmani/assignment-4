const canvas = document.getElementById("canvas");
const pen = canvas.getContext("2d");
pen.fillStyle = " #FFFF70";

const height = 600;
const width = 1000;
const cs = 67;
let food = null;
let score = 0;
let isOver = false;
let init_x = 0;
let init_y = 0;

const snake = {
  init_length: 5,
  direction: "right",
  cells: [],
  createSnake: function () {
    for (let i = 0; i < this.init_length; i++) {
      this.cells.push({ x: i, y: 0 });
    }
  },
  drawSnake: function () {
    for (let cell of this.cells) {
      if (cell == this.cells[this.cells.length - 1]) {
        pen.fillStyle = "#FFFF00";
      }
      pen.fillRect(cell.x * cs, cell.y * cs, cs - 0.5, cs - 0.5);
    }
  },
  updateSnake: function () {
    const headX = this.cells[this.cells.length - 1].x;
    const headY = this.cells[this.cells.length - 1].y;
    let nextX, nextY;

    if (food.x === headX && food.y === headY) {
      food = getRandomFood();
      score++;
    } else {
      this.cells.shift(); //delete cell when snake dont eat the food
    }

    switch (this.direction) {
      case "up": {
        nextX = headX;
        nextY = headY - 1;
        if (nextY * cs < 0) {
          isOver = true;
        }
        break;
      }
      case "down": {
        nextX = headX;
        nextY = headY + 1;
        if (nextY * cs >= height) {
          isOver = true;
        }
        break;
      }
      case "left": {
        nextX = headX - 1;
        nextY = headY;
        if (nextX * cs < 0) {
          isOver = true;
        }
        break;
      }
      case "right": {
        nextX = headX + 1;
        nextY = headY;

        if (nextX * cs >= width) {
          isOver = true;
        }
        break;
      }
    }

    this.cells.push({ x: nextX, y: nextY });
  },
};

function keyPress(event) {
  switch (event.key) {
    case "ArrowUp": {
      snake.direction = "up";
      break;
    }
    case "ArrowDown": {
      snake.direction = "down";
      break;
    }
    case "ArrowLeft": {
      snake.direction = "left";
      break;
    }
    case "ArrowRight": {
      snake.direction = "right";
      break;
    }
  }
}

function init() {
  snake.createSnake();
  snake.drawSnake();
  food = getRandomFood();
  document.addEventListener("keydown", keyPress);
}

function update() {
  snake.updateSnake();
}

function draw() {
  if (isOver) {
    clearInterval(id);
    pen.fillStyle = "red";
    pen.fillText("Game Over", 50, 100);
    console.log("GAME OVER");
    return;
  }
  pen.clearRect(0, 0, width, height);
  pen.font = "40px sans-serif";
  pen.fillStyle = "green";
  pen.fillText(`Score is ${score} `, 50, 50);
  pen.fillStyle = "blue";
  pen.fillRect(food.x * cs, food.y * cs, cs - 0.5, cs - 0.5);
  pen.fillStyle = " #FFFF70";
  snake.drawSnake();
}

function gameLoop() {
  update();
  draw();
}

function getRandomFood() {
  const foodX = Math.floor((Math.random() * (width - cs)) / cs);
  const foodY = Math.floor((Math.random() * (height - cs)) / cs);
  for (cell in snake.cells) {
    if (cell.x === foodX && cell.y === foodY) {
      return getRandomFood();
    }
  }
  food = {
    x: foodX,
    y: foodY,
  };
  return food;
}

init();

let id = setInterval(gameLoop, 200);
