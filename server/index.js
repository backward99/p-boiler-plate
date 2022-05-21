const express = require('express');
const app = express();
const port = 5000;
const mongoose = require('mongoose');
const { User } =require('./models/User') ;
const bodyParser = require('body-parser');
const config = require('./config/key');
const cookieParser = require('cookie-parser');
const {auth} = require('./middleware/auth');

//bodyparser로 분석해서 가져올 수 있게
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

//cookie사용
app.use(cookieParser());

mongoose.connect(config.mongoURI, {
    useNewUrlParser: true, useUnifiedTopology: true
}).then(()=> console.log('몽고DB 연결 성공 ')).catch(err => console.log(err));

app.get('/',(req,res)=>{
    
    res.send("이번에는 두 번 실행되지 않기를...");
})

//bodyparser를 사용해서 req정보를 받아 올 수 있음
app.post('/api/users/register', (req,res)=>{
    const user = new User(req.body)

    user.save((err, doc)=>{
        if(err) return res.json({success: false, err})
        return res.status(200).json({registerSuccess: true})
    })
})

app.post('/api/users/login', (req,res)=>{
    User.findOne({ email: req.body.email},(err, userConfirm) => {
        if(!userConfirm) res.json({loginSuccess : false})
        
        userConfirm.comparePassword(req.body.password, (err, pwConfirm)=>{
            if(!pwConfirm) res.json({ loginSuccess : false, message: "비밀번호 틀림"});


            userConfirm.ititToken((err, user)=>{
                if(err) return res.status(400).send(err);
                
                res.cookie("new_cookie",user.token).status(200)
                .json({loginSuccess: true, userId: user._id, message: "다 맞아서 토큰도 생성함"})
            })
        })
    })
})


app.get('/api.users/auth', auth, (req, res)=>{
    res.status(200).json({
        _id: req.user._id,
        isAdmin: req.user.role == 0 ? false : true,
        isAuth: true,
        email: req.user.email,
        name: req.user.name,
        lastname: req.user.lastname,
        role: req.user.role,
        image: req.user.image
    })
})
//이렇게 가능한지 상은이한테 물어보기
app.get('/api/users/logout',auth, (req, res)=>{
    User.findOneAndUpdate({ _id: req.user._id},
        {token: ""},
        (err, user) =>{
            if(err) return res.json({success:false, err});
            return res.status(200).send({
                logoutSuccess: true
            })
        }
        )
})

app.listen(port, ()=>console.log(`Example app listening on port ${port}!`));