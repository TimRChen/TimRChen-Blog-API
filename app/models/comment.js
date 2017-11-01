const mongoose = require('mongoose');
const CommentSchema = require('../schemas/comment');
const CommentModal = mongoose.model('CommentModal', CommentSchema);

module.exports = CommentModal;
