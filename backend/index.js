const express=require('express');
const mongoose =require('mongoose');
const app=express();
const cors=require('cors')
const path=require('path')
app.use(cors('*'))

mongoose.connect('mongodb://127.0.0.1:27017/driveCrud', ).then(()=>console.log("connected"))
.catch((err)=>console.log(err))
app.use(express.json());

app.use('/s',require('./routes/StudentRoute'));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/b',require('./routes/BookRoute'))
app.use('/l',require('./routes/LibraryRoute'))


app.listen(5000,()=> console.log("listening"))