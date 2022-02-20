
//hold wrapper class objects
//we need to make these private
entities.objPool = [];
entities.objMap = new Map();

entities.update = function(){

  const len = entities.objPool.length;
  let i = 0;
  while (i < len){

    entities
	   .objPool[i]
      .update( ioput.clock.getDelta() );
    i++;
  }
}

//acts as a factory for 
//populating objPool/objMap
entities.initEntity = function(
    req
){
	
	let wrapperObj;
	if( req.type == CAMERA){
		wrapperObj = new Camera();
	}
	else if( req.type == BUILDING){
		wrapperObj = new Building();
	}
	entities.objMap.set( 
		req.name, wrapperObj
		
	);
	this.objPool.push( req );
};

entities.wipe = function(){

	let i = 0;
	const len = entities.mortalEntities.length;

	while(i < len){
		objPool
		 .get(entities.mortalEntities[i])
		 .removeFromScene();
		i++;
	}
};  

entities.get = function( 
    name 
){
	return entities
		.objMap
		.get(name);
}

entities.getTHREECamera = function(){
	console.log(entities);
	let cam = entities.get("eyes");
	
	return cam.camera;
}

class SceneObj{
  
  constructor(){

    this.velocity = new THREE.Vector3(0,0,0);
    this.accel = new THREE.Vector3(0,0,0);
    this.mass = 5;

    this.model = assets.finalModels[this.name];
    
    this.hitbox = new THREE.Box3();

	  //still not sure what to do here
    this.rotation = 0;

  }
	
  setPhysics(a, v, position){
	  this.accel = a;
	  this.velocity = v;
	  this.model.position.x = position.x;
	  this.model.position.y = position.y;
	  this.model.position.z = position.z;
  }
	
  update(){
	  this.velocity = 
  }
}
class Camera extends SceneObj{

  constructor(){
    super();
    
	this.camera = new THREE
		.PerspectiveCamera(75, 2, 1, 1000);
    
   }

   footPosition(){

      let vector = this.model.position;

     vector.y = vector.y -
         (this.hitbox.getSize().y / 2);

      //should be at the level of their feet,
      //since it's at the bottom of the hitbox

      return vector;
   }
}
class Building{

  constructor(){

  }
    shrink(hitBox){

      const mins = hitBox.min;
      const maxs = hitBox.max;

      hitBox.expandByScalar(
        this.hitBoxShrinker
      );
    }

    setModel(model){

      this.model = model;

      this.model.name = this.name;

      this.model.children.forEach(child =>{

         let box = new THREE.Box3();

         box.setFromObject( child );

         //shrink by 10%
         this.hitBoxShrinker = 0 /*+ (
            (box.max.x - box.min.x) +
            (box.max.y - box.min.y) +
            (box.max.z - box.min.z)
          ) ;*/

         let helper = new THREE
           .Box3Helper(box, 0xffff00 );
           
        this.hitBoxMap.set(box, helper);

        this.hitBoxList.push(box);

        this.hitBoxHelpers.push(helper);
      
      }); 
    }

  //updates each mesh that the model has
    updateHitBoxMap( d, game ){

      for( const [box , help] of this.hitBoxMap ){

        box.setFromObject( this.model );
        this.shrink( box );

        help.updateMatrixWorld();

      }
    } 
}
class View3D{

  constructor(){}
}
