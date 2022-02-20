
assets.toLoad = [];
assets.finalModels = {};
assets.mortalEntities = [];

class LoadRequest {

    modelFormat( name, type ) {

      return  ASSET_PATH + name + GLB;
    }

	//type refers to the kind of wrapper class
	//to be used for the object
	constructor( name, type ){

		this.url = (() =>{
			return (
				/* SERVER + ROOT +*/
				    ASSET_PATH + 
					name + 
					GLB
				);
		})();

        this.name = name;
	    this.type = type;
		assets.toLoad.push( this );
	}
};
assets.beginLoading = function(gameLoop){
	
     assets.loader = new GLTFLoader();
     const p = new LoadRequest('pavillion', BUILDING);
     const e = new LoadRequest('eyes', CAMERA);
	
     const nToLoad = assets.toLoad.length;
     loadingLoop( nToLoad );

    function loadingLoop( nToLoad ){

      let req = assets.toLoad.pop();
		
      nToLoad -= 1;
		
      //if there is more to load
      if(  nToLoad != 0 ){ 
		  threeLoad( nToLoad, req ); 
	  }
      else{ 
		  
		  gameLoop(); 
		}
    }

    function threeLoad( nToLoad, req ){
	
       assets.loader
		.load(req.url, (model) => {     
			
		  assets
			.finalModels[model.name] = model;
		  entities.initEntity( req );
		  //iterates over model's parts
		  //adds to finalModels & objMap
		   model.scene.children
			.forEach(sub =>{
				
			   assets.finalModels[sub.name] = sub;
			 });

			loadingLoop( nToLoad );
		}, 
		undefined,
		() =>{ throw url; }
      );
    }
};

assets.getModel = function(name){

  let x = assets.finalModels[name];
  if(!x){ 
    throw "model not found: " + name; 
  }
  return x.scene.clone();

};


function setHandler(handlerToSet, functionToCall) {

	if (handlerToSet === "mouseMoveHandler") {
	  mouseMoveHandler = (e) => {
		functionToCall(e);
	  }
	  window.addEventListener(
		"mousemove",
		mouseMoveHandler
	  );
	} 
	else if (handlerToSet === "mouseDownHandler") {
	  mouseDownHandler = (e) => {
		functionToCall(e);
	  }
	  window.addEventListener(
		"mousedown",
		mouseDownHandler
	  );
	}
}