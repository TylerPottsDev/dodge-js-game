// VARIABLES
const options = {};
let canvas, ctx, gravity, startingGravity, timer, spawnSpeed, obstacles = [], player, isGameOver, timeAlive, gameOverEl, timeAliveEl, restartgameBTN;

// EVENTS
window.addEventListener('load', preload);
window.addEventListener('keypress', inputHandler);

function preload() {
	options.lanes	= 4;
	options.width	= window.innerWidth;
	options.height	= window.innerHeight;

	canvas			= document.querySelector('canvas');
	ctx				= canvas.getContext('2d');
	canvas.width	= options.width;
	canvas.height	= options.height;

	gameOverEl		= document.querySelector('.gameover');
	timeAliveEl		= document.querySelector('.timealive');
	restartgameBTN	= document.querySelector('.restartgame');

	gravity = 3;
	spawnSpeed = 1000;
	timer = 0;
	timeAlive = 0;
	startingGravity = gravity;
	
	isGameOver = false;

	// Once loaded start game
	start();
}

function start() {
	setInterval(() => timeAlive++, 1000);
	
	player = new Player(0, canvas.height - 50, canvas.width/options.lanes, 50, '#FFCE00');
	spawnObstacle();

	// Set enemy spawn timer
	setInterval(spawnObstacle, spawnSpeed);
	
	// Start first frame
	requestAnimationFrame(update);
}

function update() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);

	if (obstacles.length > 0) {
		for (const [i, obs] of obstacles.entries()) {
			obs.move();
			obs.draw();
			
			if (obs.y > canvas.height) {
				obstacles.splice(i, 1);
			}
		}
	}

	player.draw();
	player.detect();

	timer++;

	gravity = startingGravity + timer/1000;

	// recall to create gameloop
	if (!isGameOver) {
		requestAnimationFrame(update);
	}
}

function inputHandler(evt) {
	if (evt.key == "d") {
		player.move(1);
	} else if (evt.key == "a") {
		player.move(-1);
	}
}

function spawnObstacle() {
	const lane = randomIntFromInterval(0, options.lanes - 1);
	const w = canvas.width/options.lanes;
	const h = 50;
	const x = lane * w;
	const y = -h;
	const c = "#AF1E2D";
	
	const obs = new Obstacle(x, y, w, h, c);

	obstacles.push(obs);
}

function gameOver() {
	isGameOver = true;
	gameOverEl.classList.add('is-active');
	timeAliveEl.innerText = "You survived " + timeAlive + " seconds";
	restartgameBTN.addEventListener('click', () => {
		window.location.reload();
	}, {once: true});
}

// Functional Objects
function Player (x, y, w, h, c) {
	this.x = x;
	this.y = y;
	this.w = w;
	this.h = h;
	this.c = c;

	this.move = (dir) => {
		if (
			dir == 1 &&
			this.x < canvas.width - canvas.width/options.lanes
		) {
			this.x += canvas.width/options.lanes;
		} else if (
			dir == -1 &&
			this.x >= canvas.width/options.lanes
		) {
			this.x -= canvas.width/options.lanes;
		}
	}

	this.draw = () => {
		ctx.fillStyle = this.c;
		ctx.fillRect(this.x, this.y, this.w, this.h);
	}

	this.detect = () => {
		for (obs of obstacles) {
			// x > b.x && x < b.x+brickWidth && y > b.y && y < b.y+brickHeight
			if (
				this.x == obs.x &&
				this.y < obs.y + obs.h &&
				this.y + this.h > obs.y
			) {
				gameOver();
			}
		}
	}
}

function Obstacle (x, y, w, h, c) {
	this.x = x;
	this.y = y;
	this.w = w;
	this.h = h;
	this.c = c;

	this.move = () => {
		this.y += gravity;
	}

	this.draw = () => {
		ctx.fillStyle = this.c;
		ctx.fillRect(this.x, this.y, this.w, this.h);
	}
}

// Helper functions
function randomIntFromInterval(min, max) { // min and max included 
  return Math.floor(Math.random() * (max - min + 1) + min);
}