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
	orbitControl.enableRotate = false;
	//orbitControl.minPolarAngle = 1.1;
	//orbitControl.maxPolarAngle = 1.1;
	//orbitControl.minAzimuthAngle = -0.2;
	//orbitControl.maxAzimuthAngle = 0.2;
}


function getRangeRandom(min, max) {
	return min + Math.random() * (max - min);
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function detectSwipe(element, func) {
      swipe_det = new Object();
      swipe_det.sX = 0;
      swipe_det.sY = 0;
      swipe_det.eX = 0;
      swipe_det.eY = 0;
      var min_x = 20;  //min x swipe for horizontal swipe
      var max_x = 40;  //max x difference for vertical swipe
      var min_y = 40;  //min y swipe for vertical swipe
      var max_y = 50;  //max y difference for horizontal swipe
      var direc = "";
      element.addEventListener('touchstart',function(e){
        var t = e.touches[0];
        swipe_det.sX = t.screenX; 
        swipe_det.sY = t.screenY;
      },false);
      element.addEventListener('touchmove',function(e){
        e.preventDefault();
        var t = e.touches[0];
        swipe_det.eX = t.screenX; 
        swipe_det.eY = t.screenY;    
      },false);
      element.addEventListener('touchend',function(e){
        //horizontal detection
        if ((((swipe_det.eX - min_x > swipe_det.sX) || (swipe_det.eX + min_x < swipe_det.sX)) && ((swipe_det.eY < swipe_det.sY + max_y) && (swipe_det.sY > swipe_det.eY - max_y)))) {
          if(swipe_det.eX > swipe_det.sX) direc = "r";
          else direc = "l";
        }
        //vertical detection
        if ((((swipe_det.eY - min_y > swipe_det.sY) || (swipe_det.eY + min_y < swipe_det.sY)) && ((swipe_det.eX < swipe_det.sX + max_x) && (swipe_det.sX > swipe_det.eX - max_x)))) {
          if(swipe_det.eY > swipe_det.sY) direc = "d";
          else direc = "u";
        }
    
        if (direc != "") {
          if(typeof func == 'function') func(direc);
        }
        direc = "";
      },false);  
}

function handleSwipe(direction){
	var swipeEvent = {}
	console.log(direction);
	if (direction == "u"){
		swipeEvent.keyCode = 38
	} else if(direction == "l") {
		swipeEvent.keyCode = 37
	} else if(direction == "d") {
		swipeEvent.keyCode = 39
	}
	if (swipeEvent.keyCode)	handleKeyDown(swipeEvent);
}

