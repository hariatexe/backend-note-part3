 
// const http = require("http");

let notes = [
    {
      id: 1,
      content: "HTML is easy",
      important: true
    },
    {
      id: 2,
      content: "Browser can execute only JavaScript",
      important: false
    },
    {
      id: 3,
      content: "GET and POST are the most important methods of HTTP protocol",
      important: true
    }
  ]

// const app = http.createServer((request,response)=>{
//     response.writeHead(200,{"Content-type" : "application/json"}); 
//     response.end(JSON.stringify(notes)); 
// })
 const express = require('express'); 
 const app = express(); 
 const cors = require('cors'); 

 app.use(cors()); 
 app.use(express.static("dist")); 
 

 const requestLogger = (request,response,next)=>{
  console.log('Method: ', request.method); 
  console.log('Path: ', request.path); 
  console.log('Body:  ', request.body)
  console.log('---')
  next()
}

app.use(requestLogger); 


 //get - response / respuesta a la solicitud / get - request / toda la info de la solicitud 
 //cuando se carga el navegador lo primero que hace la pagina es hacer una solicitud http al servidor  

 app.get('/', (request,response)=>{
    response.send('<h1>Servidor de notas</h1>')
 })

 app.get('/api/notes/:id',(request,response)=>{
    const id = Number(request.params.id);
    const note = notes.find(elt => {
        return elt.id === id; 
    })
    
    if(note){
      response.json(note);
    }else{
      response.statusMessage = "Nota no encontrada en el servidor"; 
      response.status(404).end(); 
    }
  })
  app.delete('/api/notes/:id',(request,response)=>{
    const id = Number(request.params.id);
    const note = notes.filter(elt=> elt.id !== id); 

    response.statusMessage = "Nota eliminada correctamente del servidor"; 
    response.status(204).end(); 

  })
 app.get('/api/notes',(request,response)=>{
    response.json(notes); 
 })


 app.use(express.json());   // es json.parse de express precisamente para la solicitud post 

 const generateId = ()=>{
  const maxId = notes.length > 0 ?
  Math.max(...notes.map(elt => elt.id))
  : 0   

  return maxId + 1; 
 }
 app.post('/api/notes',(request,response)=>{
 
  const body = request.body;
  if(!body.content){
    return response.status(400).json({ //importante poner return para que no se siga ejecutando el resto del codigo
      error: "content missing"
    })
  }

  const note = {
    content: body.content, 
    important: Boolean(body.important) || false,
    id: generateId()
  }

  notes = notes.concat(note); 
  response.statusMessage = "Nota creada correctamente"; 
  response.status(200).json(note); 

 })

 const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

  app.use(unknownEndpoint)

const PORT = process.env.PORT || 3001; 
app.listen(PORT); 
console.log(`Server running on port ${PORT}`); 
