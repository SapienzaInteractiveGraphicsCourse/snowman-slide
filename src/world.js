var gravity=0.005;
var worldRadius=26;
var rollingSpeed=0.008;
var rollingGroundSphere;

function createPathStrings(folder) {
  const basePath = `./assets/scene/${folder}/`;
  const sides = ['ft', 'bk', 'up', 'dn', 'rt', 'lf'];
  const pathStings = sides.map(side => {
    return `${basePath}${side}.jpg`;
  });

  return pathStings;
}

function createSkyBox(rotation=0){

	const skyboxImagepaths = createPathStrings(2);
	const materialArray = skyboxImagepaths.map(image => {
		let texture = new THREE.TextureLoader().load(image);
		return new THREE.MeshBasicMaterial({ map: texture, side: THREE.BackSide });
	});

	let skyboxGeo = new THREE.BoxGeometry(50, 50, 50);
	skybox = new THREE.Mesh(skyboxGeo, materialArray);
	skybox.rotation.y = rotation
	skybox.position.y -= 8
	scene.add(skybox)
}

function createEnvironment(){
	addWorld();
	addLight();
	addWorldHills();
	//addWorldTrees();
	setOrbitControl();
	createObstaclePool();
    createSkyBox();
}

function addWorld(){
	var sides=120;
	var tiers=120;
	var sphereGeometry = new THREE.SphereGeometry(worldRadius, sides,tiers);
	var sphereMaterial = new THREE.MeshStandardMaterial( { color: 0xfffafa, shading:THREE.FlatShading} )
	sphereMaterial.bumpMap = textureLoader.load('./assets/scene/bump.png');   
	sphereMaterial.bumpScale = 0.04;

	rollingGroundSphere = new THREE.Mesh( sphereGeometry, sphereMaterial );
	rollingGroundSphere.receiveShadow = true;
	rollingGroundSphere.castShadow=false;
	rollingGroundSphere.rotation.z=-Math.PI/2;
	scene.add(rollingGroundSphere);
	rollingGroundSphere.position.y=-24;
	rollingGroundSphere.position.z=2;
}

function addLight(){

	var hemisphereLight = new THREE.HemisphereLight(0xfffafa,0x000000, .9)
	scene.add(hemisphereLight);
	var sun = new THREE.DirectionalLight(0xcdc1c5, 0.9);
	sun.position.set(12, 6, -7);
	sun.castShadow = true;
	scene.add(sun);

	//Set up shadow properties for the sun light
	sun.shadow.mapSize.width = 256;
	sun.shadow.mapSize.height = 256;
	sun.shadow.camera.near = 0.5;
	sun.shadow.camera.far = 50 ;
}
