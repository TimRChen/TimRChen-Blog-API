const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

let CommentSchema = new Schema({
    essayId: {
        type: ObjectId,
        ref: 'EssayModel'
    },
    from: {
        type: ObjectId,
        ref: 'UserModel'        
    },
    to: {
        type: ObjectId,
        ref: 'UserModel'
    },
    name: String,
    content: String,
    meta: {
        createAt: {
            type: Date,
            default: Date.now(),
        }
    }
});


CommentSchema.pre('save', function(next) {
    this.meta.createAt = Date.now();
    next();
});


const pageSize = 8; // 一页显示条数

// 定义静态方法
CommentSchema.statics = {
    fetch: function (cb) {
        return this
            .find({})   // 取出所有数据
            .sort({"meta.updateAt": -1})
            .exec(cb);
    },    
    findById: function (id, cb) {
        return this
            .findOne({_id: id})     // 查找单条数据
            .exec(cb);
    },
    getMainPage: function (cb) { // 初始化首页数据
        return this
            .find({})   // 取出所有数据
            .sort({"meta.updateAt": -1})
            .limit(pageSize)
            .exec(cb);
    },
    findPage: function (nextPage, cb) {
        return this
            .find({})
            .sort({"meta.updateAt": -1})
            .skip(pageSize*(nextPage - 1))
            .limit(pageSize)
            .exec(cb)
    }
};


module.exports = CommentSchema;