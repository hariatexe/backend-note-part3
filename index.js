 
// const http = require("http");
require('dotenv').config(); 


const Note = require('./models/note'); 

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

// const mongoose = require('mongoose')

// const password = process.argv[2]

//no guardar la contraseña en github
// const url = `mongodb+srv://ignacioariasexe:${password}@cluster0.2bsdnbo.mongodb.net/noteApp?retryWrites=true&w=majority`

// mongoose.set('strictQuery',false)

// mongoose.connect(url)

// const noteSchema = new mongoose.Schema({
//   content: String,
//   important: Boolean,
// })  


// noteSchema.set('toJSON',{
//   transform:(document,returnedObject) =>{
//     returnedObject.id == returnedObject._id.toString(); 
//     delete returnedObject._id; 
//     delete returnedObject.__v; 
//   }
// }) //cuando retorne la respuesta


// const Note = mongoose.model('Note', noteSchema)
//

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

 app.get('/api/notes/:id',(request,response,next)=>{
    // const id = Number(request.params.id);
    // const note = notes.find(elt => {
    //     return elt.id === id; 
    // })
    
    // if(note){
    //   response.json(note);
    // }else{
    //   response.statusMessage = "Nota no encontrada en el servidor"; 
    //   response.status(404).end(); 
    // }
    Note.findById(request.params.id).then(note => {
      if(note){
        response.json(note); 
      }else{
        response.status(404).end(); 
      }
    }).catch(err => {
      next(err); 
      // console.log(err); 
      // response.status(400).send({ error: 'malformatted id'})
    });

  })


 

  app.delete('/api/notes/:id',(request,response,next)=>{
    
    // const id = Number(request.params.id);
    // const note = notes.filter(elt=> elt.id !== id); 


    // response.statusMessage = "Nota eliminada correctamente del servidor"; 
    // response.status(204).end(); 
    Note.findByIdAndDelete(request.params.id)
    .then(result => {
      response.status(204).end(); 
    })
    .catch(err => next(err)); 

  })
 app.get('/api/notes',(request,response)=>{
    // response.json(notes); 
    Note.find({}).then(elt => {
      response.json(elt); 
    })
 })


 app.use(express.json());   // es json.parse de express precisamente para la solicitud post 

 const generateId = ()=>{
  const maxId = notes.length > 0 ?
  Math.max(...notes.map(elt => elt.id))
  : 0   

  return maxId + 1; 
 }
 app.post('/api/notes',(request,response,next)=>{
 
  const body = request.body;
  // if(!body.content){
  //   return response.status(400).json({ //importante poner return para que no se siga ejecutando el resto del codigo
  //     error: "content missing"
  //   }); 
  // }


  const note = new Note({
    content: body.content, 
    important: body.important || false,
  })
  // id: generateId()

  // notes = notes.concat(note); 
  // response.statusMessage = "Nota creada correctamente"; 

  note.save().then(savedNote => {
    response.json(savedNote); // la version de savedNote es la version formateada con toJSON 
  })
  .catch(err => next(err)); 
  // response.status(200).json(note); 

 })


  app.put('/api/notes/:id',(request,response,next)=>{
    const {content, important} = request.body;

    // if(!body.content){
    //     return response.status(400).json({
    //       error:'content missing'
    //     })
    // }

    // const note = {
    //   content: body.content,
    //   important: body.important, 
    // }

    Note.findByIdAndUpdate(request.params.id, { content, important}, { new : true, runValidators: true, context: 'query'})
    .then(updatedNote => {
      response.json(updatedNote)
    })
    .catch(err => next(err)); 
  })




  const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
  } 

  app.use(unknownEndpoint)

  const errorHandler = (error,request,response,next) =>{
    console.log(error);
    console.log(error.message); 
    if(error.name === "CastError"){
      return response.status(400).send({ error : 'malformatted id'}); 
    }
    else if(error.name === "ValidationError"){
      return response.status(400).json({ error: error.message }); 
    }
     next(error); 
  }

  app.use(errorHandler); 


const PORT = process.env.PORT || 3001; 
app.listen(PORT); 
console.log(`Server running on port ${PORT}`); 
