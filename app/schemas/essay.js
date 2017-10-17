const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

let EssaySchema = new Schema({
    title: String,
    content: String,
    picUrl: String,
    pv: {
        type: Number,
        default: 0
    },
    meta: {
        createAt: {
            type: Date,
            default: Date.now(),
        },
        updateAt: {
            type: Date,
            default: Date.now(),
        }
    }
});


EssaySchema.pre('save', function(next) {
    if (this.isNew) {
        this.meta.createAt = this.meta.updateAt = Date.now();
    } else {
        this.meta.updateAt = Date.now();
    }
    next();
});


const pageSize = 4; // 一页显示条数

// 定义静态方法
EssaySchema.statics = {
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


module.exports = EssaySchema;