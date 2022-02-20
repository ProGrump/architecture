
physics.forceMap = new Map();
physics.actionForceMap = new Map();
physics.reactionForceMap = new Map();

physics.addToForceMap = function( name, F ){
	
	 physics.forceMap.set(
        name,
        physics
          .forceMap
          .get(name)
          .push(F)
    );
}

//acts as a class
physics.Force = function( params ){

	 let F = {
	 	head: null,
	 	tail: null,
	 	newtons: null,
	 	producer: null,
	 	target: null,
	 	type: null,
	 	dT: null
	 };   //the 'class' instance
	
     let name = params.target.model.name;
	 if( params.type === "gravity" ){

		  F.tail = new THREE.Vector3(
		      params.target.model.position.x, 
		      WORLD_BOUNDS, 
		      params.target.model.position.z
		  );
		  F.head = F.tail.multiplyScalar(
			  1001, 1001, 1001
		  );
		 // F.vector.x = direction.x * dT;
		  //F.vector.y = direction.y * dT;
		  //F.vector.z = direction.z * dT;
		  F.newtons = params
			  .target
			  .mass;
		  F.newtons *= GRAVITY;
		  F.target = params.target;

		  physics
		    .actionForceMap
		    .set(F.type, F);
	}
	else if( params.type === "walk" ){

	    F.tail = params
		  .target
		  .footPosition();
	    F.head = F.tail;
	    F.head.multiplyScalar(
		  1.001, 1.001, 1.001
	    );
		F.newtons = obj.mass * GRAVITY;
		F.producer = params.producer;
		F.target = params.target;

		physics
		    .actionForceMap
		    .set(F.type, F);
	}

    addToForceMap(name, F);

	return F;
};

physics.update = function( dT ){

    const len = entities.objPool.length;
    let i = 0;

    physics.applyGravity( len );

    while(i < len){

    	let e = entities.objPool[i];
        let forces = forceMap.get(
            e.model.name
        );
        //create reaction forces
		const len = forces.length;
		let j = 0;

		while(j < len){

			physics.reactionForce( F );
			j++;
		}

		i++;
    }
};

physics.applyGravity = function( len, dT ){
	
    let i = 0;
    while(i < len){
    	physics.Force({
    		type: "gravity",
    		target: entities.objPool[i],
    		dT: dT
    	})
    }
};

physics.collisionDetect = function( obj, objs ){

	//checks if obj intersects any in objs

	const result = {};

	objs.forEach( o => {
		const collides = o
		   .hitbox
		   .intersectsBox(
			   obj.hitbox
		   );
	   result[obj.type] = o;
	});
	return result;
};

physics.reactionForce = function( F ){

    //F = action we're reacting to
    const TYPE  = (() =>{

	 	if( F.type === "walk" ){
	 		return "normal";
	 	}

	})();

	physics.Force({
	 	head: F.tail,
	 	tail: F.head,
	 	newtons: F.newtons,
	 	producer: F.target,
	 	target: F.producer,
	 	type: TYPE,
	 	dT: F.dT
	 });

};