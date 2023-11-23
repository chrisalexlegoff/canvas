let canvas = document.querySelector("#canvas");
// Re-affectation du ratio canvas => css
canvas.height = canvas.offsetHeight;
canvas.width = canvas.offsetWidth;
// Score
let score = 0;
// nbre vies
let lives = 3;
// optimistation dimensions briques
// Préparation variables
// briques
let brickRowCount = 3; // nbre lignes
let brickColumnCount = 5; // nbre colonnes
let brickWidth = 75;
let brickHeight = 20;
let brickPadding = 10;
let brickOffsetTop = 30;
let brickOffsetLeft = 30;
// paddle
let paddleHeight = 10;
let paddleWidth = 70;
let paddleX = (canvas.width - paddleWidth) / 2; // postion paddle
// postion calculée en 2 variables pour les traitements futurs
let x = canvas.width / 2;
let y = canvas.height - 30;
// vélocité (velocity)
let dx = 2;
let dy = -2;
// balle
let ballRadius = 10; // rayon
// détection des appuis touches droite et gauche
let rightPressed = false;
let leftPressed = false;
// tableau pour création et dessin des brisues furures
let bricks = [];
for (let c = 0; c < brickColumnCount; c++) {
  bricks[c] = [];
  for (let r = 0; r < brickRowCount; r++) {
    bricks[c][r] = { x: 0, y: 0, status: 1 };
  }
}
// Récupération du contexte 2d pour pouvoir dessiner dans le navigateur
let ctx = canvas.getContext("2d");
// écoute d'évènement sur les touches left et right
document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
// écoute mouvements souris
document.addEventListener("mousemove", mouseMoveHandler, false);
// fonction mouvement souris
function mouseMoveHandler(e) {
  let relativeX = e.clientX - canvas.offsetLeft;
  if (relativeX > 0 && relativeX < canvas.width) {
    paddleX = relativeX - paddleWidth / 2;
  }
}
// function appuis touche
function keyDownHandler(e) {
  if (e.key === "ArrowRight" || e.key === "Right") {
    rightPressed = true;
  } else if (e.key === "ArrowLeft" || e.key === "Left") {
    leftPressed = true;
  }
}
// fonction touche relevée
function keyUpHandler(e) {
  if (e.key === "ArrowRight" || e.key === "Right") {
    rightPressed = false;
  } else if (e.key === "ArrowLeft" || e.key === "Left") {
    leftPressed = false;
  }
}

function collisionDetection() {
  for (let c = 0; c < brickColumnCount; c++) {
    for (let r = 0; r < brickRowCount; r++) {
      let b = bricks[c][r];
      if (b.status === 1) {
        if (
          x > b.x &&
          x < b.x + brickWidth &&
          y > b.y &&
          y < b.y + brickHeight
        ) {
          dy = -dy;
          b.status = 0;
          score++;
          if (score === brickColumnCount * brickRowCount) {
            alert("Bravo, c'est gagné!");
            document.location.reload();
            // clearInterval(interval); // chrome
          }
        }
      }
    }
  }
}
// dessin texte du score (nbre briques cassées)
function drawScore() {
  ctx.font = "16px Arial";
  ctx.fillstyle = "#0095DD";
  ctx.fillText("Score: " + score, 8, 20);
}
// dessin texte du nbre de vies restantes
function drawLives() {
  ctx.font = "16px Arial";
  ctx.fillstyle = "#0095DD";
  ctx.fillText("Lives: " + lives, canvas.width - 65, 20);
}

// fonction dessin briques
function drawBrick() {
  // parcours tableau multi-dimensionnel
  for (let c = 0; c < brickColumnCount; c++) {
    for (let r = 0; r < brickRowCount; r++) {
      if (bricks[c][r].status === 1) {
        // calcul position pour chaque brique
        let brickX = c * (brickWidth + brickPadding) + brickOffsetLeft;
        let brickY = r * (brickHeight + brickPadding) + brickOffsetTop;
        // stockage position pour traitement collisions futures
        bricks[c][r].x = brickX;
        bricks[c][r].y = brickY;
        // dessin briques à chaque ittération (x15 pour nous)
        ctx.beginPath();
        ctx.rect(brickX, brickY, brickWidth, brickHeight);
        ctx.fillstyle = "#0095DD";
        ctx.fill();
        ctx.closePath();
      }
    }
  }
}
// fonction dessin paddle
function drawPaddle() {
  ctx.beginPath();
  ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
  ctx.fillStyle = "#0095DD";
  ctx.fill();
  ctx.closePath();
}
// fonction dessin balle
function drawBall() {
  ctx.beginPath();
  ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
  ctx.fillStyle = "#0095DD";
  ctx.fill();
  ctx.closePath();
}
// fonction dessin principal (cavas) à chaque frame
function draw() {
  if (canvas.getContext) {
    // vérification présence du contexte
    // nettoyage du canvas à chaque rendu (frame)
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBall(); // callback
    drawPaddle();
    drawScore();
    drawLives();
    collisionDetection();
    drawBrick();
    // rebond haut et bas
    if (y + dy < ballRadius) {
      dy = -dy;
    } else if (y + dy > canvas.height - ballRadius) {
      if (x > paddleX && x < paddleX + paddleWidth) {
        // condition collision paddle
        dy = -dy; // inversion direcion balle
      } else {
        lives--;
        if (lives === 0) {
          // (!lives)
          // si nbre vies = à zéro
          // fin de partie à optimiser!!
          alert("GAME OVER!");
          document.location.reload();
          // clearInterval(interval); // chrome
        } else {
          // réinitialisation des position canvas
          x = canvas.width / 2;
          y = canvas.height - 30;
          // direction balle
          dx = 2;
          dy = -2;
          // re-positionnement du paddle
          paddleX = (canvas.width - paddleWidth) / 2;
        }
      }
    }
    // rebonds gauche et droit
    if (x + dx < ballRadius || x + dx > canvas.width - ballRadius) {
      dx = -dx;
    }
    if (rightPressed) {
      paddleX += 7;
      if (paddleX + paddleWidth > canvas.width) {
        // détection bord droit => arrêt paddle
        paddleX = canvas.width - paddleWidth;
      }
    } else if (leftPressed) {
      paddleX -= 7;
      if (paddleX < 0) {
        // détection bord gauche => arrêt paddle
        paddleX = 0;
      }
    }
    x += dx; // x = x + dx
    y += dy;
  }
  requestAnimationFrame(draw); // 60fps
}
// tips chrome
// let interval = setInterval(draw, 20);
draw();
