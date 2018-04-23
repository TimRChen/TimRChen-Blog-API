const superRequest = require('../utils/request');

const oneArticleAPI = 'https://interface.meiriyiwen.com/article';
/**
 * 获取每日一文
 * GET
 * API https://interface.meiriyiwen.com/article/today?dev=1
 */
exports.getOneArticle = function (request, response) {
    const api = `${oneArticleAPI}/today?dev=1`;
    superRequest.requestHttps(api).then(res => {
       const data = JSON.parse(res).data;
       response.status(200).send(data);
    }).catch(error => {
        console.error(error);
        response.status(500).send({'err': error});
    });
};

/**
 * 获取随机文章
 * GET
 * API https://interface.meiriyiwen.com/article/random?dev=1
 */
exports.getRandomArticle = function (request, response) {
    const api = `${oneArticleAPI}/random?dev=1`;
    superRequest.requestHttps(api).then(res => {
       const data = JSON.parse(res).data;
       response.status(200).send(data);
    }).catch(error => {
        console.error(error);
        response.status(500).send({'err': error});
    });
};