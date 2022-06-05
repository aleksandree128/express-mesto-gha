const express = require('express');
const mongoose = require('mongoose')
const {userRouter} = require('./routes/users')
const {cardRouter} = require('./routes/cards')

const app = express()
const {PORT = 3000} = process.env

mongoose.connect('mongodb://localhost:27017/mestodb')

app.use(express.json())
app.use('/', userRouter)
app.use('/', cardRouter)


app.listen(PORT,()=>{
    console.log("server has been started")
})