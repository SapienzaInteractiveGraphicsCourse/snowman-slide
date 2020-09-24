var rock;
var hill;
var sphericalHelper;
var obstacleReleaseInterval=0.4;
var hillReleaseInterval=0.5;
var lastTreeReleaseTime=0;
var pathAngleValues=[1.52,1.57,1.62];
var obstaclesInPath=[];
var obstaclePool=[];
var normal_tree;
var snowy_tree;

var leftLane=-1;
var rightLane=1;
var middleLane=0;
var currentLane=middleLane;

async function loadRock(){
	rock = await loadModel('./assets/rock/rock.gltf')
	rock.type = 'rock'
}

async function loadHill(){
	hill = await loadModel('./assets/hill/hill.gltf')
}

async function loadTrees(){ 
	snowy_tree = await loadModel('./assets/snowy_tree/model.gltf')
	snowy_tree.position.y=0.25;
	snowy_tree.type = 'tree'
	normal_tree = await loadModel('./assets/normal_tree/model.gltf')
	normal_tree.position.y=0.25;
	normal_tree.type = 'tree'
}

async function createObstaclePool(){

	if (!normal_tree) await loadTrees();
	if (!rock) await loadRock();
	var maxObsInPool=35;
	var obstacle;
	for(var i=0; i < maxObsInPool; i++){
		obstacle = createObstacle();
		obstaclePool.push(obstacle);
	}
}

function createObstacle(){
	if (Math.random() > 0.3){
		return createTree();
	} else {
		return createRock();
	}
}
function createRock(){
	if (rock) {
		let clone = rock.clone()
		let scale = (Math.random() * (1.1 - 0.8) + 0.8) / 2;
		rotation = Math.random() * Math.PI 
		clone.scale.set(scale, scale, scale);
		clone.rotation.y = rotation;
		return clone
	};
}

function createSnowHill(){
	if (hill) {
		let clone = hill.clone()
		scale = Math.random() * (1.5 - 0.5) + 0.5;
		rotation = Math.random() * Math.PI 
		clone.scale.set(scale, scale, scale);
		clone.rotation.y = rotation;
		return clone
	};
}


function clearSet() {

	obstaclesInPath.forEach(function (element, index) {
		rollingGroundSphere.remove(element);
	});

	obstaclePool.forEach(function (element, index) {
		rollingGroundSphere.remove(element);
	});
	obstaclesInPath=[];
	obstaclePool=[];
	createObstaclePool();
}

function doObstacleLogic(){
	var obstacle;
	var fromWhere;
	var obstaclePos = new THREE.Vector3();
	var obstaclesToRemove = [];
	
	obstaclesInPath.forEach(function (element, index) {
		obstacle=obstaclesInPath[index];
		obstaclePos.setFromMatrixPosition(obstacle.matrixWorld);
		if(obstaclePos.z > 6 && obstacle.visible){ //gone out of our view zone
			obstaclesToRemove.push(obstacle);
		} else { //check collision
			if (hero) {
				if(obstaclePos.distanceTo(hero.base.position)<=0.7){
					hero.hasCollided=true;
					explode();
				}
			}
		}
	});

	obstaclesToRemove.forEach(function (element, index) {
		obstacle = obstaclesToRemove[index];
		fromWhere = obstaclesInPath.indexOf(obstacle);
		obstaclesInPath.splice(fromWhere,1);
		obstaclePool.push(obstacle);
		obstacle.visible=false;
	});
}


function createTree(){
	
	var array = [normal_tree, snowy_tree]
	var tree = array[Math.floor(Math.random() * array.length)];
	if (tree) {return tree.clone()};
}

function addHill(gap, left){

	let newHill = createSnowHill();
	let forestAreaAngle; //[1.52,1.57,1.62];

	if (left) {
		newHill.rotation.x -= Math.PI / 2
		forestAreaAngle=1.44 - Math.random()*0.1;
	} else {
		newHill.rotation.x += Math.PI / 2;
		forestAreaAngle=1.72+Math.random()*0.1; //[1.52,1.57,1.62];
	}

	sphericalHelper.set(worldRadius-0.1, forestAreaAngle, gap);
	newHill.position.setFromSpherical(sphericalHelper);
	let rollingGroundVector=rollingGroundSphere.position.clone().normalize();
	let hillVector = newHill.position.clone().normalize();
	newHill.quaternion.setFromUnitVectors(hillVector,rollingGroundVector);
	rollingGroundSphere.add(newHill);
}

function addObstacle(lane){
	var obstacle;
	if(obstaclePool.length==0) return;
	obstacle = obstaclePool.pop();
	obstacle.visible=true;
	obstaclesInPath.push(obstacle);

	sphericalHelper.set(worldRadius-0.1, pathAngleValues[lane], -rollingGroundSphere.rotation.x + 4);

	if (obstacle) {
		obstacle.position.setFromSpherical(sphericalHelper);
		let rollingGroundVector = rollingGroundSphere.position.clone().normalize();
		let obstacleVector = obstacle.position.clone().normalize();
		obstacle.quaternion.setFromUnitVectors(obstacleVector, rollingGroundVector);
		obstacle.rotation.x += (Math.random()*(2*Math.PI/10))+-Math.PI/10;
		rollingGroundSphere.add(obstacle);
	}
}

function addWorldTree(left, where){

	newTree = createTree();
	var forestAreaAngle=1.46-Math.random()*0.1;
	if(left) forestAreaAngle=1.68+Math.random()*0.1;
	sphericalHelper.set(worldRadius-0.1, forestAreaAngle, where);

	if (newTree) {
		newTree.position.setFromSpherical(sphericalHelper);
		let rollingGroundVector=rollingGroundSphere.position.clone().normalize();
		let treeVector=newTree.position.clone().normalize();
		newTree.quaternion.setFromUnitVectors(treeVector,rollingGroundVector);
		newTree.rotation.x+=(Math.random()*(2*Math.PI/10))+-Math.PI/10;
		rollingGroundSphere.add(newTree);
	}
}


function addPathObstacle(){
	var options=[0,1,2];
	var lane= Math.floor(Math.random()*3);
	addObstacle(lane);
	options.splice(lane,1);
	if(Math.random()>0.7){
		lane = Math.floor(Math.random()*2);
		addObstacle(options[lane]);
	}
}

async function addWorldHills(){
	if (!hill) await loadHill();
	var numTrees=40;
	var gap=6.3 / 36;
	for(var i=0;i<numTrees;i++){
		addHill(i * gap, true);
		addHill(i * gap, false);
	}
}

function addWorldTrees(){
	var numTrees=25;
	var gap=6.28 / 36;
	for(var i=0;i < numTrees;i++){
		addWorldTree(true, i * gap);
		addWorldTree(false, i * gap);
	}
}

