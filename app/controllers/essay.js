const EssayModel = require('../models/essay');
const _ = require('underscore');


/**
 * POST - new Essay
 * headers: Authorization
 * response
 * 	{
 * 		title: 文章标题
 * 		content: 文章内容
 * 		picUrl: 文章标题图片地址
 * 		pv: 浏览量
 * 	}
 */
exports.new = function (req, res, next) {

	const essayObj = req.body;
	let _essay;

	console.log(essayObj);

	// 构建文章模型
	_essay = new EssayModel({
		title: essayObj.title,
		content: essayObj.content,
		picUrl: essayObj.picUrl
	});
	
	_essay.save(function (err, essay) {
		if (err) {
			console.error(err);
			res.status(500).send({
				"message": "文章存储出错!"
			});
		}
		res.status(200).send({
			"message": "成功发布文章!"
		});
	});

};



/**
 * GET - essay list
 * response
 * {
 * 		essays: Object
 * }
 */
exports.getList = function (req, res, next) {
	EssayModel.fetch(function(err, essays) {
		if (err) {
			console.error(err);
			res.status(500).send({
				"message": "暂时无法获取文章信息!"
			});
		}
		res.status(200).send({
			essays: essays
		});
	});
};


/**
 * GET - essay details
 * response
 * {
 * 		title: 文章标题
 * 		content: 文章内容
 * 		picUrl: 文章标题图片地址
 * 		meta: Object 文章创建/更新时间
 * 		pv: 浏览量
 * }
 */
exports.getEssayDetails = function (req, res, next) {
	


};






/* GET detail page. */
// exports.detail = function(req, res, next) {
// 	const id = req.params.id;

// 	EssayModel.update({_id: id}, {$inc: {pv: 1}}, function(err) {
// 		if (err) {
// 			console.log(err);
// 		}
// 	});
// 	EssayModel.findById(id, function (err, essay) {
// 		res.render('detail', {
// 			essay: essay,
// 		});
// 	});
// };



/* Edit/Update admin essay */
// exports.update = function(req, res) {
// 	const id = req.params.id;

// 	if (id) {
// 		EssayModel.findById(id, function(err, essay) {
// 			res.render('admin', {
// 				title: '文章编辑',
// 				essay: essay,
// 			});
// 		});
// 	}
// };


/* GET list page. */
// exports.list = function(req, res, next) {
// 	EssayModel.fetch(function(err, essays) {
// 		if (err) {
// 			console.log(err);
// 		}
// 		res.render('list', {
// 			poster: 'background-image: url(/images/banner.jpeg)',
// 			title: '文章管理列表',
// 			essays: essays,
// 		});
// 	});
// };


// list delete essay
// exports.delete = function(req, res, next) {
// 	const id = req.query.id;
// 	if (id) {
// 		EssayModel.findById({_id: id}, function(err, essay) {
// 			if (err) {
// 				console.log(err);
// 			}
// 			let poster = essay.poster;
// 			let path = poster.slice(23).replace(')', '');
// 			// 删除相应的图片
// 			fs.unlinkSync(`public/${path}`);
// 			// 删除文章内容
// 			essay.remove(function(err) {
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
