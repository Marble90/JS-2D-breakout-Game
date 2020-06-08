// create the canvas
var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");

var x = canvas.width/2;
var y = canvas.height-20;

var dx = 2;
var dy = -2;

var ballRadius = 10;

var paddleHeight = 10;
var paddleWidth = 75;
var paddleX = (canvas.width-paddleWidth) / 2;


// controling the paddle by user
var rightPressed = false;
var leftPressed = false;

//creating the bricks
var brickRowCount = 3;
var brickColumnCount = 5;
var brickWidth = 75;
var brickHeight = 20;
var brickPadding = 10;
var brickOffsetTop = 30;
var brickOffsetLeft = 30;

var score = 0;

var lives = 3;


//hold our bricks in a two-dimensional array
var bricks = [];
for(var c=0; c<brickColumnCount; c++) {
    bricks[c] = [];
    for(var r=0; r<brickRowCount; r++) {
        bricks[c][r] = { x: 0, y: 0 , status: 1 }; // status is added to clarify it is break or not
    }
}

// drawing the bricks
function drawBricks() {
    for(var c=0; c<brickColumnCount; c++) {
        for(var r=0; r<brickRowCount; r++) {
            if(bricks[c][r].status == 1){
            var brickX = (c*(brickWidth+brickPadding))+brickOffsetLeft;
            var brickY = (r*(brickHeight+brickPadding))+brickOffsetTop;
            bricks[c][r].x = brickX;
            bricks[c][r].y = brickY;
            ctx.beginPath();
            ctx.rect(brickX, brickY, brickWidth, brickHeight);
            ctx.fillStyle = "#FF69B4";
            ctx.fill();
            ctx.closePath();
            }
        }
    }
}

// detecting the collision - x and y is for the ball
function collisionDetection() {
    for(var c=0; c<brickColumnCount; c++) {
        for(var r=0; r<brickRowCount; r++) {
            var b = bricks[c][r];
            if(b.status == 1) {
            if(x > b.x && x < b.x+brickWidth && y > b.y && y < b.y+brickHeight) {
                dy = -dy;
                dx = -dx; // add it to make the game harder
                b.status = 0; // removing the hit brick
                score++; // incrementing the score

                if(score == brickRowCount*brickColumnCount) {
                    alert("YOU WIN, CONGRATULATIONS!");
                    document.location.reload();
                    clearInterval(interval); // Needed for Chrome to end game
                }
            }
          }
        }
    }
}


// Move the ball
function drawBall() {
    ctx.beginPath();
    ctx.arc(x, y, ballRadius, 0, Math.PI*2);
    ctx.fillStyle = "#800080";
    ctx.fill();
    ctx.closePath();
}

// create the paddle
function drawPaddle() {
    ctx.beginPath();
    ctx.rect(paddleX, canvas.height-paddleHeight, paddleWidth, paddleHeight);
    ctx.fillStyle = "#FF69B4";
    ctx.fill();
    // ctx.strokeColor = "#FF0000";
    ctx.lineWidth = 4;
    ctx.strokeStyle="#800080";
    ctx.strokeRect(paddleX, canvas.height-paddleHeight, paddleWidth, paddleHeight);
    ctx.closePath();
}


function draw() { 
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBricks();
    drawBall();
    drawPaddle();
    collisionDetection();
    drawScore();
    drawLives();
    

    x += dx;
    y += dy;

    // bouncing off the walls (right left top bottom)
    if(x + dx > canvas.width-ballRadius || x + dx < ballRadius) {
        dx = -dx;
    }
    
    // if(y + dy > canvas.height-ballRadius || y + dy < ballRadius) {
    //     dy = -dy;
    if(y + dy < ballRadius) {
        dy = -dy;
    } else if (y + dy > canvas.height-ballRadius) {
        if (x > paddleX && x < paddleX + paddleWidth) 
        {dy = -dy;} else {
            lives--;
            if(lives == 0) {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                document.getElementById("myCanvas").style.backgroundImage="url(gameOver.jpg)";
            
                // loadAndDrawImage();
                // alert("GAME OVER");
                // document.location.reload();
                clearInterval(interval); // Needed for Chrome to end game
               
            } else { x = canvas.width/2;
                y = canvas.height-30;
                dx = 2;
                dy = -2;
                paddleX = (canvas.width-paddleWidth)/2;}
        // alert("GAME OVER");
        // document.location.reload();
        // clearInterval(interval); // Needed for Chrome to end game
      }
    }

    // moving the paddle with right and left bottons
    if(rightPressed) {
        paddleX += 7;
        if (paddleX + paddleWidth > canvas.width){
            paddleX = canvas.width - paddleWidth;
        }
    }
    else if(leftPressed) {
        paddleX -= 7;
        if (paddleX < 0){
            paddleX = 0;
        }
    }
    
}

function loadAndDrawImage() {
    // var img1 = new Image();
    // img1.src = "gameOver.jpg";
    // document.getElementById('myCanvas').style.backgroundImage=img1;
    // img1.onload = function(){
    //    ctx.drawImage(img1,0,0,canvas.width,canvas.height);
    // }   
}


document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
document.addEventListener("mousemove", mouseMoveHandler, false);


function keyDownHandler(e) {
    if(e.key == "Right" || e.key == "ArrowRight") {
        rightPressed = true;
    }
    else if(e.key == "Left" || e.key == "ArrowLeft") {
        leftPressed = true;
    }
}

function keyUpHandler(e) {
    if(e.key == "Right" || e.key == "ArrowRight") {
        rightPressed = false;
    }
    else if(e.key == "Left" || e.key == "ArrowLeft") {
        leftPressed = false;
    }
}

function mouseMoveHandler(e) {
    var relativeX = e.clientX - canvas.offsetLeft;
    if(relativeX > 0 && relativeX < canvas.width) {
        paddleX = relativeX - paddleWidth/2;
    }
}
 
function play(){
document.getElementById("myCanvas").style.backgroundImage="url(bg2.jpg)";
score = 0 ;
lives = 3 ;
// bricks.status = 1 ;
for(var c=0; c<brickColumnCount; c++) {
    for(var r=0; r<brickRowCount; r++) {
        (bricks[c][r].status = 1)   
    }
}
// console.log(lives);
interval = setInterval(draw, 7);
}


function drawScore() {
    ctx.font = "16px Verdana";
    ctx.fillStyle = "#800080";
    ctx.fillText("Score: "+score, 8, 20);
}

function drawLives() {
    ctx.font = "16px Verdana";
    ctx.fillStyle = "#800080";
    
    ctx.fillText("Lives: "+lives, canvas.width-70, 20);
    console.log(lives); 
}

// Wrap every letter in a span
anime.timeline({loop: true})
  .add({
    targets: '.ml15 .word',
    scale: [14,1],
    opacity: [0,1],
    easing: "easeOutCirc",
    duration: 800,
    delay: (el, i) => 800 * i
  }).add({
    targets: '.ml15',
    opacity: 0,
    duration: 1000,
    easing: "easeOutExpo",
    delay: 1000
  });



