const router = require('express').Router();
const mongoose = require('mongoose');
const session = require('express-session');
const mongoStore = require('connect-mongo')(session);
const dbUrl = 'mongodb://localhost/timrchenDB';
// const Index = require('../app/controllers/index');
const User = require('../app/controllers/user');
// const Essay = require('../app/controllers/essay');

mongoose.Promise = global.Promise;  // 赋值一个全局Promise
mongoose.connect(dbUrl, {useMongoClient: true});

// create session db
router.use(session({
    secret: 'essay',
    store: new mongoStore({
        url: dbUrl,
        collection: 'sessions'
    })
}));

// pre handle user
router.use(function(req, res, next) {
	let _user = req.session.user;
    res.locals.user = _user;

	next();
});

// CORS
router.all('*', function(req, res, next) {  
    //设置允许 http://localhost:8080 这个域响应  
    res.header("Access-Control-Allow-Origin", "http://127.0.0.1:8080");  
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");  
    res.header("Access-Control-Allow-Headers", "Content-Type, Content-Length, Authorization, Accept,X-Requested-With");  
    next();
  });


/* Index */
// router.get('/', Index.index);
// router.get('/next', Index.next);
// router.get('/previous', Index.next);


/* User */
router.post('/signup', User.signup);


// router.post('/user/signin', User.signin);
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
