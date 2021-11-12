const http=require('http');
const url=require('url');
const fs=require('fs');
const querystring = require('querystring');

const mime = {
   'html' : 'text/html',
   'css'  : 'text/css',
   'jpg'  : 'image/jpg',
   'ico'  : 'image/x-icon',
   'mp3'  : 'audio/mpeg3',
   'mp4'  : 'video/mp4'
};

const servidor=http.createServer((pedido ,respuesta) => {
    const objetourl = url.parse(pedido.url);
  let camino='public'+objetourl.pathname;
  if (camino=='public/')
    camino='public/index.html';
  encaminar(pedido,respuesta,camino);
});

servidor.listen(8888);


function encaminar (pedido,respuesta,camino) {
  console.log(camino);
  switch (camino) {
    case 'public/recuperardatos': {
      recuperar(pedido,respuesta);
      break;
    }	
    default : {  
      fs.stat(camino, error => {
        if (!error) {
        fs.readFile(camino,(error, contenido) => {
          if (error) {
            respuesta.writeHead(500, {'Content-Type': 'text/plain'});
            respuesta.write('Error interno');
            respuesta.end();					
          } else {
            const vec = camino.split('.');
            const extension=vec[vec.length-1];
            const mimearchivo=mime[extension];
            respuesta.writeHead(200, {'Content-Type': mimearchivo});
            respuesta.write(contenido);
            respuesta.end();
          }
        });
      } else {
        respuesta.writeHead(404, {'Content-Type': 'text/html'});
        respuesta.write('<!doctype html><html><head></head><body>Recurso inexistente</body></html>');		
        respuesta.end();
        }
      });	
    }
  }	
}

function recuperar(pedido,respuesta) {
  let info = '';
  pedido.on('data', datosparciales => {
    info += datosparciales;
  });
  pedido.on('end', () => {
    const formulario = querystring.parse(info);
    var n= parseInt(formulario['numero']);

    respuesta.writeHead(200, {'Content-Type': 'text/html'});
     pagina=
      `<!doctype html><html><head></head><body>
      <center><h1 id="as">a</h1></center>

	<script>
			let nivel =2;			

			function conseguirArray(lvl){
				let nums=[]
		
				for(let x=0, y=0; x<lvl; x++){
					y=Math.floor(Math.random() * 10); //numero aleatorio entre 0 y 9 inclusives (integers)+
					if(x==0){
						nums.push(y);
					}
					else{
						while(esta(nums, y)){
							y=Math.floor(Math.random() * 10);
						}
						nums.push(y);
					}
				}
				return nums;
			}
		
			function esta(valores, n){
				let eone=false;
				for(let x=0; x<valores.length; x++){
					if(valores[x]==n){
						eone=true;
					}
				}
				return eone;
			}
			
			function sleep(millis)
			{
				var date = new Date();
				var curDate = null;
				do { curDate = new Date(); }
				while(curDate-date < millis);
			}

			let h3 = document.getElementById("as");
			
			
			
			function mostrarNumeros(){
				let arr =conseguirArray(nivel);
				console.log(arr);
				let numeros;
				let tiempoExtra=0;
				for(let x=0; x<nivel;x++){
					tiempoExtra+=1000;
				}
				let y=1;
				h3.innerHTML=arr[0];
				let nn = window.setInterval(() =>{
					h3.innerHTML=arr[y];
					if(y==nivel-1){
						clearInterval(nn);
					}
					y++;
				}, 1000);


				let nm = window.setInterval(() =>{
					h3.innerHTML = " ";
					clearInterval(nm);
					
				},500+tiempoExtra)
				let mm = window.setInterval(() =>{
					numeros = window.prompt("que numeros viste?","");
					clearInterval(mm);
				}, 1000+tiempoExtra	)
				let mn = window.setInterval(() =>{
					let numerosArray;
					for(let x=0; x<arr.length;x++){
						if(x==0){
							numerosArray=arr[0];
						}
						else{
							numerosArray*=10;
							numerosArray+=arr[x];
						}
					}
					if(numeros==numerosArray && nivel<=9){
						nivel++;
						alert("Muy bien");
						mostrarNumeros();
					}else if(nivel==10){
						h3.innerHTML = "!!Ganaste!! Diez niveles superados";
					}else{
						h3.innerHTML = "Juego finalizado, llegaste a "+nivel;
					}
					clearInterval(mn);
				}, 3500+tiempoExtra)

				


			}
		
		

			mostrarNumeros();
			
		
		
		</script></body></html>`;
      
    respuesta.end(pagina);

    

  });	
}






			
		
console.log('Servidor web iniciado');