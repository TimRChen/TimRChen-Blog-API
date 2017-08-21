const router = require('express').Router();
const mongoose = require('mongoose');
const mongoStore = require('connect-mongo');
const dbUrl = 'mongodb://localhost/timrchenDB';
const User = require('../app/controllers/user');
// const Essay = require('../app/controllers/essay');

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

/**
 * JWT
 */
router.get('/api/auth', User.getAuth);


// 客户端token是否有效
router.use(/^\/api\/.+/g, User.isAuth);

/**
 * 获取用户信息的接口
 */
router.get('/api/getUserInfo', User.getUserInfo);



/**
 * User API signup && login
 * request: post
 * body: {
 *  "username": username,
 *  "password": password
 * },
 * response: 
 * body: {
 *  "userId": userId,
 *  "token": token
 * }
 */
router.post('/signup', User.signup);
router.post('/login', User.signin);


// router.get('/signin', User.showSignin);
// router.get('/signup', User.showSignup);
// router.get('/logout', User.logout);
// router.get('/admin/user/list', User.signinRequired, User.adminRequired, User.list);
// router.delete('/admin/user/list', User.signinRequired, User.adminRequired, User.delete);





/* Essay */
// router.get('/essay/:id', Essay.detail);
// router.get('/admin/essay/new', User.signinRequired, User.adminRequired, Essay.new);
// router.post('/admin/essay', User.signinRequired, User.adminRequired, Essay.save);
// router.get('/admin/essay/update/:id', User.signinRequired, User.adminRequired, Essay.update);
// router.get('/admin/essay/list', User.signinRequired, User.adminRequired, Essay.list);
// router.delete('/admin/essay/list', User.signinRequired, User.adminRequired, Essay.delete);



module.exports = router;
