var worldRadius=26;
let snowFlakeImage;
let snowStorms = [];
let snowMaterials = [];
const snowflakes = 50000;
const ground_size = Math.PI*((worldRadius / 2)^2);
const sky_height = 1000;

var ignore_streak = 15;
var ignore_counter = ignore_streak;

var particleGeometry;
var particleCount=1000;
var explosionPower = .06;
var particles;

function addFallingSnow() {
	// however many groups of 100k snow flakes
	// atm only need 1
	let num_storms = 1;
	snowFlakeImage = textureLoader.load("./assets/snowflake.png");

	for (let i = 0; i < num_storms; i++) {
		let snowVertices = [];
		let snowGeometry = new THREE.BufferGeometry();

		for (let c = 0; c < snowflakes; c++) {
			let x = Math.random() * ground_size;
			let y = Math.random() * sky_height / 2;
			let z = Math.random() * ground_size;
			snowVertices.push(x, y, z);
		}

		snowGeometry.addAttribute('position', new THREE.Float32BufferAttribute(snowVertices, 3));
		// size of snowflake
		let size = getRangeRandom(0.15, 0.20);

		snowMaterials[i] = new THREE.PointsMaterial({size: size, map: snowFlakeImage, blending: THREE.AdditiveBlending, depthTest: false, transparent: true});
		// a brightness of 0.5 to 1 of white
		snowMaterials[i].color.setHSL(0, 0, Math.random() * 0.5 + 0.5);

		let particles = new THREE.Points(snowGeometry, snowMaterials[i]);

		particles.position.x = -ground_size / 2;
		particles.position.z = -ground_size / 2;

		snowStorms.push(particles);
		scene.add(particles);
	}
}

function updateParticles() {
	for (let i = 0; i < snowStorms.length; i++) {
		var arr = snowStorms[i].geometry.attributes.position.array;
		for (let j = 0; j < arr.length; j += 3) {
			arr[j + 1] -= 0.1;
			if (arr[j + 1] < 0) {
				arr[j + 1] += sky_height / 2;
			}
		}
		snowStorms[i].geometry.attributes.position.needsUpdate = true;
	}
}


function doExplosionLogic(){
	if(!particles.visible)return;
	for (var i = 0; i < particleCount; i ++ ) {
		particleGeometry.vertices[i].multiplyScalar(explosionPower);
	}
	if(explosionPower>1.005){
		explosionPower-=0.001;
	}else{
		particles.visible=false;
	}
	particleGeometry.verticesNeedUpdate = true;
}

function explode(){
	particles.position.y=2;
	particles.position.z=4.8;
	particles.position.x=hero.base.position.x;
	for (var i = 0; i < particleCount; i ++ ) {
		var vertex = new THREE.Vector3();
		vertex.x = -0.2+Math.random() * 0.4;
		vertex.y = -0.2+Math.random() * 0.4 ;
		vertex.z = -0.2+Math.random() * 0.4;
		particleGeometry.vertices[i]=vertex;
	}
	explosionPower=1.57;
	particles.visible=true;
}


function addExplosion(){
	particleGeometry = new THREE.Geometry();
	for (var i = 0; i < particleCount; i ++ ) {
		var vertex = new THREE.Vector3();
		particleGeometry.vertices.push(vertex);
	}
	var pMaterial = new THREE.PointsMaterial({size: 0.04 ,map: snowFlakeImage, blending: THREE.AdditiveBlending, depthTest: false, transparent: true});
	pMaterial.color.setHSL(0, 0, Math.random() * 0.5 + 0.5);
	particles = new THREE.Points(particleGeometry, pMaterial);
	scene.add(particles);
	particles.visible=false;
}

