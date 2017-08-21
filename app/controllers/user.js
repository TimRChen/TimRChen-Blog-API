const UserModel = require('../models/user');
const Authentication = require('./authentication/authentication');

let USER;

UserModel.findOne({"username": "123"}, function(err, user) {
	USER = user;
	console.log(USER);
});

// 获取用户
let getUser = function (username, password) {
	let user = USER;

	if (!user) return false;
	if (user.password != password) return false

	return user;
};


//认证管理的组件实例
let auth = new Authentication({
    getCredentials: function (req) {
        return {
            username: req.body.username || req.query.username,
            password: req.body.password || req.query.password
        }
    },
    verifyIdentity: function (formData) {
        return getUser(formData.username, formData.password);
    }
});

//获取token
exports.getAuth = function (req, res) {
    res.status(200).send({
        "token": auth.generateToken(req)
    });
};

// 客户端token是否有效 中间件
exports.isAuth = function (req, res, next) {
    // 如果是认证的请求，直接跳过
    if (/^\/api\/auth/g.test(res.pathname)) {
        console.log('客户端请求认证...');
        next();
        return;
    }

    // 其它请求验证用户是否登录
    if (!auth.verify(req)) {
        console.log('客户端token无效...');
        res.json({
			code: 304,
			message: '客户端token无效...'
        });
    } else {
        next();
    }
};


//拉取用户信息的接口
exports.getUserInfo = function (req, res) {
    let data = auth.getIdentity(req);
    //刷新token
    let token = auth.refreshToken(req);
    res.status(200).send({
        data: data,
        token: token
    });
};


/* signUp */
exports.signup = function(req, res) {
	let _user = req.body;

	let username = _user.username;
	let password = _user.password;

	// 显示注册账号 & 密码
	console.log(`> username: ${username} \n> password: ${password}`);

	UserModel.findOne({"username": username}, function(err, user) {
		if (err) {
			console.log(err);
			res.status(400).send({
				"message": 'Bad Request'
			});
		}

		// 若用户名没有注册，需要处理
		console.log(`user: ${user}`);

		// 处理用户名重复
		if (user) {
			res.status(400).send({
				message: '用户名已存在，请重新输入!'
			});
		} else {
			user = new UserModel(_user);
			user.save(function(err, userData) {
				if (err) {
					console.log(err);
					res.status(400).send({
						"message": "数据库存储有错误!"
					});
				} else {
					res.status(200).send({
						"userId": userData._id,
						"message": "注册成功!"
					});
				}
			});
		}
	});
};


/* Login */
exports.signin = function(req, res) {
	let _user = req.body;
	let username = _user.username;
	let password = _user.password;

	UserModel.findOne({"username": username}, function(err, user) {
		if (err) {
			console.log(err);
			res.status(400).send({
				"message": 'Bad Request'
			});
		}

		// 若用户名没有注册，需要处理
		console.log(`user: ${user}`);		

		// user不存在，返回注册页
		if (!user) {
			res.status(400).send({
				message: '用户名不存在，请注册后再进行登录操作!'
			});
		} else {

			// 密码校对
			user.comparePassword(password, function(err, result) {
				if (err) {
					console.log(err);
				}

				if (result) {
					console.log('Password is matched');
					res.status(200).send({
						"userId": user._id,
						"message": "登录成功!"
					});
				} else {
					// 密码不匹配
					console.log('Password is not matched');
					res.status(404).send({
						"message": "密码输入错误!"
					});
				}
			});

		}
	});
};


/* logout */
exports.logout = function(req, res) {
	delete req.session.user;
};


/* userList page */
// exports.list = function(req, res) {
// 	UserModel.fetch(function(err, users) {
// 		if (err) {
// 			console.log(err);
// 		}
// 		res.render('userList', {
// 			poster: 'background-image: url(/images/book.jpg)',
// 			title: '用户列表页',
// 			users: users,
// 		});
// 	});
// };

// list delete user
// exports.delete = function(req, res, next) {
// 	const id = req.query.id;
// 	if (id) {
// 		UserModel.findById({_id: id}, function(err, user) {
// 			if (err) {
// 				console.log(err);
// 			}
// 			// 删除文章内容
// 			user.remove(function(err) {
// 				if (err) {
// 					console.log(err);
// 					res.json({success: 0});
// 				} else {
// 					res.json({success: 1});
// 				}
// 			});
// 		});
// 	}
// };


/* middleware for user */
// exports.signinRequired = function(req, res, next) {
// 	let user = req.session.user;
// 	console.log(user);

// 	if (!user) {
// 		return res.redirect('/signin');
// 	}

// 	next();
// };

/* middleware for admin */
// exports.adminRequired = function(req, res, next) {
// 	let user = req.session.user;
// 	if (user.role <= 10) {
// 		return res.redirect('/');
// 	}

// 	next();
// };