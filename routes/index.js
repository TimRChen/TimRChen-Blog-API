const router = require('express').Router();
const mongoose = require('mongoose');
const mongoStore = require('connect-mongo');
const dbUrl = 'mongodb://localhost/timrchenDB';
const User = require('../app/controllers/user');
// const UserModel = require('../app/models/user');
const Essay = require('../app/controllers/essay');
const jwt = require('express-jwt');

mongoose.Promise = global.Promise;  // 赋值一个全局Promise
mongoose.connect(dbUrl, {useMongoClient: true});

// CORS
router.all('*', function(req, res, next) {  
    //设置允许 http://localhost:8080 这个域响应  
    res.header("Access-Control-Allow-Origin", "http://localhost:8080");  
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");  
    res.header("Access-Control-Allow-Headers", "Content-Type, Content-Length, Authorization, Accept, X-Requested-With");  
    next();
});

// 使用express-jwt 进行验证  除了登录操作不需要验证，其余均需要通过JWT验证，否则无法操作.
router.use(jwt({
    secret: 'timrchen' // Todo: secret 参数需要存入数据库 后期更换为TimRChen
}).unless({path: [
    '/signup',
    '/login'
]}));

// 用于验证用户JWT是否有效
let requireAdmin = (req, res, next) => {

    console.log(req.user);
    if (!req.user.userId) {
        return res.status(401).send({
            message: "invalid token",
            state: "noLogged"
        });
    } else {
        return res.status(200).send({
            message: "token passed!",
            state: "logged"
        });        
    }

    next();
};

// JWT 错误处理
router.use((err, req, res, next) => {
    if (err.name === 'UnauthorizedError') {
        res.status(401).send({
            message: "invalid token"
        });
    }
});


/**
 * JWT 验证
 */
router.get('/api/auth', requireAdmin);


/**
 * User API - signup && login
 */
router.post('/signup', User.signup);
router.post('/login', User.signin);

/**
 * User API - logout
 */
router.get('/logout', User.logout);


/**
 * Essay API - new Essay
 */
router.post('/api/essay/new', Essay.new);


// router.get('/essay/:id', Essay.detail);
// router.get('/admin/essay/new', User.signinRequired, User.adminRequired, Essay.new);
// router.post('/admin/essay', User.signinRequired, User.adminRequired, Essay.save);
// router.get('/admin/essay/update/:id', User.signinRequired, User.adminRequired, Essay.update);
// router.get('/admin/essay/list', User.signinRequired, User.adminRequired, Essay.list);
// router.delete('/admin/essay/list', User.signinRequired, User.adminRequired, Essay.delete);



module.exports = router;
