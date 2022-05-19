const express = require('express');
const app = express();
const port = 5000;
const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://jiho:rldjrgodigka@cluster0.pk7zo.mongodb.net/?retryWrites=true&w=majority', {
    useNewUrlParser: true, useUnifiedTopology: true
}).then(()=> console.log('몽고DB 연결 성공')).catch(err => console.log(err));

app.get('/',(req,res)=>{
    res.send("이번에는 두 번 실행되지 않기를... 제발");
})

app.listen(port, ()=>console.log(`Example app listening on port ${port}!`));