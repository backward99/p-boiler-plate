const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10;
var jsonwebtoken = require('jsonwebtoken');

const userSchema = mongoose.Schema({
    name: {
        type: String,
        maxlangth: 50
    },email: {
        type: String,
        trim: true,
        uniqeu: 1
    },password: {
        type: String,
        mixlangth: 4
    },lastname: {
        type: String,
        maxlangth: 50
    },role: {
        type: Number,
        default: 0
    },image: {
        type: String
    },token: {
        type: String,
    },tokenExo: {
        type: Number,
    },
})

userSchema.pre('save', function (next){
    var user = this;

    if(user.isModified('password')){
        bcrypt.genSalt(saltRounds, function(err, salt) {
            if(err) return next(err);
            bcrypt.hash(user.password, salt, function(err, hash) {
                if(err) return next(err);
                user.password = hash;
                next();
            });
        });
    }else{
        
        next();
    }
})

userSchema.methods.comparePassword = function(pwConfirm, callback){
    //확인된 유저의 패스워드
    bcrypt.compare(pwConfirm, this.password, function(err, isMatch){
        if(err) return callback(err);
        callback(null, isMatch);
    })
}

userSchema.methods.ititToken = function(callback){
    var user = this;
    var token = jsonwebtoken.sign(user._id.toHexString(), 'everything');
    user.token = token;
    user.save(function(err, user){
        if(err) return callback(err);
        callback(null, user);
    });
}

userSchema.methods.findByToken = function(token, callback){
    var user = this;

    jsonwebtoken.verify(token, 'everything', function(err, decoded){
        user.findOne({ "_id": decoded, "token": token}, function(err, findUser){
            if(err) return callback(err);
            callback(null, findUser)
        })
    })
}


const User = mongoose.model('User', userSchema);



module.exports = { User };