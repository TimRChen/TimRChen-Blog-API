const CommentModal = require('../models/comment');
const _ = require('underscore');


/**
 * POST - new Comment
 * 
 * response
 * 	{
 * 		name: 评论人
 * 		content: 评论内容
 * 	}
 */
exports.create = function (req, res, next) {
    const commentObj = req.body;
    const essayId = commentObj.essayId;
    let _comment;

    if (essayId) {
        // 构建评论
        _comment = new CommentModal({
            essayId: commentObj.essayId,
            name: commentObj.name,
            content: commentObj.content,
        });
        
        _comment.save(function (err, comment) {
            if (err) {
                console.error(err);
                res.status(500).send({
                    "message": "评论存储出错!"
                });
            }
            console.log(comment);
            res.status(200).send({
                "message": "评论提交成功!"
            });
        });
    }
    
};


/**
 * GET - comment list
 * 
 * response
 * {
 *	 	commentSum: Number, 总条数
 * 		comments: Object
 * }
 */
exports.getList = function (req, res, next) {
    const essayId = req.query.essayId;
    let commentSum = null;
	
	CommentModal.find({essayId: essayId}, function(err, comments) {
        if (err) {
            console.error(err);
            res.status(500).send({
                "message": "暂时无法获取文章信息!"
            });
        }
        commentSum = comments.length;

        res.status(200).send({
            commentSum: commentSum,
            comments: comments
        }); 

	});

};

