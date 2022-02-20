
ioput.checkAnimFunctions = function(){

  const w = animEvents.length;
  let j = 0;
  while (j < w){
    
    let current = animEvents[ j ];
    let listener = current[0];
    let callback = current[1];
    let params = current[2];
  //[anim, listener, callback, params]

    if( listener( ...params )){
       callback();
    }
    j++;
  }
};

ioput.isAnimDone = function(action){

  if( action.paused && action.time !== 0 ){
    return true;
  }
  return false;
};	

ioput.animDependantFunc = function(
    listener, toCall, paramsArray
){
  
  return [listener, toCall, paramsArray];
};

ioput.update = function( ){

  ioput.renderer.setSize(
       ioput.canvasWidth,  
       ioput.canvasHeight
  );
  ioput.renderer.setPixelRatio(
    window.devicePixelRatio
  );
  ioput.renderer.render(
    ioput.scene, entities.getTHREECamera()
  );
};

ioput.init = function(){
  ioput.renderer = new THREE.WebGLRenderer(
  { antialias: true }
  );

  document
    .getElementById(
      "viewportWrapper"
    )
    .appendChild( 
      ioput.renderer.domElement 
    );

  ioput.getRect = function(){

    return (
      renderer
      .domElement
      .getBoundingClientRect()
    );
  };

  ioput.clock = new THREE.Clock();
  ioput.scene = new THREE.Scene();

  //CANVAS CONSTANTS
  ioput.origin = new THREE.Vector2(
    8,8
  );
  ioput.canvasWidth = 1200;
  ioput.canvasHeight = 600;

  ioput.midX = ioput.canvasWidth / 2 + ioput.origin.x;
  ioput.midY = ioput.canvasHeight / 2  + ioput.origin.y;

  ioput.animEvents = [];
  ioput.toCreate = [];

  ioput.renderer.outputEncoding = THREE.sRGBEncoding;
  
}
