/*
C:\node-js\node C:\Users\Administrator\Downloads\architect\server.js

*/
const http = require("http");
const fs = require("fs");
const path = require("path");
const server = http.createServer();
const assets = "C:/Users/Administrator/Downloads/architect/assets";

//should return an array of node js's <dirent>
//all of which are of type file
function dirArraySearch(dirArray, name){
    
	let i = 0; 
	while(i < dirArray.length){

		if(dirArray[i].name == name){
			return i;
		}
		i++;
	}

}
function getDirFiles( a ) {
        
        let params, 
        q, 
        files,
        filePathMap, 
        workingPath,
        dirContentPath, 
        currentEntry,
        dirContents;
        
        

        params = { 
		encoding: 'utf8', 
		withFileTypes: true 
	}
        files = {}; //<dirent> : path
	filePathMap = new Map(); //name: path
        workingPath = assets;
        dirContentPath = assets;

        const stateMSG = (isLoopBegin) =>{

            if(isLoopBegin){
            	console.log('\nLoop Begin:\n');
            }
            
        	const iter = [
        	    params, 
				q, 
				files,
				filePathMap, 
				workingPath,
				dirContentPath, 
				currentEntry,
				dirContents
		    ];
		    console.log(iter);
        };

        const fileMSG = (e) => {

          console.log(e.name);
          console.log("it\'s a file");
          stateMSG();
        };
        const dirMSG = (e) => {

            console.log(e.name);
            console.log("it\'s a directory");
            stateMSG();
        };

	    q = (function(){
            
            let result = [];
            
			let directoryEntries = fs
			    .readdirSync(assets, params);

			directoryEntries.forEach(e =>{

                const obj = {}

                obj[e.name] = e;

				result.push( obj );

			});

			return result;
	    })();

        //while we haven't flattened it
        //down to files only
        while( q.length > 0 ){

          

          currentEntry = Object.values( q[0] );
          //deque the q

          currentEntry = currentEntry;
          //now points to <dirent>

          const isFile = (() =>{
          	return (
          	  typeof(currentEntry[0]) === "string"
          	);
          })();

		  if( isFile ){
            
            ////fileMSG(currentEntry);

            dirContentPath = (
                workingPath + currentEntry[0].name
            );
			files[dirContentPath] = currentEntry[0];

			q.shift();
		  }

		  //if its a directory
		  else{

			  //cache dir file path
              workingDir = (
                  workingPath + 
                  "/" + 
                  currentEntry[0].name
              );

              //current directory: path
			  filePathMap.set(
			      currentEntry[0].name,
				  workingDir
			  );

			  //get dir contents
			  contents = fs.readdirSync(
				 workingDir,
				 params
			  );

			  contents.forEach(content =>{

                dirContentPath = (
                   workingDir +
                   "/" + 
                  content.name
                )
                //current directory ENTRY: path
			  	filePathMap.set(
			  	  content.name,  
				  dirContentPath
				);
			  	q.push(content);

			  });

              //remove the directory for the queue,
              //since all of its contents are now in
              //the q
			  q.shift();
		  }
        }
		return files;
}

getDirFiles(assets);

console.log('got assets');
		//!PORT 3!
server.listen(3, '127.0.0.1', () => {

    server.on('request', (request, response) => { 

       let clientReq = request.url.toString()

       let mimeType = 'text/html';

       clientReq = __dirname + clientReq;

       if(clientReq){

            fs.readFile(clientReq, (err, data) =>{

				//console.log(clientReq); 
				
				if(clientReq.includes('png')){ mimeType = 'image/png'; }

				else if(clientReq.includes('ico')){ mimeType = 'image/ico'; }

				else if(clientReq.includes('assets')){ 
				    mimeType = 'text/text'; 

			    }
				else if(clientReq.includes('jfif')){ mimeType = 'image/jfif'; }

				else if(clientReq.includes('jpg')){ mimeType = 'image/jpg'; }

				else if(clientReq.includes('jpeg')){ mimeType = 'image/jpeg'; }

				else if(clientReq.includes('js')){ mimeType = 'text/javascript'; }

				else if(clientReq.includes('glb')){ mimeType = 'model/gltf-binary'; }

				else if(clientReq.includes('gltf')){ mimeType = 'model/gltf-binary'; }

                response.setHeader('Access-Control-Allow-Origin', 'http://127.0.0.1:3/');

                response.setHeader('Content-Type', mimeType);
                
                response.end(data);

            });
       }
       else
       {
                response.statusCode = 503;
                response.statusMessage = "Die virbindung gibt einen fehler";
                response.end();
       }
    });
});

