const UserModel = require('../models/user');

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
			newUser = new UserModel(_user);
			newUser.save(function(err, userData) {
				if (err) {
					console.log(err);
				} else {
					res.status(200).send({
						"userId": userData._id,
						"token": userData.password,
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
					// 将user信息存储至 session 中
					req.session.user = user;
					console.log('Password is matched');
					res.status(200).send({
						"userId": user._id,
						"token": user.password,
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
	res.redirect('/');
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