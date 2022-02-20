
//vec, canvas, boxMin, boxMax
function testing(vectorAtT, canvasXY, box3){

	let cache = "[" +
	    (vectorAtT.x).toString().substring(0,5) +
	    "," +
        (vectorAtT.y).toString().substring(0,5) +
        "," +
		(vectorAtT.z).toString().substring(0,4) +
		"],\n"; /*+ 

	    (canvasXY.x).toString().substring(1,5) +
		"," + 	    
		(canvasXY.y).toString().substring(1,5) +
		"," +

		(box3.min.x).toString().substring(1,5) +
		"," +
		(box3.min.y).toString().substring(1,5) +
		"," + 
		(box3.min.z).toString().substring(1,5) +
		"," + 		

		(box3.max.x).toString().substring(1,5) +
		"," + 
		(box3.max.y).toString().substring(1,5) +
		"," + 
		(box3.max.z).toString().substring(1,5) +
		",";	
		*/			
	 return cache;
}

function within(x, small, big) {
  if (x < big && x > small){ return true; } 
  else{ return false; }
}

function toCanvasCoords(clickEvent){

	let x,y;

    //client x, y from 0 to window.width/window.height
    //y++ from up to down
    //canvas from -1 to 1
 
	x = ( ( -midX + clickEvent.pageX)  / midX); 
	y = ( -((-midY + clickEvent.pageY)) / midY) ;
    
    //outside of canvas
    if(x > 1 || y > 1){ return false; }

    let v = new THREE.Vector2(x, y);

    return v;
}

function initRay(canvasXY){
    
    const camera = getCamera();

    const DEG_2_RAD = 0.017453;

    const FOV = camera.fov * DEG_2_RAD;

    const ASPECT = camera.aspect;

    const FAR_Z = camera.far;
    const NEAR_Z = camera.near;
    

    //computes the base length of a wider side
    //by finding one the right triangles, then mutiplying
    //opposite side by two to get the full length

	const WIDTH_SIDE_FRUSTUM_BASE_LENGTH  = 
              (Math.tan(FOV / 2) * 
              FAR_Z ) * 2;


    // i divided by aspect because aspect is normal width to height
    //and we want height to width for the smaller base length

     const HEIGHT_SIDE_FRUSTUM_BASE_LENGTH = 
         WIDTH_SIDE_FRUSTUM_BASE_LENGTH / ASPECT;
      
     
     //-1 to fit arc cosines range
     const WIDTH_SIDE_FRUSTUM_SLANT_HEIGHT = Math.sqrt(
            ((HEIGHT_SIDE_FRUSTUM_BASE_LENGTH / 2) ** 2) +
            (FAR_Z ** 2)
     );
         const HEIGHT_SIDE_FRUSTUM_SLANT_HEIGHT = Math.sqrt(
            ((WIDTH_SIDE_FRUSTUM_BASE_LENGTH / 2) ** 2) +
            (FAR_Z ** 2)
     );
     
     //all edge lengths are the same
     const EDGE_LENGTH_FRUSTUM = Math.sqrt(
          ((WIDTH_SIDE_FRUSTUM_BASE_LENGTH / 2) ** 2) +
          (WIDTH_SIDE_FRUSTUM_SLANT_HEIGHT) ** 2
     );
    

     //adjacent = distance from image plane center 
     const AREA_OF_FRUSTUM_BASE =
         WIDTH_SIDE_FRUSTUM_BASE_LENGTH * 
          HEIGHT_SIDE_FRUSTUM_BASE_LENGTH;
     
     //coming from the formula here: https://mathworld.wolfram.com/Pyramid.html
     const IMAGE_PLANE_HEIGHT_ABOVE_BASE = FAR_Z - NEAR_Z;

     //coming from the formula here: https://mathworld.wolfram.com/Pyramid.html
     const IMAGE_PLANE_AREA = AREA_OF_FRUSTUM_BASE * 
         ((IMAGE_PLANE_HEIGHT_ABOVE_BASE - FAR_Z) ** 2) / 
         (FAR_Z ** 2);
    

     const IMAGE_PLANE_WIDTH =  Math.sqrt(IMAGE_PLANE_AREA) * 2;
     const IMAGE_PLANE_HEIGHT =  Math.sqrt(IMAGE_PLANE_AREA);


    const CLICK_X_WORLD = canvasXY.x *= IMAGE_PLANE_WIDTH;

    const CLICK_Y_WORLD = canvasXY.y *= IMAGE_PLANE_HEIGHT;

    //assumes position positive
    const CLICK_Z_WORLD =  camera.position.z - NEAR_Z;
 
    let tAtImagePlane = Math.sqrt(
		(CLICK_X_WORLD - camera.position.x) ** 2 + 
		(CLICK_Y_WORLD -  camera.position.y) ** 2 + 
		(CLICK_Z_WORLD -  camera.position.z) ** 2
    );

    let xOfT = (CLICK_X_WORLD -  camera.position.x); 
    xOfT /= tAtImagePlane;

    let yOfT = (CLICK_Y_WORLD -  camera.position.y);
    yOfT /= tAtImagePlane;
    
    let zOfT = (CLICK_Z_WORLD -  camera.position.z); 
    zOfT /= tAtImagePlane;

    return new THREE.Vector3(xOfT, yOfT, zOfT);
    

}


function isHit(vCoefficients, clickEvent, entityToCheck){
    
  const SENSITIVITY_DAMPER = 0.7;
    
  const camera = objPool.get('eyes').cCamera.camera;
  const FAR_Z = camera.far;
  
  let hitStatus = false;
  let whereRayHit = null;
  let data = "";
  let vectorAtT; 

  let t =  camera.near;
  const hitBoxes = entityToCheck.cVisible.hitBoxList;

  const len = hitBoxes.length;

  while(t <  FAR_Z){

	vectorAtT = new THREE.Vector3(

		(vCoefficients.x * t + 
		 camera.position.x)
		* SENSITIVITY_DAMPER,

		(vCoefficients.y * t + 
		 camera.position.y)
		* SENSITIVITY_DAMPER,

		(vCoefficients.z * t + 
		 camera.position.z)
		* SENSITIVITY_DAMPER,

	);

	 for(let j = 0; j < len; j++){

		if(hitBoxes[j].containsPoint(vectorAtT)){

		   hitStatus = true;
		   whereRayHit = vectorAtT;
		   break;
		}

	 }
	 t += 5;
 }
 return {
	hitStatus: hitStatus,
	whereRayHit: whereRayHit,
	csvOut: data
 }
}