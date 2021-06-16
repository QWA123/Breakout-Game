const grid = document.querySelector(".grid");
const scoreDisplay = document.querySelector("#score");
const blockWidth = 100;
const blockHeight = 20;
const ballDiameter = 20;
const boardWidth = 565;
const boardHeight = 300;

let timerId;
let xDirection = 2;
let yDirection = 2;
let score = 0;

// positions of user
const startPosition = [230, 10]; // starts at middle
let currentPosition = startPosition;

// positions of ball
const ballStart = [270, 40];
let ballCurrentPosition = ballStart;

// generate block
class Block {
  constructor(xAxis, yAxis) {
    this.bottomLeft = [xAxis, yAxis];
    this.bottomRight = [xAxis + blockWidth, yAxis];
    this.topLeft = [xAxis, yAxis + blockHeight];
    this.topRight = [xAxis + blockWidth, yAxis + blockHeight];
  }
}

// all my blocks
const blocks = [];

let x = 10;
let y = 270;
let ct = 0;

while (ct < 15) {
  blocks.push(new Block(x, y));
  ct++;
  if (ct % 5 != 0) {
    x += 110;
  } else {
    x = 10;
    y -= 30;
  }
}

// draw all the blocks
function addBlock() {
  for (let i = 0; i < blocks.length; i++) {
    const block = document.createElement("div");
    block.classList.add("block");
    block.style.left = blocks[i].bottomLeft[0] + "px"; // Note: always append 'px'
    block.style.bottom = blocks[i].bottomLeft[1] + "px";
    grid.appendChild(block);
  }
}

addBlock();

// add player ie user of game
const user = document.createElement("div");
user.classList.add("user");
grid.appendChild(user);
drawUser();

// draw user
function drawUser() {
  user.style.left = currentPosition[0] + "px";
  user.style.bottom = currentPosition[1] + "px";
}

// draw the ball
function drawBall() {
  ball.style.left = ballCurrentPosition[0] + "px";
  ball.style.bottom = ballCurrentPosition[1] + "px";
}

// move user
function moveUser(e) {
  switch (e.key) {
    case "ArrowLeft":
      if (currentPosition[0] - 20 >= 0) {
        currentPosition[0] -= 20;
        drawUser();
      }
      break;
    case "ArrowRight":
      if (currentPosition[0] + 20 <= boardWidth - blockWidth) {
        currentPosition[0] += 20;
        drawUser();
      }
      break;
  }
}

document.addEventListener("keydown", moveUser);
// moveUser has the parameter 'e' already by default
// but mention 'e' as parameter when using 'e' inside a function

// add ball
const ball = document.createElement("div");
ball.classList.add("ball");
grid.appendChild(ball);
drawBall();

function moveBall() {
  ballCurrentPosition[0] += xDirection;
  ballCurrentPosition[1] += yDirection;
  checkForCollisions();
  drawBall();
}

timerId = setInterval(moveBall, 10);

// check for collisions
function checkForCollisions() {
  // check for collisions with currently living blocks
  for (let i = 0; i < blocks.length; i++) {
    if (
      ballCurrentPosition[0] > blocks[i].bottomLeft[0] &&
      ballCurrentPosition[0] < blocks[i].bottomRight[0] &&
      ballCurrentPosition[1] + ballDiameter > blocks[i].bottomLeft[1] &&
      ballCurrentPosition[1] < blocks[i].topLeft[1]
    ) {
      // collision
      const allBlocks = Array.from(grid.querySelectorAll(".block"));
      allBlocks[i].classList.remove("block");
      allBlocks.splice(i, 1);
      changeDirection(1);
      score++;
      scoreDisplay.innerHTML = score;

      // check for win
      if (allBlocks.length === 0) {
        clearInterval(timerId); // stops moving the ball ie STOPS the Game
        scoreDisplay.innerHTML = "You Win";
        document.removeEventListener("keydown", moveUser); // key pressing works no more
      }
    }
  }

  // check for user collisions
  if (
    ballCurrentPosition[0] > currentPosition[0] &&
    ballCurrentPosition[0] < currentPosition[0] + blockWidth &&
    ballCurrentPosition[1] <= currentPosition[1] + blockHeight
  ) {
    // collision
    changeDirection(2); // coll with user
  }

  // check for wall collisions
  if (
    ballCurrentPosition[0] > boardWidth - ballDiameter ||
    ballCurrentPosition[0] <= 0
  ) {
    // collision with right/left wall
    changeDirection(0); // 0 means coll with l/r
  }
  if (ballCurrentPosition[1] >= boardHeight - ballDiameter) {
    // collision with top wall
    changeDirection(1); // 1 is coll with top wall
  }
  if (ballCurrentPosition[1] <= 0) {
    // collision with bottom wall ie GAME OVER
    clearInterval(timerId); // stops moving the ball ie STOPS the Game
    scoreDisplay.innerHTML = "You Lose";
    document.removeEventListener("keydown", moveUser); // key pressing works no more
  }
}

function changeDirection(a) {
  if (a == 0) {
    xDirection *= -1;
  } else if (a == 1 || a == 2) {
    yDirection *= -1;
  }
}
