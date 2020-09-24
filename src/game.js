/*global THREE*/
/*global Stats*/
window.addEventListener('load', init, false);
THREE.Cache.enabled = false;

var camera;
var scene;
var renderer;
var controls;
var dom;
var id;
var score_board;
var sceneWidth=window.innerWidth;
var sceneHeight=window.innerHeight;

var clock = new THREE.Clock();
var score = 0;
var obstacleInterval = 25;
var speedInterval = 1000;
var obstacleCounter;
var speedCounter;


function init() {
	document.getElementsByClassName('start')[0].onclick = start;
	document.getElementsByClassName('playAgain')[0].onclick = resumeGame;
	createScene(); // set up the scene
	document.body.classList.add('fade')
	dom.classList.add('fade')
	document.getElementsByClassName('score')[0].classList.add('fade')
}

function setVars() {
	score = 0;
	obstacleCounter = 0;
	speedCounter = 0;
	rollingSpeed=0.008;
	clock.start();
	rollingGroundSphere.rotation.x = 0;
	hero.hasCollided = false;
	set_pose(normal);
	currentLane=middleLane;
	hero.base.position.x = currentLane;
	position_buffer = [];

}

function start() {
	setVars();
	dom.classList.remove('fade');
	document.body.classList.remove('fade')
	document.getElementsByClassName("gameOver")[0].classList.remove('summary')
	document.getElementsByClassName('score')[0].classList.remove('fade')
	document.getElementsByClassName('start')[0].style.display = "none";
	update(); //call game loop
}

async function createScene(){
	sphericalHelper = new THREE.Spherical();
    scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0xffffff, 0.03);
    camera = new THREE.PerspectiveCamera( 75, sceneWidth / sceneHeight, 0.1, 1000);
	camera.position.set(0, 3.5, 6.5);

    score_board = document.getElementsByClassName('value')[0];
    renderer = new THREE.WebGLRenderer({alpha:true});
    renderer.shadowMap.enabled = true; //enable shadow
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.setSize(sceneWidth, sceneHeight);
    dom = document.getElementsByClassName('game')[0];
	dom.appendChild(renderer.domElement);
	detectSwipe(renderer.domElement, handleSwipe);
	createEnvironment();
	hero = getHero('./assets/snowman/', body, scene)
	addFallingSnow();
	addExplosion();
	
	document.onkeydown = handleKeyDown;
}

function update(){
	id = requestAnimationFrame(update);
	if (hero && !hero.hasCollided){
		if (speedCounter >= speedInterval){
			console.log('faster');
			rollingSpeed += 0.0005
			speedCounter = 0;
		}
		rollingGroundSphere.rotation.x += rollingSpeed;
		nextIntStep();
		obstacleCounter += 1;
		speedCounter += 1;
		if(obstacleCounter >= obstacleInterval){
			obstacleCounter = 0;
			clock.start();
			addPathObstacle();

			score+=2*obstacleReleaseInterval;
			score_board.innerHTML = Math.floor(score);
			} 

		doObstacleLogic();

	} else {
		gameOver();
	}
	
    doExplosionLogic();
	updateParticles();
    render();
}

function render(){

    renderer.render(scene, camera); //draw
}

function gameOver () {
	var overlay = document.getElementsByClassName("gameOver")[0]
	overlay.classList.add('summary')
	document.getElementById('final_score_value').innerHTML = score_board.innerHTML
	document.getElementsByClassName('score')[0].classList.add('fade')
}

function resumeGame() {
  cancelAnimationFrame(id) 
  clearSet();
  start();
}

function onWindowResize() {
	sceneHeight = window.innerHeight;
	sceneWidth = window.innerWidth;
	renderer.setSize(sceneWidth, sceneHeight);
	camera.aspect = sceneWidth/sceneHeight;
	camera.updateProjectionMatrix();
}
