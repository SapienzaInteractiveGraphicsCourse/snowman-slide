let orbitControl;
let textureManager = new THREE.LoadingManager();
var textureLoader = new THREE.TextureLoader(textureManager);

function loadModel(path) {

var loader = new THREE.GLTFLoader();
  return new Promise((resolve, reject) => {
	loader.load(path, data => {
		var model = data.scene
		model.traverse( function( node ) {
		   if ( node instanceof THREE.Mesh ) { 
			   node.castShadow = true; 
			   node.receiveShadow = true; }
		resolve(model)}
	  , null, reject);});
	})
}

function dcopy(obj){
	return JSON.parse(JSON.stringify(obj));
}

function setOrbitControl(){

	orbitControl = new THREE.OrbitControls( camera, renderer.domElement );//helper to rotate around in scene
	orbitControl.addEventListener( 'change', render );
	orbitControl.enableDamping = true;
	orbitControl.dampingFactor = 0.8;
	orbitControl.noKeys = true;
	orbitControl.noPan = true;
	orbitControl.enableZoom = false;
	orbitControl.minPolarAngle = 1.1;
	orbitControl.maxPolarAngle = 1.1;
	orbitControl.minAzimuthAngle = -0.2;
	orbitControl.maxAzimuthAngle = 0.2;
}


function getRangeRandom(min, max) {
	return min + Math.random() * (max - min);
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
