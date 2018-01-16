const router = require('express').Router();
const mongoose = require('mongoose');
const mongoStore = require('connect-mongo');
const dbUrl = 'mongodb://localhost/timrchenDB';
const User = require('../app/controllers/user');
// const UserModel = require('../app/models/user');
const Essay = require('../app/controllers/essay');
const Comment = require('../app/controllers/comment');
const jwt = require('express-jwt');

// Extra
const News = require('../app/handlers/news');

mongoose.Promise = global.Promise;  // 赋值一个全局Promise
mongoose.connect(dbUrl, {useMongoClient: true});

// CORS
router.all('*', function(req, res, next) {
    // res.header("Access-Control-Allow-Origin", "http://localhost:8080");
    let currentReqHostName = req.hostname;
    if (currentReqHostName === 'blog.timrchen.site' || currentReqHostName === 'www.timrchen.site') {
        res.header("Access-Control-Allow-Origin", 'http://' + currentReqHostName);
    } else if (currentReqHostName === '127.0.0.1') {
        res.header("Access-Control-Allow-Origin", 'http://' + currentReqHostName + ':8080');
    }
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");  
    res.header("Access-Control-Allow-Headers", "Content-Type, Content-Length, Authorization, Accept, X-Requested-With");  
    next();
});

// 使用express-jwt 进行验证  不在unless中的 path 均需要通过JWT验证，否则无法操作.
router.use(jwt({
    secret: 'timrchen' // Todo: secret 参数需要存入数据库 后期更换为TimRChen
}).unless({path: [
    '/signup',
    '/login',
    '/api/essay/list',
    '/api/essay/page',
    '/api/essay/details',
    '/api/comment/create',
    '/api/comment/list',
    '/api/extra/news' // 额外的转发接口
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


/**
 * Essay API - essay list
 */
router.get('/api/essay/list', Essay.getList);

/**
 * Essay API - essay admin list
 */
router.get('/api/essay/admin/list', Essay.getAdminList);

/**
 * Essay API - essay page list
 */
router.post('/api/essay/page', Essay.getPage);


/**
 * Essay API - essay details
 */
router.get('/api/essay/details', Essay.getEssayDetails);

/**
 * Essay API - essay delete
 */
router.delete('/api/essay/delete', Essay.delete);


/**
 * Comment API - create comment
 */
router.post('/api/comment/create', Comment.create);

/**
 * Comment API - get comment list
 */
router.get('/api/comment/list', Comment.getList);

/**
 * Comment API - get admin comment list
 */
router.get('/api/comment/admin/list', Comment.getAdminList);

/**
 * Comment API - delete comment
 */
router.delete('/api/comment/delete', Comment.delete);


/**
 * Extra 接口转发 —— 聚合数据新闻API
 */
router.get('/api/extra/news', News.provideNewsList);


module.exports = router;
