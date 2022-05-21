//배포, 개발모드 시 다르게 설정
if(process.env.NODE_ENV === 'production'){
    module.exports = require('./prod');
} else{
    module.exports = require('./dev');
}