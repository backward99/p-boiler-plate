const { User } = require('../models/User');


let auth =  (req, res, next) => {
    let token = req.cookies.new_cookie;

    User.findByToken(token, (err, user)=>{
        if(err) throw err;
        if(!user) return res.json({ isAuth: false, message : "일치하는 유저 없음"});

        req.token = token;
        req.user = user;
        next()

    })

}

module.exports = {auth};