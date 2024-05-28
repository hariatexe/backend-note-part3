// const mongoose = require('mongoose'); 

//   if(process.argv.length < 3){
//       console.log('give password as argument')
//       process.exit(1); 
//   }

//   const password = process.argv[2]; 

// const uri =`mongodb+srv://ignacioariasexe:${password}@cluster0.2bsdnbo.mongodb.net/noteApp?retryWrites=true&w=majority`; 
// mongoose.set('strictQuery',false); 

// mongoose.connect(uri); 

// //modelo y esquema de la nota 

// const noteSchema = new mongoose.Schema({
//     content: String,
//     important: Boolean,
//   })
  
//   const Note = mongoose.model('Note', noteSchema) //clase
  
//   // const note = new Note({
//   //   content: 'HTML is easy',
//   //   important: true,
//   // }) // new Note -> funcion constructora 
  
//   Note.find({}).then(result => {
//     result.forEach(note =>{
//       console.log(note);  
//     })
//     mongoose.connection.close(); 
//   }); 
  
//   // note.save().then(result => {
//   //   console.log(result); 
//   //   console.log('note saved!')
//   //   mongoose.connection.close()
//   // }) //.save() guardamos el objeto en la base de datos