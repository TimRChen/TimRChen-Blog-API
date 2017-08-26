const UserModel = require('../models/user');
const jwt = require('jsonwebtoken');

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

			// payload
			let payload = {
				userId: user._id
			};
			// password
			let secret = user.secretOrPrivateKey;

			// 密码校对
			user.comparePassword(password, function(err, result) {
				if (err) {
					console.log(err);
				}

				if (result) {
					console.log('Password is matched');
					
					// generate JWT Token
					let token = jwt.sign(payload, secret, {expiresIn: "7d"});

					console.log(`token is: ${token}`);

					res.status(200).send({
						"userId": user._id,
						"token": token,
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
	res.status(200).send({
		"message": "退出登录成功!",
		"state": "noLogged"
	});
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