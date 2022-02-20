function loopIfGood(){
    //testing
  if(state != parseInt(KILL)){ 
    requestAnimationFrame(gameLoop);
  }
}

function gameLoop(){
  
  ioput.update();
  state.update();
  entities.update();
  physics.update(
    ioput.clock.getDelta()
  );
  loopIfGood();
}

ioput.init();
assets.beginLoading( 
  gameLoop 
);