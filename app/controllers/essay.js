const EssayModel = require('../models/essay');
const _ = require('underscore');


/**
 * POST - new Essay
 * 
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
	const essayId = essayObj.essayId;
	let _essay;

	console.log(essayObj);

	if (essayId !== "undefined") { // 若文章essayId不为undefined，说明在更新文章
		EssayModel.findById(essayId, function (err, essay) {
			if (err) {
				console.error(err);
				res.status(500).send({
					"message": "文章存储出错!"
				});
			}
			// 用更新的字段替换老字段
			_essay = _.extend(essay, essayObj);
			_essay.save(function(err, essay) {
				if (err) {
					console.log(err);
					res.status(500).send({
						"message": "文章存储出错!"
					});
				}
				res.status(200).send({
					"message": "成功更新文章!"
				});
			});
		});
	} else {
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
	}
};



/**
 * GET - essay list
 * 
 * response
 * {
 *	 	essaySum: Number, 总条数
 * 		essays: Object
 * }
 */
exports.getList = function (req, res, next) {
	let essaySum = null;
	
	EssayModel.fetch(function(err, essays) {
		essaySum = essays.length;
	});

	EssayModel.getMainPage(function(err, essays) {
		if (err) {
			console.error(err);
			res.status(500).send({
				"message": "暂时无法获取文章信息!"
			});
		}
		res.status(200).send({
			essaySum: essaySum,
			essays: essays
		});
	});
};



/**
 * POST - essay list & page
 * 
 * response
 * {
 * 		currentPage: Number, 当前页数
 * 		essaySum: Number, 总条数
 * 		essays: Object
 * }
 */
exports.getPage = function (req, res, next) {
	let nextPage = req.body.nextPage;
	let essaySum = null;

	EssayModel.fetch(function(err, essays) {
		if (err) {
			console.error(err);
			res.status(500).send({
				"message": "获取页面接口出问题."
			});
		}

		essaySum = essays.length;

		if (nextPage <= Math.ceil(essaySum / 4)) {
			EssayModel.findPage(nextPage, function(err, essayList) {
				if (err) {
					console.error(err);
					res.status(500).send({
						"message": "页数不正确!"
					});
				}
				res.status(200).send({
					currentPage: nextPage,
					essaySum: essaySum,
					essays: essayList
				});
			});
		} else {
			res.status(500).send({
				"message": "页数不正确!"
			});
		}
	});
};



/**
 * GET - essay details
 * 
 * response
 * {
 * 		essay: {
 * 			title: 文章标题
 * 			content: 文章内容
 * 			picUrl: 文章标题图片地址
 * 			meta: Object 文章创建/更新时间
 * 			pv: 浏览量
 * 		}
 * 
 * }
 */
exports.getEssayDetails = function (req, res, next) {

	const essayId = req.query.essayId;

	EssayModel.update({_id: essayId}, {$inc: {pv: 1}}, function(err) {
		if (err) {
			console.log(err);
		}
	});

	EssayModel.findById(essayId, function (err, essay) {
		if (err) {
			console.error(err);
			res.status(500).send({
				"message": "暂时无法获取文章详细信息!"
			});
		}
		res.status(200).send({
			essay: essay
		});
	});

};


/**
 * DELETE - essay
 * 
 * request: essayId
 * headers: Authorization
 * response: {
 * 	message: '文章已删除'
 * }
 */
exports.delete = function (req, res, next) {
	const essayId = req.query.essayId;

	if (essayId) {
		EssayModel.findById({_id: essayId}, function (err, essay) {
			if (err) {
				res.status(500).send({
					"message": "删除文章失败"
				});
			}
			essay.remove(function (err) {
				if (err) {
					res.status(500).send({
						"message": "删除文章失败"
					});
				} else {
					res.status(200).send({
						"message": "文章已删除"
					});
				}
			});
		});
	} else {
		res.status(404).send({
			"message": "Error: essayId not found."
		});
	}
};
